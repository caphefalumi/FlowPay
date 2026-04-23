import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fxApi } from '../api/fx';
import { TrendingUp, RefreshCw, ArrowRightLeft, Loader2, CheckCircle, Info } from 'lucide-react';
import type { ConversionQuoteResponse } from '../types/fx';

const CURRENCY_PAIRS = ['EUR/USD', 'EUR/GBP', 'EUR/PLN', 'EUR/CHF', 'EUR/JPY', 'USD/GBP', 'USD/PLN'];

export function FxPage() {
  const queryClient = useQueryClient();
  const [quoteForm, setQuoteForm] = useState({ pair: 'EUR/USD', amount: '', direction: 'BUY' as 'BUY' | 'SELL' });
  const [quoteResult, setQuoteResult] = useState<ConversionQuoteResponse | null>(null);
  const [quoteError, setQuoteError] = useState('');
  const [quoteLoading, setQuoteLoading] = useState(false);

  const { data: rates, isLoading: ratesLoading } = useQuery({
    queryKey: ['fx-rates'],
    queryFn: fxApi.getAllRates,
  });

  const getQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteLoading(true);
    setQuoteError('');
    setQuoteResult(null);
    try {
      const result = await fxApi.getQuote({
        pair: quoteForm.pair,
        amount: parseFloat(quoteForm.amount),
        direction: quoteForm.direction,
      });
      setQuoteResult(result);
    } catch (err: any) {
      setQuoteError(err.response?.data?.message || 'Failed to get quote');
    } finally {
      setQuoteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">FX Rates & Conversion</h1>
        <p className="text-gray-500 text-sm mt-1">Live exchange rates and currency conversion</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Live Exchange Rates</h2>
            <button onClick={() => queryClient.invalidateQueries({ queryKey: ['fx-rates'] })} className="flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700">
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
          {ratesLoading ? (
            <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-lg" />)}</div>
          ) : rates?.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <TrendingUp size={40} className="mx-auto mb-2 opacity-50" />
              <p>No rates available. FX Service may be offline.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {rates?.map(rate => (
                <div key={rate.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-semibold text-gray-900">{rate.pair}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      <span className="inline-flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${rate.active ? 'bg-green-500' : 'bg-gray-400'}`} />
                        {rate.source}
                      </span>
                      {' · '}
                      Spread: {rate.spreadBasisPoints}bps
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-lg">{Number(rate.midRate).toFixed(6)}</p>
                    <p className="text-xs text-gray-400">
                      Bid {Number(rate.bidRate).toFixed(4)} / Ask {Number(rate.askRate).toFixed(4)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ArrowRightLeft size={20} className="text-teal-600" />
            Get Conversion Quote
          </h2>
          <form onSubmit={getQuote} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency Pair</label>
                <select
                  value={quoteForm.pair}
                  onChange={e => setQuoteForm({ ...quoteForm, pair: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                >
                  {CURRENCY_PAIRS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
                <select
                  value={quoteForm.direction}
                  onChange={e => setQuoteForm({ ...quoteForm, direction: e.target.value as 'BUY' | 'SELL' })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                >
                  <option value="BUY">BUY (we buy base)</option>
                  <option value="SELL">SELL (we sell base)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={quoteForm.amount}
                onChange={e => setQuoteForm({ ...quoteForm, amount: e.target.value })}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                placeholder="Enter amount"
                required
              />
            </div>
            {quoteError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{quoteError}</div>}
            <button
              type="submit"
              disabled={quoteLoading}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
            >
              {quoteLoading ? <><Loader2 size={16} className="animate-spin" /> Fetching...</> : 'Get Quote'}
            </button>
          </form>

          {quoteResult && (
            <div className="mt-4 p-4 bg-teal-50 border border-teal-200 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={16} className="text-teal-600" />
                <p className="text-sm font-semibold text-teal-800">Quote Received</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Pair</span>
                  <span className="font-medium text-gray-900">{quoteResult.pair}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Source Amount</span>
                  <span className="font-medium text-gray-900">{Number(quoteResult.sourceAmount).toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Converted</span>
                  <span className="font-bold text-teal-700 text-base">{Number(quoteResult.convertedAmount).toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Applied Rate</span>
                  <span className="font-medium text-gray-900">{Number(quoteResult.appliedRate).toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fee</span>
                  <span className="font-medium text-gray-900">{Number(quoteResult.fee).toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Spread</span>
                  <span className="font-medium text-gray-900">{quoteResult.spreadBasisPoints}bps</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
        <Info size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold">Provider Fallback Chain</p>
          <p className="mt-1">FX rates are fetched from a primary REST provider with circuit breaker protection. If the primary provider fails, the system automatically falls back to the ECB XML feed. Both sources failing results in a fast failure rather than using stale rates.</p>
        </div>
      </div>
    </div>
  );
}
