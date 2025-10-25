import { Migration } from '@mikro-orm/migrations';

export class Migration20251025094506 extends Migration {
  async up(): Promise<void> {
    // author_id FK를 포함하여 테이블을 한 번에 생성 (SQLite는 ALTER TABLE로 FK 추가 불가)
    this.addSql(`
  create table "posts" (
    "id" integer not null primary key autoincrement,
    "title" varchar not null,
    "content" varchar null,
    "created_at" datetime not null,
    "updated_at" datetime null,
    "author_id" integer not null,
    constraint "fk_posts_author"
      foreign key ("author_id") references "users" ("id") on delete cascade
  );
`);

    this.addSql(
      'create index "posts_author_id_index" on "posts" ("author_id");',
    );
  }
}
