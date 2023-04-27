import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { DataSource, In } from 'typeorm';
import { Role } from '../../modules/user/role.entity';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsRoleExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly dataSource: DataSource) {}

  validate(roles: Role[], args: ValidationArguments) {
    if (!roles || (roles && !roles.length)) {
      return false;
    }
    const roleIds = roles.map((r) => r.id);
    return this.dataSource.manager
      .count(Role, {
        where: {
          id: In(roleIds),
        },
      })
      .then((count) => count === roles.length);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Invalid role or roles';
  }
}

export function IsRoleExists(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsRoleExistsConstraint,
    });
  };
}
