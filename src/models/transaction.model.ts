import {Entity, model, property} from '@loopback/repository';

@model()
export class Transaction extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'number',
    required: true,
  })
  accountId: number;

  @property({
    type: 'number',
    required: true,
  })
  amount: number;

  @property({
    type: 'string',
  })
  description?: string;

  @property({
    type: 'date',
    required: true,
  })
  completed: Date;


  constructor(data?: Partial<Transaction>) {
    super(data);
  }
}

