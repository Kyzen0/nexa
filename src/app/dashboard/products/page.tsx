import React from "react";
import {
  Boxes,
  Package,
  Plus,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { ProductAddButton } from "@/components/dashboard/products/product-add-button";
import { ProductRowActions } from "@/components/dashboard/products/product-row-actions";

export default async function ProductsPage() {
  const supabase = await createClient();

  const { data: productsData, error } = await supabase
    .from('products')
    .select('id, name, category, description, status, monthly_sales_volume, margin_percentage')
    .order('monthly_sales_volume', { ascending: false });

  const products = (productsData || []).map((product) => {
    let badgeVariant: "success" | "warning" | "brand" | "secondary" = "secondary";
    if (product.status === "In Stock") badgeVariant = "success";
    else if (product.status === "Low Stock") badgeVariant = "warning";
    else if (product.status === "Backordered") badgeVariant = "brand";

    let icon = Package;
    if (product.category === "Consumables") icon = ShoppingBag;
    else if (product.category === "Drinkware") icon = Boxes;
    else if (product.category === "Electronics") icon = TrendingUp;

    return {
      id: product.id,
      name: product.name,
      type: product.category,
      description: product.description,
      status: product.status,
      badgeVariant: badgeVariant,
      monthlyVolume: `${product.monthly_sales_volume} units/mo`,
      margin: `${product.margin_percentage}%`,
      icon: icon,
    };
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Product Inventory
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your catalog, track stock levels, and monitor product performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ProductAddButton />
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {products.map((product) => {
          const Icon = product.icon;
          return (
            <Card key={product.id} className="hover:border-neutral-400 dark:hover:border-neutral-700 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg border border-border/80 bg-muted/40 p-2 text-foreground">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">
                        {product.name}
                      </CardTitle>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {product.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={product.badgeVariant} size="sm">
                      {product.status}
                    </Badge>
                    <ProductRowActions product={(({ icon, ...rest }) => rest)(product)} />
                  </div>
                </div>
                <CardDescription className="pt-2">
                  {product.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="border-t border-border/60 pt-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-muted-foreground">Sales: {product.monthlyVolume}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{product.margin} Margin</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
