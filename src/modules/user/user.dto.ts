import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import {
  PaginatedParams,
  PaginatedResponse,
} from '../../common/dtos/pagination';
import { Match } from '../../common/validators/match.validator';
import { IsRoleExists } from '../../common/validators/role-exists.validator';
import { Role } from './role.entity';
import { User } from './user.entity';

/**
 * Login Params
 */
export class LoginUserParams {
  @IsNotEmpty({
    message: 'Email is required',
  })
  @IsEmail(
    {},
    {
      message: 'Provide a valid email',
    },
  )
  email: string;

  @IsNotEmpty({
    message: 'Password is required',
  })
  password: string;
}

/**
 * Login Response
 */
export class LoginUserResponse {
  token?: string;
  constructor(token: string) {
    this.token = token;
  }
}

/**
 * Create User Params
 */
export class CreateUserParams {
  @IsNotEmpty({
    message: 'First name is required',
  })
  firstName: string;

  @IsNotEmpty({
    message: 'Last name is required',
  })
  lastName: string;

  @IsNotEmpty({
    message: 'Email is required',
  })
  @IsEmail(
    {},
    {
      message: 'Provide a valid email',
    },
  )
  email: string;

  @IsNotEmpty({
    message: 'Password is required',
  })
  password: string;

  @IsNotEmpty({
    message: 'Confirm your password',
  })
  @Match('password', {
    message: 'Confirm your password',
  })
  confirmPassword: string;

  @IsArray({
    message: 'Roles must be an array',
  })
  @ArrayNotEmpty({
    message: 'Roles is required',
  })
  @IsRoleExists()
  roles: Role[];

  @IsNotEmpty()
  currentUser: User;
}

/**
 * Create User Response
 */
export class CreateUserResponse {}

/**
 * List User Params
 */
export class ListUserParams extends PaginatedParams {
  @IsOptional()
  roles?: string[];
}

/**
 * List User Response
 */
export class ListUserResponse {
  users: User[];
  pagination: PaginatedResponse;
}
