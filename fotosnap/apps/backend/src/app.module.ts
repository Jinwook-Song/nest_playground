import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthGuard, AuthModule } from '@mguay/nestjs-better-auth';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from './database/database-connection';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    AuthModule.forRootAsync({
      imports: [DatabaseModule, ConfigModule],
      useFactory: (database: NodePgDatabase, configService: ConfigService) => ({
        auth: betterAuth({
          database: drizzleAdapter(database, {
            provider: 'pg',
          }),
          emailAndPassword: {
            enabled: true,
          },
          trustedOrigins: [configService.getOrThrow('UI_URL')],
        }),
      }),
      inject: [DATABASE_CONNECTION, ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
