import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ROLE_TYPES } from '../../user/role.contants';
import { Role } from '../../user/role.entity';

@Injectable()
export class RolesSeeding {
  constructor(private readonly dataSource: DataSource) {}

  public async seed(): Promise<Role[]> {
    const roles = [];

    /**
     * Super Admin Role
     */
    const superAdminRole = new Role(ROLE_TYPES.SUPER_ADMIN);
    roles.push(superAdminRole);

    /**
     * Admin Role
     */
    const adminRole = new Role(ROLE_TYPES.ADMIN);
    roles.push(adminRole);

    await this.dataSource.manager.save(roles);
    return roles;
  }
}
