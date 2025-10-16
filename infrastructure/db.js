// DB Wrapper to be able to quickly switch adapters
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

    // Allows us to attach to every query to add our logic
    // We are sure that we always have connection and only if we need it
    async executeQuery(query, args) {
        this.connect();
        const res = await this.client.query(query, args);
        return res;
    }
}

module.exports = { DB }