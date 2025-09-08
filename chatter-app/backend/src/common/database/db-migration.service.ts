import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { config, database, up } from 'migrate-mongo';
import path from 'path';

@Injectable()
export class DbMigrationService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const dbMigrationConfig: Partial<config.Config> = {
      mongodb: {
        databaseName: this.configService.getOrThrow('DB_NAME'),
        url: this.configService.getOrThrow('MONGODB_URI'),
      },
      migrationsDir: path.join(__dirname, '..', '..', 'migrations'),
      changelogCollectionName: 'changelog',
      migrationFileExtension: '.js',
    };

    config.set(dbMigrationConfig);
    const { db, client } = await database.connect();
    try {
      await up(db, client);
    } finally {
      await client.close();
    }
  }
}
