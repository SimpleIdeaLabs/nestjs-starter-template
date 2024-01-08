import {
  Global,
  MiddlewareConsumer,
  Module,
  RequestMethod,
  VersioningType,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { useContainer } from 'class-validator';
import { join } from 'path';
import { DataSource } from 'typeorm';
import envConfig from './common/config/env.config';
import { ENV } from './common/constants/constants';
import { RequestIdMiddleware } from './common/middlewares/request-id/request-id.middleware';
import systemInfoInterceptor from './common/middlewares/request-id/system-info.interceptor';
import { DatabaseModule } from './common/modules/database/database.module';
import { AppService } from './common/modules/global/app.service';
import { GlobalModule } from './common/modules/global/global.module';
import { IsValueUniqueConstraint } from './common/validators/is-value-unique';
import { IsPatientExistsConstraint } from './common/validators/patient-exists.validator';
import { IsRoleExistsConstraint } from './common/validators/role-exists.validator';
import { IsRoleUniqueConstraint } from './common/validators/role-is-unique.validator';
import { IsUserEmailUniqueConstraint } from './common/validators/user-email-is-unique.validator';
import { OperationModule } from './modules/operation/operation.module';
import { PatientModule } from './modules/patient/patient.module';
import { ServiceModule } from './modules/service/service.module';
import { StoreModule } from './modules/store/store.module';
import { SystemModule } from './modules/system/system.module';
import { UserModule } from './modules/user/user.module';
import { IsGenderValidConstraint } from './common/validators/is-gender-valid';

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
    ServiceModule,
  ],
  controllers: [],
  providers: [
    AppService,
    IsRoleExistsConstraint,
    IsPatientExistsConstraint,
    IsRoleUniqueConstraint,
    IsUserEmailUniqueConstraint,
    IsValueUniqueConstraint,
    IsGenderValidConstraint,
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
