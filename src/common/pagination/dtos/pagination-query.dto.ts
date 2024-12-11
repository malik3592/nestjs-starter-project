import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Number records per page', default: 10 })
  @IsOptional()
  @IsPositive()
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Page number of which records you want to get',
    default: 1,
  })
  @IsOptional()
  @IsPositive()
  page?: number = 1;
}
