export interface PaymentResponse {
  id: string;
  idempotencyKey: string;
  sourceAccountId: string;
  targetAccountId: string;
  amount: number;
  currency: string;
  type: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REJECTED_FRAUD';
  failureReason?: string;
  initiatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface InitiatePaymentRequest {
  sourceAccountId: string;
  targetAccountId: string;
  amount: number;
  currency: string;
  type: string;
}
