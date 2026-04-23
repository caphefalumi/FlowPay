import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard, Wallet, ArrowRightLeft, ShieldAlert, Bell, LogOut, Menu, X,
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ROLE_USER', 'ROLE_ADMIN'] },
  { path: '/accounts', label: 'Accounts', icon: Wallet, roles: ['ROLE_USER', 'ROLE_ADMIN'] },
  { path: '/payments', label: 'Payments', icon: ArrowRightLeft, roles: ['ROLE_USER', 'ROLE_ADMIN'] },
  { path: '/fx', label: 'FX Rates', icon: ArrowRightLeft, roles: ['ROLE_USER', 'ROLE_ADMIN'] },
  { path: '/fraud', label: 'Fraud Cases', icon: ShieldAlert, roles: ['ROLE_ADMIN', 'ROLE_COMPLIANCE'] },
  { path: '/notifications', label: 'Notifications', icon: Bell, roles: ['ROLE_USER', 'ROLE_ADMIN'] },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const visibleItems = NAV_ITEMS.filter(item =>
    user?.roles?.some((role: string) => item.roles.includes(role))
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white min-h-screen fixed">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold text-teal-400">FinCore</h1>
          <p className="text-xs text-slate-400 mt-1">Banking Platform</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {visibleItems.map(item => {
            const Icon = item.icon;
            const active = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-xs font-bold">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{user?.email || user?.sub}</p>
              <p className="text-xs text-slate-400 truncate">
                {user?.roles?.filter((r: string) => r !== 'ROLE_USER').map((r: string) => r.replace('ROLE_', '')).join(', ') || 'USER'}
              </p>
            </div>
            <button onClick={logout} className="text-slate-400 hover:text-white" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 text-white p-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-teal-400">FinCore</h1>
        <button onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-900 pt-16">
          <nav className="p-4 space-y-1">
            {visibleItems.map(item => {
              const Icon = item.icon;
              const active = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                    active ? 'bg-teal-600 text-white' : 'text-slate-300'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
            <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-red-400 w-full">
              <LogOut size={18} /> Logout
            </button>
          </nav>
        </div>
      )}

      <main className="flex-1 md:ml-64 p-6 pt-16 md:pt-6 min-h-screen">
        {children}
      </main>
    </div>
  );
};
