import express from "express"
import dotenv from "dotenv"
import helmet from "helmet"
import cors from "cors"
import { fetchAllMoves, fetchByDamageClass, fetchByMove, fetchByName, fetchByType } from "./fetchPokemon.ts"
import { validateAndSanitizeQueryString } from "./middlewares.ts"
import type { Request, Response } from "express"

dotenv.config({ path: '/Users/samy/Projects/testBackendApi/conf.env' })

const PORT = process.env.PORT
const app = express()

const corsOption = {
    origin: ["http://localhost:5173"]
};


app.use(helmet())
app.use(cors(corsOption));
app.get("/", (req, res) => {
    res.send("Welcome to the Pokémon API!");
});

const pkmnCache = new Map();
const moveCache = new Map();

async function cachedFetchPokemonByName(name: string) {
    if (pkmnCache.has(name)) {
        return pkmnCache.get(name);
    }
    const data = await fetchByName(name);
    pkmnCache.set(name, data);
    return data;
}

async function cachedFetchMoveByName(name: string) {
    if (moveCache.has(name)) {
        return moveCache.get(name);
    }
    const data = await fetchByMove(name);
    moveCache.set(name, data);
    return data;
}

app.use(express.json());

app.get("/pokemon", validateAndSanitizeQueryString(["name", "type"]), async (req: Request, res: Response) => {
    try {
        if (req.query.type) {
            const result = await fetchByType(req.query.type as string);

            const allPkmn = await Promise.all(
                result.pokemon.map(async (entry) => {
                    try {
                        return await cachedFetchPokemonByName(entry.pokemon.name);
                    } catch (err) {
                        console.error(`Failed to fetch ${entry.pokemon.name}:`, err);
                        return null;
                    }
                })
            );

            const successfulPkmn = allPkmn.filter(p => p !== null);
            res.json(successfulPkmn);
        } else {
            res.json(await cachedFetchPokemonByName(req.query.name as string));
        }
    } catch (err) {
        const status = err.status || 500;
        const message = err.message || "Failed to fetch Pokémon";
        res.status(status).json({ error: message });
    }
});


const fetchSmallestSubset = async (request) => {
    if (request.moveType) {
        const type = await fetchByType(request.moveType.toLowerCase())
        return type.moves;
    }
    else if (request.damageClass) {
        const dmgClass = await fetchByDamageClass(request.damageClass.toLowerCase())
        return dmgClass.moves;
    }

    const all = await fetchAllMoves();
    return all;
}

const createFilters = (filterCriteria) => {
    const filters = []
    const createPowerFilter = (operator, threshold) =>
        move => {
            switch (operator) {
                case '>': return move.power > threshold
                case '<': return move.power < threshold;
                case '>=': return move.power >= threshold;
                case '<=': return move.power <= threshold;
                case '=': return move.power === threshold;
            }
        };

    console.log(filterCriteria.moveStats.powerOperator)
    if (filterCriteria.moveStats.powerOperator && filterCriteria.moveStats.movePower !== undefined) {
        filters.push(createPowerFilter(
            filterCriteria.moveStats.powerOperator,
            Number(filterCriteria.moveStats.movePower)
        ));
    }

    if (filterCriteria.moveType) {
        filters.push((move) => {
            return move.type === filterCriteria.moveType
        });
    }

    if (filterCriteria.damageClass) {
        filters.push(move => move.damage_class.name === filterCriteria.damageClass);
    }

    return filters;
}

// const createFilters = (filterCriteria) => {
//     console.log('Raw filter criteria:', JSON.stringify(filterCriteria, null, 2));

//     const filters = [];

//     const createPowerFilter = (operator, threshold) => {
//         console.log(`Creating power filter: ${operator} ${threshold}`);
//         return move => {
//             const power = move.power;
//             console.log(`Checking move ${move.name}: power=${power}, threshold=${threshold}`);

//             if (power === undefined) {
//                 console.log(`-> ${move.name} has no power, excluded`);
//                 return false;
//             }

//             const result = (() => {
//                 switch (operator) {
//                     case '>': return power > threshold;
//                     case '<': return power < threshold;
//                     case '>=': return power >= threshold;
//                     case '<=': return power <= threshold;
//                     case '=': return power === threshold;
//                     default:
//                         console.warn(`Unknown operator '${operator}', defaulting to true`);
//                         return true;
//                 }
//             })();

//             console.log(`-> ${move.name} ${operator} ${threshold}: ${result}`);
//             return result;
//         };
//     };

//     // Power filter
//     if (filterCriteria.moveStats?.powerOperator && filterCriteria.moveStats?.movePower !== undefined) {
//         filters.push(createPowerFilter(
//             filterCriteria.moveStats.powerOperator,
//             Number(filterCriteria.moveStats.movePower)
//         ));
//     } else {
//         console.log('No power filter created - missing criteria');
//     }

//     // Type filter
//     if (filterCriteria.moveType) {
//         console.log(`Creating type filter for: ${filterCriteria.moveType}`);
//         filters.push(move => {
//             const typeMatch = move.type.name === filterCriteria.moveType;
//             console.log(`Type check: ${move.type.name} === ${filterCriteria.moveType} -> ${typeMatch}`);
//             return typeMatch;
//         });
//     } else {
//         console.log('No type filter created');
//     }

//     // Damage class filter
//     if (filterCriteria.damageClass) {
//         console.log(`Creating damage class filter for: ${filterCriteria.damageClass}`);
//         filters.push(move => {
//             const damageClass = move.damage_class?.name || move.damageClass;
//             const match = damageClass === filterCriteria.damageClass;
//             console.log(`Damage class check: ${damageClass} === ${filterCriteria.damageClass} -> ${match}`);
//             return match;
//         });
//     } else {
//         console.log('No damage class filter created');
//     }

//     console.log(`Created ${filters.length} filters`);
//     return filters;
// };

const applyFilters = (array, ...filters) =>
    array.filter(item => filters.every(filter => filter(item)));


app.post("/moves", async (req: Request, res: Response) => {
    console.log(req.body)
    const { moveName, moveStats, moveType, damageClass } = req.body
    const filterCriteria = { moveName, moveStats, moveType, damageClass }
    try {
        if (moveName) {
            const result = await cachedFetchMoveByName(moveName)
            console.log(result)
            res.json(result)
        }
        else {
            const result = await fetchSmallestSubset(filterCriteria)
            const filters = createFilters(filterCriteria)
            console.log(filters)
            const allMoves = await Promise.all(
                result.map(async (entry) => {
                    try {
                        return await cachedFetchMoveByName(entry.name);
                    } catch (err) {
                        console.error(`Failed to fetch ${entry.name}:`, err);
                        return null;
                    }
                })
            );
            allMoves.forEach(element => {
                console.log(element.power, element.name, element.damage_class, element.type)
            });

            const successfulMoves = applyFilters(allMoves, ...filters)
            console.log(successfulMoves)
            res.json(successfulMoves);
        }

    } catch (err) {
        const status = err.status || 500;
        const message = err.message || "Failed to fetch Move";
        res.status(status).json({ error: message });
    }
});


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})


//TODO: Add caching with redis
//TODO: change endpoints names
//TODO: Add database