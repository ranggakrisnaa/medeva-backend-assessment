import { Request } from 'express'; // Assuming you're using Express for handling requests
import { checkFilteringQueryV2 } from './CheckFilteringQuery';

describe('checkFilteringQueryV2', () => {
  it('should correctly parse request query parameters into FilteringQueryV2 object', () => {
    const req: Request = {
      query: {
        orderKey: 'someOrderKey',
        orderRule: 'asc',
        filters: JSON.stringify({ category: 'electronics' }),
        searchFilters: JSON.stringify({ name: 'phone' }),
        rangedFilters: JSON.stringify([{ field: 'price', min: 100, max: 500 }]),
        rows: '10',
        page: '2',
      },
    } as unknown as Request;

    const expectedFilter = {
      orderKey: 'someOrderKey',
      orderRule: 'asc',
      filters: { category: 'electronics' },
      searchFilters: { name: 'phone' },
      rangedFilters: [{ field: 'price', min: 100, max: 500 }],
      rows: 10,
      page: 2,
    };

    const result = checkFilteringQueryV2(req);

    expect(result).toEqual(expectedFilter);
  });

  it('should correctly handle missing query parameters', () => {
    const req: Request = {
      query: {},
    } as Request;

    const expectedFilter = {};

    const result = checkFilteringQueryV2(req);

    expect(result).toEqual(expectedFilter);
  });
});