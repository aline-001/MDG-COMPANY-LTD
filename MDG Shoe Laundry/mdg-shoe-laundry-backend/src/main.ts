import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. MUST ENABLE CORS FOR FRONTEND PORT 5173
  app.enableCors({
    origin: 'http://localhost:5173', 
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  });

  // 2. SET THE PREFIX SO YOUR URL IS /api/orders
  app.setGlobalPrefix('api');

  // 3. ENABLE GLOBAL VALIDATION PIPE
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const PORT = 5000;
  await app.listen(PORT);
  console.log(`🚀 MDG Backend Secure & Running on: http://localhost:${PORT}`);
}
bootstrap();