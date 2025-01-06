import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async createUser(User: User[]): Promise<User[]> {
    const newUser = await this.userRepository.create(User);
    return await this.userRepository.save(User); // 새로운 엔티티 생성
  }
}
