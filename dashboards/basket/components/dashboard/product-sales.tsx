"use client";

import { useState } from "react";
import { ArrowDown, ArrowDownUp, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { currency, number } from "@/lib/dashboard/format";
import type { Product } from "@/lib/dashboard/types";
import { Panel } from "./panel";
import { TrendBadge } from "./trend-badge";

const columns = ["revenue", "sales", "growth", "reviews", "views"] as const;
type SortKey = typeof columns[number];

export function ProductSales({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>({ key: "revenue", desc: true });
  const sorted = [...products].sort((a, b) => ((a[sort.key] ?? 0) - (b[sort.key] ?? 0)) * (sort.desc ? -1 : 1)).slice(0, 4);
  return <Panel title="Top Product Sales" action={<Button variant="secondary" size="xs" aria-label="View all products">View all</Button>}>
    <Table className="min-w-132">
      <caption className="sr-only">Product sales for the selected timeline. Select a column heading to sort.</caption>
      <TableHeader><TableRow className="[&>th]:h-10">
        <TableHead>PRODUCT</TableHead>
        {columns.map(key => {
          const active = sort.key === key;
          const Icon = active ? (sort.desc ? ArrowDown : ArrowUp) : ArrowDownUp;
          return <TableHead key={key} className="text-right" aria-sort={active ? (sort.desc ? "descending" : "ascending") : "none"}>
            <Button variant="ghost" size="xs" className="uppercase" aria-label={`Sort by ${key}`} onClick={() => setSort({ key, desc: active ? !sort.desc : true })}>
              {key}<Icon />
            </Button>
          </TableHead>;
        })}
      </TableRow></TableHeader>
      <TableBody>{sorted.map(product => <TableRow key={product.id}>
        <TableCell className="font-medium">{product.name}</TableCell>
        <TableCell className="text-right tabular-nums">{currency(product.revenue)}</TableCell>
        <TableCell className="text-right tabular-nums">{number(product.sales)}</TableCell>
        <TableCell className="text-right"><TrendBadge compact value={product.growth} /></TableCell>
        <TableCell className="text-right tabular-nums">{number(product.reviews)}</TableCell>
        <TableCell className="text-right tabular-nums">{number(product.views)}</TableCell>
      </TableRow>)}</TableBody>
    </Table>
    {!sorted.length && <p className="py-12 text-center text-sm text-muted-foreground">No products to display.</p>}
  </Panel>;
}
