import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
console.log('GOOGLE_MAPS_API_KEY =', process.env.GOOGLE_MAPS_API_KEY);
