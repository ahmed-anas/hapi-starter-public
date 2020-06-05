'use strict';
module.exports = (sequelize, DataTypes) => {
  const Media = sequelize.define('Media', {
    url: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    extension: DataTypes.STRING,
    isDeleted: DataTypes.BOOLEAN,
    isPermanent: DataTypes.BOOLEAN
  }, {});
  Media.associate = function(models) {
    Media.belongsTo(models.Users);
    // associations can be defined here
  };
  return Media;
};