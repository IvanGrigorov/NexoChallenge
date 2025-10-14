require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser');
const { Client } = require('pg')
const { Routes } = require('./infrastructure/routes')
const { DB: Database } = require('./infrastructure/db')

// Start server
const app = express()
const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// Infrastructure setup
app.use(bodyParser.json());
const DB = new Database(new Client());
const routes = new Routes(app, DB);
routes.registerRoutes();