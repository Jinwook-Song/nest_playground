import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/users/schema';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async getUsers() {
    return this.db.query.users.findMany({
      with: {
        posts: true,
        profile: true,
      },
    });
  }

  async createUser(user: typeof schema.users.$inferInsert) {
    await this.db.insert(schema.users).values(user);
  }

  async createProfile(profile: typeof schema.profile.$inferInsert) {
    await this.db.insert(schema.profile).values(profile);
  }
}
