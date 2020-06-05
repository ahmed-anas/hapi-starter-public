'use strict';

module.exports = (sequelize, DataTypes) => {
    var Admins = sequelize.define('Admins', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        salt: DataTypes.STRING
    }, {
        scopes: {
            public: {
                attributes: ['email','id']
            }
        }
    });
    Admins.associate = function (models) {
       
    };
    return Admins;
};