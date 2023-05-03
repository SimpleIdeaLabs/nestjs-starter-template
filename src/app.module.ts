import {
  Global,
  MiddlewareConsumer,
  Module,
  RequestMethod,
  VersioningType,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './common/modules/global/app.service';
import { Appv2Controller } from './appv2/appv2.controller';
import envConfig from './common/config/env.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { DataSource } from 'typeorm';
import { DatabaseModule } from './common/modules/database/database.module';
import { NestFactory } from '@nestjs/core';
import { SystemModule } from './modules/system/system.module';
import systemInfoInterceptor from './common/middlewares/request-id/system-info.interceptor';
import { IsRoleExistsConstraint } from './common/validators/role-exists.validator';
import { useContainer } from 'class-validator';
import { PatientModule } from './modules/patient/patient.module';
import { IsPatientExistsConstraint } from './common/validators/patient-exists.validator';
import { GlobalModule } from './common/modules/global/global.module';
import { RequestIdMiddleware } from './common/middlewares/request-id/request-id.middleware';
import { OperationModule } from './modules/operation/operation.module';
import { ENV } from './common/constants/constants';
import { IsRoleUniqueConstraint } from './common/validators/role-is-unique.validator';
import { IsUserEmailUniqueConstraint } from './common/validators/user-email-is-unique.validator';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { StoreModule } from './modules/store/store.module';
import { PhDataController } from './common/controllers/ph-data/ph-data.controller';

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
    process.env.ENV === ENV.TEST
      ? __dirname + '/../**/*.entity{.ts,.js}'
      : __dirname + '/../**/*.entity.js',
  ],
  migrations: ['./dist/common/modules/database/migrations/*.js'],
  synchronize: process.env.ENV === ENV.DEVELOP,
  logging: process.env.ENABLE_LOGGING === 'true',
  migrationsTableName: 'sys_migrations',
});

@Global()
@Module({
  imports: [
    configModule,
    typeormModule,
    UserModule,
    DatabaseModule,
    SystemModule,
    PatientModule,
    GlobalModule,
    OperationModule,
    StoreModule,
  ],
  controllers: [Appv2Controller, PhDataController],
  providers: [
    AppService,
    IsRoleExistsConstraint,
    IsPatientExistsConstraint,
    IsRoleUniqueConstraint,
    IsUserEmailUniqueConstraint,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}

  /**
   * Request ID Middlewares
   */
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}

export const getAppInstance = async () => {
  const _app = await NestFactory.create<NestExpressApplication>(AppModule);

  /**
   * Allow NestJS Dependency Injector
   * to be used for class-validator
   */
  useContainer(_app.select(AppModule), { fallbackOnErrors: true });

  /**
   * Attach System Data
   * on response headers
   */
  _app.use(systemInfoInterceptor);

  /**
   * Enable CORS
   */
  _app.enableCors();

  /**
   * Public uploads
   */
  _app.useStaticAssets(join(__dirname, '..', 'uploads'));

  /**
   * Enable API Versioning
   */
  _app.enableVersioning({
    type: VersioningType.URI,
  });

  return _app;
};
