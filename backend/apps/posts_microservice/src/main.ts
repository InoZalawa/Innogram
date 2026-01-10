import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { AllExceptionsFilter } from './common/filters/global.filter';
async function bootstrap() {
  const app = await NestFactory.create(PostsModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  app.useGlobalFilters(new AllExceptionsFilter())
  await app.listen(3002); 
}
bootstrap();
