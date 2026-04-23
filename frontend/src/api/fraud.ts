import { apiClient } from '../config/client';
import { API_ENDPOINTS } from '../config/api';
import type { FraudCaseResponse, ReviewDecisionRequest } from '../types/fraud';

export const fraudApi = {
  getPendingReview: async (): Promise<FraudCaseResponse[]> => {
    const { data } = await apiClient.get(API_ENDPOINTS.fraudReview);
    return data;
  },

  getCase: async (id: string): Promise<FraudCaseResponse> => {
    const { data } = await apiClient.get(API_ENDPOINTS.fraudCase(id));
    return data;
  },

  approveCase: async (id: string, notes: string): Promise<FraudCaseResponse> => {
    const request: ReviewDecisionRequest = { notes };
    const { data } = await apiClient.post(API_ENDPOINTS.fraudApprove(id), request);
    return data;
  },

  confirmFraud: async (id: string, notes: string): Promise<FraudCaseResponse> => {
    const request: ReviewDecisionRequest = { notes };
    const { data } = await apiClient.post(API_ENDPOINTS.fraudConfirm(id), request);
    return data;
  },
};
