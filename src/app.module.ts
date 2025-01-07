import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entity/user.entity';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';
import { KakaoController } from './kakao/kakao.controller';
import { KakaoService } from './kakao/kakao.service';
import { DatabaseService } from './database/database.service';
import { HashService } from './hash/hash.service';
import { MessageController } from './message/message.controller';
import { MessageService } from './message/message.service';
import { Message } from './message/entity/message.entity';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // TODO 해당 변수 .env 설정으로 변경예정
      type: 'mariadb',
      host: process.env.DATABASE_HOST, // MariaDB 서버 주소
      port: parseInt(process.env.DATABASE_PORT), // MariaDB 포트
      username: process.env.DATABASE_USERNAME, // MariaDB 사용자 이름
      password: process.env.DATABASE_PASSWORD, // MariaDB 비밀번호
      database: process.env.DATABASE_NAME, // 사용하려는 데이터베이스 이름
      entities: [User, Message], // 사용되는 엔티티
      synchronize: true, // 애플리케이션 시작 시 데이터베이스 스키마 자동 동기화 (개발 환경에서만 사용 권장)
    }),
    TypeOrmModule.forFeature([User, Message]),
    ConfigModule.forRoot({
      isGlobal: true, //설정파일을 앱 전역에서 사용할 수 있도록 설정
      envFilePath: path.resolve(__dirname, '.env'), //env 파일 결로 설정
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [
    AppController,
    UserController,
    KakaoController,
    MessageController,
  ],
  providers: [
    AppService,
    UserService,
    KakaoService,
    DatabaseService,
    HashService,
    MessageService,
  ],
})
export class AppModule {}
