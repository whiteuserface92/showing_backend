import { Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { HashService } from 'src/hash/hash.service';
import { UserRepository } from './user.repository';
import { AuthService } from 'src/auth/auth.service';
import { Connection } from 'mariadb';

@Injectable()
export class UserService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly hashService: HashService,
    private readonly authService: AuthService,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) { }

  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async createUser(user: any): Promise<User[]> {
    //만약 기존가 중복일 시 중복되지 않도록 하는 로직 추가
    const username = user.username;

    const existUser = await this.userRepository.findOneBy({ username });
    //중복된 아이디가 없으면 생성하고, 있으면 생성하지 않는다.
    if (!existUser) {
      // SHA-256 hashing
      const hashedPassword = await this.hashService.hashData(user.password);

      user.password = hashedPassword; //패스워드 받아서 인코딩 후 저장

      console.log(user);

      const newUser = await this.userRepository.create(user); // 새로운 엔티티 생성

      return await this.userRepository.save(newUser);
    } else {
      return null;
    }
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    console.log(password);

    const user = await this.userRepository.findOneBy({ username });
    console.log(`before password : ${user.password}`);

    const passwordEncodeData = await this.hashService.hashData(password);
    console.log(`now encode password : ${passwordEncodeData}`);

    if (user) {
      if (passwordEncodeData == user.password) {
        // 비밀번호가 일치하면 사용자 반환
        return user;
      } else {
        // 비밀번호가 틀리면 null 반환
        return null;
      }
    }
  }

  async getUserOptionByUsername(username: string): Promise<Object | null> {
    const userOption = await this.dataSource.query(
      'SELECT * FROM user_option WHERE user_id = (SELECT id FROM user WHERE username = ?);',
      [username]
    );
    console.log(userOption);
    return userOption
  }

}
