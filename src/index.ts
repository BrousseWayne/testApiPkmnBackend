import express from "express"
import axios from "axios"
import dotenv from "dotenv"

dotenv.config({ path: '/Users/samy/Projects/testBackendApi/conf.env' })
const PORT = process.env.PORT
const app = express()

app.get("/", (req, res) => {
    res.send("Welcome to the Pokémon API!");
});

app.get("/search", (req, res) => {
    const { name } = req.query;
    res.send(`Searching for Pokémon: ${name}`);
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})

