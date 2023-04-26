import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { MyLoggerService } from '../../../common/modules/global/my-logger.service';
import { UtilService } from '../../../common/modules/global/util.service';
import {
  CreateRoleParams,
  DeleteRoleParams,
  ListRoleParams,
  ListRoleResponse,
  ReadRoleParams,
  ReadRoleResponse,
  UpdateRoleParams,
} from './role.dto';
import { plainToClass } from 'class-transformer';
import { validateAndExtract } from 'class-validator-ext';
import { ERROR_TITLES } from '../../../common/constants/constants';
import { ApiResponse } from '../../../common/dtos/api-response';
import { Role } from '../role.entity';
import { User } from '../user.entity';

@Injectable()
export class RoleService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly utilService: UtilService,
    private readonly myLoggerService: MyLoggerService,
  ) {}

  /**
   * Read Role
   */
  public async read(
    params: ReadRoleParams,
  ): Promise<ApiResponse<ReadRoleResponse>> {
    const response = new ApiResponse<ReadRoleResponse>();
    const readRoleResponse = plainToClass(ReadRoleResponse, params);
    const validationErrors = await validateAndExtract(readRoleResponse);

    // validation
    if (!validationErrors.isValid) {
      response.status = false;
      response.message = 'Invalid parameters, check input';
      response.validationErrors = validationErrors.errors;
      throw new BadRequestException(response, ERROR_TITLES.VALIDATION_ERROR);
    }

    // params
    const { roleId } = params;

    const role = await this.dataSource.manager.findOne(Role, {
      where: {
        id: roleId,
      },
    });

    if (!role) {
      response.status = false;
      response.message = 'Role not found.';
      throw new NotFoundException(response, ERROR_TITLES.NON_FOUND_ERROR);
    }
    response.status = true;
    response.data = {
      role,
    };
    response.message = 'Role';

    return response;
  }

  /**
   * List Roles
   */
  public async list(
    params: ListRoleParams,
  ): Promise<ApiResponse<ListRoleResponse>> {
    const response = new ApiResponse<ListRoleResponse>();
    const listRoleParams = plainToClass(ListRoleParams, params);
    const validationErrors = await validateAndExtract(listRoleParams);

    // validation
    if (!validationErrors.isValid) {
      response.status = false;
      response.message = 'Invalid parameters, check input';
      response.validationErrors = validationErrors.errors;
      throw new BadRequestException(response, ERROR_TITLES.VALIDATION_ERROR);
    }

    // params
    const { page = 1, limit = 10, keyword = null } = listRoleParams;
    let totalRoles = 0;
    let roles = [];
    const skip = this.utilService.getSkipOffset({ limit, page });

    const roleQuery = await this.dataSource.manager
      .createQueryBuilder(Role, 'role')
      .leftJoin('role.users', 'users')
      .select([
        'role.id',
        'role.name',
        'role.key',
        'COUNT(users.id) as role_user_count',
      ])
      .limit(limit)
      .offset(skip)
      .where('1 = 1')
      .groupBy('role.id')
      .orderBy('role.id', 'DESC');

    // filter by name
    if (keyword) {
      roleQuery.andWhere('role.name LIKE :keyword', {
        keyword: `%${keyword}%`,
      });
    }

    totalRoles = await roleQuery.getCount();
    const rawRoles = await roleQuery.getRawMany();
    roles = rawRoles.map((rawRole) => {
      const tmpRole = new Role();
      tmpRole.id = rawRole.role_id;
      tmpRole.name = rawRole.role_name;
      tmpRole.key = rawRole.role_key;
      tmpRole.userCount = rawRole.role_user_count;
      return tmpRole;
    });

    // response
    const total = Number(totalRoles);
    response.data = {
      roles,
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
    response.message = `Get list of roles`;
    return response;
  }

  /**
   * Create Role
   */
  public async create(params: CreateRoleParams): Promise<ApiResponse<Role>> {
    const response = new ApiResponse<Role>();
    const createRoleParams = plainToClass(CreateRoleParams, params);
    const validationErrors = await validateAndExtract(createRoleParams);

    this.myLoggerService.log('Create Role Attempt', {
      createRoleParams,
    });

    // validation
    if (!validationErrors.isValid) {
      response.status = false;
      response.message = 'Invalid parameters, check input';
      response.validationErrors = validationErrors.errors;
      this.myLoggerService.error('Create Role Failed', {
        createRoleParams,
        response,
      });
      throw new BadRequestException(response, ERROR_TITLES.VALIDATION_ERROR);
    }

    // params
    const { name } = createRoleParams;

    // create role
    const roleKey = Role.generateKey(name);
    const role = new Role(roleKey, name);

    await this.dataSource.manager.save(role);

    // response
    response.data = role;
    response.status = true;
    response.message = `${role.name} was successfully created`;

    this.myLoggerService.log(`${role.name} created`, {
      createRoleParams,
      response,
    });

    return response;
  }

  /**
   * Update Role
   */
  public async update(params: UpdateRoleParams): Promise<ApiResponse<Role>> {
    const response = new ApiResponse<Role>();
    const updateRoleParams = plainToClass(UpdateRoleParams, params);
    const validationErrors = await validateAndExtract(updateRoleParams);

    this.myLoggerService.log('Update Role Attempt', {
      updateRoleParams,
    });

    // validation
    if (!validationErrors.isValid) {
      response.status = false;
      response.message = 'Invalid parameters, check input';
      response.validationErrors = validationErrors.errors;
      this.myLoggerService.error('Update Role Failed', {
        updateRoleParams,
        response,
      });
      throw new BadRequestException(response, ERROR_TITLES.VALIDATION_ERROR);
    }

    // params
    const { roleId, name } = updateRoleParams;

    const role = await this.dataSource.manager.findOne(Role, {
      where: {
        id: roleId,
      },
    });

    if (!role) {
      response.status = false;
      response.message = 'Role not found.';
      throw new NotFoundException(response, ERROR_TITLES.NON_FOUND_ERROR);
    }

    // update role data
    role.name = name;
    await this.dataSource.manager.save(role);
    response.status = true;
    response.message = `${name} role updated`;
    response.data = role;

    return response;
  }

  /**
   * Delete Role
   */
  public async delete(params: DeleteRoleParams): Promise<ApiResponse<boolean>> {
    const response = new ApiResponse<boolean>();
    const deleteRoleParams = plainToClass(DeleteRoleParams, params);
    const validationErrors = await validateAndExtract(deleteRoleParams);

    // validation
    if (!validationErrors.isValid) {
      response.status = false;
      response.message = 'Invalid parameters, check input';
      response.validationErrors = validationErrors.errors;
      this.myLoggerService.error('Delete Role Failed', {
        deleteRoleParams,
        response,
      });
      throw new BadRequestException(response, ERROR_TITLES.VALIDATION_ERROR);
    }

    // params
    let { roleId } = deleteRoleParams;
    roleId = Number(roleId);
    const role = await this.dataSource.manager.findOne(Role, {
      where: {
        id: roleId,
      },
    });

    if (!role) {
      response.status = false;
      response.message = 'Role not found.';
      throw new NotFoundException(response, ERROR_TITLES.NON_FOUND_ERROR);
    }

    const usersWithRole = await this.dataSource.manager
      .createQueryBuilder(User, 'user')
      .innerJoin('user.roles', 'role')
      .where('role.id = :roleId', { roleId })
      .getMany();
    const hasUsersWithRole = usersWithRole.length > 0;
    if (hasUsersWithRole) {
      response.data = false;
      response.message = `Unable to delete role, ${role.name} has  users.`;
      throw new BadRequestException(response, ERROR_TITLES.NON_FOUND_ERROR);
    }

    await this.dataSource.manager.remove(role);
    response.message = `${role.name} successfully deleted.`;
    response.data = true;
    return response;
  }
}
