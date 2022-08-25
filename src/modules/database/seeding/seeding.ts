import { Injectable } from '@nestjs/common';
import { MyLoggerService } from '../../my-logger/my-logger.service';
import { RolesSeeding } from './roles';
import { UsersSeeding } from './users';

@Injectable()
export class Seeding {
  constructor(
    private readonly roleSeeding: RolesSeeding,
    private readonly userSeeding: UsersSeeding,
    private readonly myLoggerService: MyLoggerService,
  ) {}

  public async start() {
    this.myLoggerService.log('Starting seeding...');
    await this.roleSeeding.seed();
    await this.userSeeding.seed();
  }
}
