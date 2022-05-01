export class ClientError extends Error {
  constructor(public response: any, public request: any) {
    super(ClientError.extractMessage(response));
  }
  private static extractMessage(response: any): string {
    console.log(`From Client Error - ${response}`);
    if (response) {
      return response[0].message;
    } else {
      return `Apollo GraphQL Error (Code: ${response.status})`;
    }
  }
}
