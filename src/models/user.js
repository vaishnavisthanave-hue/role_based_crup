'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {

      User.belongsToMany(models.Permission, {
        through: models.UserPermission,
        foreignKey: "userId",
        otherKey: "permissionId"
      });

    }
  }

  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    roleid: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};