import { Migration } from '@mikro-orm/migrations';

export class Migration20251027023206 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `user` add column `age` integer null;');
  }

}
