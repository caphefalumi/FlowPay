import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountApi } from '../api/account';
import { paymentApi } from '../api/payment';
import { ArrowRightLeft, Plus, Clock, CheckCircle, XCircle, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import type { PaymentResponse } from '../types/payment';

const STATUS_CONFIG: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  PENDING: { icon: Clock, color: 'text-yellow-600 bg-yellow-50', label: 'Pending' },
  PROCESSING: { icon: Loader2, color: 'text-blue-600 bg-blue-50', label: 'Processing' },
  COMPLETED: { icon: CheckCircle, color: 'text-green-600 bg-green-50', label: 'Completed' },
  FAILED: { icon: XCircle, color: 'text-red-600 bg-red-50', label: 'Failed' },
  REJECTED_FRAUD: { icon: AlertTriangle, color: 'text-orange-600 bg-orange-50', label: 'Fraud Rejected' },
};

const PAYMENT_TYPES = ['TRANSFER', 'WIRE', 'SEPA', 'INTERNAL'];

function PaymentRow({ payment }: { payment: PaymentResponse }) {
  const config = STATUS_CONFIG[payment.status] || STATUS_CONFIG.PENDING;
  const StatusIcon = config.icon;
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`p-2 rounded-lg ${config.color}`}>
          <StatusIcon size={18} className={payment.status === 'PROCESSING' ? 'animate-spin' : ''} />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-gray-900 text-sm truncate">{payment.id}</p>
          <p className="text-xs text-gray-400">
            {payment.sourceAccountId.slice(0, 12)}... → {payment.targetAccountId.slice(0, 12)}...
          </p>
        </div>
      </div>
      <div className="text-right ml-4">
        <p className="font-bold text-gray-900">
          {new Intl.NumberFormat('en-US', { style: 'currency', currency: payment.currency }).format(Number(payment.amount))}
        </p>
        <p className="text-xs text-gray-400">{payment.currency} · {payment.type}</p>
      </div>
      <div className="hidden md:flex flex-col items-end ml-4">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.color}`}>{config.label}</span>
        <p className="text-xs text-gray-400 mt-1">{new Date(payment.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
}

export function PaymentsPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ sourceAccountId: '', targetAccountId: '', amount: '', currency: 'EUR', type: 'TRANSFER' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { data: accounts } = useQuery({ queryKey: ['accounts'], queryFn: accountApi.getMyAccounts });

  const allPayments: PaymentResponse[] = [];
  const { data: accountPayments, isLoading: paymentsLoading, refetch } = useQuery({
    queryKey: ['payments-all'],
    queryFn: async () => {
      if (!accounts) return [];
      const results = await Promise.all(accounts.map(a => paymentApi.getPaymentsByAccount(a.id).catch(() => [])));
      return results.flat();
    },
    enabled: !!accounts,
  });

  const initiateMutation = useMutation({
    mutationFn: paymentApi.initiatePayment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payments-all'] });
      setSuccess(`Payment ${data.id} initiated successfully!`);
      setError('');
      setTimeout(() => { setShowModal(false); setSuccess(''); setForm({ sourceAccountId: '', targetAccountId: '', amount: '', currency: 'EUR', type: 'TRANSFER' }); }, 2000);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Payment failed. Try again.');
      setSuccess('');
    },
  });

  const processMutation = useMutation({
    mutationFn: paymentApi.processPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments-all'] });
    },
  });

  const displayPayments = accountPayments || allPayments;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500 text-sm mt-1">Initiate and track payments across accounts</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => refetch()} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <RefreshCw size={16} /> Refresh
          </button>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium">
            <Plus size={16} /> New Payment
          </button>
        </div>
      </div>

      {paymentsLoading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-xl" />)}</div>
      ) : displayPayments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <ArrowRightLeft size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No payments yet</h3>
          <p className="text-gray-400 mt-1 mb-4">Initiate your first payment to get started</p>
          <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium">New Payment</button>
        </div>
      ) : (
        <div className="space-y-3">
          {displayPayments.map(p => (
            <div key={p.id} className="relative">
              <PaymentRow payment={p} />
              {p.status === 'PENDING' && (
                <button
                  onClick={() => processMutation.mutate(p.id)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-blue-600 hover:text-blue-700 font-medium px-2 py-1 bg-blue-50 rounded"
                >
                  Process
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Initiate Payment</h2>
            <form onSubmit={e => {
              e.preventDefault();
              initiateMutation.mutate({
                sourceAccountId: form.sourceAccountId,
                targetAccountId: form.targetAccountId,
                amount: parseFloat(form.amount),
                currency: form.currency,
                type: form.type,
              });
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source Account</label>
                <select
                  value={form.sourceAccountId}
                  onChange={e => setForm({ ...form, sourceAccountId: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                  required
                >
                  <option value="">Select account</option>
                  {accounts?.map(a => <option key={a.id} value={a.id}>{a.iban} ({a.currency})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Account ID</label>
                <input
                  type="text"
                  value={form.targetAccountId}
                  onChange={e => setForm({ ...form, targetAccountId: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                  placeholder="acc-..."
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={form.amount}
                    onChange={e => setForm({ ...form, amount: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select
                    value={form.currency}
                    onChange={e => setForm({ ...form, currency: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                  >
                    {['EUR', 'USD', 'GBP', 'PLN', 'CHF'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
                <select
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
                >
                  {PAYMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
              {success && <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{success}</div>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setError(''); setSuccess(''); }} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">Cancel</button>
                <button type="submit" disabled={initiateMutation.isPending} className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white rounded-lg text-sm font-medium">
                  {initiateMutation.isPending ? 'Processing...' : 'Send Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
