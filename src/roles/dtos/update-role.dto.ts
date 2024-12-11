import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { IsBoolean, IsOptional } from 'class-validator';

/**
 * DTO for updating an existing role
 */
export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  @ApiProperty({
    example: true,
    description: 'Indicates if the role is active',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
