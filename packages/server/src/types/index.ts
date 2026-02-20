export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'email' | 'uuid' | 'phone' | 'address' | 'url' | 'custom';

export interface SchemaField {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
  fakerTemplate?: string;
  options?: string[];
}

export type RelationType = 'one-to-one' | 'one-to-many' | 'many-to-many';

export interface SchemaRelation {
  id: string;
  fromTable: string;
  toTable: string;
  type: RelationType;
  fromField?: string;
  toField?: string;
}

export interface TablePosition {
  x: number;
  y: number;
}

export interface SchemaTable {
  id: string;
  name: string;
  fields: SchemaField[];
  position: TablePosition;
}

export interface Schema {
  id: string;
  name: string;
  tables: SchemaTable[];
  relations: SchemaRelation[];
  createdAt: string;
  updatedAt: string;
}

export interface SchemaRef {
  schemaId: string;
  tableId: string;
}

export type ResponseType = 'json' | 'ts';

export type RequestBodySource = 'schema' | 'keys' | 'example';

export interface RequestBody {
  source: RequestBodySource;
  schemaRef?: SchemaRef;
  keys?: string[];
  example?: object;
}

export interface MockEndpoint {
  id: string;
  path: string;
  method: HttpMethod;
  response: object;
  responseType?: ResponseType;
  delay?: number;
  schemaRef?: SchemaRef;
  storedData?: object[];
  responseKeys?: string[];
  authRequired?: boolean;
  requestBody?: RequestBody;
  createdAt: string;
}

export interface CreateEndpointDto {
  path: string;
  method: HttpMethod;
  response: object;
  responseType?: ResponseType;
  delay?: number;
  schemaRef?: SchemaRef;
  storedData?: object[];
  responseKeys?: string[];
  authRequired?: boolean;
  requestBody?: RequestBody;
}

export interface UpdateEndpointDto {
  path?: string;
  method?: HttpMethod;
  response?: object;
  responseType?: ResponseType;
  delay?: number;
  schemaRef?: SchemaRef;
  storedData?: object[];
  responseKeys?: string[];
  authRequired?: boolean;
  requestBody?: RequestBody;
}

export interface MockServerConfig {
  port?: number;
  cors?: boolean;
}

export interface RequestLog {
  id: string;
  endpointId: string;
  path: string;
  method: string;
  status: number;
  timestamp: string;
  responseTime?: number;
}

export type AuthType = 'jwt' | 'basic' | 'apiKey' | 'bearer';

export interface AuthSettings {
  enabled: boolean;
  type: AuthType;
  jwtSecret?: string;
  jwtExpiry: string;
  apiKey?: string;
  allowRegister: boolean;
}

export interface User {
  id: string;
  username: string;
  password: string;
  createdAt: string;
}
