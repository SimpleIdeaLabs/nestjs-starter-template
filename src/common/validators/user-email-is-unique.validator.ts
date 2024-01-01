import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { DataSource, Not } from 'typeorm';
import * as _ from 'lodash';
import { User } from '../../modules/user/user.entity';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUserEmailUniqueConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly dataSource: DataSource) {}

  validate(email: string, args: ValidationArguments) {
    const userId = _.get(args, 'object.userId', null);

    const where = {
      email,
    };

    if (userId) {
      where['id'] = Not(+userId);
    }

    return this.dataSource.manager
      .count(User, {
        where,
      })
      .then((count) => count === 0);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Email already used.';
  }
}

export function IsUserEmailUnique(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserEmailUniqueConstraint,
    });
  };
}
