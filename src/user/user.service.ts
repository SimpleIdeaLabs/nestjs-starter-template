import { Injectable, Dependencies } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
@Dependencies(getRepositoryToken(User))
export class UserService {
  public usersRepository: Repository<User>;

  constructor(usersRepository) {
    this.usersRepository = usersRepository;
  }

  save(user: User) {
    return this.usersRepository.save(user);
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id) {
    return this.usersRepository.findOne(id);
  }

  async remove(id) {
    await this.usersRepository.delete(id);
  }
}
