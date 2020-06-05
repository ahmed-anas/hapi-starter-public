require('./initializer');
const Boom = require('boom');

const Hapi = require('@hapi/hapi');
const db = require('../config/db');
const { jwtSecret, rootHost } = require('../config/config')
const config = require('../config/config');
const Path = require('path');
const cronjob = require('../src/libs/cronjob.core')
const tokenHelper = require('./utils/token');

var defaultPort = 3005;

const server = new Hapi.server({
    port: (("port" in config) && config.port != defaultPort) ? config.port : defaultPort,
    host: rootHost,
    routes: {
        timeout: {
            server: 120000, // ms
            socket: 180000 //ms
        },
        //cors:true,
        cors: {

            credentials: true,
            "headers": ["Accept", "Authorization", "Content-Type", "If-None-Match", "Accept-language", "Referer", "content-type", "x-requested-with", "Access-Control-Allow-Credentials"]
        }
    }
});
server.ext('onPreResponse', (request, reply) => {
    const response = request.response;
    if (!response.isBoom) { // if not error then continue :)
        return response
    }
    if (response instanceof Error && response.output && response.output.statusCode === 500) {
        return Boom.badRequest(response.message);
    }
    return response;
});

const startServer = async () => {
    db.connection();

    try {
        await server.register([
            require('hapi-auth-jwt2')
        ]);

        await server.auth.strategy('jwt', 'jwt', {
            key: jwtSecret,
            validate: tokenHelper.processAuthToken,
            verifyOptions: { algorithms: ['HS256'] }
        });

        for (let routingFile of config.getGlobbedFiles('./src/**/*.route.js')) {
            let routeObj = require(Path.resolve(routingFile));

            if (!routeObj.routes) {
                throw new Error('routing file ' + routingFile + ' does not have a routes key');
            }

            await server.register(routeObj.routes, routeObj.options);
        }

        await server.register([require('@hapi/vision'), require('@hapi/inert'), {
            plugin: require('hapi-swagger'),
            options: {
                info: {
                    title: 'Frizhub Hapi Starter',
                },
                securityDefinitions: {
                    'jwt': {
                        'type': 'apiKey',
                        'name': 'Authorization',
                        'in': 'header'
                        // 'x-keyPrefix': 'Bearer '
                    }
                },
                security: [{ jwt: [] }], // THIS WAS THE KEY. Without this, the Authorization headers are never sent, but with them they are!

            }
        }]);

        const goodPluginConfig = {
            ops: {
                interval: 1000
            },
            reporters: {
                myConsoleReporter: [
                    {
                        module: 'good-squeeze',
                        name: 'Squeeze',
                        args: [{ log: '*', response: '*' }]
                    },
                    {
                        module: 'good-console'
                    },
                    'stdout'
                ]
            }
        };

        if (process.env.NODE_ENV != 'test') {
            await server.register({
                plugin: require('good'),
                options: goodPluginConfig,
            });
        }

        await server.start();
        console.log(`Server running at: ${server.info.uri}`);

        if (!("runCrons" in config) || config.runCrons == true) {
            cronjob.runner();
            console.log(`Cron jobs are executing`);
        }
        else {
            console.log(`Cron jobs are NOT executing`);
        }
    }
    catch (err) {
        console.error(err)
        console.error(err.stack)
        process.exit(1);
    }
};

process.on('unhandledRejection', (err) => {
    console.error(err);
    console.error(err.stack);
    process.exit(1);
});


startServer();

module.exports = server.info.uri;