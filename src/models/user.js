'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {

      // User ↔ Permission (Many-to-Many)
      User.belongsToMany(models.Permission, {
        through: models.UserPermission,
        foreignKey: "userId",
        otherKey: "permissionId"
      });

      // User → Role (Many-to-One)
      User.belongsTo(models.Role, {
        foreignKey: "roleid",
        as: "role"
      });

    }
  }

  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    roleid: DataTypes.INTEGER,
    active: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    is_request: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    sessionToken: {
      type: DataTypes.STRING,
      allowNull: true,

    }
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};