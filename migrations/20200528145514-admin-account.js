'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(`INSERT INTO Admins(id,email,password,salt) VALUES (null,'admin@admin.com','admin123','')`);
  },

  down: (queryInterface, Sequelize) => {
    throw new Error('no timplemented');
  }
};
