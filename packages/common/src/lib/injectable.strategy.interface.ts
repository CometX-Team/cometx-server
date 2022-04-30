import { ModuleRef } from '@nestjs/core';

export interface InjectableStrategy {
  init?: (moduleRef: ModuleRef) => void | Promise<void>;
  destroy?: () => void | Promise<void>;
}
