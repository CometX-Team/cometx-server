import { DeepPartial } from '@cometx-server/common';
import { CometXEntity } from '@cometx-server/entity';

import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { User } from '../user/user.entity';

/**
 * @description
 * This entity represents a customer of the store, typically an individual person. A Customer can be
 * a guest, in which case it has no associated {@link User}. Customers with registered account will
 * have an associated User entity.
 *
 * @docsCategory entities
 */
@Entity()
export class Customer extends CometXEntity {
  constructor(input: DeepPartial<Customer>) {
    super(input);
  }

  @Column({ type: Date, nullable: true })
  deletedAt: Date | null;

  @Column({ nullable: true }) title: string;

  @Column() firstName: string;

  @Column() lastName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column()
  emailAddress: string;

  @OneToOne(() => User)
  @JoinColumn()
  user?: User;
}
