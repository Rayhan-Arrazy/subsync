import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ListOrdered, 
  History, 
  Bell, 
  RefreshCw
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import DashboardPage from './pages/DashboardPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import HistoryPage from './pages/HistoryPage';
import { fetchSubscriptions, createSubscription, deleteSubscription, fetchAllHistory } from './api';

export default function App() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [subsData, historyData] = await Promise.all([
        fetchSubscriptions(),
        fetchAllHistory()
      ]);
      setSubscriptions(subsData);
      setHistory(historyData);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAdd = async (data) => {
    const created = await createSubscription(data);
    setSubscriptions((prev) => [...prev, created]);
    loadData(); // Refresh to get history if any was created (though usually not on add)
  };

  const handleDelete = async (id) => {
    await deleteSubscription(id);
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
    setHistory((prev) => prev.filter((h) => h.subscription?.id !== id));
  };

  // Notification calculations
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const notifications = subscriptions.filter((s) => {
    if (!s.nextRenewalDate) return false;
    const renewal = new Date(s.nextRenewalDate + 'T00:00:00');
    const diff = Math.ceil((renewal - today) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 3;
  }).map(s => {
    const renewal = new Date(s.nextRenewalDate + 'T00:00:00');
    const diff = Math.ceil((renewal - today) / (1000 * 60 * 60 * 24));
    return { ...s, diff };
  });

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/subscriptions', label: 'Subscriptions', icon: ListOrdered },
    { to: '/history', label: 'History', icon: History },
  ];

  if (loading && subscriptions.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Syncing SubSync...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans antialiased dark">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground group-hover:scale-105 transition-transform">
                S
              </div>
              <span className="text-xl font-bold tracking-tight">SubSync</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                    location.pathname === link.to ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80">
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-semibold">Billing Reminders</h3>
                  <div className="flex flex-col gap-1">
                    {notifications.length === 0 ? (
                      <p className="py-4 text-center text-xs text-muted-foreground">🎉 No upcoming bills!</p>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className="flex items-center gap-3 rounded-md p-2 hover:bg-accent">
                          <div className={`h-2 w-2 rounded-full ${n.diff === 0 ? "bg-destructive" : "bg-warning"}`} />
                          <div className="flex-1 overflow-hidden">
                            <p className="truncate text-xs font-medium">{n.serviceName}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {n.diff === 0 ? "Due today" : n.diff === 1 ? "Due tomorrow" : `Due in ${n.diff} days`}
                            </p>
                          </div>
                          <span className="text-xs font-semibold">${parseFloat(n.monthlyCost).toFixed(2)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Button variant="ghost" size="icon" onClick={loadData} title="Refresh data">
              <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-6 py-8">
        <Routes>
          <Route
            path="/"
            element={<DashboardPage subscriptions={subscriptions} history={history} onDelete={handleDelete} />}
          />
          <Route
            path="/subscriptions"
            element={
              <SubscriptionsPage
                subscriptions={subscriptions}
                onAdd={handleAdd}
                onDelete={handleDelete}
              />
            }
          />
          <Route
            path="/history"
            element={<HistoryPage history={history} />}
          />
        </Routes>
      </main>

      <footer className="border-t py-12">
        <div className="container mx-auto max-w-7xl px-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} SubSync. Powered by Shadcn & Spring Boot.</p>
        </div>
      </footer>
    </div>
  );
}
