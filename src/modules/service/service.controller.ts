import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthorizedRoles } from '../../common/decorators/authorized-roles.decorator';
import { AuthenticatedGuard } from '../../common/guards/authenticated.guard';
import { AuthorizedGuard } from '../../common/guards/authorized.guard';
import { ROLE_TYPES } from '../user/role.contants';
import { ServiceService } from './service.service';
import { Request } from 'express';
import { servicesPhotosStorage } from '../../common/config/patient-uploads.config';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller({
  path: 'service',
  version: '1',
})
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  // list
  @Get('/')
  @AuthorizedRoles(ROLE_TYPES.SUPER_ADMIN, ROLE_TYPES.PMS_ADMIN)
  @UseGuards(AuthenticatedGuard, AuthorizedGuard)
  async list(@Req() req: Request) {
    const response = await this.serviceService.list({
      ...req.body,
      ...req.query,
      ...req.params,
      currentUser: req.user,
    });
    return response;
  }

  /**
   * Read Service
   */
  @Get('/:serviceId')
  @AuthorizedRoles(ROLE_TYPES.SUPER_ADMIN, ROLE_TYPES.PMS_ADMIN)
  @UseGuards(AuthenticatedGuard, AuthorizedGuard)
  async read(@Req() req: Request) {
    const response = await this.serviceService.read({
      ...req.body,
      ...req.query,
      ...req.params,
      currentUser: req.user,
    });
    return response;
  }

  /**
   * Create Service
   */
  @Post('/')
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: servicesPhotosStorage,
    }),
  )
  @AuthorizedRoles(ROLE_TYPES.SUPER_ADMIN, ROLE_TYPES.PMS_ADMIN)
  @UseGuards(AuthenticatedGuard, AuthorizedGuard)
  async create(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    const response = await this.serviceService.create({
      ...req.body,
      logo: file,
      currentUser: req.user,
    });
    return response;
  }

  @Patch('/:serviceId')
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: servicesPhotosStorage,
    }),
  )
  @AuthorizedRoles(ROLE_TYPES.SUPER_ADMIN, ROLE_TYPES.PMS_ADMIN)
  @UseGuards(AuthenticatedGuard, AuthorizedGuard)
  public async update(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const response = await this.serviceService.update({
      ...req.body,
      ...req.query,
      ...req.params,
      logo: file,
      currentUser: req.user,
    });
    return response;
  }

  @Delete('/:serviceId')
  @AuthorizedRoles(ROLE_TYPES.SUPER_ADMIN, ROLE_TYPES.PMS_ADMIN)
  @UseGuards(AuthenticatedGuard, AuthorizedGuard)
  public async delete(@Req() req: Request) {
    const response = await this.serviceService.delete({
      ...req.body,
      ...req.query,
      ...req.params,
      currentUser: req.user,
    });
    return response;
  }
}
