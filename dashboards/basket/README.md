# Basket

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

The dashboard uses Inter from Google Fonts through `next/font/google`.

## Dashboard structure

- `components/layout/`: responsive sidebar, topbar, and shared dashboard shell.
- `components/ui/`: reusable shadcn-style Base UI primitives (button, card, input, badge, table, dialog).
- `components/dashboard/`: metric cards, panels, trend badges, heatmap, sales chart, country tiles, and sortable product table.
- `data/dashboard.json`: sample workspace, metric definitions, countries, products, profile, and notifications.
- `lib/dashboard/demo-analytics.ts`: deterministic daily demo records from January 2024 through the current date. These are sample data, not live sales.
- `lib/dashboard/analytics.ts`: inclusive timeline filtering, equal-length previous-period comparisons, weekday/hour aggregation, and hourly/daily/weekly/monthly sales buckets.
- `components/ui/chart.tsx`: shared Apache ECharts integration, theme colors, resize/disposal, and reduced-motion-aware animations.
- `lib/dashboard/types.ts`: the shared data contract.
- `lib/dashboard/data.ts`: the server-only data adapter consumed by `app/page.tsx`.

To connect a database, replace the body of `getDashboardData()` with your query or API call and return the same `DashboardData` shape. No presentation components need to import or know about the database. Keep database credentials on the server.

The timeline selection is shared by the header, mobile timeline badge, all four metric cards, the order heatmap, and the sales chart. Today uses hourly sales; longer ranges use daily, weekly, or monthly buckets. Missing days appear as zero totals. Ranges outside the demo history show an empty state. Trends compare with the immediately preceding range of the same length; unavailable comparisons show a dash.

Both plots use Apache ECharts for rendering, tooltips, legend interaction, and animated data transitions. The target line uses the lime theme token. Country and product sales use daily breakdowns from the same timeline. The search input filters both panels and product column buttons sort the table; on phones the table scrolls inside its card. Country flags resolve from ISO country codes through `country-flag-icons`, with a globe fallback for unknown codes. View all, Account, and Log out are UI placeholders; no popup or navigation is attached to them, and authentication is not connected.

Validation: `npm run lint`, `npx tsc --noEmit`, and `npm run build`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
