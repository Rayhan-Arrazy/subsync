import { useState, useEffect } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  Trash2,
  Clock,
  History
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getServiceMeta, formatCurrency, formatDate, daysUntil, guessCategory, CATEGORIES } from '../utils';
import { fetchSubscriptionHistory } from '../api';

export default function SubscriptionDetail({ sub, onClose, onDelete }) {
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (sub?.id) {
      setLoadingHistory(true);
      fetchSubscriptionHistory(sub.id)
        .then(setHistory)
        .catch(console.error)
        .finally(() => setLoadingHistory(false));
    }
  }, [sub]);

  if (!sub) return null;

  const meta = getServiceMeta(sub.serviceName);
  const days = daysUntil(sub.nextRenewalDate);
  const category = CATEGORIES.find((c) => c.id === guessCategory(sub.serviceName)) || CATEGORIES[5];

  let urgencyText = "";
  let urgencyVariant = "outline";
  
  if (days < 0) { urgencyText = "Past due"; urgencyVariant = "destructive"; }
  else if (days === 0) { urgencyText = "Due today"; urgencyVariant = "destructive"; }
  else if (days === 1) { urgencyText = "Due tomorrow"; urgencyVariant = "secondary"; }
  else { urgencyText = `Due in ${days} days`; }

  const yearlyEstimate = parseFloat(sub.monthlyCost || 0) * 12;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-none sm:rounded-2xl shadow-2xl">
        <div 
          className="h-28 w-full relative" 
          style={{ background: `linear-gradient(135deg, ${meta.color}40, ${meta.color}10)` }}
        >
          <div className="absolute -bottom-6 left-6">
            <Avatar className="h-16 w-16 rounded-2xl border-4 border-background bg-card shadow-lg">
              <AvatarFallback style={{ backgroundColor: meta.color + '20', color: meta.color }} className="text-2xl font-bold">
                {meta.icon}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="p-6 pt-10">
          <div className="flex items-start justify-between mb-6">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold">{sub.serviceName}</DialogTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium flex items-center gap-1.5" style={{ color: category.color }}>
                  {category.icon} {category.label}
                </span>
                <span className="text-muted-foreground">·</span>
                <Badge variant={urgencyVariant} className="h-5 px-2 text-[10px] font-bold">
                  {urgencyText}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{formatCurrency(sub.monthlyCost)}</div>
              <p className="text-[10px] font-medium uppercase text-muted-foreground">per month</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <Card className="bg-muted/30 border-none">
              <CardContent className="p-3 space-y-1">
                <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Next Billing
                </p>
                <p className="text-sm font-semibold">{formatDate(sub.nextRenewalDate)}</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/30 border-none">
              <CardContent className="p-3 space-y-1">
                <p className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> Yearly
                </p>
                <p className="text-sm font-semibold">{formatCurrency(yearlyEstimate)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Local History Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                <History className="h-3.5 w-3.5" /> Recent History
              </h4>
            </div>
            <div className="rounded-xl border bg-muted/20 overflow-hidden">
              {loadingHistory ? (
                <div className="p-4 text-center text-xs text-muted-foreground">Loading history...</div>
              ) : history.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground">No payments recorded yet.</div>
              ) : (
                <div className="divide-y">
                  {history.slice(0, 3).map((h) => (
                    <div key={h.id} className="flex items-center justify-between p-3 text-xs">
                      <span className="text-muted-foreground">{formatDate(h.paymentDate)}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-destructive">-{formatCurrency(h.amount)}</span>
                        <Badge variant="secondary" className="h-4 px-1 text-[9px] bg-emerald-500/10 text-emerald-500 border-transparent">
                          {h.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex-row gap-2 sm:justify-between border-t pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button 
              variant="destructive" 
              className="flex-1 gap-2"
              onClick={() => {
                onDelete?.(sub.id);
                onClose();
              }}
            >
              <Trash2 className="h-4 w-4" /> Cancel Sub
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
