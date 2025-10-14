require('dotenv').config()
const { Client } = require('pg')

async function getActiveConfig() {
    const client = new Client();
    await client.connect();
    const configs = await client.query("SELECT * FROM configs WHERE active = TRUE");
    return configs.rows[0];
}

module.exports = {
    getActiveConfig
}