import { Options } from '@mikro-orm/core';
import { getDatabasePath } from './config/database-path';

const config: Options = {
  type: 'sqlite',
  dbName: getDatabasePath(),

  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],

  migrations: {
    path: process.env.MIKRO_ORM_CLI ? './src/migrations' : './dist/migrations',
    pattern: /^[\w-]+\d+\.js$/,
    tableName: 'mikro_orm_migrations',
    transactional: true,
    disableForeignKeys: true,
  },

  driverOptions: {
    connection: {
      foreign_keys: 1, // 👈 SQLite 외래키 활성화
    },
  },

  debug: process.env.NODE_ENV !== 'production',
};

export default config;
