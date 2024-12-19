import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for pagination query params.
 */
export class PaginationQueryDto {
  @ApiProperty({
    example: 1,
    description: 'Current page number',
    required: false,
  })
  page?: number;

  @ApiProperty({
    example: 10,
    description: 'Number of items per page',
    required: false,
  })
  limit?: number;
}

/**
 * Pagination Result Interface.
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export class PaginationWithAggregationProvider {
  /**
   * Generalized function for aggregation-based pagination in MongoDB.
   * @param model - Mongoose model to perform aggregation on.
   * @param pipeline - Aggregation pipeline stages.
   * @param page - Current page number.
   * @param limit - Number of items per page.
   */
  async pagination<T>(
    model: any,
    pipeline: any[] = [],
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedResult<T>> {
    const currentPage = Math.max(Number(page) || 1, 1);
    const pageSize = Math.max(Number(limit) || 10, 1);

    // Calculate skip for pagination
    const skip = (currentPage - 1) * pageSize;

    // Add pagination stages to the aggregation pipeline
    const aggregationPipeline = [
      ...pipeline,
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: pageSize }],
          total: [{ $count: 'count' }],
        },
      },
    ];

    // Execute the aggregation pipeline
    const result = await model.aggregate(aggregationPipeline).exec();

    const data = result[0]?.data || [];
    const total = result[0]?.total?.[0]?.count || 0;

    return {
      data,
      total,
      page: currentPage,
      limit: pageSize,
    };
  }
}
