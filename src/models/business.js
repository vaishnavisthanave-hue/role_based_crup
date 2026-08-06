'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Business extends Model {
    static associate(models) {
      // define association here
    }
  }

  Business.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },

    discription: {
      type: DataTypes.STRING,
      allowNull: false
    },

    userid: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    image: {
      type: DataTypes.STRING,
      allowNull: true
    },

    video: {
      type: DataTypes.STRING,
      allowNull: true
    }
,fileHash: {
  type: DataTypes.STRING,
  allowNull: true
}
  }, {
    sequelize,
    modelName: 'Business',
  });

  return Business;
};