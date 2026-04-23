import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fraudApi } from '../api/fraud';
import { ShieldAlert, CheckCircle, XCircle, Clock, AlertTriangle, Loader2, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import type { FraudCaseResponse } from '../types/fraud';

const STATUS_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  UNDER_REVIEW: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  APPROVED: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  BLOCKED: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ESCALATED: { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
  CONFIRMED: { icon: ShieldAlert, color: 'text-red-700', bg: 'bg-red-100' },
};

const RISK_COLORS: Record<string, string> = {
  LOW: 'text-green-600 bg-green-100',
  MEDIUM: 'text-yellow-600 bg-yellow-100',
  HIGH: 'text-orange-600 bg-orange-100',
  CRITICAL: 'text-red-600 bg-red-100',
};

function FraudCaseCard({ fraudCase }: { fraudCase: FraudCaseResponse }) {
  const [expanded, setExpanded] = useState(false);
  const config = STATUS_CONFIG[fraudCase.status] || STATUS_CONFIG.UNDER_REVIEW;
  const StatusIcon = config.icon;
  const [notes, setNotes] = useState('');
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: () => fraudApi.approveCase(fraudCase.id, notes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fraud-cases'] }),
  });

  const confirmMutation = useMutation({
    mutationFn: () => fraudApi.confirmFraud(fraudCase.id, notes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['fraud-cases'] }),
  });

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${config.bg}`}>
              <StatusIcon size={20} className={config.color} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Case {fraudCase.id.slice(0, 12)}...</p>
              <p className="text-xs text-gray-400">Payment: {fraudCase.paymentId.slice(0, 12)}...</p>
              <p className="text-xs text-gray-400">Account: {fraudCase.sourceAccountId.slice(0, 12)}...</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${RISK_COLORS[fraudCase.riskLevel] || 'bg-gray-100 text-gray-600'}`}>
              {fraudCase.riskLevel} ({fraudCase.riskScore}pts)
            </span>
            <p className="text-xs text-gray-400 mt-1">{new Date(fraudCase.createdAt).toLocaleString()}</p>
          </div>
        </div>

        {fraudCase.ruleResults.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {fraudCase.ruleResults.map((r, i) => (
              <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${r.triggered ? 'bg-red-100 text-red-700' : 'bg-gray-50 text-gray-500'}`}>
                {r.ruleName} {r.triggered && `⚠ ${r.score}pts`}
              </span>
            ))}
          </div>
        )}

        {fraudCase.reviewedBy && (
          <p className="text-xs text-gray-400 mt-2">Reviewed by: {fraudCase.reviewedBy}</p>
        )}

        <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mt-2">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? 'Hide' : 'Show'} details
        </button>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            {fraudCase.ruleResults.map((r, i) => (
              <div key={i} className="mb-2 p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">{r.ruleName}</span>
                  <span className={`text-xs font-bold ${r.triggered ? 'text-red-600' : 'text-gray-400'}`}>{r.score}pts</span>
                </div>
                {r.reason && <p className="text-xs text-gray-500 mt-0.5">{r.reason}</p>}
              </div>
            ))}
            {fraudCase.reviewNotes && (
              <p className="text-xs text-gray-600 italic mt-2">Notes: {fraudCase.reviewNotes}</p>
            )}
          </div>
        )}

        {fraudCase.status === 'UNDER_REVIEW' || fraudCase.status === 'ESCALATED' ? (
          <div className="mt-4 pt-3 border-t border-gray-100 space-y-3">
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add review notes (optional)..."
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900"
            />
            <div className="flex gap-2">
              <button
                onClick={() => confirmMutation.mutate()}
                disabled={confirmMutation.isPending}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white text-sm font-medium rounded-lg"
              >
                {confirmMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                Confirm Fraud
              </button>
              <button
                onClick={() => approveMutation.mutate()}
                disabled={approveMutation.isPending}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-sm font-medium rounded-lg"
              >
                {approveMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                Approve
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function FraudPage() {
  const [filter, setFilter] = useState<'ALL' | 'UNDER_REVIEW' | 'ESCALATED' | 'APPROVED' | 'BLOCKED'>('UNDER_REVIEW');

  const { data: cases, isLoading, refetch } = useQuery({
    queryKey: ['fraud-cases'],
    queryFn: fraudApi.getPendingReview,
  });

  const filtered = cases?.filter(c => filter === 'ALL' || c.status === filter);

  const counts = {
    ALL: cases?.length ?? 0,
    UNDER_REVIEW: cases?.filter(c => c.status === 'UNDER_REVIEW').length ?? 0,
    ESCALATED: cases?.filter(c => c.status === 'ESCALATED').length ?? 0,
    APPROVED: cases?.filter(c => c.status === 'APPROVED').length ?? 0,
    BLOCKED: cases?.filter(c => c.status === 'BLOCKED').length ?? 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fraud Case Review</h1>
          <p className="text-gray-500 text-sm mt-1">Compliance dashboard for fraud detection and review</p>
        </div>
        <button onClick={() => refetch()} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-2 overflow-x-auto">
        {(['ALL', 'UNDER_REVIEW', 'ESCALATED', 'APPROVED', 'BLOCKED'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === status ? 'bg-teal-600 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
            }`}
          >
            {status.replace('_', ' ')} ({counts[status]})
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">{[1, 2].map(i => <div key={i} className="h-48 bg-gray-100 animate-pulse rounded-xl" />)}</div>
      ) : filtered?.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <ShieldAlert size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No cases found</h3>
          <p className="text-gray-400 mt-1">No fraud cases match the selected filter</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered?.map(fc => <FraudCaseCard key={fc.id} fraudCase={fc} />)}
        </div>
      )}

      <div className="bg-slate-800 rounded-xl p-5 text-white">
        <h3 className="font-semibold mb-2">Strategy Pattern - Fraud Rules Engine</h3>
        <p className="text-sm text-slate-300">7 independent fraud rules evaluate each payment. Rules can be CRITICAL (short-circuit on trigger) or weighted scoring. Redis caches velocity checks for pattern detection.</p>
      </div>
    </div>
  );
}
