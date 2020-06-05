const configHelper = require('./config-helper');
const env = 'development';
module.exports = {
    jwtSecret: 'youJwtSecretHere',
    env,
    rootHost: 'localhost',
    db: configHelper.getDatabaseConfig(env)

}