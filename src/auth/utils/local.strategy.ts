import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { CustomUnauthorizedException } from '../exception/CustomUnauthorizedException.exception';
import { User } from 'src/user/entity/user.entity';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(
    username: string,
    password: string,
    res: Response,
  ): Promise<User> {
    console.log('local.strategy start');

    const user = this.authService.getUserByUserName(username);

    if (!user) {
      throw new CustomUnauthorizedException('해당 유저를 찾을 수 없습니다.');
    }

    console.log('localStorage.strategy end');
    return user;
  }
}
