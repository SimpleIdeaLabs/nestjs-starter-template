import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import {
  MAX_PATIENT_DOCUMENTS_PER_UPLOAD,
  MAX_PATIENT_PHOTOS_PER_UPLOAD,
  patientDocsStorage,
  patientPhotosStorage,
} from '../../common/config/patient-uploads.config';
import { AuthorizedRoles } from '../../common/decorators/authorized-roles.decorator';
import { AuthenticatedGuard } from '../../common/guards/authenticated.guard';
import { AuthorizedGuard } from '../../common/guards/authorized.guard';
import { MyLoggerService } from '../../common/modules/global/my-logger.service';
import { ROLE_TYPES } from '../user/role.contants';
import { PatientService } from './patient.service';

@Controller({
  path: 'patient',
  version: '1',
})
export class PatientController {
  constructor(
    private readonly patientService: PatientService,
    private readonly myLoggerService: MyLoggerService,
  ) {}

  /**
   * Create Patient
   */
  @Post('/')
  @AuthorizedRoles(ROLE_TYPES.SUPER_ADMIN, ROLE_TYPES.PMS_ADMIN)
  @UseGuards(AuthenticatedGuard, AuthorizedGuard)
  async create(@Req() req: Request) {
    const response = await this.patientService.create({
      ...req.body,
      currentUser: req.user,
    });
    return response;
  }

  /**
   * Upload Photos
   */
  @Post('/:patientId/photo')
  @UseInterceptors(
    FilesInterceptor('files', MAX_PATIENT_PHOTOS_PER_UPLOAD, {
      storage: patientPhotosStorage,
    }),
  )
  @AuthorizedRoles(ROLE_TYPES.SUPER_ADMIN, ROLE_TYPES.PMS_ADMIN)
  @UseGuards(AuthenticatedGuard, AuthorizedGuard)
  async uploadPhoto(
    @UploadedFiles() files: any[],
    @Param('patientId') patientId: number,
    @Req() req: Request,
  ) {
    const response = await this.patientService.uploadPhoto({
      files,
      patientId,
      currentUser: req.user,
    });
    return response;
  }

  /**
   * Delete Photo
   */
  @Delete('/:patientId/photo')
  @AuthorizedRoles(ROLE_TYPES.SUPER_ADMIN, ROLE_TYPES.PMS_ADMIN)
  @UseGuards(AuthenticatedGuard, AuthorizedGuard)
  async deletePhoto(
    @Param('patientId') patientId: number,
    @Req() req: Request,
  ) {
    const response = await this.patientService.deletePhoto({
      ...req.body,
      patientId,
      currentUser: req.user,
    });
    return response;
  }

  /**
   * Upload Documents
   */
  @Post('/:patientId/documents')
  @UseInterceptors(
    FilesInterceptor('files', MAX_PATIENT_DOCUMENTS_PER_UPLOAD, {
      storage: patientDocsStorage,
    }),
  )
  @AuthorizedRoles(ROLE_TYPES.SUPER_ADMIN, ROLE_TYPES.PMS_ADMIN)
  @UseGuards(AuthenticatedGuard, AuthorizedGuard)
  async uploadDocuments(
    @UploadedFiles() files: any[],
    @Param('patientId') patientId: number,
    @Req() req: Request,
  ) {
    const response = await this.patientService.uploadDocuments({
      files,
      patientId,
      currentUser: req.user,
      ...req.body,
    });
    return response;
  }

  /**
   * Delete Documents
   */
  @Delete('/:patientId/document')
  @AuthorizedRoles(ROLE_TYPES.SUPER_ADMIN, ROLE_TYPES.PMS_ADMIN)
  @UseGuards(AuthenticatedGuard, AuthorizedGuard)
  async deleteDocument(
    @Param('patientId') patientId: number,
    @Req() req: Request,
  ) {
    const response = await this.patientService.deleteDocuments({
      ...req.body,
      patientId,
      currentUser: req.user,
    });
    return response;
  }

  /**
   * Patient List
   */
  @Get('/')
  @AuthorizedRoles(ROLE_TYPES.SUPER_ADMIN, ROLE_TYPES.PMS_ADMIN)
  @UseGuards(AuthenticatedGuard, AuthorizedGuard)
  async list(@Req() req: Request) {
    const response = await this.patientService.list({
      ...req.body,
      ...req.query,
      ...req.params,
      currentUser: req.user,
    });
    return response;
  }

  /**
   * Patient Details
   */
  @Get('/:patientId')
  @AuthorizedRoles(ROLE_TYPES.SUPER_ADMIN, ROLE_TYPES.PMS_ADMIN)
  @UseGuards(AuthenticatedGuard, AuthorizedGuard)
  async detail(@Req() req: Request) {
    const response = await this.patientService.detail({
      ...req.body,
      ...req.query,
      ...req.params,
      currentUser: req.user,
    });
    return response;
  }
}
