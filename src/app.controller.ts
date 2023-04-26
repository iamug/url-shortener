import { Controller, Get, Redirect, VERSION_NEUTRAL } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController(true)
@Controller({ version: VERSION_NEUTRAL })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Redirect('/api')
  getHello(): string {
    return this.appService.getHello();
  }
}
