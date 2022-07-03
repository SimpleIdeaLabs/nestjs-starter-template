import { Controller, Get, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse } from './common/dtos/api-response.dto';

@Controller({
  version: '1',
})
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/unauthorized')
  @HttpCode(401)
  unauthorized() {
    return new ApiResponse({
      status: true,
      message: 'Unauthorized',
    });
  }

  @Get('/server-error')
  @HttpCode(500)
  serverError() {
    return new ApiResponse({
      status: true,
      message: 'Internal Server Error',
    });
  }
}
