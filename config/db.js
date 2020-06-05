const mysql = require('mysql');
const { db } = require('./config');
const pool = mysql.createPool(db.mysql);
const Sequelize = require('sequelize');

exports.getConnection = function () {
    return new Promise(function (resolve, reject) {
        pool.getConnection((err, connection) => {
            if (err) {
                return reject(err);
            }
            return resolve(connection);
        })
    })
}
exports.connection = () => {
    return new Sequelize(db.mysql.database, db.mysql.user, db.mysql.password, {
        host: db.mysql.host,
        dialect: 'mysql',
        port : 3306,
        logging: (db.debugging != null) ? db.debugging : false,
        operatorsAliases: false,
        pool: {
            max: 10,
            min: 0,
            idle: 10000
        },

    });

}
   


