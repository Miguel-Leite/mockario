let callCount = 0;

const generateId = () => {
  callCount++;
  return `mock-uuid-${callCount}-${Math.random().toString(36).substr(2, 9)}`;
};

const mockData: Record<string, () => any> = {
  name: () => `Name ${Math.random().toString(36).substr(2, 5)}`,
  firstName: () => `First${Math.random().toString(36).substr(2, 5)}`,
  lastName: () => `Last${Math.random().toString(36).substr(2, 5)}`,
  email: () => `email${Math.random().toString(36).substr(2, 5)}@example.com`,
  phone: () => `+1-555-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
  uuid: () => generateId(),
  boolean: () => Math.random() > 0.5,
  number: () => Math.floor(Math.random() * 1000),
  date: () => new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
  word: () => `word${Math.random().toString(36).substr(2, 5)}`,
  sentence: () => `Sentence ${Math.random().toString(36).substr(2, 10)}`,
  paragraph: () => `Paragraph ${Math.random().toString(36).substr(2, 20)}`,
  city: () => `City ${Math.random().toString(36).substr(2, 5)}`,
  country: () => `Country ${Math.random().toString(36).substr(2, 5)}`,
  street: () => `${Math.floor(Math.random() * 999)} Street ${Math.random().toString(36).substr(2, 5)}`,
  url: () => `https://example.com/${Math.random().toString(36).substr(2, 5)}`,
  avatar: () => `https://example.com/avatar/${Math.random().toString(36).substr(2, 5)}.png`,
  company: () => `Company ${Math.random().toString(36).substr(2, 5)}`,
};

export const faker = {
  person: {
    fullName: () => mockData.name(),
    firstName: () => mockData.firstName(),
    lastName: () => mockData.lastName(),
  },
  internet: {
    email: () => mockData.email(),
    url: () => mockData.url(),
  },
  phone: {
    number: () => mockData.phone(),
  },
  string: {
    uuid: () => mockData.uuid(),
  },
  datatype: {
    boolean: () => mockData.boolean(),
  },
  number: {
    int: () => mockData.number(),
  },
  date: {
    recent: () => new Date(mockData.date()),
  },
  lorem: {
    word: () => mockData.word(),
    sentence: () => mockData.sentence(),
    paragraph: () => mockData.paragraph(),
  },
  location: {
    city: () => mockData.city(),
    country: () => mockData.country(),
    streetAddress: () => mockData.street(),
  },
  image: {
    avatar: () => mockData.avatar(),
  },
  company: {
    name: () => mockData.company(),
  },
};
