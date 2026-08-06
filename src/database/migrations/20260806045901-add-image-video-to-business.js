'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.addColumn('Businesses', 'image', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Businesses', 'video', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('Businesses', 'fileHash', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('Businesses', 'image');
   await queryInterface.removeColumn('Businesses', 'video');
   await queryInterface.removeColumn('Businesses', 'fileHash');
  }
};
