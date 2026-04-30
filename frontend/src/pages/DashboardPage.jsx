import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wallet, 
  CreditCard, 
  Calendar, 
  TrendingUp, 
  Clock, 
  ChevronRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getServiceMeta, formatCurrency, daysUntil, formatDateShort, guessCategory, CATEGORIES } from '../utils';
import SubscriptionDetail from '../components/SubscriptionDetail';

export default function DashboardPage({ subscriptions, history, onDelete }) {
  const [selectedSub, setSelectedSub] = useState(null);

  // Calculations
  const totalMonthly = subscriptions.reduce((sum, s) => sum + parseFloat(s.monthlyCost || 0), 0);
  const totalYearly = totalMonthly * 12;
  const activeSubs = subscriptions.filter((s) => s.isActive);

  // Today's bills and upcoming (within 3 days)
  const todayBills = subscriptions.filter((s) => daysUntil(s.nextRenewalDate) === 0);
  const upcomingBills = subscriptions
    .filter((s) => {
      const d = daysUntil(s.nextRenewalDate);
      return d > 0 && d <= 3;
    })
    .sort((a, b) => daysUntil(a.nextRenewalDate) - daysUntil(b.nextRenewalDate));

  // Category breakdown
  const categoryBreakdown = CATEGORIES.map((cat) => {
    const catSubs = subscriptions.filter((s) => guessCategory(s.serviceName) === cat.id);
    const total = catSubs.reduce((sum, s) => sum + parseFloat(s.monthlyCost || 0), 0);
    return { ...cat, count: catSubs.length, total };
  }).filter((c) => c.count > 0);

  const nextBill = [...subscriptions]
    .filter((s) => daysUntil(s.nextRenewalDate) >= 0)
    .sort((a, b) => daysUntil(a.nextRenewalDate) - daysUntil(b.nextRenewalDate))[0];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your subscription expenses.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalMonthly)}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(totalYearly)}/year estimate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSubs.length}</div>
            <p className="text-xs text-muted-foreground">
              {subscriptions.length} total tracked
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Billing</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">{nextBill ? nextBill.serviceName : "None"}</div>
            <p className="text-xs text-muted-foreground">
              {nextBill ? `${formatCurrency(nextBill.monthlyCost)} on ${formatDateShort(nextBill.nextRenewalDate)}` : "All clear!"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Cost</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeSubs.length > 0 ? formatCurrency(totalMonthly / activeSubs.length) : "$0.00"}
            </div>
            <p className="text-xs text-muted-foreground">per active subscription</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Col: Billing Sections */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Today's Bills */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                <CardTitle className="text-base">Today's Bills</CardTitle>
              </div>
              <Badge variant="outline">{todayBills.length}</Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-0">
              {todayBills.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">✨ No bills due today!</p>
              ) : (
                todayBills.map((s, i) => {
                  const meta = getServiceMeta(s.serviceName);
                  return (
                    <div key={s.id}>
                      {i > 0 && <Separator />}
                      <div 
                        className="flex items-center justify-between py-4 hover:bg-accent/50 cursor-pointer rounded-lg px-2 transition-colors"
                        onClick={() => setSelectedSub(s)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 rounded-lg">
                            <AvatarFallback style={{ backgroundColor: meta.color + '20', color: meta.color }}>
                              {meta.icon}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{s.serviceName}</p>
                            <p className="text-xs text-destructive">Due today</p>
                          </div>
                        </div>
                        <div className="text-sm font-bold">{formatCurrency(s.monthlyCost)}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Upcoming Bills */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-500" />
                <CardTitle className="text-base">Upcoming Bills</CardTitle>
              </div>
              <p className="text-xs text-muted-foreground">Next 3 days</p>
            </CardHeader>
            <CardContent className="flex flex-col gap-0">
              {upcomingBills.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No bills coming up in the next 3 days.</p>
              ) : (
                upcomingBills.map((s, i) => {
                  const meta = getServiceMeta(s.serviceName);
                  const d = daysUntil(s.nextRenewalDate);
                  return (
                    <div key={s.id}>
                      {i > 0 && <Separator />}
                      <div 
                        className="flex items-center justify-between py-4 hover:bg-accent/50 cursor-pointer rounded-lg px-2 transition-colors"
                        onClick={() => setSelectedSub(s)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 rounded-lg">
                            <AvatarFallback style={{ backgroundColor: meta.color + '20', color: meta.color }}>
                              {meta.icon}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{s.serviceName}</p>
                            <p className="text-xs text-amber-500">
                              {d === 1 ? "Tomorrow" : `In ${d} days`} · {formatDateShort(s.nextRenewalDate)}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm font-bold">{formatCurrency(s.monthlyCost)}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Recent Payments (Now using real history) */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Recent Payments</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/history" className="flex items-center gap-1">
                  View all <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-0">
              {history.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No payment history yet.</p>
              ) : (
                history.slice(0, 5).map((h, i) => {
                  const meta = getServiceMeta(h.subscription?.serviceName);
                  return (
                    <div key={h.id}>
                      {i > 0 && <Separator />}
                      <div className="flex items-center justify-between py-4 px-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 rounded-lg">
                            <AvatarFallback style={{ backgroundColor: meta.color + '20', color: meta.color }}>
                              {meta.icon}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{h.subscription?.serviceName}</p>
                            <p className="text-xs text-muted-foreground">{formatDateShort(h.paymentDate)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-destructive">-{formatCurrency(h.amount)}</div>
                          <Badge variant="outline" className="text-[9px] h-4 px-1 border-emerald-500/50 text-emerald-500">PAID</Badge>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Category & Schedule */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Spending by Category</CardTitle>
              <CardDescription>Monthly breakdown</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {categoryBreakdown.map((cat) => {
                const pct = totalMonthly > 0 ? (cat.total / totalMonthly) * 100 : 0;
                return (
                  <div key={cat.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-medium">
                        {cat.icon} {cat.label}
                      </span>
                      <span className="text-muted-foreground">{formatCurrency(cat.total)}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ width: `${pct}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                );
              })}
              {categoryBreakdown.length === 0 && <p className="text-xs text-muted-foreground">No data yet.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">Billing Schedule</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {[...subscriptions]
                .filter((s) => daysUntil(s.nextRenewalDate) >= 0)
                .sort((a, b) => daysUntil(a.nextRenewalDate) - daysUntil(b.nextRenewalDate))
                .slice(0, 6)
                .map((s) => {
                  const meta = getServiceMeta(s.serviceName);
                  const d = daysUntil(s.nextRenewalDate);
                  return (
                    <div key={s.id} className="flex items-center justify-between rounded-lg p-2 hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-xs">{meta.icon}</span>
                        <span className="truncate text-xs font-medium">{s.serviceName}</span>
                      </div>
                      <Badge variant={d <= 1 ? "destructive" : d <= 3 ? "secondary" : "outline"} className="text-[10px] px-1.5 py-0">
                        {d === 0 ? "Today" : d === 1 ? "Tmrw" : `${d}d`}
                      </Badge>
                    </div>
                  );
                })}
              {subscriptions.filter((s) => daysUntil(s.nextRenewalDate) >= 0).length === 0 && (
                <p className="py-2 text-center text-xs text-muted-foreground">No upcoming bills.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {selectedSub && (
        <SubscriptionDetail
          sub={selectedSub}
          onClose={() => setSelectedSub(null)}
          onDelete={onDelete}
        />
      )}
    </div>
  );
}
