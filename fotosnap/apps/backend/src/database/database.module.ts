import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DATABASE_CONNECTION } from './database-connection';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as authSchema from '../auth/schema';
import * as postSchema from '../posts/schemas/schema';
import * as commentSchema from '../comments/schemas/schema';

export const schema = {
  ...authSchema,
  ...postSchema,
  ...commentSchema,
};

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: (configService: ConfigService) => {
        const poll = new Pool({
          connectionString: configService.getOrThrow('DATABASE_URL'),
        });

        return drizzle(poll, { schema });
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
