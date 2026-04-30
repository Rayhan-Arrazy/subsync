import { useState, useMemo } from 'react';
import { 
  FileText,
  Search
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getServiceMeta, formatCurrency, formatDate, CATEGORIES } from '../utils';

export default function HistoryPage({ history }) {
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and Sort
  const filtered = useMemo(() => {
    let result = history;

    // Filter by Category
    if (filterCategory !== 'all') {
      result = result.filter((h) => {
        const sub = h.subscription;
        if (!sub) return false;
        // In this app, we guess category from name if not stored
        const cat = CATEGORIES.find(c => c.id === filterCategory);
        return cat && sub.serviceName.toLowerCase().includes(cat.id);
      });
    }

    // Filter by Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((h) => 
        h.subscription?.serviceName?.toLowerCase().includes(q)
      );
    }
    
    // Sort
    if (sortBy === 'date') {
      result = [...result].sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));
    } else if (sortBy === 'amount') {
      result = [...result].sort((a, b) => b.amount - a.amount);
    } else if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.subscription?.serviceName?.localeCompare(b.subscription?.serviceName));
    }
    return result;
  }, [history, filterCategory, sortBy, searchQuery]);

  const totalSpent = filtered.reduce((sum, h) => sum + parseFloat(h.amount || 0), 0);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment History</h1>
          <p className="text-muted-foreground">
            {filtered.length} transactions · {formatCurrency(totalSpent)} total spent
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Latest Date</SelectItem>
              <SelectItem value="amount">Highest Amount</SelectItem>
              <SelectItem value="name">Service Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <Button 
              variant={filterCategory === 'all' ? "default" : "outline"} 
              size="sm" 
              onClick={() => setFilterCategory('all')}
              className="rounded-full"
            >
              All
            </Button>
            {CATEGORIES.map((cat) => (
              <Button 
                key={cat.id}
                variant={filterCategory === cat.id ? "default" : "outline"} 
                size="sm" 
                onClick={() => setFilterCategory(cat.id)}
                className="rounded-full whitespace-nowrap"
              >
                <span className="mr-1.5">{cat.icon}</span> {cat.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-48 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-8 w-8 opacity-20" />
                      <p>No payment records found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((entry) => {
                  const meta = getServiceMeta(entry.subscription?.serviceName);
                  return (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarFallback style={{ backgroundColor: meta.color + '20', color: meta.color }} className="text-xs">
                              {meta.icon}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{entry.subscription?.serviceName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(entry.paymentDate)}</TableCell>
                      <TableCell className="text-right font-semibold text-destructive">
                        -{formatCurrency(entry.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          variant="secondary" 
                          className={`
                            ${entry.status === 'PAID' ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" : 
                              entry.status === 'FAILED' ? "bg-destructive/10 text-destructive hover:bg-destructive/20" :
                              "bg-muted text-muted-foreground"}
                            border-transparent
                          `}
                        >
                          {entry.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
