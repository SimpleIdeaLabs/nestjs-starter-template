import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MyLoggerModule } from '../../modules/my-logger/my-logger.module';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), MyLoggerModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
