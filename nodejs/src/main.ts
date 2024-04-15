import 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'typeorm';

const newLocal = process.env.HTTP_PORT;
const port = newLocal || 7005;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(port);

  Logger.log(`Server running on port:${port}`, 'Bootstrap');
}
bootstrap();
