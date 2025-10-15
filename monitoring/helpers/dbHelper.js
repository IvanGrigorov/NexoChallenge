require('dotenv').config()
const { Client } = require('pg')

async function getActiveConfig(client) {
    const configs = await client.query("SELECT * FROM configs WHERE active = TRUE");
    const config = configs.rows[0] || null;
    return config;
}

async function saveTransaction(client, transaction, config) {
    const text = 'INSERT INTO transactions(transaction_hash, config) VALUES($1, $2) RETURNING *'
    const values = [transaction, config];
    const insertedTransaction = await client.query(text, values);
    return insertedTransaction.rows[0] || null;
}

module.exports = {
    getActiveConfig,
    saveTransaction
}