import { Migration } from '@mikro-orm/migrations';

export class Migration20251027023104 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `user` (`id` integer not null primary key autoincrement, `name` varchar not null, `email` varchar not null, `created_at` datetime not null, `updated_at` datetime not null);');
  }

}
