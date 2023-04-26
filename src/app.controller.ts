import { Controller, Get, Redirect, VERSION_NEUTRAL, Version } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController(true)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Version(VERSION_NEUTRAL)
  @Redirect('/api')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('ping')
  ping(): string {
    return 'pong';
  }
}
