'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Media extends Model {
    static associate(models) {
      // define association here
    }
  }

  Media.init({
    image: {
      type: DataTypes.STRING,
      allowNull: false
    },

    video: {
      type: DataTypes.STRING,
      allowNull: false
    },

    audio: {
      type: DataTypes.STRING,
      allowNull: false
    },

    file: {
      type: DataTypes.STRING,
      allowNull: false
    }
    ,userid: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
,fileHash: {
  type: DataTypes.STRING,
  allowNull: true
}
  }, {
    sequelize,
    modelName: 'Media',
  });

  return Media;
};