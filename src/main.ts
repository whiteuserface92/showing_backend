import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as session from 'express-session';
// .env 파일을 로드하여 환경 변수들을 사용할 수 있게 설정
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://192.168.30.173:5000', // Allow requests from this domain
    methods: 'GET,POST', // Allow only GET and POST methods
    allowedHeaders: 'Content-Type, Authorization', // Allow certain headers
    credentials: true, // Allow sending credentials (cookies)
  });

  app.use(
    session({
      secret: 'dlsdlworld-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 }, //1시간
    }),
  );

  await app.listen(process.env.PORT ?? 3000);

  const appUrl = await app.getUrl();

  console.log(`Application is running on: ${appUrl}`);
}
bootstrap();
