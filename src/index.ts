import express from "express"
import axios from "axios"
import dotenv from "dotenv"

dotenv.config({ path: '/Users/samy/Projects/testBackendApi/conf.env' })
const PORT = process.env.PORT
const app = express()

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})
