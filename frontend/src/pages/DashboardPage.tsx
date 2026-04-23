import { useQuery } from '@tanstack/react-query';
import { accountApi } from '../api/account';
import { fxApi } from '../api/fx';
import { useAuth } from '../contexts/AuthContext';
import { Wallet, ArrowRightLeft, TrendingUp, AlertTriangle, RefreshCw, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DashboardPage() {
  const { user } = useAuth();

  const { data: accounts, isLoading: accountsLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountApi.getMyAccounts,
  });

  const { data: rates, isLoading: ratesLoading } = useQuery({
    queryKey: ['fx-rates'],
    queryFn: fxApi.getAllRates,
  });

  const totalBalance = accounts?.reduce((sum, a) => sum + Number(a.balance), 0) ?? 0;

  const statCards = [
    {
      label: 'Total Balance',
      value: new Intl.NumberFormat('en-US', { style: 'currency', currency: accounts?.[0]?.currency || 'EUR' }).format(totalBalance),
      icon: DollarSign,
      color: 'text-green-400',
      bgColor: 'bg-green-900/30',
    },
    {
      label: 'Accounts',
      value: accounts?.length ?? 0,
      icon: Wallet,
      color: 'text-teal-400',
      bgColor: 'bg-teal-900/30',
    },
    {
      label: 'FX Pairs',
      value: rates?.length ?? 0,
      icon: TrendingUp,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/30',
    },
    {
      label: 'Payment Status',
      value: 'Active',
      icon: ArrowRightLeft,
      color: 'text-purple-400',
      bgColor: 'bg-purple-900/30',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {user?.email || user?.sub}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  {accountsLoading ? (
                    <div className="h-8 w-24 bg-gray-200 animate-pulse rounded mt-1" />
                  ) : (
                    <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
                  )}
                </div>
                <div className={`p-3 rounded-xl ${card.bgColor}`}>
                  <Icon size={24} className={card.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Accounts</h2>
            <Link to="/accounts" className="text-sm text-teal-600 hover:text-teal-700 font-medium">View all</Link>
          </div>
          {accountsLoading ? (
            <div className="space-y-3">{[1, 2].map(i => <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-lg" />)}</div>
          ) : accounts?.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Wallet size={40} className="mx-auto mb-2 opacity-50" />
              <p>No accounts yet</p>
              <Link to="/accounts" className="text-teal-600 text-sm mt-2 inline-block">Open your first account</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {accounts?.slice(0, 3).map(account => (
                <div key={account.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-100 rounded-lg">
                      <Wallet size={18} className="text-teal-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{account.iban}</p>
                      <p className="text-xs text-gray-500">{account.currency} · {account.status}</p>
                    </div>
                  </div>
                  <p className={`font-bold ${account.status === 'FROZEN' ? 'text-red-600' : 'text-gray-900'}`}>
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: account.currency }).format(Number(account.balance))}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Exchange Rates</h2>
            <Link to="/fx" className="text-sm text-teal-600 hover:text-teal-700 font-medium">View FX</Link>
          </div>
          {ratesLoading ? (
            <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-100 animate-pulse rounded-lg" />)}</div>
          ) : rates?.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <TrendingUp size={40} className="mx-auto mb-2 opacity-50" />
              <p>No rates available</p>
            </div>
          ) : (
            <div className="space-y-2">
              {rates?.slice(0, 5).map(rate => (
                <div key={rate.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{rate.pair}</p>
                    <p className="text-xs text-gray-400">Source: {rate.source} · Spread: {rate.spreadBasisPoints}bps</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{Number(rate.midRate).toFixed(6)}</p>
                    <p className="text-xs text-gray-400">Bid: {Number(rate.bidRate).toFixed(4)} / Ask: {Number(rate.askRate).toFixed(4)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link to="/payments" className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowRightLeft size={24} className="text-teal-600" />
            <span className="text-sm font-medium text-gray-700">Send Payment</span>
          </Link>
          <Link to="/fx" className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
            <RefreshCw size={24} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Convert Currency</span>
          </Link>
          <Link to="/accounts" className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
            <Wallet size={24} className="text-green-600" />
            <span className="text-sm font-medium text-gray-700">Open Account</span>
          </Link>
          <Link to="/notifications" className="flex flex-col items-center gap-2 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
            <AlertTriangle size={24} className="text-orange-600" />
            <span className="text-sm font-medium text-gray-700">Notifications</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
