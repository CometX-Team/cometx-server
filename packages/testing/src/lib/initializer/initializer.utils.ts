import { ConnectionOptions } from 'typeorm';
import { TestDBInitializer } from './initializer.interface';

export type InitialRegistry = {
  [type in ConnectionOptions['type']]?: TestDBInitializer<any>;
};

const initialRegistry: InitialRegistry = {};

export function registerInitializer(
  type: ConnectionOptions['type'],
  server: TestDBInitializer<any>,
) {
  initialRegistry[type] = server;
}

export function getInitializer(
  type: ConnectionOptions['type'],
): TestDBInitializer<any> {
  const server = initialRegistry[type];
  if (!server) {
    throw new Error(`No server has been registered for the database "${type}"`);
  }
  return server;
}
