import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/decorator/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }
  @Post('getUsers')
  // @UseGuards(AuthGuard('local'))
  @Public()
  @HttpCode(200)
  async getUsers() {
    return this.userService.getUsers();
  }

  @Post('createUser')
  // @UseGuards(AuthGuard('local'))
  @Public()
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

  @Post('getUserOption')
  // @UseGuards(AuthGuard('local'))
  @Public()
  async getUserByUsername(@Body() user, @Res() res: Response) {

    console.log(JSON.stringify(user.user.username));

    const result = await this.userService.getUserOptionByUsername(JSON.stringify(user.user.username));
    if (result) {
      return res.status(200).json({ message: 'UserOption get successful', result });
    } else {
      return res
        .status(400)
        .json({ message: 'UserOption get failed Because this username Exist.' });
    }
  }

  @Post('validateUser')
  @UseGuards(AuthGuard('local'))
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
  //세션 테스트 용
  @Get('set-session')
  @Public()
  setSession(@Req() req: Request, @Res() res: Response) {
    req.session.user = {
      completeDecryptUserData:
        '0a0e0264d1fa60724ec04b2a88e9233b:ce0e059e7aadb043e806a0682c7870a7e0db5a6b4863031c18a615fcf74d87ecdeca766b143462d8e1dc2bb5c2ce9fe1e1d70c2e580ea18def5509532d2cf5f8',
      username: req.body.username,
    };
    res.send('Session has been set');
  }
  //세션 테스트 용
  @Get('get-session')
  @Public()
  getSession(@Req() req: Request, @Res() res: Response) {
    console.log('get session start');
    if (req.session.user) {
      return res.json(req.session.user);
    } else {
      return res.send('No session data found');
    }
  }
  //세션 테스트 용
  @Get('delete-session')
  @Public()
  deleteSession(@Req() req: Request, @Res() res: Response) {
    console.log('delete session complete!');
    if (req.session.user) {
      delete req.session.user;
      return res.send('delete session user complete');
    } else {
      return res.send('already session user empty');
    }
  }

  //세션 테스트 용
  @Get('set-cookie')
  @Public()
  async setCookie(@Req() req: Request, @Res() res: Response) {
    req.session.cookie.expires = new Date(Date.now() + 1000 * 60 * 60);
    req.session.cookie.maxAge = 1000 * 60 * 1;
    // 변경된 세션 정보를 저장
    req.session.save((err) => {
      if (err) {
        console.error('Error saving session:', err);
        return res.status(500).send('Failed to refresh session.');
      }
      res.send('Session expiration time has been refreshed');
    });
  }
  //세션 테스트 용
  @Get('get-cookie')
  @Public()
  getCookie(@Req() req: Request, @Res() res: Response) {
    console.log('get session start');
    if (req.session.cookie) {
      return res.json(req.session.cookie);
    } else {
      return res.send('No cookie data found');
    }
  }
  //세션 테스트 용
  @Get('delete-cookie')
  @Public()
  deleteCookie(@Req() req: Request, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroy session:', err);
        return res.status(500).send('Failed to refresh session.');
      }
      res.send('Session destroy');
    });
  }
  //세션 테스트 용
  @Get('refresh-cookie')
  refreshSession(@Req() req: Request, @Res() res: Response) {
    if (req.session.user) {
      // 세션 만료 시간을 1시간 후로 갱신
      req.session.cookie.expires = new Date(Date.now() + 1000 * 60 * 1); // 1시간
      req.session.cookie.maxAge = 1000 * 60 * 1; // 1시간

      // 변경된 세션 정보를 저장
      req.session.save((err) => {
        if (err) {
          console.error('Error saving session:', err);
          return res.status(500).send('Failed to refresh session.');
        }
        res.send('Session expiration time has been refreshed');
      });
    } else {
      res.status(401).send('No session found');
    }
  }
}
