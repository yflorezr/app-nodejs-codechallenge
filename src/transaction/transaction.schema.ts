import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';

@ObjectType()
export class Transaction {
  @Field(() => ID)
  transactionExternalId: string;

  @Field()
  accountExternalIdDebit: string;

  @Field()
  accountExternalIdCredit: string;

  @Field()
  tranferTypeId: number;

  @Field()
  value: number;

  @Field()
  transactionStatus: string;

  @Field()
  createdAt: Date;
}

@InputType()
export class CreateTransactionInput {
  @Field()
  accountExternalIdDebit: string;

  @Field()
  accountExternalIdCredit: string;

  @Field()
  tranferTypeId: number;

  @Field()
  value: number;
}
