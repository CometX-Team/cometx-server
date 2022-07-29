import { ID, PaginatedList } from '@cometx-server/common';
import { EntityNotFoundError, InternalServerError } from '@cometx-server/error';
import { RequestContext } from '@cometx-server/request-context';
import { TransactionalConnection } from '@cometx-server/transaction';
import { Injectable } from '@nestjs/common';
import { DeletionResponse, DeletionResult } from '../generated-graphql';
import { Role } from './role.entity';

/**
 * @description
 * Contains methods relating to {@link Role} entities.
 *
 * @docsCategory services
 */
@Injectable()
export class RoleService {
  constructor(private connection: TransactionalConnection) {}

  private getRoleByCode(code: string): Promise<Role | undefined> {
    return this.connection.getRepository(Role).findOne({
      where: { code },
    });
  }

  findAll(ctx: RequestContext): Promise<PaginatedList<Role>> {
    return this.connection
      .getRepository(ctx, Role)
      .createQueryBuilder('role')
      .getManyAndCount()
      .then(([items, totalItems]) => ({ items, totalItems }));
  }

  findOne(ctx: RequestContext, roleId: ID): Promise<Role | undefined> {
    return this.connection.getRepository(ctx, Role).findOne(roleId);
  }

  async create(ctx: RequestContext, input: any): Promise<Role> {
    const role = new Role({
      code: input.code,
      description: input.description,
    });
    const createdRole = this.connection.getRepository(ctx, Role).save(role);
    return createdRole;
  }

  async update(ctx: RequestContext, input: any): Promise<Role> {
    const role = this.findOne(ctx, input.id);
    if (!role) {
      throw new EntityNotFoundError('Role', input.id);
    }

    const update = Object.assign(input, role);
    const updatedRole = this.connection.getRepository(ctx, Role).save(update);

    return updatedRole;
  }

  async delete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
    const role = await this.findOne(ctx, id);
    if (!role) {
      throw new EntityNotFoundError('Role', id);
    }

    await this.connection.getRepository(ctx, Role).remove(role);

    return {
      result: DeletionResult.Deleted,
    };
  }

  /**
   * @description
   * Returns Customer Role which is prior defined by special code in MyanCommerce
   */
  getCustomerRole(): Promise<Role> {
    return this.getRoleByCode('__customer_role__').then(role => {
      if (!role) {
        throw new InternalServerError({ message: 'Role Not Error' });
      }
      return role;
    });
  }

  /**
   * @description
   * Returns SuperAdmin Role which is prior defined by special code in MyanCommerce
   */
  getSuperAdminRole(): Promise<Role> {
    return this.getRoleByCode('__super_admin_role__').then(role => {
      if (!role) {
        throw new InternalServerError({ message: 'Role Not Error' });
      }
      return role;
    });
  }
}
