import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { SqliteDriver } from '@mikro-orm/sqlite';
import * as fs from 'fs';
import * as path from 'path';
import config from '../../mikro-orm.config';

function timestamp(): string {
  const d = new Date();
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  return (
    d.getFullYear().toString() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

async function createBlankMigration(destDir: string) {
  const ts = timestamp();
  const className = `Migration${ts}`;
  const fileName = `${className}.ts`;
  const filePath = path.join(destDir, fileName);
  const content = `import { Migration } from '@mikro-orm/migrations';

export class ${className} extends Migration {
  async up(): Promise<void> {
    // TODO: write your migration here
  }

  async down(): Promise<void> {
    // TODO: write your reverse migration here
  }
}
`;
  fs.mkdirSync(destDir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  // eslint-disable-next-line no-console
  console.log('Blank migration created at:', filePath);
}

async function main() {
  const args = process.argv.slice(2);
  const isBlank = args.includes('--blank');

  // 생성 시에만 마이그 경로를 src/migrations로 강제, DB는 항상 app.dev.db 기준
  const cfg: any = { ...(config as any) };
  cfg.migrations = { ...(cfg.migrations || {}), path: 'src/migrations' };
  cfg.dbName = 'app.dev.db';
  if (!fs.existsSync(cfg.dbName)) {
    console.error(
      'app.dev.db not found. Run the dev server once to apply current migrations.',
    );
    process.exit(1);
  }

  if (isBlank) {
    await createBlankMigration(cfg.migrations.path);
    return;
  }

  const orm = await MikroORM.init<SqliteDriver>(cfg);
  const migrator = orm.getMigrator();
  const ret = await migrator.createMigration();
  await orm.close(true);
  if (!ret || !(ret as any).code) {
    // eslint-disable-next-line no-console
    console.log('No changes detected');
    return;
  }
  // eslint-disable-next-line no-console
  console.log('Migration created:', ret);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
