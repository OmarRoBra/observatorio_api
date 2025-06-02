import { QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    // Agrega el índice único
    await queryInterface.sequelize.query(`
      ALTER TABLE monthly_stats
      ADD CONSTRAINT unique_monthly_stats UNIQUE (year, month, municipality);
    `);
  },
  async down(queryInterface: QueryInterface) {
    // Remueve el índice único si haces rollback
    await queryInterface.sequelize.query(`
      ALTER TABLE monthly_stats
      DROP CONSTRAINT IF EXISTS unique_monthly_stats;
    `);
  }
};
