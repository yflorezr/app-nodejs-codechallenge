import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { TransactionService } from '../transaction/transaction.service';

@Injectable()
export class AntiFraudService implements OnModuleInit {
  private kafkaConsumer;

  constructor(private readonly transactionService: TransactionService) {
    const kafka = new Kafka({
      clientId: 'anti-fraud-service',
      brokers: ['localhost:9092'],
    });

    this.kafkaConsumer = kafka.consumer({ groupId: 'anti-fraud-group' });
  }

  async onModuleInit() {
    await this.kafkaConsumer.connect();
    await this.kafkaConsumer.subscribe({
      topic: 'transaction-topic',
      fromBeginning: true,
    });

    await this.kafkaConsumer.run({
      eachMessage: async ({ message }) => {
        const transaction = JSON.parse(message.value.toString());

        if (transaction.value > 1000) {
          await this.transactionService.updateStatus(
            transaction.transactionExternalId,
            'rejected',
          );
        } else {
          await this.transactionService.updateStatus(
            transaction.transactionExternalId,
            'approved',
          );
        }
      },
    });
  }
}
