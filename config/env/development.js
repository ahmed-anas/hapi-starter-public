const configHelper = require('./config-helper');
const env = 'development';
module.exports = {
    jwtSecret: 'youJwtSecretHere',
    env,
    rootHost: '0.0.0.0',
    db: configHelper.getDatabaseConfig(env)

}