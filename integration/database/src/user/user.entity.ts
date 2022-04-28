import { Column, Entity } from 'typeorm';

import { DeepPartial } from '@cometx-server/common';
import { CometXEntity } from '@cometx-server/transaction'


/**
 * @description
 * A User represents any authenticated user of the CometX API.
 *
 */
@Entity()
export class User extends CometXEntity  {
    constructor(input?: DeepPartial<User>) {
        super(input);
    }

    @Column({ type: Date, nullable: true })
    deletedAt: Date | null;

    @Column({ type: String, nullable: true })
    identifier: string;

    @Column({ default: false })
    verified: boolean;

    @Column({ type: Date, nullable: true })
    lastLogin: Date | null;
}