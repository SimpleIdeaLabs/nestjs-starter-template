import {
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthorizedRoles } from '../../common/decorators/authorized-roles.decorator';
import { ApiResponse } from '../../common/dtos/api-response';
import { AuthenticatedGuard } from '../../common/guards/authenticated.guard';
import { AuthorizedGuard } from '../../common/guards/authorized.guard';
import { MyLoggerService } from '../../modules/my-logger/my-logger.service';
import { ROLE_TYPES } from './role.contants';
import { UserService } from './user.service';

@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(
    private userService: UserService,
    private myLogger: MyLoggerService,
  ) {}

  @Post('/login')
  async login(@Req() req: Request, @Res() res: Response) {
    try {
      const response = await this.userService.login(req.body);

      // validation error
      if (!response.status && response?.validationErrors) {
        res.statusCode = HttpStatus.BAD_REQUEST;
        res.json(response);
        return res;
      }

      // invalid user
      if (!response.status) {
        res.statusCode = HttpStatus.UNAUTHORIZED;
        res.json(response);
        return res;
      }

      res.statusCode = HttpStatus.OK;
      return res.json(response);
    } catch (error) {
      this.myLogger.error('Login Error', error);
      return res.redirect('/http-errors/500');
    }
  }

  @Get('/session')
  @AuthorizedRoles(ROLE_TYPES.SUPER_ADMIN)
  @UseGuards(AuthenticatedGuard, AuthorizedGuard)
  async session(@Req() req: Request, @Res() res: Response) {
    try {
      const response = new ApiResponse();
      response.status = true;
      response.message = 'User active session';
      response.data = req.user;
      return res.json(response);
    } catch (error) {
      this.myLogger.error('Login Error', error);
      return res.redirect('/http-errors/500');
    }
  }
}
