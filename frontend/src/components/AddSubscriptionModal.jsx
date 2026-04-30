import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getServiceMeta, CATEGORIES } from '../utils';

export default function AddSubscriptionModal({ onClose, onAdd }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    serviceName: '',
    monthlyCost: '',
    nextRenewalDate: new Date().toISOString().split('T')[0],
    category: 'other',
  });

  const meta = getServiceMeta(form.serviceName);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.serviceName.trim() || !form.monthlyCost) return;
    setLoading(true);
    try {
      await onAdd({
        serviceName: form.serviceName.trim(),
        monthlyCost: parseFloat(form.monthlyCost),
        nextRenewalDate: form.nextRenewalDate,
      });
      onClose();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Add Subscription</DialogTitle>
          <DialogDescription>
            Enter the details of your new recurring payment.
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 flex items-center gap-4 rounded-xl border bg-muted/30 p-4">
          <Avatar className="h-12 w-12 rounded-xl">
            <AvatarFallback style={{ backgroundColor: meta.color + '20', color: meta.color }} className="text-xl font-bold">
              {meta.icon}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold leading-none">{form.serviceName || "Service Name"}</p>
            <p className="text-xs text-muted-foreground mt-1">Live preview of your service</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Service Name</Label>
            <Input
              id="name"
              placeholder="e.g. Netflix, Spotify, AWS..."
              value={form.serviceName}
              onChange={(e) => setForm({ ...form, serviceName: e.target.value })}
              autoFocus
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost">Monthly Cost</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={form.monthlyCost}
                  onChange={(e) => setForm({ ...form, monthlyCost: e.target.value })}
                  className="pl-7"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Next Billing Date</Label>
              <Input
                id="date"
                type="date"
                value={form.nextRenewalDate}
                onChange={(e) => setForm({ ...form, nextRenewalDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={form.category} 
              onValueChange={(val) => setForm({ ...form, category: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center gap-2">
                      <span>{cat.icon}</span> {cat.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4 flex-row gap-2">
            <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Adding..." : "Add Subscription"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
