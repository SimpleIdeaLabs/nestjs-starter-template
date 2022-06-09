import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MyLoggerModule } from './common/modules/my-logger/my-logger.module';
import { Appv2Controller } from './appv2/appv2.controller';
import envConfig from './common/config/env.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';

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
  entities: [User],
  synchronize: true,
});

@Module({
  imports: [configModule, typeormModule, MyLoggerModule, UserModule],
  controllers: [AppController, Appv2Controller],
  providers: [AppService],
})
export class AppModule { }
