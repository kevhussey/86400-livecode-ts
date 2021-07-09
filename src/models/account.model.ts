import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Account extends Entity {
  @property({
    type: 'number',
    id: true,
  })
  id: number;

  @property({
    type: 'number',
    required: true,
  })
  userId: number;

  @property({
    type: 'string',
    required: true,
  })
  number: string;

  @property({
    type: 'number',
    required: true,
  })
  balance: number;

  @property({
    type: 'string',
    required: true,
  })
  type: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Account>) {
    super(data);
  }
}
