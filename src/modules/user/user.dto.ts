import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

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
