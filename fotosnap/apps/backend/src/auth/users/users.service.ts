import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DATABASE_CONNECTION } from 'src/database/database-connection';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { schema } from 'src/database/database.module';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async findById(id: string) {
    const foundUser = await this.db.query.user.findFirst({
      where: eq(schema.user.id, id),
    });

    if (!foundUser) {
      throw new NotFoundException('User not found');
    }

    return foundUser;
  }
}
