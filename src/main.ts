import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
// .env 파일을 로드하여 환경 변수들을 사용할 수 있게 설정
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);

  const appUrl = await app.getUrl();

  console.log(`Application is running on: ${appUrl}`);
}
bootstrap();
