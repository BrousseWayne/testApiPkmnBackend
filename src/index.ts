import express from "express"
import type { Request, Response } from "express"
import dotenv from "dotenv"
import helmet from "helmet"
import { validateAndSanitizeQueryString } from "./middlewares.ts"
import { fetchByType, fetchPokemon, fetchPokemonSpecies } from "./fetchPokemon.ts"

dotenv.config({ path: '/Users/samy/Projects/testBackendApi/conf.env' })
const PORT = process.env.PORT
const app = express()

app.use(helmet())

app.get("/", (req, res) => {
    res.send("Welcome to the Pokémon API!");
});

// type fetchHandler = {
//     handler: (name: string) => Promise<unknown>,
//     priority: number
// }

// const fetchFunctions: fetchHandler[] = []

app.get("/search", validateAndSanitizeQueryString(["name", "type", "evolve"]), async (req: Request, res: Response) => {
    // console.log(req.query)
    // const name = req.query.name as string;
    const type = req.query.type as string;
    // const evolution = req.query.evolve as string;
    try {

        const result = await fetchByType(type)
        for (const pokemon of result.pokemon) {
            const pokemonName = pokemon.pokemon.name

            const species = await fetchPokemonSpecies(pokemonName)
        }
        // result.pokemon.forEach(async pokemon => {

        //     // console.log(species)
        // });
        res.json(result); // Send the result to the client
    } catch {
        res.status(500).json({ error: "Failed to fetch Pokémon" });
    }
});



app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})

