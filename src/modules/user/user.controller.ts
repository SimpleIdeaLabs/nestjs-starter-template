import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthorizedRoles } from '../../common/decorators/authorized-roles.decorator';
import { ApiResponse } from '../../common/dtos/api-response';
import { AuthenticatedGuard } from '../../common/guards/authenticated.guard';
import { AuthorizedGuard } from '../../common/guards/authorized.guard';
import { ROLE_TYPES } from './role.contants';
import { UserService } from './user.service';

@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/login')
  async login(@Req() req: Request) {
    const response = await this.userService.login(req.body);
    return response;
  }

  @Get('/session')
  @UseGuards(AuthenticatedGuard)
  async session(@Req() req: Request) {
    const response = new ApiResponse();
    response.status = true;
    response.message = 'User active session';
    response.data = req.user;
    return response;
  }

  /**
   * Create User
   */
  @Post('/')
  @AuthorizedRoles(ROLE_TYPES.SUPER_ADMIN, ROLE_TYPES.PMS_ADMIN)
  @UseGuards(AuthenticatedGuard, AuthorizedGuard)
  async create(@Req() req: Request) {
    const response = await this.userService.create({
      ...req.body,
      currentUser: req.user,
    });
    return response;
  }

  /**
   * Get Users lists
   */
  @Get('/')
  @AuthorizedRoles(ROLE_TYPES.SUPER_ADMIN, ROLE_TYPES.PMS_ADMIN)
  @UseGuards(AuthenticatedGuard, AuthorizedGuard)
  async read(@Req() req: Request) {
    const response = await this.userService.read({
      ...req.body,
      ...req.query,
      ...req.params,
      currentUser: req.user,
    });
    return response;
  }
}
