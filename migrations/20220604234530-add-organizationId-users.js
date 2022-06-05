'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'organizationId', {
      type: Sequelize.INTEGER,
        allowNull:true,
        references: {
          model: 'organizations',
          key: 'id',
        }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'organizationId');
  }
};
