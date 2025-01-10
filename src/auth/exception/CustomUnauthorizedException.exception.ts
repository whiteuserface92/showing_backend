import { UnauthorizedException } from '@nestjs/common';
// 임시로 사용
export class CustomUnauthorizedException extends UnauthorizedException {
  constructor(message: string) {
    super(message);
  }
}
