import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ROLE_TYPES } from '../../../../modules/user/role.contants';
import { Role } from '../../../../modules/user/role.entity';
import { User } from '../../../../modules/user/user.entity';

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

    /**
     * Super Admin
     */
    const superAdmin = new User();
    superAdmin.email = 'markernest.matute@gmail.com';
    superAdmin.password = '12345678';
    superAdmin.firstName = 'Mark';
    superAdmin.lastName = 'Matute';
    superAdmin.roles = [superAdminRole];
    users.push(superAdmin);

    /**
     * PMS Admin
     */
    const pmsAdminRole = await this.dataSource.manager.findOne(Role, {
      where: {
        name: ROLE_TYPES.PMS_ADMIN,
      },
    });
    const pmsAdmin = new User();
    pmsAdmin.email = 'pmsAdmin@clinic.com';
    pmsAdmin.password = '12345678';
    pmsAdmin.firstName = 'PMS';
    pmsAdmin.lastName = 'Admin';
    pmsAdmin.roles = [pmsAdminRole];
    pmsAdmin.createdBy = superAdmin;
    pmsAdmin.updatedBy = superAdmin;
    users.push(pmsAdmin);

    /**
     * Save users
     */
    await this.dataSource.manager.save(users);
    return users;
  }
}
