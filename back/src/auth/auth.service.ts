import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as dotenv from 'dotenv';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from './payload';
dotenv.config();

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async googleLogin(user: User, res: Response): Promise<void> {
    // get req.user by using CurrentUser decorator which is saved during validate function in googleStrategy

    await this.setCookie(res, user, 'access');
    await this.setCookie(res, user, 'refresh');
    res.redirect(process.env.FRONT_CALLBACK_URL as string);
  }

  async setCookie(
    res: Response,
    user: User,
    type: 'access' | 'refresh',
  ): Promise<void> {
    const base = {
      domain: process.env.JWT_DOMAIN,
      path: '/',
      sameSite: 'none' as const,
      httpOnly: true,
    };
    const payload: JwtPayload = { id: user.id };
    const isRefresh = type === 'refresh';
    const secret = isRefresh
      ? process.env.JWT_REFRESH_TOKEN_SECRET
      : process.env.JWT_ACCESS_TOKEN_SECRET;
    const expiresIn = isRefresh
      ? process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME
      : process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME;
    const token = this.jwtService.sign(payload, {
      secret,
      expiresIn: `${expiresIn}s`,
    });
    const name = isRefresh ? 'Refresh' : 'Authentication';
    res.cookie(name, token, { ...base, maxAge: Number(expiresIn) * 1000 });
    if (isRefresh) {
      await this.userService.setRefreshToken(user.id, token);
    }
  }

  async removeCookies(res: Response, user: User): Promise<void> {
    const base = {
      domain: process.env.JWT_DOMAIN,
      path: '/',
      sameSite: 'none' as const,
      httpOnly: true,
    };
    res.cookie('Authentication', '', {
      ...base,
      maxAge: 0,
    });
    res.cookie('Refresh', '', {
      ...base,
      maxAge: 0,
    });
    await this.userService.removeRefreshToken(user.id);
  }
}
