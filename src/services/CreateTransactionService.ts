import TransactionsRepository from '../repositories/TransactionsRepository';
import TransactionsBalanceService from './TransactionsBalanceService';
import Transaction from '../models/Transaction';

interface Request {
  title: string;

  value: number;

  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    if (!['income', 'outcome'].includes(type))
      throw new Error('The transactions types allowed are income or outcome.');

    const transactionsBalance = new TransactionsBalanceService(
      this.transactionsRepository,
    ).execute();

    if (type === 'outcome' && transactionsBalance.total < value)
      throw Error(
        'The balance cannot be negative. There is not balance to pay anything more.',
      );

    return this.transactionsRepository.create({ title, value, type });
  }
}

export default CreateTransactionService;
