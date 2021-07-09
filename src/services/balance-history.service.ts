import {Account, PortfolioBalance, PortfolioHistory, Transaction} from '../models';
import {AccountRepository, TransactionRepository} from '../repositories';



interface BalanceHistoryOptions {
  days: number;
  type?: string
}

const defaultOptions: BalanceHistoryOptions = {
  days: 10
};

export class BalanceHistoryService {
  constructor(private accountRepository: AccountRepository,
              private transactionRepository: TransactionRepository) {
  }

  async getBalanceHistory(userId: number, options: BalanceHistoryOptions = defaultOptions): Promise<PortfolioHistory> {

    const userAccounts: Account[] = await this.accountRepository.getAccountsFor(userId);
    let totalAccountSum = 0;
    for(const account of userAccounts) {
      totalAccountSum += account.balance;
    }

    const history: PortfolioBalance[] = [];
    history.push(new PortfolioBalance({
      date: new Date().toDateString(),
      balance: totalAccountSum
    }));

    return new PortfolioHistory({
      history
    });
  }

  private getDaysAgo = (n: number) => {
    const d = new Date(); // Today!
    d.setDate(d.getDate() - n);  //n days ago
    return d;
  };

  private atStartOfDay = (d: Date) => {
    d.setHours(0, 0, 0, 0);
    return d;
  };

  private atEndOfDay = (d: Date) => {
    d.setHours(23, 59, 59, 999);
    return d;
  };

}
