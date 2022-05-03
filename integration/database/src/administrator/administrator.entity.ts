import { DeepPartial } from '@cometx-server/common';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { CometXEntity } from '@cometx-server/transaction';
import { User } from '../user/user.entity';

/**
 * @description
 * An administrative user who has access to the admin ui.
 *
 * @docsCategory entities
 */
@Entity()
export class Administrator extends CometXEntity {
  constructor(input?: DeepPartial<Administrator>) {
    super(input);
  }

  @Column({ type: Date, nullable: true })
  deletedAt: Date | null;

  @Column() firstName: string;

  @Column() lastName: string;

  @Column({ unique: true })
  emailAddress: string;

  @OneToOne(type => User)
  @JoinColumn()
  user: User;
}
