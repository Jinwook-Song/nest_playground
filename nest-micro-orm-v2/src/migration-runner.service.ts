import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('ts-node/register/transpile-only');
}
import { MikroORM } from '@mikro-orm/core';

@Injectable()
export class MigrationRunnerService implements OnModuleInit {
  private readonly logger = new Logger(MigrationRunnerService.name);

  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    // 애플리케이션 부트 시, 미적용 마이그레이션을 적용
    try {
      // SQLite FK 강제 (연결 단위 설정)
      await this.orm.em.getConnection().execute('PRAGMA foreign_keys = ON');
      const migrator = this.orm.getMigrator();
      await migrator.up();
      this.logger.log('Migrations applied');
    } catch (err) {
      this.logger.error('Migration run failed', err as Error);
      throw err;
    }
  }
}
