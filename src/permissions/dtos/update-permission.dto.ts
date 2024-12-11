import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePermissionDto } from './create-permission.dto';
import { IsBoolean, IsOptional } from 'class-validator';

/**
 * DTO for updating an existing permission
 */
export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @ApiProperty({
    example: true,
    description: 'Indicates if the permission is active',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
