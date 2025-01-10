import {
  Controller,
  Post,
  UseGuards,
  Res,
  HttpCode,
  Get,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from 'src/decorator/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('login')
  async login(@Req() req: Request, @Res() res: Response) {
    console.log('login start');
    console.log(req.body);

    const user = await this.authService.validateUser(
      req.body.username,
      req.body.password,
    );

    if (user) {
      delete user.password;
      const userStringData = JSON.stringify(user);
      const completeDecryptUserData =
        await this.authService.encryptData(userStringData);
      console.log(completeDecryptUserData);

      req.session.cookie.maxAge = 10 * 60 * 1000;

      req.session.save((err) => {
        if (err) {
          console.error('Error saving session:', err);
          console.error('Failed to refresh session.');
        }
        console.log('Session expiration time has been refreshed');
      });

      req.session.user = { completeDecryptUserData: completeDecryptUserData };

      return res.status(200).json({
        completeDecryptUserData,
      });
    } else {
      return res.status(403).json({
        completeDecryptUserData: null,
      });
    }
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: Request, @Res() res: Response) {
    // req.logout((err) => {
    //   if (err) return res.status(500).send('Error logging out');
    //   res.send('Logged out successfully');
    // });
  }

  @Post('check-session')
  async checkSession(@Req() req: Request) {
    const nowSession = req.session;

    console.log('nowSession :' + nowSession);

    return nowSession;
  }
}
