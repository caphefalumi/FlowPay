import { Bell, Mail, MessageSquare, Smartphone, CheckCircle, XCircle, Clock, Info } from 'lucide-react';

export function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-500 text-sm mt-1">Notification delivery status and channel routing</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={20} className="text-teal-600" />
          <h2 className="text-lg font-semibold text-gray-900">How Notifications Work</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Mail size={18} className="text-blue-500" />
              <span className="font-medium text-gray-900 text-sm">Email</span>
            </div>
            <p className="text-xs text-gray-500">HTML emails via Thymeleaf templates. Triggered on payment completion, fraud alerts, and account events.</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Smartphone size={18} className="text-green-500" />
              <span className="font-medium text-gray-900 text-sm">Push (FCM)</span>
            </div>
            <p className="text-xs text-gray-500">Firebase Cloud Messaging. Instant delivery on all payment and account events. Token refresh handled automatically.</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={18} className="text-purple-500" />
              <span className="font-medium text-gray-900 text-sm">SMS (Twilio)</span>
            </div>
            <p className="text-xs text-gray-500">High-priority alerts only. Auto-truncated to 155 chars for single GSM-7 segment. Used for fraud alerts and security events.</p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium text-gray-900 text-sm">Channel Routing Rules (Domain Logic)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-2 pr-4 font-medium">Event</th>
                  <th className="pb-2 pr-4 font-medium">Email</th>
                  <th className="pb-2 pr-4 font-medium">Push</th>
                  <th className="pb-2 font-medium">SMS</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                <tr className="border-b border-gray-50">
                  <td className="py-2 pr-4">Payment Completed</td>
                  <td className="py-2 pr-4"><CheckCircle size={16} className="text-green-500" /></td>
                  <td className="py-2 pr-4"><CheckCircle size={16} className="text-green-500" /></td>
                  <td className="py-2"><XCircle size={16} className="text-gray-300" /></td>
                </tr>
                <tr className="border-b border-gray-50">
                  <td className="py-2 pr-4">Payment Failed</td>
                  <td className="py-2 pr-4"><CheckCircle size={16} className="text-green-500" /></td>
                  <td className="py-2 pr-4"><CheckCircle size={16} className="text-green-500" /></td>
                  <td className="py-2"><XCircle size={16} className="text-gray-300" /></td>
                </tr>
                <tr className="border-b border-gray-50">
                  <td className="py-2 pr-4">Fraud Alert</td>
                  <td className="py-2 pr-4"><CheckCircle size={16} className="text-green-500" /></td>
                  <td className="py-2 pr-4"><CheckCircle size={16} className="text-green-500" /></td>
                  <td className="py-2"><CheckCircle size={16} className="text-green-500" /></td>
                </tr>
                <tr className="border-b border-gray-50">
                  <td className="py-2 pr-4">Account Debited</td>
                  <td className="py-2 pr-4"><XCircle size={16} className="text-gray-300" /></td>
                  <td className="py-2 pr-4"><CheckCircle size={16} className="text-green-500" /></td>
                  <td className="py-2"><XCircle size={16} className="text-gray-300" /></td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Account Frozen</td>
                  <td className="py-2 pr-4"><CheckCircle size={16} className="text-green-500" /></td>
                  <td className="py-2 pr-4"><CheckCircle size={16} className="text-green-500" /></td>
                  <td className="py-2"><CheckCircle size={16} className="text-green-500" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-100 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} className="text-yellow-500" />
              <span className="font-medium text-gray-900 text-sm">Outbox Pattern</span>
            </div>
            <p className="text-xs text-gray-500">Notifications are written to an outbox table in the same DB transaction as the event. A background poller dispatches them with up to 5 retries before dead-lettering.</p>
          </div>
          <div className="p-4 border border-gray-100 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Smartphone size={16} className="text-teal-500" />
              <span className="font-medium text-gray-900 text-sm">GDPR Compliance</span>
            </div>
            <p className="text-xs text-gray-500">Contact details (email, phone, FCM token) are snapshotted at notification creation time. Each channel has independent retry and delivery status.</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
        <Info size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold">Real Notification Events</p>
          <p className="mt-1">Real notifications are triggered by backend events. Check Grafana for notification delivery metrics (email/sms/push success rates) and Mailpit at <span className="font-mono bg-blue-100 px-1 rounded">http://localhost:8025</span> for email previews in dev.</p>
        </div>
      </div>
    </div>
  );
}
