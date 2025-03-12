import express from "express"
import type { Request, Response } from "express"
import dotenv from "dotenv"
import helmet from "helmet"
import { validateAndSanitizeQueryString } from "./middlewares"
// import { validateAndSanitizeQueryString } from "./middlewares"

dotenv.config({ path: '/Users/samy/Projects/testBackendApi/conf.env' })
const PORT = process.env.PORT
const app = express()

app.use(helmet())

app.get("/", (req, res) => {
    res.send("Welcome to the Pokémon API!");
});

app.get("/search", validateAndSanitizeQueryString("name"), (req: Request, res: Response) => {
    const { name } = req.query;
    res.send(`Searching for Pokémon: ${name}`);
});



app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})

