import { CometXEntity } from '@cometx-server/entity';
import { Column, DeepPartial, Entity } from 'typeorm';

/**
 * @description
 * A Role represents a collection of permissions which determine the authorization
 * level of a {@link User}.
 *
 * @docsCategory entities
 */
@Entity()
export class Role extends CometXEntity {
  constructor(input?: DeepPartial<Role>) {
    super(input);
  }

  @Column() code: string;

  @Column() description: string;
}
