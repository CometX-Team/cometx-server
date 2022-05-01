import { ApolloError } from 'apollo-server-express';

abstract class ApiError extends ApolloError {
  protected constructor(
    public override message: string,
    public variables: { [key: string]: string | number } = {},
    public code?: string,
  ) {
    super(message, code);
  }
}

export default ApiError;
