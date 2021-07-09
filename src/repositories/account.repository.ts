import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Account} from '../models';

export class AccountRepository extends DefaultCrudRepository<
  Account,
  typeof Account.prototype.id,
  Account
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Account, dataSource);
  }

  async getAccountsFor(userId: number): Promise<Account[]> {
    return this.find({
      where: {
        and: [{ userId: userId }]
      }
    })
  }
}
