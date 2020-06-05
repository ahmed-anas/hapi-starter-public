'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserTokens',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          onDelete: 'CASCADE',
          references: {
            model: 'Users',
            key: 'id'
          }
        },
        type: {
          type: Sequelize.ENUM('login-token', 'forgot-password'),
          allowNull: false,
        },
        token: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        expiryTime: {
          type: Sequelize.STRING,
          allowNull: false,
          index: true
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      }).then(async v => {
        await queryInterface.addIndex('UserTokens', { fields: ['expiryTime'] })
      }).then(async  v => {
        await queryInterface.addIndex('UserTokens', { fields: ['token'] })
      })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('UserTokens')
  }
};
