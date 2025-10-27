import { Migration } from '@mikro-orm/migrations';

export class Migration20251027023817 extends Migration {
  async up(): Promise<void> {
    // 외래키 제약 조건을 포함한 테이블 생성
    this.addSql(`
      create table \`post\` (
        \`id\` integer not null primary key autoincrement,
        \`title\` varchar not null,
        \`content\` text not null,
        \`author_id\` integer not null,
        \`created_at\` datetime not null,
        constraint \`post_author_id_foreign\` 
          foreign key (\`author_id\`) 
          references \`user\` (\`id\`) 
          on delete cascade 
          on update cascade
      );
    `);

    // 인덱스 생성
    this.addSql('create index `post_author_id_index` on `post` (`author_id`);');
  }

  async down(): Promise<void> {
    // 롤백 시 테이블 삭제
    this.addSql('drop table if exists `post`;');
  }
}
