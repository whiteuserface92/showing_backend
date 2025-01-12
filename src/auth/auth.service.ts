import { Inject, Injectable } from '@nestjs/common';
import { HashService } from 'src/hash/hash.service';
import { User } from 'src/user/entity/user.entity';
import { UserRepository } from 'src/user/user.repository';
import * as crypto from 'crypto';
import session from 'express-session';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) { }

  private readonly secretKey = crypto.randomBytes(32);
  private readonly iv = crypto.randomBytes(16);

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

      sessionStorage.user = user;

      return user;
    }
    console.log('validateUser failed end');
    return null;
  }
  //응답에 secret와 username을 세팅
  setLoginSession(sessionData: any) {
    const encryptSecret = this.encryptData({
      sessionData,
    });
    return encryptSecret;
  }

  validateLoginSession(req: any, res: any) { }

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
    if (typeof encryptedData !== 'string') {
      throw new Error('Invalid encrypted data format');
    }

    const [iv, encrypted] = encryptedData.split(':');
    if (!iv || !encrypted) {
      throw new Error('Invalid encrypted data format');
    }

    const ivBuffer = Buffer.from(iv, 'hex');
    if (ivBuffer.length !== 16) {
      throw new Error('Invalid initialization vector length');
    }

    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      this.secretKey,
      ivBuffer,
    );
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  }
}
