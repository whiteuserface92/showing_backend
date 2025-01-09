import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    console.log('isPublic enable : ' + isPublic);
    if (isPublic) {
      return true; // 공용 라우트는 인증 건너뜀
    }
    // 인증 로직 처리
    const req = context.switchToHttp().getRequest();
    return this.validateSession(req);
  }

  validateSession(req: any): boolean {
    // Session 검증 로직 (위에서 설명한 대로)
    if (req.session.cookie.originalMaxAge > 0) {
      console.log(req.session.cookie.originalMaxAge);
      return true;
    } else {
      console.log(req.session.cookie.originalMaxAge);
      return false;
    }
  }
}
