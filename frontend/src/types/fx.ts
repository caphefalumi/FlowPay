export interface ExchangeRateResponse {
  id: string;
  pair: string;
  midRate: number;
  bidRate: number;
  askRate: number;
  spreadBasisPoints: number;
  source: string;
  fetchedAt: string;
  validUntil: string;
  active: boolean;
}

export interface ConversionQuoteRequest {
  pair: string;
  amount: number;
  direction: 'BUY' | 'SELL';
}

export interface ConversionQuoteResponse {
  pair: string;
  sourceAmount: number;
  convertedAmount: number;
  appliedRate: number;
  fee: number;
  spreadBasisPoints: number;
  rateTimestamp: string;
}

export interface ConvertRequest {
  paymentId: string;
  accountId: string;
  pair: string;
  sourceAmount: number;
  direction: 'BUY' | 'SELL';
}

export interface FxConversionResponse {
  id: string;
  paymentId: string;
  pair: string;
  sourceAmount: number;
  convertedAmount: number;
  appliedRate: number;
  fee: number;
  spreadBasisPoints: number;
  status: string;
  createdAt: string;
}
