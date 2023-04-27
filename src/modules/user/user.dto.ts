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
import { IsUserEmailUnique } from '../../common/validators/user-email-is-unique.validator';
import { Express } from 'express';

/**
 * User Data Class
 */
class UserData {
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
  @IsUserEmailUnique()
  email: string;

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
export class CreateUserParams extends UserData {
  @IsNotEmpty({
    message: 'Profile photo is required.',
  })
  profilePhoto: Express.Multer.File;

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
}

/**
 * Create User Response
 */
export class CreateUserResponse {}

/**
 * Update User Params
 */
export class UpdateUserParams extends UserData {
  @IsNotEmpty()
  userId: number;

  @IsOptional()
  profilePhoto: Express.Multer.File;

  @IsOptional()
  @Match('confirmPassword', {
    message: 'Confirm your password',
  })
  password: string;

  @IsOptional()
  confirmPassword: string;
}

/**
 * Update User Response
 */
export class UpdateUserResponse {}

/**
 * List User Params
 */
export class ListUserParams extends PaginatedParams {
  @IsOptional()
  role?: string[];

  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  email: string;

  @IsNotEmpty()
  currentUser: User;
}

/**
 * List User Response
 */
export class ListUserResponse {
  users: User[];
  pagination: PaginatedResponse;
}

/**
 * Read User Params
 */
export class ReadUserParams {
  @IsNotEmpty()
  userId: number;
}

/**
 * Read User Response
 */
export class ReadUserResponse {
  user: User;
}

/**
 * Delete User Params
 */
export class DeleteUserParams {
  @IsNotEmpty()
  userId: number;
}
