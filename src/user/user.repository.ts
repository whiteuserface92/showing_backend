import { Repository, DataSource } from 'typeorm';
import { User } from './entity/user.entity';

export const UserRepository = (dataSource: DataSource) =>
  dataSource.getRepository(User).extend({
    // 사용자 정의 메서드를 여기에 추가합니다.
  });

export type UserRepository = ReturnType<typeof UserRepository>;
