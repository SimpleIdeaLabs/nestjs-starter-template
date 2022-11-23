import { Injectable, Dependencies } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as lodash from 'lodash';

@Injectable()
@Dependencies(Reflector)
export class AuthorizedGuard {
  private reflector: Reflector;

  constructor(reflector) {
    this.reflector = reflector;
  }

  canActivate(context) {
    try {
      const roles = this.reflector.get('roles', context.getHandler());
      if (!roles) {
        return true;
      }
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      const userRoles = user.roles.map((r: any) => r.name);
      const intersect = lodash.intersection(roles, userRoles);
      return intersect.length > 0;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
