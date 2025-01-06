import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('getUsers')
  async getUsers() {
    return this.userService.getUsers();
  }

  @Post('create')
  async createUser(@Body() User) {
    return this.userService.createUser(User);
  }
}
