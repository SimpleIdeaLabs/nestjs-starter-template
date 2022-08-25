import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { DataSource } from 'typeorm';
import { User } from '../../modules/user/user.entity';
import { plainToClass } from 'class-transformer';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request: Request = context.switchToHttp().getRequest();
      const authorization = (request.headers as any).authorization;
      const token = authorization.split(' ')[1];
      const jwtSecret = this.configService.get('jwtSecret');
      const user = plainToClass(User, jwt.verify(token, jwtSecret));

      return this.dataSource.manager
        .findOne(User, {
          where: {
            id: user.id,
            email: user.email,
            isActive: true,
          },
          relations: ['roles'],
        })
        .then((queriedUser) => {
          if (!queriedUser) {
            return false;
          }
          request.user = queriedUser.toJSON();
          return true;
        });
      return true;
    } catch (error) {
      return false;
    }
  }
}
