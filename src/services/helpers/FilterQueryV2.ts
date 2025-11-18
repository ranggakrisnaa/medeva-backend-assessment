import { FilteringQueryV2, RangedFilter } from "$entities/Query";

function isNonNull<T>(value: T | null | undefined): value is NonNullable<T> {
  return value != null;
}

/**
 * Base primitive values that can be used in filters
 */
export type PrimitiveValue = string | number | boolean | Date;

/**
 * Array of primitive values
 */
export type ArrayValue = string[] | number[] | boolean[];

/**
 * Operator conditions for advanced filtering
 */
export type OperatorCondition = {
  contains?: string;
  in?: ArrayValue;
  gte?: PrimitiveValue;
  lte?: PrimitiveValue;
  gt?: PrimitiveValue;
  lt?: PrimitiveValue;
};

/**
 * Nested field condition for relational filtering
 */
export type NestedFieldCondition = {
  [nestedKey: string]: PrimitiveValue | OperatorCondition | unknown;
};

/**
 * OR condition for combining multiple filters
 */
export type OrCondition = {
  OR: WhereConditionV2[];
};

/**
 * Main where condition type - flexible and supports various filter patterns
 * Using 'any' for maximum flexibility with complex nested structures
 */
export type WhereConditionV2 = {
  [key: string]:
    | PrimitiveValue
    | ArrayValue
    | OperatorCondition
    | NestedFieldCondition
    | OrCondition
    | unknown; // Allow any for complex nested structures
};

/**
 * Main filter query structure for database queries
 */
export type FilterQueryV2 = {
  where: {
    AND: WhereConditionV2[];
  };
  orderBy: Record<string, "asc" | "desc"> | Record<string, unknown>;
  take: number;
  skip: number;
};

/**
 * Filter value types - can be primitive, array, or null
 */
export type FilterValue = string | number | boolean | null;

/**
 * Search filters object - used for text/partial matching
 */
export type SearchFilters = Record<
  string,
  FilterValue | FilterValue[] | null | unknown
>;

/**
 * Where filters object - used for exact matching
 */
export type WhereFilters = Record<
  string,
  FilterValue | FilterValue[] | null | unknown
>;

/**
 * Parsed ranged filter with properly typed start/end
 */
export type ParsedRangedFilter = {
  key: string;
  start: Date | string | number | unknown;
  end: Date | string | number | unknown;
  [key: string]: unknown; // Allow additional properties
};

/**
 * Order rule type
 */
export type OrderRule = "asc" | "desc";

/**
 * Pagination options
 */
export type PaginationOptions = {
  page?: number;
  rows?: number;
  take?: number;
  skip?: number;
};

/**
 * Build search query with contains operators
 * Supports both direct fields and relational fields (e.g., "relation.column")
 */
function buildSearchQuery(searchFilters: SearchFilters): WhereConditionV2[] {
  const whereClauseAndResult: WhereConditionV2[] = [];
  const orQuerySearchArray: WhereConditionV2[] = [];

  const nonNullFilters = Object.entries(searchFilters).filter(([_, value]) =>
    isNonNull(value),
  );
  const isMultiKey = nonNullFilters.length > 1;

  for (const key in searchFilters) {
    const valueToSearch = searchFilters[key];

    // Skip null/undefined values
    if (!isNonNull(valueToSearch)) continue;

    let searchQuery: WhereConditionV2;

    // Handle relational fields (e.g., "user.name")
    if (key.includes(".")) {
      const [relation, column] = key.split(".");

      searchQuery = {
        [relation]: {
          [column]: {
            contains: String(valueToSearch),
          },
        },
      };
    } else {
      // Handle direct fields
      searchQuery = {
        [key]: {
          contains: String(valueToSearch),
        },
      };
    }

    if (isMultiKey) {
      orQuerySearchArray.push(searchQuery);
    } else {
      whereClauseAndResult.push(searchQuery);
    }
  }

  // Combine multiple search filters with OR logic
  if (isMultiKey && orQuerySearchArray.length > 0) {
    whereClauseAndResult.push({
      OR: orQuerySearchArray,
    });
  }

  return whereClauseAndResult;
}

/**
 * Build where query for exact matching
 * Supports both single values and array values (converted to OR conditions)
 * Supports relational filtering (e.g., "relation.column")
 */
