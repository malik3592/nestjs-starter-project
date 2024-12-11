import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateModuleDto } from './create-module.dto';

/**
 * DTO for updating an existing module
 */
export class UpdateModuleDto extends PartialType(CreateModuleDto) {}
