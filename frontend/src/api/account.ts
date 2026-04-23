import { apiClient } from '../config/client';
import { API_ENDPOINTS } from '../config/api';
import type { AccountResponse, OpenAccountRequest } from '../types/account';

export const accountApi = {
  getMyAccounts: async (): Promise<AccountResponse[]> => {
    const { data } = await apiClient.get(API_ENDPOINTS.myAccounts);
    return data;
  },

  getAccount: async (accountId: string): Promise<AccountResponse> => {
    const { data } = await apiClient.get(`${API_ENDPOINTS.accounts}/${accountId}`);
    return data;
  },

  openAccount: async (request: OpenAccountRequest): Promise<AccountResponse> => {
    const { data } = await apiClient.post(API_ENDPOINTS.accounts, request);
    return data;
  },

  getAuditLog: async (accountId: string) => {
    const { data } = await apiClient.get(`${API_ENDPOINTS.accounts}/${accountId}/audit`);
    return data;
  },
};
