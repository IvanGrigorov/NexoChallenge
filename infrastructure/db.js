class DB {
    constructor(client) {
        this.client = client;
    }

    async connect() {
        if (this.client._connected || this.client._connecting) return;
        await this.client.connect();
    }

    end() {
        this.client.end();
    }

    // Register routes
    async executeQuery(query, args) {
        const res = await this.client.query(query, args);
        return res;
    }
}

module.exports = { DB }