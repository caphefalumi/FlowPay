import { apiClient } from '../config/client';
import { API_ENDPOINTS } from '../config/api';
import type {
  ExchangeRateResponse,
  ConversionQuoteRequest,
  ConversionQuoteResponse,
  ConvertRequest,
  FxConversionResponse,
} from '../types/fx';

export const fxApi = {
  getAllRates: async (): Promise<ExchangeRateResponse[]> => {
    const { data } = await apiClient.get(API_ENDPOINTS.fxRates);
    return data;
  },

  getRate: async (pair: string): Promise<ExchangeRateResponse> => {
    const { data } = await apiClient.get(API_ENDPOINTS.fxRate(pair));
    return data;
  },

  getQuote: async (request: ConversionQuoteRequest): Promise<ConversionQuoteResponse> => {
    const { data } = await apiClient.post(API_ENDPOINTS.fxQuote, request);
    return data;
  },

  convert: async (request: ConvertRequest): Promise<FxConversionResponse> => {
    const { data } = await apiClient.post(API_ENDPOINTS.fxConvert, request);
    return data;
  },
};
