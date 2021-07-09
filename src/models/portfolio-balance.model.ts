import {Model, model, property} from '@loopback/repository';

@model()
export class PortfolioBalance extends Model {
  @property({
    type: 'date',
    required: true,
  })
  date: string;

  @property({
    type: 'number',
    required: true,
  })
  balance: number;


  constructor(data?: Partial<PortfolioBalance>) {
    super(data);
  }
}

export class PortfolioHistory extends Model {

  history: PortfolioBalance[]


  constructor(data?: Partial<PortfolioHistory>) {
    super(data);
  }
}
