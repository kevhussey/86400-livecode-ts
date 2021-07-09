import {expect} from '@loopback/testlab';
import {BalanceHistoryService} from '../../services';
import {Account, Transaction} from '../../models';
import {AccountRepository, TransactionRepository} from '../../repositories';
import {DbDataSource} from '../../datasources';

describe('BalanceHistory', () => {
  let balanceHistoryService: BalanceHistoryService;
  let accountRepository: AccountRepository;
  let transactionRepository: TransactionRepository;

  before('setupApplication', async () => {
    accountRepository = new AccountRepository(new DbDataSource());
    transactionRepository = new TransactionRepository(new DbDataSource());
    balanceHistoryService = new BalanceHistoryService(accountRepository, transactionRepository);
  });

  beforeEach('set up data', async () => {
    await accountRepository.deleteAll();
    await accountRepository.createAll([USER_1_SAVE_ACCOUNT, USER_1_PAY_ACCOUNT, USER_2_PAY_ACCOUNT, USER_2_SAVE_ACCOUNT]);
    await transactionRepository.createAll(USER_1_TRANSACTIONS);
    await transactionRepository.createAll(USER_2_TRANSACTIONS);
  });


  it('should return empty for non existing account', async () => {
    const history = await balanceHistoryService.getBalanceHistory(99);
    expect(history).to.containDeep({
      history: [],
    });
  });

  it('should todays balance when no transactions within date range', async () => {
    const history = await balanceHistoryService.getBalanceHistory(USER_ID_2, {days: 1});
    expect(history).to.containDeep({
      history: [{
        date: getDaysAgo(0).toDateString(),
        balance: USER_2_PAY_ACCOUNT.balance + USER_2_SAVE_ACCOUNT.balance,
      }],
    });
  });

  it('should show an unchanged history when no transactions within date range', async () => {
    const history = await balanceHistoryService.getBalanceHistory(USER_ID_2, {days: 2});
    expect(history).to.containDeep({
      history: [{
        date: getDaysAgo(0).toDateString(),
        balance: USER_2_PAY_ACCOUNT.balance + USER_2_SAVE_ACCOUNT.balance,
      }, {
        date: getDaysAgo(1).toDateString(),
        balance: USER_2_PAY_ACCOUNT.balance + USER_2_SAVE_ACCOUNT.balance,
      }],
    });
  });

  it('should show a complete history for user 1', async () => {
  const history = await balanceHistoryService.getBalanceHistory(USER_ID_1, {days: 10});
  expect(history).to.containDeep({
    history: [{
      date: getDaysAgo(0).toDateString(),
      balance: 250,
    }, {
      date: getDaysAgo(1).toDateString(),
      balance: 250,
    },
      {
        date: getDaysAgo(2).toDateString(),
        balance: 300,
      }, {
        date: getDaysAgo(3).toDateString(),
        balance: 300,
      }, {
        date: getDaysAgo(4).toDateString(),
        balance: 300,
      }, {
        date: getDaysAgo(5).toDateString(),
        balance: 500,
      }, {
        date: getDaysAgo(6).toDateString(),
        balance: 500,
      }, {
        date: getDaysAgo(7).toDateString(),
        balance: 0,
      }, {
        date: getDaysAgo(8).toDateString(),
        balance: 0,
      }, {
        date: getDaysAgo(9).toDateString(),
        balance: 0,
      }
    ],
  });
});

  it('should filter by PAY accounts', async () => {
    const history = await balanceHistoryService.getBalanceHistory(USER_ID_2, {days: 1, type: USER_2_PAY_ACCOUNT.type});
    expect(history).to.containDeep({
      history: [{
        date: getDaysAgo(0).toDateString(),
        balance: USER_2_PAY_ACCOUNT.balance,
      }],
    });
  });

  it('should filter by SAVE accounts', async () => {
    const history = await balanceHistoryService.getBalanceHistory(USER_ID_2, {days: 1, type: USER_2_SAVE_ACCOUNT.type});
    expect(history).to.containDeep({
      history: [{
        date: getDaysAgo(0).toDateString(),
        balance: USER_2_SAVE_ACCOUNT.balance,
      }],
    });
  });

  const getDaysAgo = (n: number) => {
    const d = new Date(); // Today!
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - n);  //n days ago
    return d;
  };

  const USER_ID_1 = 1;
  const USER_ID_2 = 2;

  const USER_1_PAY_ACCOUNT = new Account({
    id: 1,
    userId: USER_ID_1,
    number: '0002',
    balance: 50,
    type: 'PAY',
  });

  const USER_1_SAVE_ACCOUNT = new Account({
    id: 2,
    userId: USER_ID_1,
    number: '0001',
    balance: 200,
    type: 'SAVE',
  });

  const USER_2_PAY_ACCOUNT = new Account({
    id: 3,
    userId: USER_ID_2,
    number: '0003',
    balance: 10,
    type: 'PAY',
  });

  const USER_2_SAVE_ACCOUNT = new Account({
    id: 4,
    userId: USER_ID_2,
    number: '0004',
    balance: 20,
    type: 'SAVE',
  });

  const USER_1_TRANSACTIONS = [
    new Transaction({
      accountId: USER_1_PAY_ACCOUNT.id,
      amount: -50,
      completed: getDaysAgo(1),
      description: 'Food',
    }),
    new Transaction({
      accountId: USER_1_PAY_ACCOUNT.id,
      amount: -200,
      completed: getDaysAgo(2),
      description: 'Internal transfer',
    }),
    new Transaction({
      accountId: USER_1_SAVE_ACCOUNT.id,
      amount: 200,
      completed: getDaysAgo(2),
      description: 'Internal transfer',
    }),
    new Transaction({
      accountId: USER_1_PAY_ACCOUNT.id,
      amount: -200,
      completed: getDaysAgo(4),
      description: 'Rent',
    }),
    new Transaction({
      accountId: USER_1_PAY_ACCOUNT.id,
      amount: 500,
      completed: getDaysAgo(6),
      description: 'Pay day',
    }),
    new Transaction({
      accountId: USER_1_PAY_ACCOUNT.id,
      amount: 0,
      completed: getDaysAgo(9),
      description: 'Opening balance',
    }),
    new Transaction({
      accountId: USER_1_PAY_ACCOUNT.id,
      amount: 0,
      completed: getDaysAgo(9),
      description: 'Opening balance',
    }),
  ];

  const USER_2_TRANSACTIONS = [
    new Transaction({
      accountId: USER_2_PAY_ACCOUNT.id,
      amount: USER_2_PAY_ACCOUNT.balance,
      completed: getDaysAgo(10),
      description: 'Transfer from NAB',
    }),
    new Transaction({
      accountId: USER_2_SAVE_ACCOUNT.id,
      amount: USER_2_SAVE_ACCOUNT.balance,
      completed: getDaysAgo(10),
      description: 'Transfer from NAB',
    }),
    new Transaction({
      accountId: USER_2_PAY_ACCOUNT.id,
      amount: 0,
      completed: getDaysAgo(10),
      description: 'Opening balance',
    }),
    new Transaction({
      accountId: USER_2_SAVE_ACCOUNT.id,
      amount: 0,
      completed: getDaysAgo(10),
      description: 'Opening balance',
    }),
  ];

});
