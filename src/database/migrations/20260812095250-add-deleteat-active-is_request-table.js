'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   
    await queryInterface.addColumn('Users', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('Users', 'active', {
      type: Sequelize.INTEGER,
      defaultValue: true,
    });
    await queryInterface.addColumn('Users', 'is_request', {
      type: Sequelize.INTEGER,
      defaultValue: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users','deleteAt');
    await queryInterface.removeColumn('Users','active');
    await queryInterface.removeColumn('Users','is_request');
  }
};
