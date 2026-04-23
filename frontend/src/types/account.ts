export interface AccountResponse {
  id: string;
  ownerId: string;
  iban: string;
  currency: string;
  balance: number;
  status: 'ACTIVE' | 'FROZEN' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

export interface OpenAccountRequest {
  currency: string;
  email: string;
  phoneNumber?: string;
}

export interface AuditLogResponse {
  accountId: string;
  eventType: string;
  performedBy: string;
  details: string;
  occurredAt: string;
}
