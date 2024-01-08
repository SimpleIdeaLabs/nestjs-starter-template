import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsGenderValid' })
export class IsGenderValidConstraint implements ValidatorConstraintInterface {
  validate(gender: any) {
    if (!gender) {
      return false;
    }
    const validGenders = ['male', 'female', 'other'];
    return validGenders.includes(gender.toLowerCase());
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be 'male', 'female', or 'other'`;
  }
}

export function IsGenderValid(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: ValidatorConstraint,
    });
  };
}
