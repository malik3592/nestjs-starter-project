import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

/**
 * DTO for creating a new role
 */
export class CreateRoleDto {
  @ApiProperty({ example: 'Admin', description: 'The name of the role' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
