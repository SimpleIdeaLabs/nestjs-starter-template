import { Controller, Get } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async saveUser() {
    const user = new User();
    user.firstName = 'Mark';
    user.lastName = 'Matute';
    await this.userService.save(user);
    return true;
  }
}
