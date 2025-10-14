const { User: UserDTO } = require("./../../models/DTO/user")

class Users {

    constructor(db) {
        this.db = db
    }

    async returnUser() {
        try {
            this.db.connect();
            const users = await this.db.executeQuery("SELECT * FROM users");
            this.db.end();
            return new UserDTO(users.rows[0].name, users.rows[0].admin)
        }
        catch (error) {
            console.log("Something is wrong with the DB: ", error.message);
        }
    }
}

module.exports = { Users }