import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entity/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('getUsers')
  @HttpCode(200)
  async getUsers() {
    return this.userService.getUsers();
  }

  @Post('create')
  @HttpCode(201)
  async createUser(@Body() User) {
    return this.userService.createUser(User);
  }
}
