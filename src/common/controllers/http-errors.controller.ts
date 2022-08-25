import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../dtos/api-response';

@Controller('http-errors')
export class HttpErrorsController {
  @Get('/500')
  @HttpCode(HttpStatus.INTERNAL_SERVER_ERROR)
  async error500(@Res() res: Response) {
    const response = new ApiResponse<boolean>();
    response.status = false;
    response.data = false;
    response.message = 'Internal Server Error';
    res.json(response);
  }

  @Get('/401')
  @HttpCode(HttpStatus.UNAUTHORIZED)
  async error401(@Res() res: Response) {
    const response = new ApiResponse<boolean>();
    response.status = false;
    response.data = false;
    response.message = 'Unauthorized';
    res.json(response);
  }
}
