import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { AuthorizedRoles } from '../../../common/decorators/authorized-roles.decorator';
import { AuthenticatedGuard } from '../../../common/guards/authenticated.guard';
import { AuthorizedGuard } from '../../../common/guards/authorized.guard';
import { ROLE_TYPES } from '../role.contants';
import { Request } from 'express';

@Controller({
  path: 'role',
  version: '1',
})
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * List all Roles
   */
  @Get('/')
  @AuthorizedRoles(ROLE_TYPES.SUPER_ADMIN, ROLE_TYPES.PMS_ADMIN)
  @UseGuards(AuthenticatedGuard, AuthorizedGuard)
  public async index(@Req() req: Request) {
    const response = await this.roleService.list({
      ...req.body,
      ...req.query,
      ...req.params,
      currentUser: req.user,
    });
    return response;
  }

  /**
   * Get Role by ID
   */
  @Get('/:roleId')
  @AuthorizedRoles(ROLE_TYPES.SUPER_ADMIN, ROLE_TYPES.PMS_ADMIN)
  @UseGuards(AuthenticatedGuard, AuthorizedGuard)
  public async read(@Req() req: Request) {
    const response = await this.roleService.read({
      ...req.body,
      ...req.query,
      ...req.params,
      currentUser: req.user,
    });
    return response;
  }

  /**
   * Update Role
   */
  @Patch('/:roleId')
  @AuthorizedRoles(ROLE_TYPES.SUPER_ADMIN, ROLE_TYPES.PMS_ADMIN)
  @UseGuards(AuthenticatedGuard, AuthorizedGuard)
  public async update(@Req() req: Request) {
    const response = await this.roleService.update({
      ...req.body,
      ...req.query,
      ...req.params,
      currentUser: req.user,
    });
    return response;
  }

  @Delete('/:roleId')
  @AuthorizedRoles(ROLE_TYPES.SUPER_ADMIN, ROLE_TYPES.PMS_ADMIN)
  @UseGuards(AuthenticatedGuard, AuthorizedGuard)
  public async delete(@Req() req: Request) {
    const response = await this.roleService.delete({
      ...req.body,
      ...req.query,
      ...req.params,
      currentUser: req.user,
    });
    return response;
  }

  /**
   * Create Role
   */
  @Post('/')
  @AuthorizedRoles(ROLE_TYPES.SUPER_ADMIN, ROLE_TYPES.PMS_ADMIN)
  @UseGuards(AuthenticatedGuard, AuthorizedGuard)
  async create(@Req() req: Request) {
    const response = await this.roleService.create({
      ...req.body,
      currentUser: req.user,
    });
    return response;
  }
}
