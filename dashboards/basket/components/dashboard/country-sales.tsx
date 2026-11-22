import { Button } from "@/components/ui/button";
import { CountryFlag } from "@/components/graphics/country-flag";
import { compact } from "@/lib/dashboard/format";
import type { CountrySales as Country } from "@/lib/dashboard/types";
import { Panel } from "./panel";

function CountryTile({ country }: { country: Country }) {
  return <div className="min-w-0 rounded-lg bg-muted p-3">
    <CountryFlag code={country.code} />
    <p className="mt-2 mb-1 min-h-8 text-xs leading-4">{country.name}</p>
    <p className="flex flex-wrap items-baseline gap-1">
      <span className="text-sm font-semibold">{compact(country.products)}</span>
      <span className="text-xs text-muted-foreground">Products</span>
    </p>
  </div>;
}

export function CountrySales({ countries }: { countries: Country[] }) {
  return <Panel title="Sales by Country" action={<Button variant="secondary" size="xs" aria-label="View all countries">View all</Button>}>
    {countries.length ? <div className="grid grid-cols-3 gap-2">
      {countries.slice(0, 6).map(country => <CountryTile key={country.code} country={country} />)}
    </div> : <p className="py-12 text-center text-sm text-muted-foreground">No countries to display.</p>}
  </Panel>;
}
