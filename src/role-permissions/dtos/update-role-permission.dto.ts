import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRolePermissionDto } from './create-role-permission.dto';

/**
 * DTO for updating an existing role-permission mapping
 */
export class UpdateRolePermissionDto extends PartialType(
  CreateRolePermissionDto,
) {}
