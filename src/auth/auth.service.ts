import { Inject, Injectable } from '@nestjs/common';
import { HashService } from 'src/hash/hash.service';
import { User } from 'src/user/entity/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { CustomUnauthorizedException } from './exception/CustomUnauthorizedException.exception';
import * as crypto from 'crypto';
import { Request, Response } from 'express';
import session from 'express-session';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  private readonly secretKey = crypto.randomBytes(32); // 32바이트 키
  private readonly iv = crypto.randomBytes(16); // 16바이트 IV

  async getUserByUserName(inputUserName: string) {
    const username = inputUserName;
    const user = await this.userRepository.findOneBy({ username });
    return user;
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    console.log('validateUser start');
    const user = await this.userRepository.findOneBy({ username });
    if (user == null) {
      console.log('username not found!');
      return null;
    }
    const inputPasswordHashed = await this.hashService.hashData(password);

    if (user.password === inputPasswordHashed) {
      // 비밀번호 검증은 해시화된 비밀번호로 비교해야 합니다.
      console.log('validateUser success end');
      return user;
    }
    console.log('validateUser failed end');
    return null;
  }
  //응답에 secret와 username을 세팅
  setLoginSession(req: any, res: any, sessionData: any) {
    const encryptSecret = this.encryptData({
      sessionData,
    });
    res.session.sessionData = sessionData;
  }

  validateLoginSession(req: any, res: any) {}

  // 세션 데이터 암호화
  encryptData(data: any): string {
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      this.secretKey,
      this.iv,
    );
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    // 암호화된 데이터와 IV를 함께 반환
    return `${this.iv.toString('hex')}:${encrypted}`;
  }

  // 세션 데이터 복호화
  decryptData(encryptedData: string): any {
    const [iv, encrypted] = encryptedData.split(':');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      this.secretKey,
      Buffer.from(iv, 'hex'),
    );
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  }
}
