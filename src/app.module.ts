import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/User';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost', // MariaDB 서버 주소
      port: 3306, // MariaDB 포트
      username: 'root', // MariaDB 사용자 이름
      password: 'root', // MariaDB 비밀번호
      database: 'test', // 사용하려는 데이터베이스 이름
      entities: [User], // 사용되는 엔티티
      synchronize: true, // 애플리케이션 시작 시 데이터베이스 스키마 자동 동기화 (개발 환경에서만 사용 권장)
    }),
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
