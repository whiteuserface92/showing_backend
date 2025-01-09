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
import { AuthService } from './auth.service';
import { Public } from 'src/decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('login')
  async login(@Request() req, @Res() res: Response) {
    console.log('login start');
    console.log(req.body);

    this.authService.validateUser(req.body.username, req.body.password, res);

    // console.log('validateUser result : ' + result);

    // const username = req.body.username;
    // const resultObj = {
    //   username: username,
    // };
    // this.authService.setLoginSession(req);
    // return res
    //   .status(200)
    //   .json({ message: 'Logged in successfully', resultObj });
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Request() req, @Res() res: Response) {
    req.logout((err) => {
      if (err) return res.status(500).send('Error logging out');
      res.send('Logged out successfully');
    });
  }

  @Post('check-session')
  async checkSession(@Request() req) {
    const nowSession = req.session;

    console.log('nowSession :' + nowSession);

    return nowSession;
  }

  @Post('SessionTestEn')
  async enTest(@Request() req) {
    const data = this.authService.encryptData(req.body);
    return data;
  }

  @Post('SessionTestDe')
  async deTest(@Request() req) {
    const data = this.authService.decryptData(req.body.data);
    return data;
  }

  @Post('getSession')
  async getSession(@Request() req) {
    this.authService.setLoginSession(req);
    const user = req.session.user;
    const secret = req.session.secret;
    const result = {
      user: user,
      secret: secret,
    };
    return result;
  }
}

// if (validatedUser) {
//   return res.status(200).json({ message: 'Login successful', user });
// } else {
//   return res.status(400).json({ message: 'Invalid credentials' });
// }
