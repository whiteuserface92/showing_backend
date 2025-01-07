import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserRepository } from './user.repository';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    {
      provide: 'UserRepository', // 리포지토리 토큰
      useFactory: (dataSource: DataSource) => UserRepository(dataSource),
      inject: [DataSource], // DataSource 주입
    },
  ],
  exports: ['UserRepository'], // 외부에서 사용할 수 있도록 export
})
export class UserModule {}
