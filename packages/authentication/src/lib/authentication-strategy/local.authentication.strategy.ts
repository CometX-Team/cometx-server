// import { ModuleRef } from '@nestjs/core';

// import { AuthenticationStrategy } from './authentication.strategy.interface';
// import { TransactionalConnection } from '@cometx-server/transaction';
// import { Injector } from '@cometx-server/common';

// export const LOCAL_AUTH_STRATEGY_NAME = 'local';

// export interface LocalAuthenticationData {
//   emailAddress: string;
//   password: string;
// }

// export class LocalAuthenticationStrategy
//   implements AuthenticationStrategy<LocalAuthenticationData>
// {
//   readonly name = LOCAL_AUTH_STRATEGY_NAME;

//   private connection: TransactionalConnection;
//   private passwordCipher: import('../helpers/password-cipher').PasswordCipher;

//   async init(injector: Injector) {
//     this.connection = injector.get(TransactionalConnection);
//     // This is lazily-loaded to avoid a circular dependency
//     const { PasswordCipher } = await import('../helpers/password-cipher');
//     this.passwordCipher = injector.get(PasswordCipher);
//   }

//   async authenticate(data: LocalAuthenticationData) {}

//   async verifyPassword(password: string) {}
// }
