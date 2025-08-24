import { Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';

import { DATABASE_CONNECTION } from './database-connection';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import * as userSchema from 'src/users/schema';
import * as postSchema from 'src/posts/schema';
import * as categorySchema from 'src/categories/schema';

@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: (configService: ConfigService) => {
        const pool = new Pool({
          connectionString: configService.getOrThrow('DATABASE_URL'),
        });
        return drizzle(pool, {
          schema: {
            ...userSchema,
            ...postSchema,
            ...categorySchema,
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
