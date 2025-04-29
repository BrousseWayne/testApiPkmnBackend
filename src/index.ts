import express from "express"
import type { Request, Response } from "express"
import dotenv from "dotenv"
import helmet from "helmet"
import { validateAndSanitizeQueryString } from "./middlewares.ts"
import { fetchByType, fetchEvolutionChain, fetchPokemonSpecies } from "./fetchPokemon.ts"
import { EndOfLineState } from "typescript"

dotenv.config({ path: '/Users/samy/Projects/testBackendApi/conf.env' })
const PORT = process.env.PORT
const app = express()

app.use(helmet())

app.get("/", (req, res) => {
    res.send("Welcome to the Pokémon API!");
});

type ChainType = {
    id: number
    name: string
}

function getIdFromUrl(url) {
    return parseInt(url.split('/').filter(Boolean).pop(), 10);
}


app.get("/search", validateAndSanitizeQueryString(["name", "type", "evolve"]), async (req: Request, res: Response) => {
    const type = req.query.type as string;
    const chains: ChainType[] = []

    try {
        const result = await fetchByType(type);

        for (const entry of result.pokemon) {
            try {
                const species = await fetchPokemonSpecies(entry.pokemon.name);
                let localizedName = "";
                for (const name of species.names) {
                    if (name.language.name === "fr") {
                        localizedName = name.name;
                        break;
                    }
                }
                chains.push({ "id": getIdFromUrl(species.evolution_chain.url), "name": localizedName });
            } catch (err) {
                console.error(`Species error for ${entry.pokemon.name}:`, err);
                entry.species = { error: "Species data unavailable" };
            }
        }

        for (const chain of chains) {
            try {
                const test = await fetchEvolutionChain(chain.id)
                console.log(test.chain.evolves_to.length, chain.id, test.chain, chain.name)
                // while (test.evolves_to !== undefined)
            } catch (err) {
                console.error(`ERR`, err);
            }
        }



        // const validPokemon = ((nbOfevoWanted) => {
        //     const mapUrlNumber = new Map()
        //     const validEntry = []
        //     for (const chain of chains) {
        //         if (mapUrlNumber.has(chain.url)) {
        //             let mappedChain = mapUrlNumber.get(chain.url)
        //             mapUrlNumber.set(chain.url, [...mappedChain, chain.name])
        //         }
        //         else {
        //             mapUrlNumber.set(chain.url, [chain.name])
        //         }
        //     }
        //     for (const entry of mapUrlNumber.entries()) {
        //         console.log(entry[0], entry[1], entry[1].length, nbOfevoWanted)
        //         if (entry[1].length === nbOfevoWanted) {
        //             validEntry.push(entry[0])
        //         }

        //     }
        //     return validEntry
        // })

        // console.log(validPokemon(1))


        res.json(result);

    } catch (error) {
        const status = error.status || 500;
        const message = error.message || "Failed to fetch Pokémon";

        res.status(status).json({
            error: message,
            details: status === 404 ? `Type '${type}' not found` : undefined
        });
    }
});



app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})

