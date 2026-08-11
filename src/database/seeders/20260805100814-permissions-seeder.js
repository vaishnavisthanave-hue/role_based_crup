'use strict';

module.exports = {
  async up(queryInterface) {

    await queryInterface.bulkInsert('Permissions', [

      {
        name: 'VIEW_VENDOR',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'CREATE_VENDOR',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'UPDATE_VENDOR',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'DELETE_VENDOR',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'VIEW_BUSINESS',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'CREATE_BUSINESS',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      {
        name: 'UPDATE_BUSINESS',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'UPLOAD_MEDIA',
        createdAt: new Date(),
        updatedAt: new Date()
      }

    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Permissions', null, {});
  }
};