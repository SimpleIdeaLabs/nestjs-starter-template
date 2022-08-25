import { Module, VersioningType } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './common/services/app.service';
import { MyLoggerModule } from './modules/my-logger/my-logger.module';
import { Appv2Controller } from './appv2/appv2.controller';
import envConfig from './common/config/env.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { HttpErrorsController } from './common/controllers/http-errors.controller';
import { DataSource } from 'typeorm';
import { DatabaseModule } from './modules/database/database.module';
import { NestFactory } from '@nestjs/core';
import { SystemModule } from './modules/system/system.module';
import systemInfoInterceptor from './common/interceptors/system-info.interceptor';

// config
const configModule = ConfigModule.forRoot({
  isGlobal: true,
  load: [envConfig],
});

// typeorm
const typeormModule = TypeOrmModule.forRoot({
  type: 'mysql',
  host: process.env.MYSQL_SERVER_NAME,
  port: +process.env.MYSQL_PORT,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  entities: [
    process.env.ENV === 'TEST'
      ? __dirname + '/../**/*.entity{.ts,.js}'
      : __dirname + '/../**/*.entity.js',
  ],

  migrations: ['./dist/common/modules/database/migrations/*.js'],
  synchronize: true,
  logging: false,
  migrationsTableName: 'sys_migrations',
});

@Module({
  imports: [
    configModule,
    typeormModule,
    MyLoggerModule,
    UserModule,
    DatabaseModule,
    SystemModule,
  ],
  controllers: [Appv2Controller, HttpErrorsController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}

export const getAppInstance = async () => {
  const _app = await NestFactory.create(AppModule);

  _app.use(systemInfoInterceptor);

  // enable cors
  _app.enableCors();

  // versioning
  _app.enableVersioning({
    type: VersioningType.URI,
  });

  return _app;
};
