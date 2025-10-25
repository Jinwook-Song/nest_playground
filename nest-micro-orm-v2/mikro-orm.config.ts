import { Options } from '@mikro-orm/core';
import { SqliteDriver } from '@mikro-orm/sqlite';
import * as fs from 'fs';
import * as path from 'path';
const isProd = process.env.NODE_ENV === 'production';

const migrationsPath = isProd ? 'dist/src/migrations' : 'src/migrations';
const migrationsPattern = isProd ? /^[\w-]+\.js$/ : /^[\w-]+\.ts$/;

const resolvedDbPath = ((): string => {
  const fromEnv = (process.env.DB_PATH || '').trim();
  const fallback = isProd ? 'app.db' : 'app.dev.db';
  const dbPath = fromEnv || fallback;
  try {
    const dir = path.dirname(dbPath);
    if (dir && dir !== '.' && !fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch {
    // ignore directory creation failures; sqlite will error later if invalid
  }
  return dbPath;
})();

const config: Options<SqliteDriver> = {
  type: 'sqlite',
  dbName: resolvedDbPath,
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  migrations: {
    path: migrationsPath,
    pattern: migrationsPattern,
    tableName: 'mikro_orm_migrations',
    transactional: true,
    disableForeignKeys: true,
    allOrNothing: true,
  },
  debug: false,
};

export default config;
