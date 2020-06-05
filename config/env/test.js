const configHelper = require('./config-helper');
const env = 'test';

module.exports = {
    jwtSecret: 'password',
    env,
    rootHost: '0.0.0.0',
    db: configHelper.getDatabaseConfig(env)

}