function buildWhereQuery(filters: WhereFilters): WhereConditionV2[] {
  const whereClauseAndResult: WhereConditionV2[] = [];

  for (const key in filters) {
    const valueToFilter = filters[key];

    if (!isNonNull(valueToFilter)) continue;

    if (key.includes(".")) {
      const [relation, column] = key.split(".");

      if (Array.isArray(valueToFilter)) {
        const orQueryArray: WhereConditionV2[] = valueToFilter
          .filter(isNonNull)
          .map((value) => ({
            [relation]: {
              [column]: value,
            },
          }));

        if (orQueryArray.length > 0) {
          whereClauseAndResult.push({
            OR: orQueryArray,
          });
        }
      } else {
        whereClauseAndResult.push({
          [relation]: {
            [column]: valueToFilter,
          },
        });
      }
      continue;
    }

    if (Array.isArray(valueToFilter)) {
      const orQueryArray: WhereConditionV2[] = valueToFilter
        .filter(isNonNull)
        .map((value) => ({
          [key]: value,
        }));

      if (orQueryArray.length > 0) {
        whereClauseAndResult.push({
          OR: orQueryArray,
        });
      }
    } else {
      whereClauseAndResult.push({
        [key]: valueToFilter,
      });
    }
  }

  return whereClauseAndResult;
}

/**
 * Type guard to check if a string is a valid date format
 */
function isValidDate(dateString: unknown): dateString is string {
  if (typeof dateString !== "string") {
    return false;
  }
  // Supports ISO 8601 format and YYYY-MM-DD format
  const dateRegex =
    /^(?:\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z|\d{4}-\d{2}-\d{2})$/;
  return dateRegex.test(dateString);
}

/**
 * Parse and convert date strings to Date objects if valid
 * Otherwise return the original range filter
 */
function parseAndCheckRangeFilter(range: RangedFilter): ParsedRangedFilter {
  if (isValidDate(range.start) && isValidDate(range.end)) {
    return {
      ...range,
      start: new Date(range.start),
      end: new Date(range.end),
    };
  }
  return {
    ...range,
    start: range.start as unknown,
    end: range.end as unknown,
  };
}

/**
 * Build ranged filters using gte and lte operators
 * Automatically converts date strings to Date objects
 */
function buildRangedFilter(rangedFilters: RangedFilter[]): WhereConditionV2[] {
  const whereClauseAndResult: WhereConditionV2[] = [];

  rangedFilters.forEach((range: RangedFilter) => {
    const parsedRange = parseAndCheckRangeFilter(range);
    whereClauseAndResult.push({
      [parsedRange.key]: {
        gte: parsedRange.start,
        lte: parsedRange.end,
      },
    });
  });

  return whereClauseAndResult;
}

/**
 * Main function to build complete filter query with limit and offset
 *
 * This is the inference engine for dynamic filtering in V2
 *
 * Features:
 * - Exact matching filters (WHERE =)
 * - Multi-value filters (OR chaining)
 * - Search filters (CONTAINS)
 * - Range filters (gte/lte)
 * - Pagination (take/skip)
 * - Ordering (orderBy)
 * - Relational filtering (relation.column)
 *
 * @param filter - The filtering query configuration
 * @returns Complete filter query object ready for database execution
 */
export function buildFilterQueryLimitOffsetV2(
  filter: FilteringQueryV2,
): FilterQueryV2 {
  const usedFilter: FilterQueryV2 = {
    where: {
      AND: [],
    },
    orderBy: {},
    take: 10,
    skip: 0,
  };

  /* This is the `inference-engine` for dynamic filtering

      in V2 both Searching and Filters are constructed in type of `ClauseFilterV2`

      Which formed like :
      {
        "filters": {
           "column" : ["value1", "value2"] -> multi value filter , in v1 we use SQL's in operator, but now we use OR chaining
           "column2" : "value" -> single value filter , we use WHERE =
           "column3" : null -> we don't handle this, since this is just a placeholder from fe
        }
      }

      We give these flexibility so that front-end can have the flexibility of filtering easier by just sending null and emit the value
      as user fill the filter inside the dropdown or whatever input they use.

    */

  // Build WHERE conditions
  if (filter.filters) {
    usedFilter.where.AND = buildWhereQuery(filter.filters);
  }

  // Build SEARCH conditions (contains)
  if (filter.searchFilters) {
    const searchConditions = buildSearchQuery(filter.searchFilters);
    usedFilter.where.AND = [...usedFilter.where.AND, ...searchConditions];
  }

  // Build RANGE conditions (gte/lte)
  if (filter.rangedFilters) {
    const rangedConditions = buildRangedFilter(filter.rangedFilters);
    usedFilter.where.AND = [...usedFilter.where.AND, ...rangedConditions];
  }

  // Build ORDER BY
  if (filter.orderKey) {
    const orderRule: OrderRule | string = filter.orderRule ?? "asc";
    usedFilter.orderBy = {
      [filter.orderKey]: orderRule,
    };
  }

  // Build PAGINATION (default: 10 rows, page 1)
  let take = 10;
  let skip = 0;

  if (filter.page) {
    if (filter.rows) {
      skip = (filter.page - 1) * filter.rows;
      take = filter.rows;
    } else {
      skip = 10 * (filter.page - 1);
    }
  }

  usedFilter.take = take;
  usedFilter.skip = skip;

  return usedFilter;
}
