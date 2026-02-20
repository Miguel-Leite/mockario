const knownFieldsToFaker: Record<string, string> = {
  name: 'name',
  firstName: 'firstName',
  lastName: 'lastName',
  fullName: 'name',
  email: 'email',
  phone: 'phone',
  telephone: 'phone',
  mobile: 'phone',
  id: 'uuid',
  uuid: 'uuid',
  uuidv4: 'uuid',
  address: 'street',
  street: 'street',
  city: 'city',
  country: 'country',
  url: 'url',
  website: 'url',
  avatar: 'avatar',
  image: 'avatar',
  photo: 'avatar',
  company: 'company',
  organization: 'company',
  description: 'sentence',
  bio: 'paragraph',
  text: 'paragraph',
  content: 'paragraph',
  age: 'number',
  count: 'number',
  quantity: 'number',
  price: 'number',
  amount: 'number',
  total: 'number',
  isActive: 'boolean',
  active: 'boolean',
  enabled: 'boolean',
  verified: 'boolean',
  createdAt: 'date',
  updatedAt: 'date',
  deletedAt: 'date',
  timestamp: 'date',
};

const fakerDefaults: Record<string, () => unknown> = {
  name: () => 'John Doe',
  firstName: () => 'John',
  lastName: () => 'Doe',
  fullName: () => 'John Doe',
  email: () => 'john@example.com',
  phone: () => '123-456-7890',
  uuid: () => '550e8400-e29b-41d4-a716-446655440000',
  address: () => '123 Main St',
  street: () => '123 Main St',
  city: () => 'New York',
  country: () => 'United States',
  url: () => 'https://example.com',
  website: () => 'https://example.com',
  avatar: () => 'https://i.pravatar.cc/150',
  image: () => 'https://i.pravatar.cc/150',
  photo: () => 'https://i.pravatar.cc/150',
  company: () => 'Acme Inc',
  organization: () => 'Acme Inc',
  description: () => 'Lorem ipsum dolor sit amet',
  bio: () => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  text: () => 'Lorem ipsum dolor sit amet',
  content: () => 'Lorem ipsum dolor sit amet',
  age: () => 25,
  count: () => 1,
  quantity: () => 1,
  price: () => 99.99,
  amount: () => 100,
  total: () => 100,
  isActive: () => true,
  active: () => true,
  enabled: () => true,
  verified: () => false,
  createdAt: () => new Date().toISOString(),
  updatedAt: () => new Date().toISOString(),
  deletedAt: () => null,
  timestamp: () => new Date().toISOString(),
  word: () => 'lorem',
  sentence: () => 'Lorem ipsum dolor sit amet',
  paragraph: () => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
  string: () => 'sample',
  number: () => 1,
  boolean: () => true,
  date: () => new Date().toISOString(),
};

export function parseKeyWithType(key: string): { name: string; type: string } {
  const match = key.match(/^(\w+):(\w+)$/);
  if (match) {
    return { name: match[1], type: match[2] };
  }
  return { name: key, type: 'string' };
}

export function getFakerForKey(key: string, explicitType?: string): string {
  if (explicitType && explicitType in knownFieldsToFaker) {
    return knownFieldsToFaker[explicitType] || 'word';
  }
  
  const lowerKey = key.toLowerCase();
  if (lowerKey in knownFieldsToFaker) {
    return knownFieldsToFaker[lowerKey];
  }
  
  return 'word';
}

export function generateFakerValue(key: string, explicitType?: string): unknown {
  const fakerMethod = getFakerForKey(key, explicitType);
  const generator = fakerDefaults[fakerMethod];
  if (generator) {
    return generator();
  }
  return 'sample';
}

export function generateFromKeysWithTypes(keys: string[], count: number = 1): object[] {
  const results: object[] = [];
  
  for (let i = 0; i < count; i++) {
    const row: Record<string, unknown> = {};
    for (const key of keys) {
      const { name, type } = parseKeyWithType(key);
      row[name] = generateFakerValue(name, type);
    }
    results.push(row);
  }
  
  return results;
}
