import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import type { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User, res: Response) {
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() +
        parseInt(this.configService.getOrThrow('JWT_EXPIRATION')),
    );

    const tokenPayload: TokenPayload = {
      ...user,
      _id: user._id.toHexString(),
    };

    const token = this.jwtService.sign(tokenPayload, {
      secret: this.configService.getOrThrow('JWT_SECRET'),
      expiresIn: this.configService.getOrThrow('JWT_EXPIRATION') + 's',
    });

    res.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
  }

  verifyWs(request: Request): TokenPayload {
    const cookies: string[] = request.headers.cookie?.split(';') || [];
    const authCookie = cookies.find((cookie) =>
      cookie.includes('Authentication'),
    );
    if (!authCookie) {
      throw new Error('Authentication cookie not found');
    }
    const token = authCookie.split('=')[1];
    return this.jwtService.verify(token, {
      secret: this.configService.getOrThrow('JWT_SECRET'),
    });
  }

  async logout(res: Response) {
    res.clearCookie('Authentication', {
      httpOnly: true,
    });
  }
}
