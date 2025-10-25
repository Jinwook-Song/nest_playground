import { Migration } from '@mikro-orm/migrations';

export class Migration20251024125547 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `users` add column `password` varchar null;');
  }

}
