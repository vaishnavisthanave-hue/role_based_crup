'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {

      Permission.belongsToMany(models.User, {
        through: models.UserPermission,
        foreignKey: "permissionId",
        otherKey: "userId"
      });

    }
  }

  Permission.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Permission',
  });

  return Permission;
};