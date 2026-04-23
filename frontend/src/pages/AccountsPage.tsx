import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountApi } from '../api/account';
import { Wallet, Plus, RefreshCw, AlertCircle, Lock } from 'lucide-react';
import type { AccountResponse } from '../types/account';

const CURRENCIES = ['EUR', 'USD', 'GBP', 'PLN', 'CHF', 'JPY'];
const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  FROZEN: 'bg-red-100 text-red-700',
  CLOSED: 'bg-gray-100 text-gray-600',
};

function AccountCard({ account }: { account: AccountResponse }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${account.status === 'ACTIVE' ? 'bg-teal-50' : account.status === 'FROZEN' ? 'bg-red-50' : 'bg-gray-50'}`}>
            {account.status === 'FROZEN' ? <Lock size={20} className="text-red-500" /> : <Wallet size={20} className={account.status === 'ACTIVE' ? 'text-teal-600' : 'text-gray-400'} />}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{account.iban}</p>
            <p className="text-xs text-gray-400">{account.currency} · {account.status}</p>
          </div>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${STATUS_COLORS[account.status] || 'bg-gray-100 text-gray-600'}`}>
          {account.status}
        </span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-gray-400">Balance</p>
          <p className={`text-2xl font-bold ${account.status === 'FROZEN' ? 'text-red-600' : 'text-gray-900'}`}>
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: account.currency }).format(Number(account.balance))}
          </p>
        </div>
        <p className="text-xs text-gray-400">
          Created {new Date(account.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

export function AccountsPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ currency: 'EUR', email: '', phoneNumber: '' });
  const [error, setError] = useState('');

  const { data: accounts, isLoading, refetch } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountApi.getMyAccounts,
  });

  const openMutation = useMutation({
    mutationFn: accountApi.openAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      setShowModal(false);
      setForm({ currency: 'EUR', email: '', phoneNumber: '' });
      setError('');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to open account');
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accounts</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your bank accounts and view balances</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => refetch()} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <RefreshCw size={16} /> Refresh
          </button>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium">
            <Plus size={16} /> Open Account
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-100 animate-pulse rounded-xl" />)}
        </div>
      ) : accounts?.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <Wallet size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No accounts yet</h3>
          <p className="text-gray-400 mt-1 mb-4">Open your first account to start using the platform</p>
          <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium">
            Open Account
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts?.map(account => <AccountCard key={account.id} account={account} />)}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Open New Account</h2>
            <form onSubmit={e => { e.preventDefault(); openMutation.mutate(form); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select
                  value={form.currency}
                  onChange={e => setForm({ ...form, currency: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                <input
                  type="tel"
                  value={form.phoneNumber}
                  onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="+1234567890"
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle size={16} /> {error}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setError(''); }} className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                  Cancel
                </button>
                <button type="submit" disabled={openMutation.isPending} className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-300 text-white rounded-lg text-sm font-medium">
                  {openMutation.isPending ? 'Opening...' : 'Open Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
