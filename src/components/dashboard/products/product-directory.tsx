"use client";

import React, { useState } from "react";
import { Search, Package, ShoppingBag, Boxes, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductAddButton } from "@/components/dashboard/products/product-add-button";
import { ProductRowActions } from "@/components/dashboard/products/product-row-actions";
import { Button } from "@/components/ui/button";

interface ProductData {
  id: string;
  name: string;
  type: string;
  description: string | null;
  status: string;
  badgeVariant: "success" | "warning" | "brand" | "secondary" | "destructive";
  monthlyVolume: string;
  margin: string;
  icon: string;
}

export function ProductDirectory({ products }: { products: ProductData[] }) {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const filteredProducts = products.filter((product) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return product.name.toLowerCase().includes(q) || product.type.toLowerCase().includes(q);
  });

  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-3 rounded-lg border border-dashed border-border py-20 bg-muted/10">
        <Package className="size-8 text-muted-foreground/30" />
        <div className="space-y-1 text-center">
          <p className="text-sm font-medium text-foreground">No products yet</p>
          <p className="text-xs text-muted-foreground max-w-[250px] mx-auto leading-relaxed">
            Add your first product to your catalog to start tracking sales and margin.
          </p>
        </div>
        <div className="pt-2">
          <ProductAddButton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="size-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
          <Input
            placeholder="Search products or category..."
            className="pl-8 text-xs"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-3 rounded-lg border border-dashed border-border py-20 bg-muted/10">
          <p className="text-sm text-muted-foreground">
            No results for &quot;<span className="font-medium text-foreground">{query}</span>&quot;
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {paginatedProducts.map((product) => {
              let Icon = Package;
              if (product.icon === "ShoppingBag") Icon = ShoppingBag;
              else if (product.icon === "Boxes") Icon = Boxes;
              else if (product.icon === "TrendingUp") Icon = TrendingUp;

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

          {totalPages > 1 && (
            <div className="flex items-center justify-between py-2">
              <div className="text-[11px] text-muted-foreground font-medium pl-1">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-[11px]"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-[11px]"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
