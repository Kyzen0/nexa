"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addChannel, updateChannel } from "@/app/actions/analytics";
import { X, Loader2 } from "lucide-react";

export function ChannelDialog({ 
  channel, 
  open, 
  onOpenChange 
}: { 
  channel?: any; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    monthly_orders: 0,
    gross_revenue: 0,
    net_margin_percentage: 0,
    growth_mom_percentage: 0
  });

  useEffect(() => {
    if (open) {
      if (channel) {
        setFormData({
          name: channel.name || "",
          monthly_orders: channel.monthly_orders || 0,
          gross_revenue: channel.gross_revenue || 0,
          net_margin_percentage: channel.net_margin_percentage || 0,
          growth_mom_percentage: channel.growth_mom_percentage || 0
        });
      } else {
        setFormData({
          name: "",
          monthly_orders: 0,
          gross_revenue: 0,
          net_margin_percentage: 0,
          growth_mom_percentage: 0
        });
      }
      setError(null);
    }
  }, [open, channel]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let res;
    const payload = {
      ...formData,
      monthly_orders: Number(formData.monthly_orders),
      gross_revenue: Number(formData.gross_revenue),
      net_margin_percentage: Number(formData.net_margin_percentage),
      growth_mom_percentage: Number(formData.growth_mom_percentage)
    };

    if (channel?.id) {
      res = await updateChannel(channel.id, payload);
    } else {
      res = await addChannel(payload);
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
          <h2 className="text-xl font-bold tracking-tight">{channel ? "Edit Sales Channel" : "Add Sales Channel"}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {channel ? "Update channel details." : "Add a new sales channel to track."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name (e.g. Shopify, Amazon)</Label>
            <Input 
              id="name" 
              required 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              className="h-10"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monthly_orders">Monthly Orders</Label>
              <Input 
                id="monthly_orders" 
                type="number"
                required 
                value={formData.monthly_orders} 
                onChange={(e) => setFormData({...formData, monthly_orders: Number(e.target.value)})} 
                className="h-10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gross_revenue">Gross Revenue ($)</Label>
              <Input 
                id="gross_revenue" 
                type="number"
                step="0.01"
                required 
                value={formData.gross_revenue} 
                onChange={(e) => setFormData({...formData, gross_revenue: Number(e.target.value)})} 
                className="h-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="net_margin_percentage">Net Margin %</Label>
              <Input 
                id="net_margin_percentage" 
                type="number" 
                step="0.1"
                required 
                value={formData.net_margin_percentage} 
                onChange={(e) => setFormData({...formData, net_margin_percentage: Number(e.target.value)})} 
                className="h-10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="growth_mom_percentage">Growth MoM %</Label>
              <Input 
                id="growth_mom_percentage" 
                type="number" 
                step="0.1"
                required 
                value={formData.growth_mom_percentage} 
                onChange={(e) => setFormData({...formData, growth_mom_percentage: Number(e.target.value)})} 
                className="h-10"
              />
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
              {channel ? "Save Changes" : "Add Channel"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
