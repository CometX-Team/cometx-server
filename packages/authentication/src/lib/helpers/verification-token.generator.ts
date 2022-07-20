import ms from 'ms';
import { Injectable } from '@nestjs/common';
import { generatePublicId } from '@cometx-server/common';
import { ConfigService } from '@cometx-server/config';

@Injectable()
export class VerificationTokenGeneration {
  constructor(private configService: ConfigService) {}

  generateVerificationToken() {
    const now = new Date();
    const base64Now = Buffer.from(now.toJSON()).toString('base64');
    const id = generatePublicId();

    return `${base64Now}_${id}`;
  }

  verifyVerificationToken(token: string): boolean {
    const duration = ms(
      this.configService.authConfig.verificationTokenDuration,
    );

    const [datePrefix] = token.split('_');

    const dateString = Buffer.from(datePrefix, 'base64').toString();
    const date = new Date(dateString);
    const elapsed = +new Date() - +date;

    return elapsed < duration;
  }
}
