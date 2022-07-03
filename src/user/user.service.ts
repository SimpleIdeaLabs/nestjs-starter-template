import { Injectable, Dependencies } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { ApiResponse } from '../common/dtos/api-response.dto';
import { LoginParams, SaveUserParams } from './user.dtos';
import { User } from './user.entity';
@Injectable()
@Dependencies(getRepositoryToken(User))
export class UserService {
  public usersRepository: Repository<User>;

  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }

  async save(user: SaveUserParams): Promise<ApiResponse<User>> {
    const savedUser = await this.usersRepository.save(user);
    const response = new ApiResponse<User>({
      status: true,
      data: savedUser,
      message: 'User saved',
    });
    return response;
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id) {
    return this.usersRepository.findOne({
      where: {
        id,
      },
    });
  }

  async remove(id) {
    await this.usersRepository.delete(id);
  }

  async login(params: LoginParams): Promise<ApiResponse<string>> {
    const { email, password } = params;
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      return new ApiResponse({
        status: false,
        message: 'Login failed',
      });
    }
    if (!user.isPasswordMatching(password)) {
      return new ApiResponse({
        status: false,
        message: 'Login failed',
      });
    }

    return new ApiResponse({
      status: true,
      message: 'Login success',
      data: await user.toJWTToken(),
    });
  }

  async getSession(req: Request): Promise<ApiResponse<User>> {
    return new ApiResponse({
      status: true,
      data: req.user,
    });
  }
}
