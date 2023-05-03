import { Injectable } from '@nestjs/common';
import { MyLoggerService } from '../../global/my-logger.service';
import { RolesSeeding } from './roles';
import { UsersSeeding } from './users';
import { StoreSeeding } from './store';

@Injectable()
export class Seeding {
  constructor(
    private readonly roleSeeding: RolesSeeding,
    private readonly userSeeding: UsersSeeding,
    private readonly storeSeeding: StoreSeeding,
    private readonly myLoggerService: MyLoggerService,
  ) {}

  public async start() {
    this.myLoggerService.log('Starting seeding...');
    await this.roleSeeding.seed();
    await this.userSeeding.seed();
    await this.storeSeeding.seed();
  }
}
