"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addCustomer, updateCustomer } from "@/app/actions/customers";
import { X, Loader2 } from "lucide-react";

export function CustomerDialog({ 
  customer, 
  open, 
  onOpenChange 
}: { 
  customer?: any; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    contact_email: "",
    tier: "Wholesale",
    status: "Active",
    joined_at: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (open) {
      if (customer) {
        setFormData({
          name: customer.name || "",
          contact_email: customer.contact || "",
          tier: customer.tier || "Wholesale",
          status: customer.status || "Active",
          joined_at: customer.joined ? new Date(customer.joined).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        });
      } else {
        setFormData({
          name: "",
          contact_email: "",
          tier: "Wholesale",
          status: "Active",
          joined_at: new Date().toISOString().split('T')[0]
        });
      }
      setError(null);
    }
  }, [open, customer]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let res;
    if (customer?.id) {
      res = await updateCustomer(customer.id, formData);
    } else {
      res = await addCustomer(formData);
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
          <h2 className="text-xl font-bold tracking-tight">{customer ? "Edit Customer" : "Add Customer"}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {customer ? "Update customer details." : "Add a new customer to your workspace."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              required 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Contact Email</Label>
            <Input 
              id="email" 
              type="email" 
              required 
              value={formData.contact_email} 
              onChange={(e) => setFormData({...formData, contact_email: e.target.value})} 
              className="h-10"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tier">Tier</Label>
              <select 
                id="tier" 
                value={formData.tier} 
                onChange={(e) => setFormData({...formData, tier: e.target.value})} 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none [&>option]:bg-background [&>option]:text-foreground"
              >
                <option value="Wholesale">Wholesale</option>
                <option value="Retail Partner">Retail Partner</option>
                <option value="B2B Standard">B2B Standard</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select 
                id="status" 
                value={formData.status} 
                onChange={(e) => setFormData({...formData, status: e.target.value})} 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none [&>option]:bg-background [&>option]:text-foreground"
              >
                <option value="Active">Active</option>
                <option value="At Risk">At Risk</option>
                <option value="Trial">Trial</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="joined">Joined Date</Label>
            <Input 
              id="joined" 
              type="date" 
              required 
              value={formData.joined_at} 
              onChange={(e) => setFormData({...formData, joined_at: e.target.value})} 
              className="h-10"
            />
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
              {customer ? "Save Changes" : "Add Customer"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
