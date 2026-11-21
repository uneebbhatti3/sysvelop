import "server-only";
import { db } from "./db";
import type { EnquiryStatus } from "./schema";

export type Enquiry = {
  id: string;
  createdAt: string; // ISO
  name: string;
  email: string;
  company: string;
  need: string;
  message: string;
  status: EnquiryStatus;
};

export type DashboardData = {
  enquiries: Enquiry[];
  daily: { date: string; enquiries: number }[]; // last 90 days, oldest first
  stats: {
    total: number;
    open: number;
    last30: number;
    prev30: number;
    topNeed: { need: string; count: number } | null;
  };
};

// Retention caps the table at 12 months, so loading it whole is fine at small-business volume.
// If there are ever more rows than this, the dashboard says so (compares with stats.total).
const LIMIT = 2000;

// The chart's days are counted in this timezone (an IANA name such as "Europe/London").
// Defaults to UTC. Passed as a query parameter, so it can't inject SQL.
const TIMEZONE = process.env.ADMIN_TIMEZONE || "UTC";

export async function getDashboardData(): Promise<DashboardData> {
  const sql = db();

  const [rows, daily, [counts], [top]] = await Promise.all([
    sql<Enquiry[]>`
      select id, created_at as "createdAt", name, email, company, need, message, status
      from enquiries order by created_at desc limit ${LIMIT}
    `,
    sql<{ date: string; enquiries: number }[]>`
      with today as (select (now() at time zone ${TIMEZONE})::date as d)
      select to_char(s.d, 'YYYY-MM-DD') as date, count(e.id)::int as enquiries
      from today,
        generate_series(today.d - 89, today.d, interval '1 day') as s(d)
      left join enquiries e on (e.created_at at time zone ${TIMEZONE})::date = s.d::date
      group by s.d order by s.d
    `,
    sql<{ total: number; open: number; last30: number; prev30: number }[]>`
      select count(*)::int as total,
        count(*) filter (where status = 'new')::int as open,
        count(*) filter (where created_at >= now() - interval '30 days')::int as last30,
        count(*) filter (where created_at >= now() - interval '60 days'
                           and created_at < now() - interval '30 days')::int as prev30
      from enquiries
    `,
    sql<{ need: string; count: number }[]>`
      select need, count(*)::int as count from enquiries
      where created_at >= now() - interval '90 days'
      group by need order by count desc limit 1
    `,
  ]);

  return {
    enquiries: rows.map((r) => ({ ...r, createdAt: new Date(r.createdAt).toISOString() })),
    daily,
    stats: { ...counts, topNeed: top ?? null },
  };
}
