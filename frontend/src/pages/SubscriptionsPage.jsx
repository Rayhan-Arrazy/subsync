import { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  Filter
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import SubscriptionCard from '../components/SubscriptionCard';
import SubscriptionDetail from '../components/SubscriptionDetail';
import AddSubscriptionModal from '../components/AddSubscriptionModal';
import { guessCategory, CATEGORIES, formatCurrency } from '../utils';

export default function SubscriptionsPage({ subscriptions, onAdd, onDelete }) {
  const [showAdd, setShowAdd] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter subscriptions
  const filtered = useMemo(() => {
    let result = subscriptions;
    if (activeCategory !== 'all') {
      result = result.filter((s) => guessCategory(s.serviceName) === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((s) => s.serviceName?.toLowerCase().includes(q));
    }
    return result;
  }, [subscriptions, activeCategory, searchQuery]);

  const totalMonthly = filtered.reduce((sum, s) => sum + parseFloat(s.monthlyCost || 0), 0);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
          <p className="text-muted-foreground">
            {filtered.length} total · {formatCurrency(totalMonthly)}/mo
          </p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Subscription
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search your services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0">
            <TabsTrigger 
              value="all" 
              className="rounded-full border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              All {subscriptions.length > 0 && <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">{subscriptions.length}</Badge>}
            </TabsTrigger>
            {CATEGORIES.map((cat) => {
              const count = subscriptions.filter(s => guessCategory(s.serviceName) === cat.id).length;
              return (
                <TabsTrigger 
                  key={cat.id} 
                  value={cat.id}
                  className="rounded-full border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <span className="mr-1.5">{cat.icon}</span>
                  {cat.label}
                  {count > 0 && <Badge variant="secondary" className="ml-1.5 h-4 px-1 text-[10px]">{count}</Badge>}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-6">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-24 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">No subscriptions found</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                  {searchQuery 
                    ? `No matches for "${searchQuery}". Try a different term.`
                    : "You haven't added any subscriptions to this category yet."}
                </p>
                {!searchQuery && (
                  <Button variant="outline" className="mt-6" onClick={() => setShowAdd(true)}>
                    + Add New Subscription
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((sub) => (
                  <SubscriptionCard
                    key={sub.id}
                    sub={sub}
                    onClick={setSelectedSub}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {showAdd && (
        <AddSubscriptionModal
          onClose={() => setShowAdd(false)}
          onAdd={onAdd}
        />
      )}
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
