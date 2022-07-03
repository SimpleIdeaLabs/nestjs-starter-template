import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MyLoggerService } from '../common/modules/my-logger/my-logger.service';
import { UserAuthGuard } from './user-auth.guard';
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

  @Get('/session')
  @UseGuards(UserAuthGuard)
  async getSession(@Req() req: Request, @Res() res: Response) {
    try {
      const response = await this.userService.getSession(req);
      if (!response.status) return res.redirect('/v1/unauthorized');
      return res.json(response);
    } catch (error) {
      this.myLogger.error('Get Session', error);
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
