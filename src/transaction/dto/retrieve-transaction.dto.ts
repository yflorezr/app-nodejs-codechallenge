import { TransactionStatusDto } from './transaction-status.dto';
import { TransactionTypeDto } from './transaction-type.dto';

export class RetrieveTransactionDto {
  transactionExternalId: string;
  transactionType: TransactionTypeDto;
  transactionStatus: TransactionStatusDto;
  value: number;
  createdAt: Date;
}
