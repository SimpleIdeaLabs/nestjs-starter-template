import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { MyLoggerService } from '../common/modules/my-logger/my-logger.service';
import { LoginParams } from './user.dtos';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly myLogger: MyLoggerService,
  ) { }

  @Post('/login')
  @UsePipes(new ValidationPipe())
  async login(@Body() body: LoginParams, @Res() res: Response) {
    try {
      const response = await this.userService.login(body);
      if (!response.status) return res.redirect('/v1/unauthorized');
      return res.json(response);
    } catch (error) {
      this.myLogger.error('Login', error);
      return res.redirect('/v1/server-error');
    }
  }

  @Get()
  async saveUser(@Body() body: LoginParams, @Res() res: Response) {
    try {
      const user = new User({
        firstName: 'Mark',
        lastName: 'Matute',
        email: 'markernest.matute@gmail.com',
        password: '12345',
      });
      const response = await this.userService.save(user);
      return res.json(response);
    } catch (error) {
      this.myLogger.error('Save User', error);
      return res.redirect('/v1/server-error');
    }
  }
}
