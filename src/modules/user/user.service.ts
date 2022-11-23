import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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
  ListUserParams,
  ListUserResponse,
  LoginUserParams,
  LoginUserResponse,
} from './user.dto';
import { User } from './user.entity';

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
    const { email, password, firstName, lastName, roles, currentUser } =
      createUserParams;

    // create user
    const user = new User();
    user.email = email;
    user.password = password;
    user.firstName = firstName;
    user.lastName = lastName;
    user.roles = roles;
    user.createdBy = currentUser;
    user.updatedBy = currentUser;

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
   * List Users
   */
  public async read(
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
    const { page = 1, limit = 10, roles = [] } = listUserParams;
    let totalUsers = 0;
    let users = [];
    const skip = this.utilService.getSkipOffset({ limit, page });

    const userQuery = await this.dataSource.manager
      .createQueryBuilder(User, 'user')
      .limit(limit)
      .offset(skip)
      .where('1 = 1');

    /**
     * Optional Joins
     */
    if (roles.length) {
      userQuery.innerJoin('user.roles', 'roles');
    }

    /**
     * Optional Wheres
     */

    // roles
    if (roles.length) {
      userQuery.andWhere('roles.name IN (:roles)', { roles });
    }

    totalUsers = await userQuery.getCount();
    users = await userQuery.getMany();

    // response
    response.data = {
      users,
      pagination: {
        total: Number(totalUsers),
        page: Number(page),
      },
    };
    response.status = true;
    response.message = `Get list of users`;
    return response;
  }
}
