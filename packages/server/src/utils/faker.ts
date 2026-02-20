import { faker } from '@faker-js/faker';

type FakerMethod = 
  | 'name' 
  | 'firstName' 
  | 'lastName' 
  | 'email' 
  | 'phone' 
  | 'uuid' 
  | 'boolean' 
  | 'number' 
  | 'date' 
  | 'word' 
  | 'sentence' 
  | 'paragraph' 
  | 'city' 
  | 'country' 
  | 'street' 
  | 'url' 
  | 'avatar'
  | 'company';

const fakerFunctions: Record<FakerMethod, () => any> = {
  name: () => faker.person.fullName(),
  firstName: () => faker.person.firstName(),
  lastName: () => faker.person.lastName(),
  email: () => faker.internet.email(),
  phone: () => faker.phone.number(),
  uuid: () => faker.string.uuid(),
  boolean: () => faker.datatype.boolean(),
  number: () => faker.number.int({ min: 1, max: 1000 }),
  date: () => faker.date.recent().toISOString(),
  word: () => faker.lorem.word(),
  sentence: () => faker.lorem.sentence(),
  paragraph: () => faker.lorem.paragraph(),
  city: () => faker.location.city(),
  country: () => faker.location.country(),
  street: () => faker.location.streetAddress(),
  url: () => faker.internet.url(),
  avatar: () => faker.image.avatar(),
  company: () => faker.company.name(),
};

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

export function parseKeyWithType(key: string): { name: string; type: string } {
  const match = key.match(/^(\w+):(\w+)$/);
  if (match) {
    return { name: match[1], type: match[2] };
  }
  return { name: key, type: 'string' };
}

export function getFakerForKey(key: string, explicitType?: string): FakerMethod {
  if (explicitType && explicitType in fakerFunctions) {
    return explicitType as FakerMethod;
  }
  
  const lowerKey = key.toLowerCase();
  if (lowerKey in knownFieldsToFaker) {
    return knownFieldsToFaker[lowerKey] as FakerMethod;
  }
  
  return 'word';
}

export function processFakerTemplate(template: string): string {
  const pattern = /\{\{faker\.(\w+)\}\}/g;
  return template.replace(pattern, (_match, method: string) => {
    if (method in fakerFunctions) {
      const value = fakerFunctions[method as FakerMethod]();
      return String(value);
    }
    return _match;
  });
}

export function processObject(obj: any): any {
  if (typeof obj === 'string') {
    return processFakerTemplate(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => processObject(item));
  }
  
  if (obj !== null && typeof obj === 'object') {
    const processed: any = {};
    for (const key in obj) {
      processed[key] = processObject(obj[key]);
    }
    return processed;
  }
  
  return obj;
}

export function generateFakerValue(method: FakerMethod): any {
  return fakerFunctions[method]();
}

export function generateFromKeysWithTypes(keys: string[], count: number = 1): object[] {
  const results: object[] = [];
  
  for (let i = 0; i < count; i++) {
    const row: Record<string, unknown> = {};
    for (const key of keys) {
      const { name, type } = parseKeyWithType(key);
      const fakerMethod = getFakerForKey(name, type);
      row[name] = generateFakerValue(fakerMethod);
    }
    results.push(row);
  }
  
  return results;
}

export const availableFakerMethods = Object.keys(fakerFunctions) as FakerMethod[];
