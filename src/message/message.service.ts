import { Injectable } from '@nestjs/common';
import { Message } from './entity/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async getMessages(): Promise<Message[]> {
    return this.messageRepository.find();
  }
}
