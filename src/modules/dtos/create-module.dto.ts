import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO for creating a new module
 */
export class CreateModuleDto {
  @ApiProperty({ example: 'Users', description: 'The name of the module' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'user-icon', description: 'The icon for the module' })
  @IsString()
  @IsNotEmpty()
  icon: string;

  @ApiProperty({ example: '/users', description: 'The path for the module' })
  @IsString()
  @IsNotEmpty()
  path: string;
}
