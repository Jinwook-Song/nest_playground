import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly usersService: UsersService) {
    super({
      usernameField: 'email',
    });
  }

  validate(email: string, password: string): Promise<User> {
    try {
      return this.usersService.validateUser(email, password);
    } catch (error) {
      throw error;
    }
  }
}
