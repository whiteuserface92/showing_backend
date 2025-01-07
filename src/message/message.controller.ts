import { Controller, HttpCode, Post } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
  @Post('getMessages')
  @HttpCode(200)
  async getUsers() {
    return this.messageService.getMessages();
  }
}
