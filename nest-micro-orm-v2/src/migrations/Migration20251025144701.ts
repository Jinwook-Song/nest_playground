import { Migration } from '@mikro-orm/migrations';

export class Migration20251025085044 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table `todos` (`id` integer not null primary key autoincrement, `title` varchar not null, `description` varchar null, `completed` text not null default false, `created_at` datetime not null, `updated_at` datetime null);',
    );
  }
}
