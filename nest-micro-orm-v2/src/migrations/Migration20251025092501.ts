import { Migration } from '@mikro-orm/migrations';

export class Migration20251025092501 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `profiles` (`id` integer not null primary key autoincrement, `full_name` varchar null, `bio` varchar null, `avatar_url` varchar null, `created_at` datetime not null, `updated_at` datetime null);');

    this.addSql('alter table `profiles` add column `user_id` integer null;');
    this.addSql('create index `profiles_user_id_index` on `profiles` (`user_id`);');
    this.addSql('create unique index `profiles_user_id_unique` on `profiles` (`user_id`);');
  }

}
