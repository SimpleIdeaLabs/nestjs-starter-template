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

const MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

@ValidatorConstraint({ async: true })
@Injectable()
export class IsPatientPhotoValidConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly dataSource: DataSource) {}

  validate(files: any[], args: ValidationArguments) {
    if (!files.length) {
      return false;
    }

    let valid = true;

    for (const file of files) {
      if (!lodash.includes(MIME_TYPES, file.mimetype)) {
        valid = false;
      }
    }

    return valid;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Invalid patient photos';
  }
}

export function IsPatientPhotoValid(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPatientPhotoValidConstraint,
    });
  };
}
