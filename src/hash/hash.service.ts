import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class HashService {
  async hashData(data: string): Promise<string> {
    const result = crypto.createHash('sha256').update(data).digest('hex');
    return result;
  }
}
