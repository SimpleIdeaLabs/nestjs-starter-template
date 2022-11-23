import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { RolesSeeding } from './seeding/roles';
import { Seeding } from './seeding/seeding';
import { UsersSeeding } from './seeding/users';

@Global()
@Module({
  providers: [DatabaseService, Seeding, UsersSeeding, RolesSeeding],
})
export class DatabaseModule {}
