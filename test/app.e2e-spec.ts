import { Test, TestingModule } from '@nestjs/testing';
import { ClassSerializerInterceptor, HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Reflector } from '@nestjs/core';
import { HttpExceptionFilter } from 'src/shared/filters/http-exception.filter';
import { LoggingInterceptor } from 'src/shared/interceptors/request-logger.interceptor';
import { SuccessRequestInterceptor } from 'src/shared/interceptors/success-request.interceptor';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let shortId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(302);
  });

  it('/ping (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/ping').expect(200);
    expect(response.body).toHaveProperty('success');
    expect(response.body).toHaveProperty('payload', 'pong');
  });

  const mockUrl = 'https://example.com';

  it('should throw an error for encoding invalid url - /url/encode (POST)', async () => {
    const response = await request(app.getHttpServer()).post('/url/encode').send({ url: 'invalidUrl' }).expect(422);
    expect(response.body).toHaveProperty('success');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('error');
    expect(response.body.success).toEqual(false);
  });

  it('should successfully encode valid url - /url/encode (POST)', async () => {
    const response = await request(app.getHttpServer()).post('/url/encode').send({ url: mockUrl }).expect(201);
    expect(response.body).toHaveProperty('success');
    expect(response.body).toHaveProperty('payload');
    expect(response.body.success).toEqual(true);
    expect(response.body.payload).toBeInstanceOf(Object);
    expect(response.body.payload).toHaveProperty('shortId');
    shortId = response.body.payload.shortId;
  });

  it('should successfully decode short url - /url/decode (GET)', async () => {
    const response = await request(app.getHttpServer()).get(`/url/decode/${shortId}`).expect(200);
    expect(response.body).toHaveProperty('success');
    expect(response.body).toHaveProperty('payload');
    expect(response.body.success).toEqual(true);
    expect(response.body.payload).toBeInstanceOf(Object);
    expect(response.body.payload).toHaveProperty('originalUrl', mockUrl);
  });

  it('should throw an error when decoding invalid short url - /url/decode (GET)', async () => {
    const response = await request(app.getHttpServer()).get(`/url/decode/invalidurl`).expect(404);
    expect(response.body).toHaveProperty('success');
    expect(response.body).toHaveProperty('message');
    expect(response.body.success).toEqual(false);
  });

  it('should successfully fetch statistics for valid short url - /url/statistics (GET)', async () => {
    const response = await request(app.getHttpServer()).get(`/url/statistics/${shortId}`).expect(200);
    expect(response.body).toHaveProperty('success');
    expect(response.body).toHaveProperty('payload');
    expect(response.body.success).toEqual(true);
    expect(response.body.payload).toBeInstanceOf(Object);
    expect(response.body.payload).toHaveProperty('visits');
    expect(response.body.payload.topIps).toBeInstanceOf(Array);
    expect(response.body.payload.topUserAgents).toBeInstanceOf(Array);
  });

  it('should throw an error when fetching statistics for invalid short url - /url/statistics (GET)', async () => {
    const response = await request(app.getHttpServer()).get(`/url/statistics/invalidurl`).expect(404);
    expect(response.body).toHaveProperty('success');
    expect(response.body).toHaveProperty('message');
    expect(response.body.success).toEqual(false);
  });
});
