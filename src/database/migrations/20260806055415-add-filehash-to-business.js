'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Businesses', 'fileHash', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Businesses', 'fileHash');
  }
};