import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as session from 'express-session';
import { AuthGuard } from './auth/auth.guard';
// .env 파일을 로드하여 환경 변수들을 사용할 수 있게 설정
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // Allow requests from this domain
    methods: 'GET,POST', // Allow only GET and POST methods
    allowedHeaders: 'Content-Type, Authorization', // Allow certain headers
    credentials: true, // Allow sending credentials (cookies)
  });

  // 글로벌 AuthGuard 설정
  // app.useGlobalGuards(new (AuthGuard('local'))(new Reflector()));

  // 한국시간을 기준으로 세션 만료 시간 설정
  const koreaTimeOffset = 60 * 60 * 60 * 1000; // UTC+9, 한국시간에 맞게 밀리초로 변환 (9시간)
  const currentTimeInKST = new Date().getTime() + koreaTimeOffset; // 현재 한국시간

  // 세션 만료 시간을 1시간 후로 설정
  const sessionMaxAge = 6 * 60 * 1000; // 1시간 후 (밀리초 단위) -- 1분 변경

  app.use(
    session({
      secret: process.env.SESSION_SECRET, // 세션의 서명 키
      resave: false, // 세션을 강제로 다시 저장할지 여부
      saveUninitialized: false, // 초기화되지 않은 세션을 저장할지 여부
      cookie: {
        maxAge: sessionMaxAge, // 1시간 후에 세션 만료
        expires: new Date(currentTimeInKST + sessionMaxAge), // 만료 시간 설정 (한국시간 기준)
        secure: false,
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);

  const appUrl = await app.getUrl();

  console.log(`Application is running on: ${appUrl}`);
}
bootstrap();
