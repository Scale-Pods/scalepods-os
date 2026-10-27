"use client";

import * as React from "react";
import { toast } from "sonner";
import { Boxes, Download, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ListToolbar } from "@/components/sales/list-toolbar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  CATEGORIES, SKUS, abcClass, daysCover, daysUntilOrder, grossMargin, isDead, stockStatus, stockValue, totalStock,
} from "@/lib/mock-data/inventory";
import { AbcPill, Pill, StockPill, inrCompact, num } from "./shared";
import { SkuDetailDialog } from "./sku-detail-dialog";

type SortKey = "days" | "stock" | "sales" | "value" | "name";

export function SkuTablePage() {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [category, setCategory] = React.useState("all");
  const [abc, setAbc] = React.useState("all");
  const [sort, setSort] = React.useState<SortKey>("days");
  const [skuId, setSkuId] = React.useState<string | null>(null);

  const rows = React.useMemo(() => {
    const q = search.toLowerCase();
    const list = SKUS.filter((s) => {
      if (q && !s.name.toLowerCase().includes(q) && !s.sku.toLowerCase().includes(q)) return false;
      if (category !== "all" && s.category !== category) return false;
      if (abc !== "all" && abcClass(s) !== abc) return false;
      if (status === "dead") return isDead(s);
      if (status !== "all" && stockStatus(s) !== status) return false;
      return true;
    });
    const key: Record<SortKey, (s: (typeof SKUS)[number]) => number | string> = {
      days: daysCover, stock: (s) => -totalStock(s), sales: (s) => -s.avgMonthlySales, value: (s) => -stockValue(s), name: (s) => s.name,
    };
    return [...list].sort((a, b) => {
      const x = key[sort](a), y = key[sort](b);
      return typeof x === "string" ? x.localeCompare(y as string) : (x as number) - (y as number);
    });
  }, [search, status, category, abc, sort]);

  return (
    <>
      <PageHeader
        title="SKU Table"
        description="Every SKU with stock, cover, ABC class and order window. Click a row for full detail."
        actions={
          <>
            <Button size="sm" variant="outline" onClick={() => toast.success("Pulled latest stock from Shopify, Nykaa, Blinkit and Amazon")}><RefreshCw className="size-3.5" /> Force sync</Button>
            <Button size="sm" variant="outline" onClick={() => toast.info("Exporting inventory sheet")}><Download className="size-3.5" /> Export CSV</Button>
          </>
        }
      />
      <ListToolbar searchValue={search} onSearchChange={setSearch} placeholder="Search SKU or product...">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger size="sm" className="h-8 w-40 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Out of Stock">Out of stock</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
            <SelectItem value="Low Stock">Low stock</SelectItem>
            <SelectItem value="Healthy">Healthy</SelectItem>
            <SelectItem value="Overstock">Overstock</SelectItem>
            <SelectItem value="dead">Dead stock</SelectItem>
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger size="sm" className="h-8 w-40 text-xs"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={abc} onValueChange={setAbc}>
          <SelectTrigger size="sm" className="h-8 w-32 text-xs"><SelectValue placeholder="ABC" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All classes</SelectItem>
            <SelectItem value="A">Class A</SelectItem>
            <SelectItem value="B">Class B</SelectItem>
            <SelectItem value="C">Class C</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
          <SelectTrigger size="sm" className="h-8 w-40 text-xs"><SelectValue placeholder="Sort" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="days">Days of cover (low first)</SelectItem>
            <SelectItem value="stock">Total stock</SelectItem>
            <SelectItem value="sales">Monthly sales</SelectItem>
            <SelectItem value="value">Stock value</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground">{rows.length} SKUs</span>
      </ListToolbar>

      {rows.length === 0 ? (
        <EmptyState icon={Boxes} title="No SKUs found" description="Try a different search term or filter." />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU and product</TableHead><TableHead>Category</TableHead><TableHead>ABC</TableHead>
                <TableHead className="text-right">Stock</TableHead><TableHead className="text-right">Avg/mo</TableHead>
                <TableHead>Cover</TableHead><TableHead>Order window</TableHead><TableHead className="text-right">Value</TableHead><TableHead className="text-right">GM</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((s) => {
                const d = daysCover(s);
                const w = daysUntilOrder(s);
                return (
                  <TableRow key={s.id} className="cursor-pointer" onClick={() => setSkuId(s.id)}>
                    <TableCell><p className="text-sm font-medium">{s.name}</p><p className="text-[10px] text-muted-foreground">{s.sku}</p></TableCell>
                    <TableCell className="text-xs text-muted-foreground">{s.category}</TableCell>
                    <TableCell><AbcPill cls={abcClass(s)} /></TableCell>
                    <TableCell className="text-right tabular-nums">{num(totalStock(s))}</TableCell>
                    <TableCell className="text-right tabular-nums">{num(s.avgMonthlySales)}</TableCell>
                    <TableCell><div className="flex items-center gap-1.5"><StockPill status={stockStatus(s)} /><span className="text-xs tabular-nums text-muted-foreground">{d >= 999 ? "∞" : `${d}d`}</span></div></TableCell>
                    <TableCell>{totalStock(s) === 0 || w <= 0 ? <Pill tone="red">Order now</Pill> : w <= 7 ? <Pill tone="orange">In {w}d</Pill> : <Pill tone="green">In {w}d</Pill>}</TableCell>
                    <TableCell className="text-right tabular-nums">{inrCompact(stockValue(s))}</TableCell>
                    <TableCell className="text-right tabular-nums">{grossMargin(s)}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
      <SkuDetailDialog skuId={skuId} onClose={() => setSkuId(null)} />
    </>
  );
}
