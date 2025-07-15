/**
 * Unit tests for the product service
 */

const productService = require('../services/productService');

// Mock the Product model and logger
jest.mock('../models/Product', () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  distinct: jest.fn(),
  countDocuments: jest.fn()
}));

jest.mock('../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
}));

const Product = require('../models/Product');

describe('Product Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('mapFieldNames', () => {
    test('should map field names correctly', () => {
      const input = { type: 'shirt', color: 'blue' };
      const expected = { articleType: 'shirt', baseColour: 'blue' };
      expect(productService.mapFieldNames(input)).toEqual(expected);
    });

    test('should handle empty object', () => {
      expect(productService.mapFieldNames({})).toEqual({});
    });

    test('should handle null input', () => {
      expect(productService.mapFieldNames(null)).toEqual({});
    });

    test('should not modify unmapped fields', () => {
      const input = { type: 'shirt', gender: 'men' };
      const expected = { articleType: 'shirt', gender: 'men' };
      expect(productService.mapFieldNames(input)).toEqual(expected);
    });
  });

  describe('applyStringFieldsRegex', () => {
    test('should convert string fields to regex', () => {
      const input = { baseColour: 'blue', articleType: 'shirt' };
      const expected = {
        baseColour: { $regex: 'blue', $options: 'i' },
        articleType: { $regex: 'shirt', $options: 'i' }
      };
      expect(productService.applyStringFieldsRegex(input)).toEqual(expected);
    });

    test('should not modify non-string fields', () => {
      const input = { baseColour: 'blue', price: 100 };
      const expected = {
        baseColour: { $regex: 'blue', $options: 'i' },
        price: 100
      };
      expect(productService.applyStringFieldsRegex(input)).toEqual(expected);
    });

    test('should handle empty object', () => {
      expect(productService.applyStringFieldsRegex({})).toEqual({});
    });
  });

  describe('findProducts', () => {
    test('should find products with correct parameters', async () => {
      // Setup mocks
      const mockProducts = [{ id: 1, name: 'Test Product' }];
      Product.find.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockProducts)
        })
      });
      Product.countDocuments.mockResolvedValue(1);

      // Call the service
      const result = await productService.findProducts({ type: 'shirt' });

      // Assertions
      expect(Product.find).toHaveBeenCalled();
      expect(Product.countDocuments).toHaveBeenCalled();
      expect(result).toHaveProperty('products', mockProducts);
      expect(result).toHaveProperty('pagination');
      expect(result.pagination).toHaveProperty('total', 1);
    });

    test('should handle errors', async () => {
      // Setup mock to throw error
      const error = new Error('Database error');
      Product.find.mockImplementation(() => {
        throw error;
      });

      // Call the service and expect it to throw
      await expect(productService.findProducts({ type: 'shirt' }))
        .rejects.toThrow('Database error');
    });
  });
});