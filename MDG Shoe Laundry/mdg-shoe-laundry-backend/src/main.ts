import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. MUST ENABLE CORS FOR FRONTEND PORT 3000
  app.enableCors({
    origin: 'http://localhost:3000', 
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  });

  // 2. SET THE PREFIX SO YOUR URL IS /api/orders
  app.setGlobalPrefix('api');

  const PORT = 5000;
  await app.listen(PORT);
  console.log(`🚀 MDG Backend Secure & Running on: http://localhost:${PORT}`);
}
bootstrap();