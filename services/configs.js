const { Config: ConfigDTO } = require("./../models/DTO/config")


class Configs {

    constructor(db) {
        this.db = db
    }

    async applyNewConfig(configRM) {
        try {
            await this.makeCurrentConfigsInactive();
            const text = 'INSERT INTO configs(config, author, active) VALUES($1, $2, $3) RETURNING *'
            const values = [configRM.config, configRM.author, true];
            const inserted = await this.db.executeQuery(text, values)
            if (!inserted) {
                throw new Error("Inserting a config failed");
            }
            return new ConfigDTO(inserted.rows[0].config, inserted.rows[0].author, inserted.rows[0].active)
        }
        catch (error) {
            throw new Error("Something is wrong with the DB: ", error.message);
        }
    }

    async makeCurrentConfigsInactive() {
        try {
            await this.db.executeQuery("UPDATE configs SET active = FALSE;");
        }
        catch (error) {
            throw new Error("Something is wrong with the DB: ", error.message);
        }
    }
}

module.exports = { Configs }