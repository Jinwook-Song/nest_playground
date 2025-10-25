"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isProd = process.env.NODE_ENV === 'production';
const migrationsPath = isProd ? 'dist/migrations' : 'src/migrations';
const migrationsPattern = isProd ? /^[\w-]+\.js$/ : /^[\w-]+\.ts$/;
const config = {
    type: 'sqlite',
    dbName: 'app.db',
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
exports.default = config;
//# sourceMappingURL=mikro-orm.config.js.map