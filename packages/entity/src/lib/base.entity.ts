import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { DeepPartial, ID } from '@cometx-server/common';
import { PrimaryGeneratedId } from './entity-id.decorator';

/**
 * @description
 * This is the base class from which all entities inherit. The type of
 * the `id` property is defined by the {@link EntityIdStrategy}.
 *
 */
export abstract class CometXEntity {
  protected constructor(input?: DeepPartial<CometXEntity>) {
    if (input) {
      for (const [key, value] of Object.entries(input)) {
        (this as any)[key] = value;
      }
    }
  }

  @PrimaryGeneratedId()
  id: ID;

  @CreateDateColumn() createdAt: Date;

  @UpdateDateColumn() updatedAt: Date;
}
