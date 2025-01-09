import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './utils/local.strategy';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { UserRepository } from 'src/user/user.repository';
import { HashService } from 'src/hash/hash.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PassportModule, UserModule],
  providers: [
    HashService,
    AuthService,
    UserService,
    LocalStrategy,
    // {
    //   provide: APP_GUARD
    // }
  ],
  controllers: [AuthController],
})
export class AuthModule {}
