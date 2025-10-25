import { Migration } from '@mikro-orm/migrations';

export class Migration20251025145701 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `todos` add column `user_id` integer null;');
    this.addSql('create index `todos_user_id_index` on `todos` (`user_id`);');
  }
}
