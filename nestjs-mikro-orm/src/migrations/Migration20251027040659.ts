import { Migration } from '@mikro-orm/migrations';

export class Migration20251027040659 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table `post` add column `views` text null default 0;');
  }
}
