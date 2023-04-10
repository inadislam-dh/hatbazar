const dotenv = require('dotenv')
const express = require('express')
const { NewRoutes } = require('./routes/routes')
dotenv.config()
const p = process.env
const PORT = p.APP_PORT || 4000
const HOST = p.APP_URL || "127.0.0.1"

const app = express()
NewRoutes(express, app)

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${HOST}:${PORT}`)
})