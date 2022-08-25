import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ROLE_TYPES } from '../../user/role.contants';
import { Role } from '../../user/role.entity';
import { User } from '../../user/user.entity';

@Injectable()
export class UsersSeeding {
  constructor(private readonly dataSource: DataSource) {}

  public async seed(): Promise<User[]> {
    const users = [];
    const superAdminRole = await this.dataSource.manager.findOne(Role, {
      where: {
        name: ROLE_TYPES.SUPER_ADMIN,
      },
    });
    const superAdmin = new User();
    superAdmin.email = 'markernest.matute@gmail.com';
    superAdmin.password = '12345678';
    superAdmin.firstName = 'Mark';
    superAdmin.lastName = 'Matute';
    superAdmin.roles = [superAdminRole];
    users.push(superAdmin);
    await this.dataSource.manager.save(users);
    return users;
  }
}
