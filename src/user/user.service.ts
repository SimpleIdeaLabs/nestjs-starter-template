import { Injectable, Dependencies } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
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

  async login(params: LoginParams): Promise<ApiResponse<User>> {
    const { email, password } = params;
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      return new ApiResponse({
        status: false,
        message: 'User not found',
      });
    }
    if (!user.isPasswordMatching(password)) {
      return new ApiResponse({
        status: false,
        message: 'Password not matching',
      });
    }
    return new ApiResponse({
      status: true,
      message: 'User found',
      data: user,
    });
  }
}
