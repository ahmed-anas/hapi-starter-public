'use strict';

const nameMinimumLength = 2;
const passwordMinimumLength = 6;

const roleUser = "user"
const roleAdmin = "admin";


module.exports = (sequelize, DataTypes) => {
    var Users = sequelize.define('Users', {
        email: {
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.ENUM('doctor', 'patient'),
            allowNull: false,
        },
        phoneNumber: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        salt: DataTypes.STRING,
        fullName: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        paranoid: true
    });

    return Users;
};


module.exports.USER_DATA_CONSTRAINTS = {
    FULL_NAME_MIN_LENGTH: nameMinimumLength,
    PASSWORD_MIN_LENGTH: passwordMinimumLength,
    PHONE_NUMBER_REGEX: /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/
}

module.exports.ROLES = {
    ALL_ROLES: [roleUser, roleAdmin],
    USER: roleUser,
    ADMIN: roleAdmin,

}