const { Users: UsersService } = require("./../services/users")
const { Configs: ConfigsService } = require("./../services/configs")
const { Config } = require("./../models/RequestModels/config")

const { verifyToken } = require("./../middleware/jwtverifiction")

class Routes {
    constructor(app, db) {
        this.app = app;
        this.db = db;
    }

    static defaultErrorResponse = "Something went wrong";


    // Register routes
    registerRoutes() {
        this.app.get('/', async (req, res) => {
            try {
                const userService = new UsersService(this.db);
                const user = await userService.returnUser()
                res.status(200).json(user)
            }
            // Do not send real Error messages to client
            catch(error) {
                res.status(500).send(Routes.defaultErrorResponse)
            }
        });

        // We can create easily another CRUD operations here
        this.app.post('/config/apply', verifyToken, async (req, res) => {
            try {

                const configsService = new ConfigsService(this.db);
                let insertedConfig = configsService.applyNewConfig(
                    new Config(
                        req.user.uuid,
                        req.body.config
                    )
                )
                res.status(201).json(insertedConfig)
            }
            catch(error) {
                res.status(500).send(Routes.defaultErrorResponse)
            }
        });
    }
}

module.exports = { Routes }