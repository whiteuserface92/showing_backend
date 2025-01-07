import { Controller, HttpCode, Post, Request } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
  @Post('getMessages')
  @HttpCode(200)
  async getUsers() {
    return this.messageService.getMessages();
  }

  @Post('getMessageById')
  @HttpCode(200)
  async getMessageById(@Request() req) {
    console.log(req.body.id);
    return this.messageService.getMessageById(parseInt(req.body.id));
  }
}
