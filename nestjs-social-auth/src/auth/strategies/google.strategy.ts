import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly usersService: UsersService,
    readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.getOrThrow('GOOGLE_AUTH_CLIENT_ID'),
      clientSecret: configService.getOrThrow('GOOGLE_AUTH_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow('GOOGLE_AUTH_REDIRECT_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: any) {
    console.log('[profile]', profile.emails[0].value);
    return this.usersService.getOrCreateUser({
      email: profile.emails?.[0]?.value ?? '',
      password: '',
    });
  }
}
