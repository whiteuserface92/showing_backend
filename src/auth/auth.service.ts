import { Inject, Injectable } from '@nestjs/common';
import { HashService } from 'src/hash/hash.service';
import { User } from 'src/user/entity/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { CustomUnauthorizedException } from './exception/CustomUnauthorizedException.exception';
import * as crypto from 'crypto';
import { Response } from 'express';

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

  async validateUser(
    inputUserName: string,
    inputPassword: string,
    res: Response,
  ): Promise<User | Response> {
    var result = {
      code: 1,
    };

    if (!inputUserName) {
      return res
        .status(200)
        .json({ message: '아이디가 제대로 입력되지 않았습니다.', result });
    }

    if (!inputPassword) {
      return res
        .status(200)
        .json({ message: '비밀번호가 제대로 입력되지 않았습니다.', result });
    }

    const username = inputUserName;
    const password = inputPassword;

    const user = await this.userRepository.findOneBy({ username });

    const passwordEncodeData = await this.hashService.hashData(password);

    if (user) {
      if (passwordEncodeData == user.password) {
        // 비밀번호가 일치하면 암호화된 세션 데이터 저장
        const sessionData = this.encryptData({
          id: user.id,
          secret: process.env.SESSION_SECRET,
        });
        result.code = 0;
        // 비밀번호가 일치하면 사용자 반환
        return res
          .status(200)
          .json({ message: 'Logged in successfully', result });
      } else {
        return res
          .status(200)
          .json({ message: '해당 아이디의 비밀번호 틀립니다.', result });
      }
    } else {
      return res
        .status(200)
        .json({ message: '해당 아이디가 존재하지 않습니다.', result });
    }
  }

  setLoginSession(req: any) {
    const encryptSecret = this.encryptData({
      secret: process.env.SESSION_SECRET,
    });
    req.session.secret = encryptSecret;
    req.session.user = req.body.username; // 암호화된 세션 데이터 저장
    console.log(req.session.user);
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
