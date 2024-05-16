import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Kafka } from 'kafkajs';

@Injectable()
export class TransactionService {
  private kafkaProducer;

  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
  ) {
    const kafka = new Kafka({
      clientId: 'transaction-service',
      brokers: ['localhost:9092'],
    });

    this.kafkaProducer = kafka.producer();
  }

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const transaction =
      this.transactionsRepository.create(createTransactionDto);

    transaction.transactionStatus = 'pending';

    await this.transactionsRepository.save(transaction);

    await this.kafkaProducer.connect();
    await this.kafkaProducer.send({
      topic: 'transaction-topic',
      messages: [{ value: JSON.stringify(transaction) }],
    });
    await this.kafkaProducer.disconnect();

    return transaction;
  }

  async findOne(transactionExternalId: string): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({
      transactionExternalId,
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return transaction;
  }

  async updateStatus(
    transactionExternalId: string,
    status: string,
  ): Promise<void> {
    const transaction = await this.transactionsRepository.findOne({
      transactionExternalId
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    transaction.transactionStatus = status;
    await this.transactionsRepository.save(transaction);
  }
}
