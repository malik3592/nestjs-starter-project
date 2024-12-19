/**
 * Pagination Result Interface.
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export class PaginationProvider {
  /**
   * Function to apply pagination and population to MongoDB queries.
   * @param model - Mongoose Model
   * @param query - Query filters
   * @param PaginationQueryDto
   * @param populate - Fields to populate
   */
  async pagination<T>(
    model: any,
    query: any = {},
    page: number = 1,
    limit: number = 10,
    populate: string | object | Array<string | object> = null,
  ): Promise<PaginatedResult<T>> {
    // Ensure page and limit are numbers
    const currentPage = Math.max(Number(page) || 1, 1);
    const pageSize = Math.max(Number(limit) || 10, 1);

    // MongoDB query with population, pagination, and filtering
    const queryBuilder = model.find(query);

    if (populate) {
      queryBuilder.populate(populate); // Add population
    }

    const [data, total] = await Promise.all([
      queryBuilder
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .exec(),
      model.countDocuments(query),
    ]);

    return {
      data,
      total,
      page: currentPage,
      limit: pageSize,
    };
  }
}
