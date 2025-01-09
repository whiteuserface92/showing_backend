import { Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
  @UseGuards(AuthGuard('local'))
  @Post('getMessages')
  @HttpCode(200)
  async getUsers() {
    return this.messageService.getMessages();
  }

  @UseGuards(AuthGuard('local'))
  @Post('getMessageById')
  @HttpCode(200)
  async getMessageById(@Request() req) {
    console.log(req.body.id);
    return this.messageService.getMessageById(parseInt(req.body.id));
  }
}
