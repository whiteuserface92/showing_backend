import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { CustomUnauthorizedException } from '../exception/CustomUnauthorizedException.exception';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new CustomUnauthorizedException('해당 유저를 찾을 수 없습니다.');
    }

    if (user) {
      if (user.enabled == 0) {
        throw new CustomUnauthorizedException('삭제된 계정입니다.');
      }
    }
    return user;
  }
}
