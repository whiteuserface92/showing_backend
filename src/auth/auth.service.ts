import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from 'src/hash/hash.service';
import { User } from 'src/user/entity/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { Repository } from 'typeorm';
import { CustomUnauthorizedException } from './exception/CustomUnauthorizedException.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashService: HashService,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    // console.log(password);

    const user = await this.userRepository.findOneBy({ username });
    console.log(`before password : ${user.password}`);

    const passwordEncodeData = await this.hashService.hashData(password);
    console.log(`now encode password : ${passwordEncodeData}`);

    if (user) {
      if (passwordEncodeData == user.password) {
        // 비밀번호가 일치하면 사용자 반환
        return user;
      } else if (passwordEncodeData !== user.password) {
        throw new CustomUnauthorizedException(
          '해당 아이디의 비밀번호 틀립니다.',
        );
      } else {
        // 비밀번호가 틀리면 null 반환
        return null;
      }
    }
  }
}
