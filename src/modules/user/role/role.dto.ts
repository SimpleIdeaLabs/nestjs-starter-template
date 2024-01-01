import { IsNotEmpty, IsOptional } from 'class-validator';
import {
  PaginatedParams,
  PaginatedResponse,
} from '../../../common/dtos/pagination';
import { Role } from '../role.entity';
import { User } from '../user.entity';
import { IsRoleUnique } from '../../../common/validators/role-is-unique.validator';

/**
 * Create Role Params
 */
export class CreateRoleParams {
  @IsNotEmpty({
    message: 'Name is required',
  })
  @IsRoleUnique()
  name: string;

  @IsNotEmpty()
  currentUser: User;
}

/**
 * Create Role Response
 */
export class CreateRoleResponse {}

/**
 * Update Role Params
 */
export class UpdateRoleParams {
  @IsNotEmpty()
  roleId: number;

  @IsNotEmpty({
    message: 'Name is required',
  })
  @IsRoleUnique()
  name: string;

  @IsNotEmpty()
  currentUser: User;
}

/**
 * Update Role Response
 */
export class UpdateRoleResponse {}

/**
 * Read Role Params
 */
export class ReadRoleParams {
  @IsNotEmpty()
  roleId: number;
}

/**
 * Read Role Response
 */
export class ReadRoleResponse {
  role: Role;
}

/**
 * List Role Params
 */
export class ListRoleParams extends PaginatedParams {
  @IsOptional()
  keyword: string;
}

/**
 * List Role Response
 */
export class ListRoleResponse {
  roles: Role[];
  pagination: PaginatedResponse;
}

/**
 * Delete Role Params
 */
export class DeleteRoleParams {
  @IsNotEmpty()
  roleId: number;
}
