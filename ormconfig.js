const { NODE_ENV, DATABASE_URL } = process.env;

module.exports = {
  // database config
  type: 'postgres',
  url: DATABASE_URL,

  // entity config
  entities: [NODE_ENV === 'production' ? 'dist/**/*.entity.js' : 'src/**/*.entity.ts'],

  // migrations (only in production)
  migrationsRun: NODE_ENV === 'production',
  migrations: [NODE_ENV === 'production' ? 'dist/migrations/*.js' : 'src/migrations/*.ts'],
  cli: {
    migrationsDir: 'src/migrations'
  },

  // synchronization (only in develoment)
  synchronize: NODE_ENV !== 'production',

  // logger
  logging: true,
  logger: 'all'
};
