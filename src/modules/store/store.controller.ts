import {
  Controller,
  Get,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthorizedRoles } from '../../common/decorators/authorized-roles.decorator';
import { AuthenticatedGuard } from '../../common/guards/authenticated.guard';
import { AuthorizedGuard } from '../../common/guards/authorized.guard';
import { ROLE_TYPES } from '../user/role.contants';
import { StoreService } from './store.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  profilePhotosStorage,
  storeFilesStorage,
} from '../../common/config/patient-uploads.config';
import { Request } from 'express';

@Controller({
  path: 'store',
  version: '1',
})
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  @AuthorizedRoles(ROLE_TYPES.SUPER_ADMIN)
  @UseGuards(AuthenticatedGuard, AuthorizedGuard)
  async index() {
    const response = await this.storeService.read();
    return response;
  }

  @Patch()
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: storeFilesStorage,
    }),
  )
  @AuthorizedRoles(ROLE_TYPES.SUPER_ADMIN, ROLE_TYPES.PMS_ADMIN)
  @UseGuards(AuthenticatedGuard, AuthorizedGuard)
  async update(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    const response = await this.storeService.update({
      ...req.body,
      ...req.query,
      ...req.params,
      userId: req.user.id,
      logo: file,
      currentUser: req.user,
    });
    return response;
  }
}
