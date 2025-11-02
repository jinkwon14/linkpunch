"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { fetchStats, StatsResponse } from "@/app/shared/client";

type KpiWindow = {
  label: string;
  description: string;
  views: number;
  clicks: number;
  ctr: number;
  avgTtc: number;
  trend: number;
};

const mockData: KpiWindow[] = [
  {
    label: "Today",
    description: "Live pulse for the last 24 hours",
    views: 128,
    clicks: 42,
    ctr: 32.8,
    avgTtc: 4.6,
    trend: 12
  },
  {
    label: "7 days",
    description: "Week-over-week comparison",
    views: 986,
    clicks: 312,
    ctr: 31.7,
    avgTtc: 5.1,
    trend: 6
  },
  {
    label: "28 days",
    description: "Monthly snapshot",
    views: 3842,
    clicks: 1180,
    ctr: 30.7,
    avgTtc: 5.4,
    trend: -3
  }
];

export default function InsightsPage() {
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats()
      .then(setStats)
      .catch((err) => {
        console.warn("Failed to fetch stats", err);
        setError("Unable to load live statistics, showing mock data.");
      });
  }, []);

  const totals = useMemo(() => {
    const aggregate = mockData.reduce(
      (acc, item) => {
        acc.views += item.views;
        acc.clicks += item.clicks;
        return acc;
      },
      { views: 0, clicks: 0 }
    );
    return {
      ...aggregate,
      ctr: aggregate.views ? (aggregate.clicks / aggregate.views) * 100 : 0
    };
  }, []);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-6 px-5 pb-10 pt-10 text-white">
      <header className="flex flex-col gap-1 text-center">
        <h1 className="text-3xl font-semibold">Insights</h1>
        <p className="text-sm text-white/60">
          Track views, clicks, and time-to-click across rolling windows.
        </p>
      </header>

      {error ? (
        <div className="rounded-3xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <section className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm">
        <h2 className="text-base font-semibold text-white">Overview</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 text-white/80">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/50">Views</p>
            <p className="mt-1 text-2xl font-semibold text-white">{totals.views.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/50">Clicks</p>
            <p className="mt-1 text-2xl font-semibold text-white">{totals.clicks.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/50">CTR</p>
            <p className="mt-1 text-2xl font-semibold text-white">{totals.ctr.toFixed(1)}%</p>
          </div>
          <div>
            <button
              type="button"
              className="mt-2 w-full rounded-2xl border border-white/15 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
            >
              Export CSV
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        {mockData.map((window) => (
          <motion.article
            key={window.label}
            layout
            className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/80"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-white">{window.label}</h3>
                <p className="text-xs text-white/60">{window.description}</p>
              </div>
              <span
                className={[
                  "rounded-full px-3 py-1 text-xs font-semibold",
                  window.trend >= 0 ? "bg-emerald-400/20 text-emerald-200" : "bg-rose-400/20 text-rose-200"
                ].join(" ")}
              >
                {window.trend >= 0 ? "+" : ""}
                {window.trend}%
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-xs uppercase tracking-wide text-white/60">
              <div>
                <p>Views</p>
                <p className="mt-1 text-base font-semibold text-white">{window.views.toLocaleString()}</p>
              </div>
              <div>
                <p>Clicks</p>
                <p className="mt-1 text-base font-semibold text-white">{window.clicks.toLocaleString()}</p>
              </div>
              <div>
                <p>CTR</p>
                <p className="mt-1 text-base font-semibold text-white">{window.ctr.toFixed(1)}%</p>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-[11px] uppercase tracking-[0.25em] text-white/50">Avg time-to-click</p>
              <p className="mt-1 text-lg font-semibold text-white">{window.avgTtc.toFixed(1)}s</p>
            </div>

            <div
              className="mt-4 h-16 w-full rounded-2xl border border-dashed border-white/15 bg-white/5"
              aria-hidden="true"
            >
              <div className="h-full w-full animate-pulse rounded-2xl bg-gradient-to-r from-emerald-400/20 via-transparent to-emerald-400/20" />
            </div>
          </motion.article>
        ))}
      </section>
    </main>
  );
}
