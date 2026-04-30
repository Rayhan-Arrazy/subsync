import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header({ subscriptions = [], onRefresh }) {
  const location = useLocation();
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Calculate notifications: subscriptions due within 3 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const notifications = subscriptions
    .filter((s) => {
      if (!s.nextRenewalDate) return false;
      const renewal = new Date(s.nextRenewalDate + 'T00:00:00');
      const diff = Math.ceil((renewal - today) / (1000 * 60 * 60 * 24));
      return diff >= 0 && diff <= 3;
    })
    .map((s) => {
      const renewal = new Date(s.nextRenewalDate + 'T00:00:00');
      const diff = Math.ceil((renewal - today) / (1000 * 60 * 60 * 24));
      let label = '';
      if (diff === 0) label = 'Due today';
      else if (diff === 1) label = 'Due tomorrow';
      else label = `Due in ${diff} days`;
      return { ...s, label };
    });

  const navLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/subscriptions', label: 'Subscriptions' },
    { to: '/history', label: 'History' },
  ];

  return (
    <header className="border-b border-surface-800 bg-surface-900/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow">
            <span className="text-base font-bold text-white">S</span>
          </div>
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-surface-400 bg-clip-text text-transparent">
            SubSync
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-surface-800 text-white'
                    : 'text-surface-400 hover:text-white hover:bg-surface-800/50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side: Notification + Refresh */}
        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              id="notification-bell"
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifications.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white ring-2 ring-surface-900">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifs && (
              <div className="absolute right-0 top-12 w-80 bg-surface-800 border border-surface-700 rounded-2xl shadow-2xl shadow-black/40 animate-slide-down overflow-hidden">
                <div className="p-4 border-b border-surface-700">
                  <h3 className="text-sm font-semibold text-white">Billing Reminders</h3>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-surface-400 text-sm">
                      <p>🎉 No upcoming bills!</p>
                      <p className="mt-1 text-xs text-surface-500">You're all caught up.</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="px-4 py-3 hover:bg-surface-700/50 flex items-center gap-3 transition-colors">
                        <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{n.serviceName}</p>
                          <p className="text-xs text-surface-400">{n.label} &middot; ${parseFloat(n.monthlyCost).toFixed(2)}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onRefresh}
            className="p-2 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800 transition-colors"
            title="Refresh data"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M20.49 9A9 9 0 005.64 5.64L4 4m16 16l-1.64-1.64A9 9 0 014.51 15" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t border-surface-800 flex">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex-1 text-center py-3 text-xs font-medium transition-colors ${
                isActive ? 'text-primary-400 bg-surface-800/50' : 'text-surface-500'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
