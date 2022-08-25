import { SetMetadata } from '@nestjs/common';

export const AuthorizedRoles = (...roles: string[]) =>
  SetMetadata('roles', roles);
