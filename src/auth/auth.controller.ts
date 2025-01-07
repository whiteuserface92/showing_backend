import {
  Controller,
  Request,
  Post,
  UseGuards,
  Res,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Res() res: Response) {
    const user = req.user;
    return res.status(200).json({ message: 'Logged in successfully', user });
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Request() req, @Res() res: Response) {
    req.session.destroy();
    return res.status(200).json({ message: 'Logged out successfully' });
  }
}

// if (validatedUser) {
//   return res.status(200).json({ message: 'Login successful', user });
// } else {
//   return res.status(400).json({ message: 'Invalid credentials' });
// }
