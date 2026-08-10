'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Media', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      image: {
        type: Sequelize.STRING,
        allowNull: true
      },

      video: {
        type: Sequelize.STRING,
        allowNull: true
      },

      audio: {
        type: Sequelize.STRING,
        allowNull: true
      },

      file: {
        type: Sequelize.STRING,
        allowNull: true
      },

       userid: {
        type: Sequelize.INTEGER,
        allowNull: true
      },

      fileHash: {
        type: Sequelize.STRING,
        allowNull: true
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Media');
  }
};