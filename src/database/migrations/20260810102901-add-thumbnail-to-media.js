module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Media", "thumbnail", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("Media", "thumbnail");
  },
};