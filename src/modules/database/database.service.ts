import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { MyLoggerService } from '../my-logger/my-logger.service';
import { System } from '../system/system.entity';
import { Seeding } from './seeding/seeding';

@Injectable()
export class DatabaseService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    private readonly myLogger: MyLoggerService,
    private readonly seeding: Seeding,
  ) {}

  public async setUp() {
    const env = this.configService.get('env');
    if (await this.hasBeenSetUp()) {
      this.myLogger.log('Previous setup detected, skippung setup...');
      return;
    }

    this.myLogger.log('Starting database setup...');

    /**
     * Reset Database
     */
    if (env === 'DEVELOP') {
      await this.resetDatabase();
    }

    /**
     * Start Seeding Data
     */
    await this.startSeeding();

    /**
     * Start Migrations
     */
    await this.startMigrations();
  }

  public async hasBeenSetUp(): Promise<boolean> {
    const system = await this.dataSource.manager.count(System);
    return system !== 0;
  }

  public async setSystemSetUp(): Promise<void> {
    const system = new System();
    system.seeded = true;
    system.appName = 'nestjs starter template';
    await this.dataSource.manager.save(system);
  }

  public async startMigrations() {
    this.myLogger.log('Staring migrations...');
    this.myLogger.log(`Migrating ${this.dataSource.migrations.length}...`);
    await this.dataSource.runMigrations();
    this.myLogger.log('Done migrations...');
  }

  public async resetDatabase() {
    this.myLogger.log('Staring database reset...');
    const env = this.configService.get('env');
    if (env === 'DEVELOP' || env === 'TESTING') {
      /**
       * Synchronize DB
       */
      await this.dataSource.synchronize();

      /**
       * Truncate all tables
       */
      for (const entity of this.dataSource.entityMetadatas) {
        const repository = this.dataSource.getRepository(entity.name);
        await repository.query(`SET FOREIGN_KEY_CHECKS = 0;`);
        await repository.query(`TRUNCATE TABLE \`${entity.tableName}\`;`);
        await repository.query(`SET FOREIGN_KEY_CHECKS = 1;`);
      }

      /**
       * Truncate sys databases
       */
      try {
        await this.dataSource.query(`TRUNCATE TABLE sys_migrations`);
      } catch (error) {}
    }
    this.myLogger.log('Done database reset...');
  }

  public async stop() {
    await this.dataSource.destroy();
  }

  public async startSeeding() {
    await this.seeding.start();
  }
}
