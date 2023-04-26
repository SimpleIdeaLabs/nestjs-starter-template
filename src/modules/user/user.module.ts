import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RoleController } from './role/role.controller';
import { RoleService } from './role/role.service';
@Module({
  imports: [],
  providers: [UserService, RoleService],
  controllers: [UserController, RoleController],
})
export class UserModule {}
