import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { RolesSeeding } from './seeding/roles';
import { Seeding } from './seeding/seeding';
import { UsersSeeding } from './seeding/users';
import { StoreSeeding } from './seeding/store';
import { ServicesSeeding } from './seeding/service';

@Global()
@Module({
  providers: [
    DatabaseService,
    Seeding,
    UsersSeeding,
    RolesSeeding,
    StoreSeeding,
    ServicesSeeding,
  ],
})
export class DatabaseModule {}
