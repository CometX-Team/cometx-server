export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
  JSON: any;
};

export type Administrator = Node & {
  __typename?: 'Administrator';
  createdAt: Scalars['DateTime'];
  emailAddress: Scalars['String'];
  firstName: Scalars['String'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  user: User;
};

export type AdministratorList = PaginatedList & {
  __typename?: 'AdministratorList';
  items: Array<Administrator>;
  totalItems: Scalars['Int'];
};

export type CreateAdministratorInput = {
  emailAddress: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  roleIds: Array<Scalars['ID']>;
};

export type CreateCustomerInput = {
  emailAddress?: InputMaybe<Scalars['String']>;
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  phoneNumber?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type CreateCustomerResult = Customer | EmailAddressConflictError;

export type CreateRoleInput = {
  code: Scalars['String'];
  description: Scalars['String'];
};

export type Customer = Node & {
  __typename?: 'Customer';
  createdAt: Scalars['DateTime'];
  emailAddress?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
  user?: Maybe<User>;
};

export type DeletionResponse = {
  __typename?: 'DeletionResponse';
  message?: Maybe<Scalars['String']>;
  result: DeletionResult;
};

export enum DeletionResult {
  /** the entity is successfully deleted */
  Deleted = 'DELETED',
  /** Deletion did not happen, error message to be given */
  NotDeleted = 'NOT_DELETED'
}

/** Returned wehn attempting to create a Customer with an email address already registered to an existing User. */
export type EmailAddressConflictError = ErrorResult & {
  __typename?: 'EmailAddressConflictError';
  errorCode: ErrorCode;
  message: Scalars['String'];
};

export enum ErrorCode {
  UnknownError = 'UNKNOWN_ERROR'
}

export type ErrorResult = {
  errorCode: ErrorCode;
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Create a new Administrator */
  createAdministrator: Administrator;
  /** Create a new Customer */
  createCustomer?: Maybe<Customer>;
  /** Create a new Role */
  createRole: Role;
  /** Delete an existing Administrator */
  deleteAdministrator: DeletionResponse;
  /** Delete an existing Role */
  deleteRole: DeletionResponse;
  /** Update an existing Administrator */
  updateAdministrator: Administrator;
  /** Update an existing Role */
  updateRole: Role;
};


export type MutationCreateAdministratorArgs = {
  input: CreateAdministratorInput;
};


export type MutationCreateCustomerArgs = {
  input: CreateCustomerInput;
};


export type MutationCreateRoleArgs = {
  input: CreateRoleInput;
};


export type MutationDeleteAdministratorArgs = {
  id: Scalars['ID'];
};


export type MutationDeleteRoleArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateAdministratorArgs = {
  input: UpdateAdministratorInput;
};


export type MutationUpdateRoleArgs = {
  input: UpdateRoleInput;
};

export type Node = {
  id: Scalars['ID'];
};

export type PaginatedList = {
  items: Array<Node>;
  totalItems: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  activeAdministrator?: Maybe<Administrator>;
  administrator?: Maybe<Administrator>;
  administrators: AdministratorList;
  customer?: Maybe<Customer>;
  role?: Maybe<Role>;
  roles: RoleList;
};


export type QueryAdministratorArgs = {
  id: Scalars['ID'];
};


export type QueryCustomerArgs = {
  id: Scalars['ID'];
};


export type QueryRoleArgs = {
  id: Scalars['ID'];
};

export type Role = Node & {
  __typename?: 'Role';
  code: Scalars['String'];
  description: Scalars['String'];
  id: Scalars['ID'];
};

export type RoleList = PaginatedList & {
  __typename?: 'RoleList';
  items: Array<Role>;
  totalItems: Scalars['Int'];
};

export type UpdateAdministratorInput = {
  emailAddress?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  lastName?: InputMaybe<Scalars['String']>;
  roleIds: Array<Scalars['ID']>;
};

export type UpdateRoleInput = {
  code?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
};

export type User = Node & {
  __typename?: 'User';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  identifier: Scalars['String'];
  lastLogin?: Maybe<Scalars['DateTime']>;
  roles: Array<Role>;
  updatedAt: Scalars['DateTime'];
  verified: Scalars['Boolean'];
};
