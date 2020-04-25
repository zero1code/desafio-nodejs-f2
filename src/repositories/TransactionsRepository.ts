import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface TransactionDTO {
  title: string;
  type: 'income' | 'outcome';
  value: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const Tincome = this.transactions.reduce((incomeTotal, transaction) => {
      return (
        incomeTotal + (transaction.type === 'income' ? transaction.value : 0)
      );
    }, 0);

    const Toutcome = this.transactions.reduce((incomeTotal, transaction) => {
      return (
        incomeTotal + (transaction.type === 'outcome' ? transaction.value : 0)
      );
    }, 0);

    return {
      income: Tincome,
      outcome: Toutcome,
      total: Tincome - Toutcome,
    };
  }

  public create({ title, type, value }: TransactionDTO): Transaction {
    const transaction = new Transaction({ title, type, value });

    const balance = this.getBalance();

    if (type === 'outcome' && balance.total < value) {
      throw Error(
        'Should not be able to create outcome transaction without a valid balance',
      );
    }
    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
