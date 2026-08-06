'use strict';
const bcrypt = require('bcrypt');
module.exports = {
  async up(queryInterface) {
      const hashedPassword = await bcrypt.hash("123456", 10);
    await queryInterface.bulkInsert('Users', [
      {
        name: 'alice',
        email: 'alice@example.com',
        password: hashedPassword,
        roleid: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};