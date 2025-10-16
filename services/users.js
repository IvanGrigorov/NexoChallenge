const { User: UserDTO } = require("./../models/DTO/user")

class Users {

    constructor(db) {
        this.db = db
    }

    async returnUser() {
        try {
            const users = await this.db.executeQuery("SELECT * FROM users");
            if (!users.rows.length) {
                throw new Error("No users can be fetched");
            }
            return new UserDTO(users.rows[0].name, users.rows[0].admin)
        }
        catch (error) {
            throw new Error("Something is wrong with the DB: ", error.message);
        }
    }
}

module.exports = { Users }