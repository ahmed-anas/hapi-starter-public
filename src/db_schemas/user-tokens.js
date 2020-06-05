'use strict'

module.exports = (sequelize, DataTypes) => {
    var UserTokens = sequelize.define('UserTokens', {
        userId: {
            type: DataTypes.INTEGER
        },
        token: {
            type: DataTypes.STRING
        },
        expiryTime: {
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.ENUM('login-token', 'forgot-password'),
            allowNull: false,
            defaultValue: 'login-token',
        }

    })

    return UserTokens
}