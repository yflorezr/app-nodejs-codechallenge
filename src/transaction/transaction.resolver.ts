import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TransactionService } from './transaction.service';
import { Transaction, CreateTransactionInput } from './transaction.schema';

@Resolver(() => Transaction)
export class TransactionResolver {
  constructor(private readonly transactionService: TransactionService) {}

  @Query(() => Transaction)
  async transaction(
    @Args('transactionExternalId') transactionExternalId: string,
  ): Promise<Transaction> {
    return this.transactionService.findOne(transactionExternalId);
  }

  @Mutation(() => Transaction)
  async createTransaction(
    @Args('createTransactionInput')
    createTransactionInput: CreateTransactionInput,
  ): Promise<Transaction> {
    return this.transactionService.create(createTransactionInput);
  }
}
