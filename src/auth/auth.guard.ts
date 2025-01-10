import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    console.log('AuthGuard start');
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    console.log('isPublic enable : ' + isPublic);
    // 인증 로직 처리
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    console.log('guard Request Session : ' + JSON.stringify(req.session));
    console.log('guard Response Session : ' + JSON.stringify(res.session));
    if (isPublic) {
      console.log('AuthGuard isPublic end');
      return true; // 공용 라우트는 인증 건너뜀
    }
    console.log('AuthGuard isPublic not end');
    return this.validateSession(req, res);
  }

  validateSession(req: any, res: any): boolean {
    const sessionExpires = req.session.cookie.expires;

    if (sessionExpires) {
      const expiresTimestamp = new Date(sessionExpires).getTime();
      const currentTimestamp = Date.now();
      if (expiresTimestamp <= currentTimestamp) {
        console.log('session expired!');
        return false;
      } else {
        console.log('session not expired!');
        return true;
      }
    }
  }
}
