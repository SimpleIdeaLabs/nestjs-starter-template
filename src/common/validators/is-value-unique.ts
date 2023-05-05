import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { DataSource } from 'typeorm';
import * as _ from 'lodash';

@ValidatorConstraint({ name: 'isValueUnique', async: true })
export class IsValueUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly dataSource: DataSource) {}

  async validate(value: any, args: ValidationArguments) {
    const [entityClass, property, idProperty] = args.constraints;
    const entityId = _.get(args.object, idProperty, null);

    const query = this.dataSource.manager
      .createQueryBuilder(entityClass, 'entity')
      .where(`entity.${property} = :value`, { value });

    if (entityId) {
      query.andWhere('entity.id <> :id', { id: entityId });
    }

    const result = await query.getOne();

    return !result;
  }

  defaultMessage(args: ValidationArguments) {
    const [entityClass, property] = args.constraints;
    return `${property} must be unique for ${entityClass.name}s`;
  }
}
