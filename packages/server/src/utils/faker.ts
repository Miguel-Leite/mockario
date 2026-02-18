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

export const availableFakerMethods = Object.keys(fakerFunctions) as FakerMethod[];
