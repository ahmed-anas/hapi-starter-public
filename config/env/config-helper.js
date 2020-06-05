module.exports = {
    getDatabaseConfig: (env) => {
        const databaseConfig = require('../database.json')[env];

        return {
            mysql: {
                host: databaseConfig.host,
                user: databaseConfig.username,
                password: databaseConfig.password,
                database: databaseConfig.database
            },
            debugging: true
        }
    }
}