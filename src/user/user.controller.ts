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
    const result = await this.userService.createUser(User);
    if (result) {
      return { message: 'Created successful', result };
    } else {
      return { message: 'Created failed Because this username Exist.' };
    }
  }

  @Post('validateUser')
  @HttpCode(200)
  async validateUser(@Body() user) {
    const validatedUser = await this.userService.validateUser(
      user.username,
      user.password,
    );

    console.log(`controller value : ${validatedUser}`);

    if (validatedUser) {
      return { message: 'Login successful', user };
    } else {
      return { message: 'Invalid credentials' };
    }
  }
}
