# Portfolio analytics

Tracks **foreground time** for each visit, Projects / Work & Education routes, individual project stories, visible project cards, Work / Education headings and entries, and Resume / GitHub / LinkedIn popups. Viewport entries count when at least 25% of the tracked element is visible. A view means an entry into the viewport/route or a return from the background, not a unique person. Time is visible time, including idle reading; it does not prove attention. Overlapping cards/sections can accumulate time simultaneously, so their totals should not be added together.

No SDK, cookies, local storage, fingerprinting, full URLs, referrers, email contents, IP addresses, or user agents are saved in the analytics database. The random visit ID lasts only until the page reloads. Do Not Track / Global Privacy Control disable collection. Cloudflare's own infrastructure logging is separate.

**Request budget:** zero analytics requests during navigation, scrolling, or clicks. A cumulative JSON snapshot is sent when the page becomes hidden or leaves. A hidden + pagehide pair is deduplicated. Returning and leaving again sends another updated snapshot; the database keeps only the newest sequence, so duplicates and delayed arrivals don't inflate totals. A typical visit makes one small request and one database write. Visits shorter than one second are ignored. The payload is capped at 32 KiB. There is no heartbeat, polling, third-party request, or per-event database write. Browser termination/network failure can lose the final snapshot; this is intentionally best-effort to keep traffic low.

## Cloudflare setup (not deployed)

Uses **Workers Static Assets + D1**. Static files bypass the Worker; only `/api/analytics` invokes it. The public endpoint accepts writes only; reading reports requires your Cloudflare account. D1 is needed because Cloudflare's basic traffic analytics doesn't store these custom section/project durations.

1. Run `npx wrangler login` if needed.
2. Run `npx wrangler d1 create portfolio-analytics`.
3. Replace the all-zero `database_id` in `wrangler.jsonc` with the returned ID. Keep the `ANALYTICS` binding name.
4. Run `npx wrangler d1 migrations apply ANALYTICS --remote`.
5. Run `npm run build`, then `npx wrangler deploy` when ready to publish. For Cloudflare Git builds use build command `npm run build` and deploy command `npx wrangler deploy`.

The existing local Chromium preview helper still needs its own browser backend if you want live remote browsing after hosting; this analytics Worker does not host Chromium.

## Local verification

Normal `npm run dev` disables analytics to avoid polluting reports. To test the actual production bundle entirely locally:

```sh
npm run cf:migrate:local
npm run cf:dev
```

Visit the printed local URL (usually http://localhost:8787), explore projects and Work / Education, then switch tabs or close it. Read local data with:

```sh
npx wrangler d1 execute ANALYTICS --local --command="SELECT id, visible_ms, targets FROM visits"
```

`npm run cf:types` regenerates Cloudflare binding types after configuration changes.

## Read the reports

Open Cloudflare → D1 → portfolio-analytics → Console. These queries use the last 30 days. Or save a query to a file and run `npx wrangler d1 execute ANALYTICS --remote --file=report.sql`.

Visits and average foreground seconds:

```sql
SELECT COUNT(*) AS visits,
       ROUND(AVG(visible_ms) / 1000.0, 1) AS avg_visible_seconds,
       ROUND(SUM(visible_ms) / 60000.0, 1) AS total_visible_minutes
FROM visits
WHERE started_at >= (unixepoch() - 30 * 86400) * 1000;
```

Which sections/projects people viewed, and for how long:

```sql
SELECT json_extract(item.value, '$.id') AS target,
       COUNT(*) AS visits_that_viewed,
       SUM(json_extract(item.value, '$.views')) AS view_entries,
       ROUND(SUM(json_extract(item.value, '$.ms')) / 1000.0, 1) AS total_seconds,
       ROUND(AVG(json_extract(item.value, '$.ms')) / 1000.0, 1) AS avg_seconds_per_visit
FROM visits, json_each(visits.targets) AS item
WHERE started_at >= (unixepoch() - 30 * 86400) * 1000
GROUP BY target ORDER BY visits_that_viewed DESC, total_seconds DESC;
```

Target prefixes: `page:` tab visits; `project-card:` index exposure; `project:` opened story; `section:` section heading exposure; `work:` / `education:` visible entries; `work-detail:` opened work story; `viewer:` popup. New records in `src/data/` are automatically registered and measured by the reusable components; no tracking code changes needed. Keep IDs stable when editing titles.

Retention is owner-controlled. To remove visits older than 90 days, run this periodically in the D1 console (no scheduled requests are added):

```sql
DELETE FROM visits WHERE started_at < (unixepoch() - 90 * 86400) * 1000;
```

Anonymous public analytics can include bots or fabricated requests; origin/size/schema validation reduces accidental noise but is not bot authentication. Never use these counts as billing or security records.

References: [Cloudflare asset routing](https://developers.cloudflare.com/workers/static-assets/routing/worker-script/), [D1 bindings](https://developers.cloudflare.com/d1/worker-api/d1-database/).
