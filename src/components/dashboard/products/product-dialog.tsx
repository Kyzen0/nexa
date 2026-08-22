"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addProduct, updateProduct } from "@/app/actions/products";
import { X, Loader2 } from "lucide-react";

export function ProductDialog({ 
  product, 
  open, 
  onOpenChange 
}: { 
  product?: any; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "Consumables",
    description: "",
    status: "In Stock",
    monthly_sales_volume: 0,
    margin_percentage: 0
  });

  useEffect(() => {
    if (open) {
      if (product) {
        setFormData({
          name: product.name || "",
          category: product.category || product.type || "Consumables",
          description: product.description || "",
          status: product.status || "In Stock",
          monthly_sales_volume: product.monthly_sales_volume || (product.monthlyVolume ? parseInt(product.monthlyVolume) : 0),
          margin_percentage: product.margin_percentage || (product.margin ? parseFloat(product.margin) : 0)
        });
      } else {
        setFormData({
          name: "",
          category: "Consumables",
          description: "",
          status: "In Stock",
          monthly_sales_volume: 0,
          margin_percentage: 0
        });
      }
      setError(null);
    }
  }, [open, product]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    let res;
    const payload = {
      ...formData,
      monthly_sales_volume: Number(formData.monthly_sales_volume),
      margin_percentage: Number(formData.margin_percentage)
    };

    if (product?.id) {
      res = await updateProduct(product.id, payload);
    } else {
      res = await addProduct(payload);
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
          <h2 className="text-xl font-bold tracking-tight">{product ? "Edit Product" : "Add Product"}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {product ? "Update product details." : "Add a new product to your catalog."}
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
            <Label htmlFor="description">Description</Label>
            <Input 
              id="description" 
              required 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
              className="h-10"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select 
                id="category" 
                value={formData.category} 
                onChange={(e) => setFormData({...formData, category: e.target.value})} 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none [&>option]:bg-background [&>option]:text-foreground"
              >
                <option value="Consumables">Consumables</option>
                <option value="Drinkware">Drinkware</option>
                <option value="Electronics">Electronics</option>
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
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Backordered">Backordered</option>
                <option value="Discontinued">Discontinued</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sales">Monthly Sales</Label>
              <Input 
                id="sales" 
                type="number" 
                required 
                value={formData.monthly_sales_volume} 
                onChange={(e) => setFormData({...formData, monthly_sales_volume: Number(e.target.value)})} 
                className="h-10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="margin">Margin %</Label>
              <Input 
                id="margin" 
                type="number" 
                step="0.1"
                required 
                value={formData.margin_percentage} 
                onChange={(e) => setFormData({...formData, margin_percentage: Number(e.target.value)})} 
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
              {product ? "Save Changes" : "Add Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
