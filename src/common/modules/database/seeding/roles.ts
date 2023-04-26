import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ROLE_TYPES } from '../../../../modules/user/role.contants';
import { Role } from '../../../../modules/user/role.entity';

@Injectable()
export class RolesSeeding {
  constructor(private readonly dataSource: DataSource) {}

  public async seed(): Promise<Role[]> {
    const roles = [];

    /**
     * Super Admin Role
     */
    const superAdminRole = new Role(ROLE_TYPES.SUPER_ADMIN, 'Super Admin');
    roles.push(superAdminRole);

    /**
     * PMS Admin Role
     */
    const adminRole = new Role(ROLE_TYPES.PMS_ADMIN, 'PMS Admin');
    roles.push(adminRole);

    /**
     * Cashier
     */
    const cashierRole = new Role(ROLE_TYPES.CASHIER, 'Cashier');
    roles.push(cashierRole);

    /**
     * Reception
     */
    const receptionRole = new Role(ROLE_TYPES.RECEPTION, 'Reception');
    roles.push(receptionRole);

    await this.dataSource.manager.save(roles);
    return roles;
  }
}
