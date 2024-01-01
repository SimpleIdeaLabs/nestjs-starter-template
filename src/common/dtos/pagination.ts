import { IsNotEmpty } from 'class-validator';

export class PaginatedParams {
  @IsNotEmpty({
    message: 'Page is required',
  })
  page: number;

  @IsNotEmpty({
    message: 'Limit is required',
  })
  limit: number;
}

export class PaginatedResponse {
  page: number;
  totalNumberOfPages: number;
  total: number;
  limit: number;
}
