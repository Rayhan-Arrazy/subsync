import { Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getServiceMeta, formatCurrency, formatDate, daysUntil } from '../utils';

export default function SubscriptionCard({ sub, onClick, onDelete }) {
  const meta = getServiceMeta(sub.serviceName);
  const days = daysUntil(sub.nextRenewalDate);

  let urgencyVariant = "outline";
  let urgencyText = "";
  
  if (days === 0) {
    urgencyVariant = "destructive";
    urgencyText = "Due Today";
  } else if (days === 1) {
    urgencyVariant = "secondary";
    urgencyText = "Tomorrow";
  } else if (days <= 3) {
    urgencyText = `In ${days} days`;
  }

  return (
    <Card 
      className="group relative cursor-pointer overflow-hidden transition-all hover:border-primary/50 hover:shadow-md"
      onClick={() => onClick?.(sub)}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 rounded-xl">
              <AvatarFallback style={{ backgroundColor: meta.color + '20', color: meta.color }} className="text-xl font-bold">
                {meta.icon}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold leading-none">{sub.serviceName}</h3>
                {urgencyText && (
                  <Badge variant={urgencyVariant} className="h-4 px-1.5 text-[10px] font-bold">
                    {urgencyText}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Next: {formatDate(sub.nextRenewalDate)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold tracking-tight">{formatCurrency(sub.monthlyCost)}</div>
            <p className="text-[10px] font-medium uppercase text-muted-foreground">/ month</p>
          </div>
        </div>
      </CardContent>

      <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(sub.id);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
