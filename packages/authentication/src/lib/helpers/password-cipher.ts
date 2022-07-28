// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@cometx-server/config';
// import { PasswordHashingStrategy } from '../password-strategy/password-hashing.strategy.interface';

// @Injectable()
// export class PasswordCipher {
//   private passwordStrategy: PasswordHashingStrategy;

//   constructor(private configService: ConfigService) {
//     this.passwordStrategy =
//       this.configService.authConfig.passwordHashingStrategy;
//   }

//   async hash(plaintext: string): Promise<string> {
//     return await this.passwordStrategy.hash(plaintext);
//   }

//   async check(plaintext: string, hash: string): Promise<boolean> {
//     return await this.passwordStrategy.check(plaintext, hash);
//   }
// }
