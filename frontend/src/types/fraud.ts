export interface RuleResultResponse {
  ruleName: string;
  score: number;
  triggered: boolean;
  reason?: string;
}

export interface FraudCaseResponse {
  id: string;
  paymentId: string;
  sourceAccountId: string;
  riskScore: number;
  riskLevel: string;
  status: 'UNDER_REVIEW' | 'APPROVED' | 'BLOCKED' | 'ESCALATED' | 'CONFIRMED';
  ruleResults: RuleResultResponse[];
  reviewedBy?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewDecisionRequest {
  notes?: string;
}
