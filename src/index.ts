import express from "express"
import type { Request, Response } from "express"
import dotenv from "dotenv"
import helmet from "helmet"
import { validateAndSanitizeQueryString } from "./middlewares.ts"
import { fetchPokemon } from "./fetchPokemon.ts"

dotenv.config({ path: '/Users/samy/Projects/testBackendApi/conf.env' })
const PORT = process.env.PORT
const app = express()

app.use(helmet())

app.get("/", (req, res) => {
    res.send("Welcome to the Pokémon API!");
});

app.get("/search", validateAndSanitizeQueryString("name"), async (req: Request, res: Response) => {
    const name = req.query.name as string;
    try {
        const result = await fetchPokemon(name); // Wait for fetchPokemon to complete
        res.json(result); // Send the result to the client
    } catch {
        res.status(500).json({ error: "Failed to fetch Pokémon" });
    }
});



app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})

