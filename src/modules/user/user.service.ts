import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateAndExtract } from 'class-validator-ext';
import { DataSource } from 'typeorm';
import { ERROR_TITLES } from '../../common/constants/constants';
import { ApiResponse } from '../../common/dtos/api-response';
import { MyLoggerService } from '../../common/modules/global/my-logger.service';
import { UtilService } from '../../common/modules/global/util.service';

import {
  CreateUserParams,
  DeleteUserParams,
  ListUserParams,
  ListUserResponse,
  LoginUserParams,
  LoginUserResponse,
  ReadUserParams,
  ReadUserResponse,
  UpdateUserParams,
} from './user.dto';
import { User } from './user.entity';
import { Role } from './role.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly utilService: UtilService,
    private readonly myLoggerService: MyLoggerService,
  ) {}

  /**
   * Login User
   */
  public async login(
    params: LoginUserParams,
  ): Promise<ApiResponse<LoginUserResponse>> {
    const response = new ApiResponse<LoginUserResponse>();
    const loginParams = plainToClass(LoginUserParams, params);

    try {
      this.myLoggerService.log('Login Attempt', {
        class: 'UserService',
        method: 'login',
        loginParams,
      });

      // validation
      const validationErrors = await validateAndExtract(loginParams);
      if (!validationErrors.isValid) {
        response.status = false;
        response.message = 'Invalid parameters, check input';
        response.validationErrors = validationErrors.errors;
        this.myLoggerService.error('Login Failed', {
          class: 'UserService',
          method: 'login',
          response,
          loginParams,
          validationErrors,
        });
        throw new BadRequestException(response, ERROR_TITLES.VALIDATION_ERROR);
      }

      // attempt get user
      const { email, password } = params;
      const user = await this.dataSource.manager.findOne(User, {
        where: {
          email,
        },
        relations: ['roles'],
      });

      // user not found
      if (!user || !user.doesPasswordMatch(password)) {
        response.data = null;
        response.message = 'Invalid login credentials';
        response.status = false;
        this.myLoggerService.error('Login Failed', {
          class: 'UserService',
          method: 'login',
          response,
          loginParams,
        });
        throw new UnauthorizedException(
          response,
          ERROR_TITLES.UNAUTHORIZED_ERROR,
        );
      }

      // successful logged in
      response.status = true;
      response.message = 'User successfully logged in';
      response.data = new LoginUserResponse(user.toJWT());

      this.myLoggerService.log('Login Failed', {
        class: 'UserService',
        method: 'login',
        loginParams,
        response,
      });
    } catch (error) {
      this.myLoggerService.error('Login Failed', {
        class: 'UserService',
        method: 'login',
        response,
        loginParams,
        error,
      });
      throw error;
    }

    return response;
  }

  /**
   * Create User
   */
  public async create(params: CreateUserParams): Promise<ApiResponse<User>> {
    const response = new ApiResponse<User>();
    const createUserParams = plainToClass(CreateUserParams, params);
    const validationErrors = await validateAndExtract(createUserParams);

    this.myLoggerService.log('Create User Attempt', {
      createUserParams,
    });

    // validation
    if (!validationErrors.isValid) {
      response.status = false;
      response.message = 'Invalid parameters, check input';
      response.validationErrors = validationErrors.errors;
      this.myLoggerService.error('Create User Failed', {
        createUserParams,
        response,
      });
      throw new BadRequestException(response, ERROR_TITLES.VALIDATION_ERROR);
    }

    // params
    const {
      email,
      password,
      firstName,
      lastName,
      roles,
      currentUser,
      profilePhoto,
    } = createUserParams;

    // create user
    const user = new User();
    user.email = email;
    user.password = password;
    user.profilePhoto = profilePhoto.filename;
    user.firstName = firstName;
    user.lastName = lastName;
    user.roles = roles;
    user.createdBy = currentUser;
    user.updatedBy = currentUser;

    // save user
    await this.dataSource.manager.save(user);

    // response
    response.data = user;
    response.status = true;
    response.message = `${firstName} ${lastName} was successfully created`;

    this.myLoggerService.log(`${user.email} created`, {
      createUserParams,
      response,
    });

    return response;
  }

  /**
   * Read User
   */
  public async read(
    params: ReadUserParams,
  ): Promise<ApiResponse<ReadUserResponse>> {
    const response = new ApiResponse<ReadUserResponse>();
    const readRoleResponse = plainToClass(ReadUserResponse, params);
    const validationErrors = await validateAndExtract(readRoleResponse);

    // validation
    if (!validationErrors.isValid) {
      response.status = false;
      response.message = 'Invalid parameters, check input';
      response.validationErrors = validationErrors.errors;
      throw new BadRequestException(response, ERROR_TITLES.VALIDATION_ERROR);
    }

    // params
    const { userId } = params;
    const user = await this.dataSource.manager.findOne(User, {
      where: {
        id: userId,
      },
      relations: ['roles'],
    });

    if (!user) {
      response.status = false;
      response.message = 'User not found.';
      throw new NotFoundException(response, ERROR_TITLES.NON_FOUND_ERROR);
    }
    response.status = true;
    response.data = {
      user,
    };
    response.message = 'User';

    return response;
  }

  /**
   * Update User
   */
  public async update(params: UpdateUserParams): Promise<ApiResponse<User>> {
    const response = new ApiResponse<User>();
    const updateUserParams = plainToClass(UpdateUserParams, params);
    const validationErrors = await validateAndExtract(updateUserParams);

    // validation
    if (!validationErrors.isValid) {
      response.status = false;
      response.message = 'Invalid parameters, check input';
      response.validationErrors = validationErrors.errors;
      throw new BadRequestException(response, ERROR_TITLES.VALIDATION_ERROR);
    }

    // params
    const {
      userId,
      email,
      password = null,
      firstName,
      lastName,
      roles,
      currentUser,
      profilePhoto,
    } = updateUserParams;

    console.log('roles >>', roles);

    // get user
    const user = await this.dataSource.manager.findOne(User, {
      where: {
        id: userId,
      },
    });

    if (!user) {
      response.status = false;
      response.message = 'User not found.';
      throw new NotFoundException(response, ERROR_TITLES.NON_FOUND_ERROR);
    }

    // update user
    user.email = email;
    if (password) {
      user.password = password;
    }
    if (profilePhoto) {
      user.profilePhoto = profilePhoto.filename;
    }
    user.firstName = firstName;
    user.lastName = lastName;
    user.roles = roles.map((r) => plainToClass(Role, { id: Number(r.id) }));
    user.updatedAt = new Date();
    user.updatedBy = currentUser;
    await this.dataSource.manager.save(user);

    response.status = true;
    response.message = `${firstName} ${lastName} user updated`;
    response.data = user;

    return response;
  }

  /**
   * List Users
   */
  public async list(
    params: ListUserParams,
  ): Promise<ApiResponse<ListUserResponse>> {
    const response = new ApiResponse<ListUserResponse>();
    const listUserParams = plainToClass(ListUserParams, params);
    const validationErrors = await validateAndExtract(listUserParams);

    // validation
    if (!validationErrors.isValid) {
      response.status = false;
      response.message = 'Invalid parameters, check input';
      response.validationErrors = validationErrors.errors;
      throw new BadRequestException(response, ERROR_TITLES.VALIDATION_ERROR);
    }

    // params
    const {
      page = 1,
      limit = 10,
      role = [],
      firstName = '',
      lastName = '',
      email = '',
      currentUser,
    } = listUserParams;
    let totalUsers = 0;
    let users = [];
    const skip = this.utilService.getSkipOffset({ limit, page });

    const userQuery = await this.dataSource.manager
      .createQueryBuilder(User, 'user')
      .leftJoinAndSelect('user.roles', 'roles')
      .limit(limit)
      .offset(skip)
      .where('1 = 1')
      .andWhere('user.id != :currentUserId', {
        currentUserId: currentUser.id,
      })
      .orderBy('user.id', 'DESC');

    /**
     * Optional Wheres
     */

    // roles
    if (role.length) {
      userQuery.andWhere('roles.key IN (:role)', { role });
    }

    // filters
    if (firstName || lastName || email) {
      // firstname
      if (firstName) {
        userQuery.andWhere('user.firstName LIKE :firstName', {
          firstName: `%${firstName}%`,
        });
      }

      // lastname
      if (lastName) {
        userQuery.andWhere('user.lastName LIKE :lastName', {
          lastName: `%${lastName}%`,
        });
      }

      // email
      if (email) {
        userQuery.andWhere('user.email LIKE :email', {
          email: `%${email}%`,
        });
      }
    }

    // count
    totalUsers = await userQuery.getCount();
    users = await userQuery.getMany();

    // response
    const total = Number(totalUsers);
    response.data = {
      users,
      pagination: {
        total,
        page: Number(page),
        totalNumberOfPages: this.utilService.getTotalNumberOfPages({
          total,
          limit,
        }),
        limit,
      },
    };
    response.status = true;
    response.message = `Get list of users`;
    return response;
  }

  /**
   * Delete User
   */
  public async delete(params: DeleteUserParams): Promise<ApiResponse<boolean>> {
    const response = new ApiResponse<boolean>();
    const deleteUserParams = plainToClass(DeleteUserParams, params);
    const validationErrors = await validateAndExtract(deleteUserParams);

    // validation
    if (!validationErrors.isValid) {
      response.status = false;
      response.message = 'Invalid parameters, check input';
      response.validationErrors = validationErrors.errors;
      throw new BadRequestException(response, ERROR_TITLES.VALIDATION_ERROR);
    }

    // params
    let { userId } = deleteUserParams;
    userId = Number(userId);
    const user = await this.dataSource.manager.findOne(User, {
      where: {
        id: userId,
      },
    });

    if (!user) {
      response.status = false;
      response.message = 'User not found.';
      throw new NotFoundException(response, ERROR_TITLES.NON_FOUND_ERROR);
    }

    await this.dataSource.manager.remove(user);
    response.message = `${user.firstName} ${user.lastName} successfully deleted.`;
    response.data = true;
    return response;
  }
}
