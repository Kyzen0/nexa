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

export default function ProductsPage() {
  const products = [
    {
      id: "prod-01",
      name: "Artisan Coffee Blend",
      type: "Consumables",
      description: "Signature medium roast coffee beans sourced from Colombia.",
      status: "Low Stock",
      badgeVariant: "warning" as const,
      monthlyVolume: "1,420 units/mo",
      margin: "42%",
      icon: ShoppingBag,
    },
    {
      id: "prod-02",
      name: "Ceramic Pour-Over Dripper",
      type: "Equipment",
      description: "Hand-crafted ceramic dripper for manual coffee brewing.",
      status: "In Stock",
      badgeVariant: "success" as const,
      monthlyVolume: "450 units/mo",
      margin: "58%",
      icon: Package,
    },
    {
      id: "prod-03",
      name: "Double-Walled Glass Mug",
      type: "Drinkware",
      description: "Insulated glass mug that keeps beverages hot without burning hands.",
      status: "Backordered",
      badgeVariant: "brand" as const,
      monthlyVolume: "820 units/mo",
      margin: "65%",
      icon: Boxes,
    },
    {
      id: "prod-04",
      name: "Electric Gooseneck Kettle",
      type: "Electronics",
      description: "Precision temperature control kettle for optimal extraction.",
      status: "In Stock",
      badgeVariant: "success" as const,
      monthlyVolume: "125 units/mo",
      margin: "35%",
      icon: TrendingUp,
    },
  ];

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
          <Button size="sm" className="gap-1.5 text-xs">
            <Plus className="size-3.5" />
            <span>Add Product</span>
          </Button>
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
                  <Badge variant={product.badgeVariant} size="sm">
                    {product.status}
                  </Badge>
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
