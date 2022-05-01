import { request as fetchRequest } from 'undici';
import { stringify } from 'querystring';
import { DocumentNode } from 'graphql';
import { print } from 'graphql/language/printer';
import { ClientError } from './test-client.error';

type QueryParams = { [key: string]: string | number };

export class TestGraphQLClient {
  private headers: { [key: string]: any } = {};
  constructor(private apiUrl: string = '') {}

  async query(
    query: DocumentNode,
    variables?: any,
    queryParams?: QueryParams,
  ): Promise<any> {
    const response = await this.makeGraphQLRequest(
      query,
      variables,
      queryParams,
    );
    const result = await this.getResult(response);

    if (response.statusCode === 200 && result) {
      return result.data;
    }

    if (result?.errors) {
      const errorResult =
        result?.errors && typeof result.errors === 'string'
          ? { error: result.errors }
          : result.errors;

      throw new ClientError(
        { ...errorResult, status: response.statusCode },
        { query: print(query), variables },
      );
    }
  }

  async fetch(url: string, options: any): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
      ...this.headers,
      ...options.headers,
    };
    const response = await fetchRequest(url, {
      ...options,
      headers,
    });

    return response;
  }

  private async makeGraphQLRequest(
    query: DocumentNode,
    variables?: { [key: string]: any },
    queryParams?: QueryParams,
  ): Promise<any> {
    const queryString = print(query);
    const body = JSON.stringify({
      query: queryString,
      variables: variables ? variables : undefined,
    });

    const url = queryParams
      ? this.apiUrl + `?${stringify(queryParams)}`
      : this.apiUrl;

    return this.fetch(url, {
      method: 'POST',
      body,
    });
  }

  private async getResult(response: any): Promise<any> {
    const contentType = response.headers['content-type'];

    if (contentType && contentType.startsWith('application/json')) {
      return response.body.json();
    } else {
      return response.body.text();
    }
  }
}
