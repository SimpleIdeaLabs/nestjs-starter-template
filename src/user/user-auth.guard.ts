import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { MyLoggerService } from '../common/modules/my-logger/my-logger.service';
import * as JWT from 'jsonwebtoken';
import { plainToClass } from 'class-transformer';
import { User } from './user.entity';
import { UserService } from './user.service';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(
    private readonly myLoggerService: MyLoggerService,
    private readonly userService: UserService,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authorization = request?.headers?.authorization;

    try {
      // check authorization token
      if (!authorization) {
        return false;
      }

      const token = authorization.split(' ')[1];

      const decoded = plainToClass(
        User,
        await JWT.verify(token, process.env.JWT_SECRET),
      );

      const user = await this.userService.usersRepository.findOne({
        where: {
          id: decoded.id,
          email: decoded.email,
        },
      });

      if (!user) {
        return false;
      }

      request.user = user.makeSafe();

      // valid token
      return true;
    } catch (error) {
      console.log(error);
      this.myLoggerService.error('Forbidden', {
        originalUrl: request.originalUrl,
        authorization,
        error,
      });
      return false;
    }
  }
}
