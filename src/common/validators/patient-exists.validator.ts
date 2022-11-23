import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { DataSource } from 'typeorm';
import { Patient } from '../../modules/patient/patient.entity';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsPatientExistsConstraint implements ValidatorConstraintInterface {
  constructor(private readonly dataSource: DataSource) {}

  validate(patientId: number, args: ValidationArguments) {
    return this.dataSource.manager
      .count(Patient, {
        where: {
          id: patientId,
        },
      })
      .then((count) => count > 0);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Patient does not exits';
  }
}

export function IsPatientExists(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPatientExistsConstraint,
    });
  };
}
