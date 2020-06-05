const configHelper = require('./config-helper');
const env = 'production';
module.exports = {
    jwtSecret: 'youJwtSecretHere',
    env,
    rootHost: 'localhost',
    db: configHelper.getDatabaseConfig(env)

}