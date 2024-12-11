import { SetMetadata } from '@nestjs/common';
import { UserTypeEnum } from '../../users/enums/userType.enum';

export const Roles = (...roles: UserTypeEnum[]) => SetMetadata('roles', roles);
