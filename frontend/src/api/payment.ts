import { apiClient } from '../config/client';
import { API_ENDPOINTS } from '../config/api';
import type { PaymentResponse, InitiatePaymentRequest } from '../types/payment';

export const paymentApi = {
  initiatePayment: async (request: InitiatePaymentRequest): Promise<PaymentResponse> => {
    const idempotencyKey = crypto.randomUUID();
    const { data } = await apiClient.post(API_ENDPOINTS.payments, request, {
      headers: { 'X-Idempotency-Key': idempotencyKey },
    });
    return data;
  },

  getPayment: async (paymentId: string): Promise<PaymentResponse> => {
    const { data } = await apiClient.get(`${API_ENDPOINTS.payments}/${paymentId}`);
    return data;
  },

  getPaymentsByAccount: async (accountId: string): Promise<PaymentResponse[]> => {
    const { data } = await apiClient.get(API_ENDPOINTS.paymentsByAccount(accountId));
    return data;
  },

  processPayment: async (paymentId: string): Promise<void> => {
    await apiClient.post(`${API_ENDPOINTS.payments}/${paymentId}/process`);
  },
};
