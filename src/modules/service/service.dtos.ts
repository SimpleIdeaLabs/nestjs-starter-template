import {
  IsArray,
  IsDecimal,
  IsNotEmpty,
  IsOptional,
  Validate,
} from 'class-validator';
import {
  PaginatedParams,
  PaginatedResponse,
} from '../../common/dtos/pagination';
import { Service } from './service.entity';
import { User } from '../user/user.entity';
import { IsValueUniqueConstraint } from '../../common/validators/is-value-unique';

export class ListServiceParams extends PaginatedParams {
  @IsOptional()
  name?: string;

  @IsOptional()
  category?: string;
}

export class ListServiceResponse {
  services: Service[];
  pagination: PaginatedResponse;
}

class ServiceData {
  @IsNotEmpty({
    message: 'Name is required',
  })
  @Validate(IsValueUniqueConstraint, [Service, 'name', 'serviceId'], {
    message: 'Service name is already used',
  })
  name: string;

  @IsNotEmpty({
    message: 'Category is required',
  })
  category: number;

  @IsNotEmpty({
    message: 'Price is required',
  })
  @IsDecimal(
    {
      decimal_digits: 2,
    },
    {
      message: 'Price should be a valid number',
    },
  )
  price: string;

  @IsOptional()
  description: string;

  @IsNotEmpty()
  currentUser: User;
}

export class CreateServiceParams extends ServiceData {
  @IsNotEmpty({
    message: 'Logo is required',
  })
  logo: Express.Multer.File;
}

export class CreateServiceResponse {}

export class UpdateServiceParams extends ServiceData {
  @IsNotEmpty()
  serviceId: number;

  @IsOptional()
  logo: Express.Multer.File;
}

export class UpdateServiceResponse {
  service: Service;
}

export class ReadServiceParams {
  @IsNotEmpty()
  serviceId: number;
}

export class ReadServiceResponse {
  service: Service;
}

export class DeleteServiceParams {
  @IsNotEmpty()
  serviceId: number;
}
