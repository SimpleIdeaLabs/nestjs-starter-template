import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthorizedRoles } from '../../common/decorators/authorized-roles.decorator';
import { ApiResponse } from '../../common/dtos/api-response';
import { AuthenticatedGuard } from '../../common/guards/authenticated.guard';
import { AuthorizedGuard } from '../../common/guards/authorized.guard';
import { ROLE_TYPES } from './role.contants';
import { UserService } from './user.service';
import { profilePhotosStorage } from '../../common/config/patient-uploads.config';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * Login User
   */
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: Request) {
    const response = await this.userService.login(req.body);
    return response;
  }

  /**
   * Current User session
   */
  @Get('/current')
  @UseGuards(AuthenticatedGuard)
  async session(@Req() req: Request) {
    const response = new ApiResponse();
    response.status = true;
    response.message = 'User active session';
    response.data = req.user;
    return response;
  }

  /**
   * Update Current User
   */
  @Patch('/current')
  @UseInterceptors(
    FileInterceptor('profilePhoto', {
      storage: profilePhotosStorage,
    }),
  )
  @AuthorizedRoles(ROLE_TYPES.SUPER_ADMIN, ROLE_TYPES.PMS_ADMIN)
  @UseGuards(AuthenticatedGuard, AuthorizedGuard)
  public async updateCurrentUser(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const response = await this.userService.updateCurrentUser({
      ...req.body,
      ...req.query,
      ...req.params,
      userId: req.user.id,
      profilePhoto: file,
      currentUser: req.user,
    });
    return response;
  }

  @Patch('/current/password')
  @AuthorizedRoles(ROLE_TYPES.SUPER_ADMIN, ROLE_TYPES.PMS_ADMIN)
  @UseGuards(AuthenticatedGuard, AuthorizedGuard)
  public async updateCurrentUserPassword(@Req() req: Request) {
    const response = await this.userService.updateCurrentUserPassword({
      ...req.body,
      ...req.query,
      ...req.params,
      userId: req.user.id,
      currentUser: req.user,
    });
    return response;
  }

  /**
   * Create User
   */
  @Post('/')
  @UseInterceptors(
    FileInterceptor('profilePhoto', {
      storage: profilePhotosStorage,
    }),
  )
  @AuthorizedRoles(ROLE_TYPES.SUPER_ADMIN, ROLE_TYPES.PMS_ADMIN)
  @UseGuards(AuthenticatedGuard, AuthorizedGuard)
  async create(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    const response = await this.userService.create({
      ...req.body,
      profilePhoto: file,
      currentUser: req.user,
    });
    return response;
  }

  /**
   * Read User
   */
  @Get('/:userId')
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

  /**
   * Update User
   */
  @Patch('/:userId')
  @UseInterceptors(
    FileInterceptor('profilePhoto', {
      storage: profilePhotosStorage,
    }),
  )
  @AuthorizedRoles(ROLE_TYPES.SUPER_ADMIN, ROLE_TYPES.PMS_ADMIN)
  @UseGuards(AuthenticatedGuard, AuthorizedGuard)
  public async update(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const response = await this.userService.update({
      ...req.body,
      ...req.query,
      ...req.params,
      profilePhoto: file,
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
  async list(@Req() req: Request) {
    const response = await this.userService.list({
      ...req.body,
      ...req.query,
      ...req.params,
      currentUser: req.user,
    });
    return response;
  }

  /**
   * Delete User
   */
  @Delete('/:userId')
  @AuthorizedRoles(ROLE_TYPES.SUPER_ADMIN, ROLE_TYPES.PMS_ADMIN)
  @UseGuards(AuthenticatedGuard, AuthorizedGuard)
  public async delete(@Req() req: Request) {
    const response = await this.userService.delete({
      ...req.body,
      ...req.query,
      ...req.params,
      currentUser: req.user,
    });
    return response;
  }
}
