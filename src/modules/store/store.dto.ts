import { IsNotEmpty, IsOptional } from 'class-validator';
import { Store } from './store.entity';
import { AdminRegion } from 'ph-geo-admin-divisions/lib/dtos';

export class ReadStoreResponse {
  store: Store;
}

export class UpdateStoreParams {
  @IsNotEmpty({
    message: 'Store name is required',
  })
  name: string;

  @IsOptional()
  address1: string;

  @IsOptional()
  address2: string;

  @IsOptional()
  province: string;

  @IsOptional()
  municipality: string;

  @IsOptional()
  baranggay: string;

  @IsOptional()
  postalOrZip: string;

  @IsNotEmpty({
    message: 'Contact number is required.',
  })
  contactNo: string;

  @IsNotEmpty({
    message: 'Email is required.',
  })
  email: string;

  @IsOptional()
  logo: Express.Multer.File;
}

export class UpdateStoreResponse {}
