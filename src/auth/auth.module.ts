import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './utils/local.strategy';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/user.repository';
import { HashService } from 'src/hash/hash.service';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entity/user.entity';

@Module({
  imports: [
    PassportModule,
    UserModule,
    TypeOrmModule.forFeature([UserRepository, User]),
  ],
  providers: [
    HashService,
    AuthService,
    UserService,
    LocalStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService], // AuthService를 내보내기
})
export class AuthModule { }