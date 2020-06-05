process.env.SERVER_ENV = process.env.NODE_ENV = process.env.SERVER_ENV || process.env.NODE_ENV || 'development';
console.log('ENV: ', process.env.NODE_ENV);