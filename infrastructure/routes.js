const { Users: UsersService } = require("./../services/db/users")
const { Configs: ConfigsService } = require("./../services/db/configs")
const { Config } = require("./../models/RequestModels/config")

const { verifyToken } = require("./../middleware/jwtverifiction")

class Routes {
    constructor(app, db) {
        this.app = app;
        this.db = db;
    }

  // Register routes
    registerRoutes() {
        this.app.get('/', async (req, res) => {
            const userService = new UsersService(this.db);
            const user = await userService.returnUser()
            res.send(JSON.stringify(user))
        });

        this.app.post('/config/apply', verifyToken, async (req, res) => {
            const configsService = new ConfigsService(this.db);
            let insertedConfig = configsService.applyNewConfig(
                new Config(
                    req.user.uuid,
                    req.body.config
                )
            )
            res.send(JSON.stringify(insertedConfig))
        });
    }
}

module.exports = { Routes }