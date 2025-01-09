import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: any, done: Function) {
    console.log('serializeUser start');
    done(null, user);
    console.log('serializeUser end');
  }

  deserializeUser(payload: any, done: Function) {
    done(null, payload);
  }
}
