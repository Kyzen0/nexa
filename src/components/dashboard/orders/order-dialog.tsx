"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addOrder, updateOrder } from "@/app/actions/orders";
import { X, Loader2 } from "lucide-react";

export function OrderDialog({ 
  order, 
  customers,
  open, 
  onOpenChange 
}: { 
  order?: any;
  customers: { id: string; name: string }[];
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    customer_id: "",
    channel: "",
    amount: 0,
    status: "Pending"
  });

  useEffect(() => {
    if (open) {
      if (order) {
        setFormData({
          customer_id: order.customer_id || "",
          channel: order.channel || "",
          amount: order.amount || 0,
          status: order.status || "Pending"
        });
      } else {
        setFormData({
          customer_id: customers.length > 0 ? customers[0].id : "",
          channel: "",
          amount: 0,
          status: "Pending"
        });
      }
      setError(null);
    }
  }, [open, order, customers]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let res;
    const payload = {
      ...formData,
      amount: Number(formData.amount)
    };

    if (order?.id) {
      res = await updateOrder(order.id, payload);
    } else {
      res = await addOrder(payload);
    }

    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else {
      onOpenChange(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-md rounded-xl shadow-2xl border border-border p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={() => onOpenChange(false)} 
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="size-5" />
        </button>

        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold tracking-tight">{order ? "Edit Order" : "Add Order"}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {order ? "Update order details." : "Log a new transaction."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer_id">Customer</Label>
            <select 
              id="customer_id" 
              required
              value={formData.customer_id} 
              onChange={(e) => setFormData({...formData, customer_id: e.target.value})} 
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none [&>option]:bg-background [&>option]:text-foreground"
            >
              <option value="" disabled>Select a customer...</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="channel">Channel</Label>
            <Input 
              id="channel" 
              required
              placeholder="e.g. Shopify (Online), Retail POS..."
              value={formData.channel} 
              onChange={(e) => setFormData({...formData, channel: e.target.value})} 
              className="h-10"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input 
                id="amount" 
                type="number"
                step="0.01" 
                required 
                value={formData.amount} 
                onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})} 
                className="h-10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select 
                id="status" 
                value={formData.status} 
                onChange={(e) => setFormData({...formData, status: e.target.value})} 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none [&>option]:bg-background [&>option]:text-foreground"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Fulfilled">Fulfilled</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive mt-2">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              {order ? "Save Changes" : "Add Order"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
