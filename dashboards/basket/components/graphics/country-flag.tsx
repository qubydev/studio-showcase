import * as flags from "country-flag-icons/react/3x2";
import { Globe2 } from "lucide-react";

export function CountryFlag({ code }: { code: string }) {
  const country = code.trim().toUpperCase();
  const Flag = Object.hasOwn(flags, country) ? flags[country as keyof typeof flags] : undefined;
  return Flag
    ? <Flag data-country={country} className="h-4 w-6 rounded-xs" aria-hidden="true" />
    : <Globe2 className="size-5 text-muted-foreground" aria-hidden="true" />;
}
