import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, HttpStatus, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import appconfig from './shared/config/index.config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { SuccessRequestInterceptor } from './shared/interceptors/success-request.interceptor';
import { LoggingInterceptor } from './shared/interceptors/request-logger.interceptor';
import { APISuccessResponse } from './shared/dto/success-response.dto';
import { APIErrorResponse, APIValidationErrorResponse } from './shared/dto/error-response.dto';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api', { exclude: [''] });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });
  app.useGlobalInterceptors(new SuccessRequestInterceptor(), new LoggingInterceptor());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(new Reflector()));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      validateCustomDecorators: true,
      transform: true,
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );
  const config = new DocumentBuilder().addServer(`http://localhost:${appconfig().PORT}/`).setTitle('URL Shortener').setDescription('URL Shortener API description').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [APISuccessResponse, APIErrorResponse, APIValidationErrorResponse],
  });
  SwaggerModule.setup('api', app, document);
  app.use(compression());
  app.use(
    helmet({
      frameguard: { action: 'deny' },
    }),
  );
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  await app.listen(appconfig().PORT, async () => console.log(`Application is running on: ${await app.getUrl()}`));
}
bootstrap();
