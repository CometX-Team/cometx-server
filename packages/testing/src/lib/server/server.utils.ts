import { ConnectionOptions } from 'typeorm';
import { TestDBServer } from './server.interface';

export type InitialRegistry = {
  [type in ConnectionOptions['type']]?: TestDBServer<any>;
};

const initialRegistry: InitialRegistry = {};

export function registerServer(
  type: ConnectionOptions['type'],
  server: TestDBServer<any>,
) {
  initialRegistry[type] = server;
}

export function getServer(type: ConnectionOptions['type']): TestDBServer<any> {
  const server = initialRegistry[type];
  if (!server) {
    throw new Error(`No server has been registered for the database "${type}"`);
  }
  return server;
}
