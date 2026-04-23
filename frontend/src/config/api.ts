export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  accounts: '/api/v1/accounts',
  myAccounts: '/api/v1/accounts/my',
  payments: '/api/v1/payments',
  paymentsByAccount: (accountId: string) => `/api/v1/payments/account/${accountId}`,
  fxRates: '/api/v1/fx/rates',
  fxRate: (pair: string) => `/api/v1/fx/rates/${pair}`,
  fxQuote: '/api/v1/fx/quote',
  fxConvert: '/api/v1/fx/convert',
  fraudCases: '/api/v1/fraud/cases',
  fraudCase: (id: string) => `/api/v1/fraud/cases/${id}`,
  fraudReview: '/api/v1/fraud/cases/review',
  fraudApprove: (id: string) => `/api/v1/fraud/cases/${id}/approve`,
  fraudConfirm: (id: string) => `/api/v1/fraud/cases/${id}/confirm-fraud`,
  devices: '/api/v1/devices',
  devicesRegister: '/api/v1/devices/register',
  keycloakToken: 'http://localhost:8180/realms/fincore/protocol/openid-connect/token',
  keycloakIssuer: 'http://localhost:8180/realms/fincore',
} as const;
