import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('getUsers')
  @HttpCode(200)
  async getUsers() {
    return this.userService.getUsers();
  }

  @Post('create')
  async createUser(@Body() user, @Res() res: Response) {
    const result = await this.userService.createUser(user);
    if (result) {
      return res.status(201).json({ message: 'Created successful', result });
    } else {
      return res
        .status(400)
        .json({ message: 'Created failed Because this username Exist.' });
    }
  }

  @Post('validateUser')
  @HttpCode(200)
  async validateUser(@Body() user, @Res() res: Response) {
    const validatedUser = await this.userService.validateUser(
      user.username,
      user.password,
    );

    console.log(`controller value : ${validatedUser}`);

    if (validatedUser) {
      return res.status(200).json({ message: 'Login successful', user });
    } else {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
  }
}
