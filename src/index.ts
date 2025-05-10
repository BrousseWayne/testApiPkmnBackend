import express from "express"
import type { Request, Response } from "express"
import dotenv from "dotenv"
import helmet from "helmet"
import { validateAndSanitizeQueryString } from "./middlewares.ts"
import { fetchAllMoves, fetchByMove, fetchByName, fetchByType } from "./fetchPokemon.ts"
import cors from "cors"

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

async function cachedFetchByName(name: string) {
    if (pkmnCache.has(name)) {
        return pkmnCache.get(name);
    }
    const data = await fetchByName(name);
    pkmnCache.set(name, data);
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
                        return await cachedFetchByName(entry.pokemon.name);
                    } catch (err) {
                        console.error(`Failed to fetch ${entry.pokemon.name}:`, err);
                        return null; // or a fallback object
                    }
                })
            );

            const successfulPkmn = allPkmn.filter(p => p !== null);
            res.json(successfulPkmn);
        } else {
            res.json(await cachedFetchByName(req.query.name as string));
        }
    } catch (err) {
        const status = err.status || 500;
        const message = err.message || "Failed to fetch Pokémon";
        res.status(status).json({ error: message });
    }
});

// "searchBy: type, statAttack > 50, "
// "damage-class", "name", "power", "type"

app.post("/moves", async (req: Request, res: Response) => {
    console.log(req.body)
    const { moveName, powerOperator, movePower, moveType, damageClass } = req.body
    if (moveName) {
        const result = await fetchByMove(moveName)
        console.log(result)
        res.json(result)
    }
    else {
        //smallest subset here
        const result = await fetchAllMoves()
        console.log(result)
    }
    // try {
    //     if (req.query.type) {
    //         const result = await fetchByType(req.query.type as string);

    //         const allPkmn = await Promise.all(
    //             result.pokemon.map(async (entry) => {
    //                 try {
    //                     return await cachedFetchByName(entry.pokemon.name);
    //                 } catch (err) {
    //                     console.error(`Failed to fetch ${entry.pokemon.name}:`, err);
    //                     return null; // or a fallback object
    //                 }
    //             })
    //         );

    //         const successfulPkmn = allPkmn.filter(p => p !== null);
    //         res.json(successfulPkmn);
    //     } else {
    //         res.json(await cachedFetchByName(req.query.name as string));
    //     }
    // } catch (err) {
    //     const status = err.status || 500;
    //     const message = err.message || "Failed to fetch Pokémon";
    //     res.status(status).json({ error: message });
    // }
});


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})


//TODO: Add caching with redis
//TODO: change endpoints names
//TODO: Add database