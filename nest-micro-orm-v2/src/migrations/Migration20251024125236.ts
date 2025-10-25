import { Migration } from '@mikro-orm/migrations';

export class Migration20251024125236 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `users` (`id` integer not null primary key autoincrement, `email` varchar not null, `name` varchar null, `created_at` datetime not null, `updated_at` datetime null);');
    this.addSql('create unique index `users_email_unique` on `users` (`email`);');
  }

}
