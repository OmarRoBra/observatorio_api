import { QueryInterface } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    // Agrega el índice único
    await queryInterface.sequelize.query(`
      ALTER TABLE season_stats
      ADD CONSTRAINT unique_season_stats UNIQUE (year, season, municipality);
    `);
  },
  async down(queryInterface: QueryInterface) {
    // Remueve el índice único si haces rollback
    await queryInterface.sequelize.query(`
      ALTER TABLE season_stats
      DROP CONSTRAINT IF EXISTS unique_season_stats;
    `);
  }
};
