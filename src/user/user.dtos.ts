import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiResponse } from '../common/dtos/api-response.dto';
import { User } from './user.entity';

export class LoginParams {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class SaveUserParams {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
