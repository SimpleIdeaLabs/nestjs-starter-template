import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { DataSource } from 'typeorm';
import * as lodash from 'lodash';

const MIME_TYPES = ['application/pdf'];

@ValidatorConstraint({ async: true })
@Injectable()
export class IsPatientDocsValidConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly dataSource: DataSource) {}

  validate(docs: any[], args: ValidationArguments) {
    if (!docs.length) {
      return false;
    }

    return true;

    // let valid = true;

    // for (const file of docs) {
    //   if (!lodash.includes(MIME_TYPES, file.mimetype)) {
    //     valid = false;
    //   }
    // }

    // return valid;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Invalid patient docs';
  }
}

export function IsPatientDocsValid(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPatientDocsValidConstraint,
    });
  };
}
