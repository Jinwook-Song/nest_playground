import { Migration } from '@mikro-orm/migrations';

export class Migration20251025143701 extends Migration {
  async up(): Promise<void> {
    // 1) null 값 백필 (필요 시 기본값 변경 가능)
    this.addSql("update `users` set `password` = '' where `password` is null;");

    // 2) 임시 테이블 생성 (password를 NOT NULL로 정의)
    this.addSql(`
      create table "users_tmp" (
        "id" integer not null primary key autoincrement,
        "email" varchar not null,
        "name" varchar null,
        "password" varchar not null,
        "created_at" datetime not null,
        "updated_at" datetime null
      );
    `);

    // 3) 데이터 복사 (null 안전장치로 COALESCE 사용)
    this.addSql(`
      insert into "users_tmp" ("id", "email", "name", "password", "created_at", "updated_at")
      select "id", "email", "name", COALESCE("password", ''), "created_at", "updated_at" from "users";
    `);

    // 4) 기존 테이블 교체
    this.addSql('drop table `users`;');
    this.addSql('alter table `users_tmp` rename to `users`;');

    // 5) 인덱스/제약 재생성
    this.addSql(`
      create unique index "users_email_unique" on "users" ("email");
    `);
  }

  async down(): Promise<void> {
    // down: password를 다시 nullable로 되돌림 (재작성)
    this.addSql(`
      create table "users_tmp" (
        "id" integer not null primary key autoincrement,
        "email" varchar not null,
        "name" varchar null,
        "password" varchar null,
        "created_at" datetime not null,
        "updated_at" datetime null
      );
    `);

    this.addSql(`
      insert into "users_tmp" ("id", "email", "name", "password", "created_at", "updated_at")
      select "id", "email", "name", "password", "created_at", "updated_at" from "users";
    `);

    this.addSql('drop table `users`;');
    this.addSql('alter table `users_tmp` rename to `users`;');
    this.addSql(`
      create unique index "users_email_unique" on "users" ("email");
    `);
  }
}
