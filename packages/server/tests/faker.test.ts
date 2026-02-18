import { processFakerTemplate, processObject, generateFakerValue, availableFakerMethods } from '../src/utils/faker';

describe('Faker Utils', () => {
  describe('processFakerTemplate', () => {
    it('should replace {{faker.name}} with a generated name', () => {
      const result = processFakerTemplate('{{faker.name}}');
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
      expect(result).not.toContain('{{faker.name}}');
    });

    it('should replace {{faker.email}} with a generated email', () => {
      const result = processFakerTemplate('{{faker.email}}');
      expect(result).toContain('@');
    });

    it('should replace {{faker.uuid}} with a generated UUID', () => {
      const result = processFakerTemplate('{{faker.uuid}}');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(10);
    });

    it('should replace {{faker.boolean}} with a boolean', () => {
      const result = processFakerTemplate('{{faker.boolean}}');
      expect(result).toMatch(/^(true|false)$/);
    });

    it('should replace {{faker.number}} with a number', () => {
      const result = processFakerTemplate('{{faker.number}}');
      expect(typeof result).toBe('string');
      expect(parseInt(result)).toBeGreaterThan(0);
    });

    it('should replace multiple templates in a string', () => {
      const result = processFakerTemplate('Name: {{faker.name}}, Email: {{faker.email}}');
      expect(result).not.toContain('{{faker.name}}');
      expect(result).not.toContain('{{faker.email}}');
      expect(result).toContain('Name:');
      expect(result).toContain(', Email:');
    });

    it('should return original string if no templates', () => {
      const input = 'Hello World';
      const result = processFakerTemplate(input);
      expect(result).toBe(input);
    });

    it('should return unknown templates unchanged', () => {
      const result = processFakerTemplate('{{faker.unknown}}');
      expect(result).toBe('{{faker.unknown}}');
    });
  });

  describe('processObject', () => {
    it('should process strings in an object', () => {
      const obj = { name: '{{faker.name}}' };
      const result = processObject(obj);
      expect(result.name).not.toContain('{{faker.name}}');
    });

    it('should process arrays', () => {
      const arr = [{ name: '{{faker.name}}' }, { name: '{{faker.email}}' }];
      const result = processObject(arr);
      expect(Array.isArray(result)).toBe(true);
      expect(result[0].name).not.toContain('{{faker.name}}');
    });

    it('should process nested objects', () => {
      const obj = { user: { name: '{{faker.name}}' } };
      const result = processObject(obj);
      expect(result.user.name).not.toContain('{{faker.name}}');
    });

    it('should handle non-string values unchanged', () => {
      const obj = { count: 42, active: true, null: null };
      const result = processObject(obj);
      expect(result.count).toBe(42);
      expect(result.active).toBe(true);
      expect(result.null).toBe(null);
    });

    it('should generate different values on each call', () => {
      const obj = { name: '{{faker.uuid}}' };
      const result1 = processObject(obj);
      const result2 = processObject(obj);
      expect(result1.name).not.toBe(result2.name);
    });
  });

  describe('generateFakerValue', () => {
    it('should generate name', () => {
      const name = generateFakerValue('name');
      expect(typeof name).toBe('string');
      expect(name.split(' ').length).toBeGreaterThanOrEqual(2);
    });

    it('should generate email', () => {
      const email = generateFakerValue('email');
      expect(email).toContain('@');
    });

    it('should generate uuid', () => {
      const uuid = generateFakerValue('uuid');
      expect(typeof uuid).toBe('string');
      expect(uuid.length).toBeGreaterThan(10);
    });

    it('should generate boolean', () => {
      const bool = generateFakerValue('boolean');
      expect(typeof bool).toBe('boolean');
    });

    it('should generate city', () => {
      const city = generateFakerValue('city');
      expect(typeof city).toBe('string');
    });

    it('should generate company', () => {
      const company = generateFakerValue('company');
      expect(typeof company).toBe('string');
    });
  });

  describe('availableFakerMethods', () => {
    it('should include name', () => {
      expect(availableFakerMethods).toContain('name');
    });

    it('should include email', () => {
      expect(availableFakerMethods).toContain('email');
    });

    it('should include uuid', () => {
      expect(availableFakerMethods).toContain('uuid');
    });

    it('should have multiple methods', () => {
      expect(availableFakerMethods.length).toBeGreaterThan(10);
    });
  });
});
