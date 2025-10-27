import './env';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MikroORM } from '@mikro-orm/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const orm = app.get(MikroORM);

  const dbPath = orm.config.get('dbName');
  console.log(`📁 Current Database path: ${dbPath}`);

  const migrator = orm.getMigrator();

  try {
    const pending = await migrator.getPendingMigrations();

    if (pending && pending.length > 0) {
      console.log(`🔄 ${pending.length}개의 마이그레이션을 실행합니다...`);
      await migrator.up();
      console.log('✅ 마이그레이션 완료!');
    } else {
      console.log('✅ 실행할 마이그레이션이 없습니다.');
    }
  } catch (error) {
    console.error('❌ 마이그레이션 실패:', error);
    throw error;
  }

  await app.listen(3000);
  console.log('🚀 서버가 http://localhost:3000 에서 실행 중입니다.');
}

bootstrap();
