import * as bcrypt from 'bcrypt';

import { PasswordHashingStrategy } from './password-hashing.strategy.interface';

const bcryptSaltOrRound = 12;

export class BcryptPasswordHashingStrategy implements PasswordHashingStrategy {
  async hash(plaintext: string): Promise<string> {
    return await bcrypt.hash(plaintext, bcryptSaltOrRound);
  }

  async check(plaintext: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plaintext, hash);
  }
}
