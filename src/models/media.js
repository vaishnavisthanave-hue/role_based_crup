'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Media extends Model {
    static associate(models) {

      // User ↔ Permission (Many-to-Many)
      Media.belongsToMany(models.Permission, {
        through: models.UserPermission,
        foreignKey: "userid",
        otherKey: "permissionId"
      });

      // User → Role (Many-to-One)
    

    }
  }

  Media.init({
   image: DataTypes.STRING,
   video: DataTypes.STRING,
   audio: DataTypes.STRING,
   file: DataTypes.STRING,
   fileHash: DataTypes.STRING,
   userid: {
     type: DataTypes.INTEGER,
     allowNull: false,
     references: {
       model: 'Users',
       key: 'id'
     },
     onUpdate: 'CASCADE',
     onDelete: 'CASCADE'
   }
  }, {
    sequelize,
    modelName: 'Media',
  });

  return Media;
};