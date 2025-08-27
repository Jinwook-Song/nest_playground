import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { schema } from 'src/database/schema';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getUsers() {
    const database = this.databaseService.getDatabase();
    return database.query.users.findMany();
  }

  async createUser(user: typeof schema.users.$inferInsert) {
    const database = this.databaseService.getDatabase();
    return database.insert(schema.users).values(user);
  }
}
