import express from "express"
import type { Request, Response } from "express"
import dotenv from "dotenv"
import helmet from "helmet"
import { validateAndSanitizeQueryString } from "./middlewares.ts"
import { fetchByName, fetchByType } from "./fetchPokemon.ts"
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


app.get("/search", validateAndSanitizeQueryString(["name", "type"]), async (req: Request, res: Response) => {
    try {
        if (req.query.type) {
            const result = await fetchByType(req.query.type as string)
            const allPkmn = []
            for (const pokemon of result.pokemon) {
                try {
                    const fetchedPkmn = await fetchByName(pokemon.pokemon.name)
                    allPkmn.push(fetchedPkmn)
                } catch (err) {
                    const status = err.status || 500;
                    const message = err.message || "Failed to fetch Pokémon";

                    res.status(status).json({
                        error: message,
                    });
                }
            }
            res.json(allPkmn)
        } else {
            res.json(await fetchByName(req.query.name as string))
        }
    } catch (error) {
        const status = error.status || 500;
        const message = error.message || "Failed to fetch Pokémon";

        res.status(status).json({
            error: message,
        });
    }
});



app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})

