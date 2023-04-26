import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { DataSource, Not } from 'typeorm';
import { Role } from '../../modules/user/role.entity';
import * as _ from 'lodash';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsRoleUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly dataSource: DataSource) {}

  validate(name: string, args: ValidationArguments) {
    const roleId = _.get(args, 'object.roleId', null);

    const where = {
      name,
    };

    if (roleId) {
      where['id'] = Not(+roleId);
    }

    return this.dataSource.manager
      .count(Role, {
        where,
      })
      .then((count) => count === 0);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Role name already used.';
  }
}

export function IsRoleUnique(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsRoleUniqueConstraint,
    });
  };
}
