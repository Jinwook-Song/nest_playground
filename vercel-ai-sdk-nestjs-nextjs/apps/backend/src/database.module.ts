import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

export const schema = {};

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: (configService: ConfigService) => {
        const connectionString = configService.getOrThrow('DATABASE_URL');
        const pool = new Pool({ connectionString });
        return drizzle(pool, { schema });
      },
      inject: [ConfigService],
    },
  ],
})
export class DatabaseModule {}
