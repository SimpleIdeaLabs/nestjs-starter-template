import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateAndExtract } from 'class-validator-ext';
import { DataSource } from 'typeorm';
import { ApiResponse } from '../../common/dtos/api-response';
import { LoginUserParams, LoginUserResponse } from './user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(private readonly dataSource: DataSource) {}

  public async login(
    params: LoginUserParams,
  ): Promise<ApiResponse<LoginUserResponse>> {
    const response = new ApiResponse<LoginUserResponse>();
    const loginParams = plainToClass(LoginUserParams, params);
    const validationErrors = await validateAndExtract(loginParams);

    // validation
    if (!validationErrors.isValid) {
      response.status = false;
      response.message = 'Invalid parameters, check input';
      response.validationErrors = validationErrors.errors;
      return response;
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
      return response;
    }

    // successful logged in
    response.status = true;
    response.message = 'User successfully logged in';
    response.data = new LoginUserResponse(user.toJWT());
    return response;
  }
}
