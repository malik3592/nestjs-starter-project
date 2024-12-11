import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO for a single permission entry (moduleId and permissionId)
 */
class PermissionEntryDto {
  @ApiProperty({
    example: '64f5b2d8f7a67c001a123456',
    description: 'Module ID',
  })
  @IsNotEmpty()
  moduleId: string;

  @ApiProperty({
    example: '64f5b2d8f7a67c001a123789',
    description: 'Permission ID',
  })
  @IsNotEmpty()
  permissionId: string;
}

/**
 * DTO for assigning permissions to a role
 */
export class CreateRolePermissionDto {
  @ApiProperty({ example: '64f5b2d8f7a67c001a123123', description: 'Role ID' })
  @IsNotEmpty()
  roleId: string;

  @ApiProperty({
    example: [
      {
        moduleId: '64f5b2d8f7a67c001a123456',
        permissionId: '64f5b2d8f7a67c001a123789',
      },
    ],
    description: 'List of permissions (moduleId and permissionId)',
    type: [PermissionEntryDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionEntryDto)
  permissions: PermissionEntryDto[];
}
