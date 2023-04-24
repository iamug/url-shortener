import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { SuccessRequestInterceptor } from './shared/interceptors/success-request.interceptor';
import { LoggingInterceptor } from './shared/interceptors/request-logger.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(
    new SuccessRequestInterceptor(),
    new LoggingInterceptor(),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
