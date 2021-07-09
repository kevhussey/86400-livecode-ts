import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Transaction} from '../models';

export class TransactionRepository extends DefaultCrudRepository<
  Transaction,
  typeof Transaction.prototype.id,
  Transaction
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Transaction, dataSource);
  }

  async getAccountTransactions(accountId: number, dateFrom: Date, dateTo: Date) : Promise<Transaction[]> {

   return this.find({
      where: {
        and: [{accountId: accountId}, { completed: { gte: dateFrom } }, { completed: { lte: dateTo } }]
      }
    });
  }
}
