import { PasswordValidationStrategy } from './password-validation.strategy.interface';

export class DefaultPasswordValidationStrategy
  implements PasswordValidationStrategy
{
  constructor(private options: { minLength?: number; regExp?: RegExp }) {}

  validate(password: string): boolean | string {
    const { minLength, regExp } = this.options;

    if (minLength != null && password.length < minLength) return false;

    if (regExp != null && !regExp.test(password)) return false;

    return true;
  }
}
