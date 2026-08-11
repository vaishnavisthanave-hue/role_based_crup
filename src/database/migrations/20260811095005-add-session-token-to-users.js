"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn(
            "Users",
            "sessionToken",
            {
                type: Sequelize.STRING(255),
                allowNull: true
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.removeColumn(
            "Users",
            "sessionToken"
        );
    }
};