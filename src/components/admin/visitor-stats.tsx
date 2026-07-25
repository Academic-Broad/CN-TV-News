"use client";

import * as React from "react";
import { Users, Eye, TrendingUp, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DailyCount {
  date: string;
  visitors: number;
  pageviews: number;
}

interface VisitorStatsData {
  totalUniqueVisitors: number;
  totalPageviews: number;
  todayVisitors: number;
  todayPageviews: number;
  yesterdayVisitors: number;
  yesterdayPageviews: number;
  daily: DailyCount[];
  recent: { ipHash: string; path: string; timestamp: string; date: string }[];
}

function MiniBarChart({ data }: { data: DailyCount[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-20 text-xs text-muted-foreground">
        No data yet
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => d.visitors), 1);

  return (
    <div className="flex items-end gap-1 h-20">
      {data.map((day) => {
        const height = Math.max((day.visitors / maxVal) * 100, 2);
        const dateLabel = new Date(day.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" });
        return (
          <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-t bg-[#4169E1] transition-all"
              style={{ height: `${height}%` }}
              title={`${day.date}: ${day.visitors} visitors`}
            />
            <span className="text-[9px] text-muted-foreground hidden sm:block">{dateLabel}</span>
          </div>
        );
      })}
    </div>
  );
}

export function VisitorStats() {
  const [stats, setStats] = React.useState<VisitorStatsData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/visitor-stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Site Visitors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Loading visitor data...</div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  const todayVsYesterday = stats.yesterdayVisitors > 0
    ? Math.round(((stats.todayVisitors - stats.yesterdayVisitors) / stats.yesterdayVisitors) * 100)
    : stats.todayVisitors > 0 ? 100 : 0;

  const kpis = [
    {
      label: "Total Visitors",
      value: stats.totalUniqueVisitors.toLocaleString(),
      icon: Users,
      color: "text-[#4169E1]",
      bg: "bg-blue-50 dark:bg-blue-950",
    },
    {
      label: "Total Pageviews",
      value: stats.totalPageviews.toLocaleString(),
      icon: Eye,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950",
    },
    {
      label: "Today's Visitors",
      value: stats.todayVisitors.toLocaleString(),
      icon: TrendingUp,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950",
      subtitle: todayVsYesterday !== 0
        ? `${todayVsYesterday > 0 ? "+" : ""}${todayVsYesterday}% vs yesterday`
        : "No visits yesterday",
    },
    {
      label: "Today's Pageviews",
      value: stats.todayPageviews.toLocaleString(),
      icon: Calendar,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-950",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">Site Visitors</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="rounded-lg border p-3">
              <div className="flex items-center gap-2 mb-1">
                <div className={`${kpi.bg} rounded-md p-1.5`}>
                  <kpi.icon className={`h-3.5 w-3.5 ${kpi.color}`} />
                </div>
                <span className="text-xs text-muted-foreground">{kpi.label}</span>
              </div>
              <div className="text-2xl font-bold">{kpi.value}</div>
              {"subtitle" in kpi && kpi.subtitle && (
                <p className="text-[11px] text-muted-foreground mt-0.5">{kpi.subtitle}</p>
              )}
            </div>
          ))}
        </div>

        <div className="rounded-lg border p-4">
          <h4 className="text-xs font-medium text-muted-foreground mb-3">Visitors (Last 14 Days)</h4>
          <MiniBarChart data={stats.daily} />
        </div>

        {stats.recent.length > 0 && (
          <div className="rounded-lg border p-4">
            <h4 className="text-xs font-medium text-muted-foreground mb-3">Recent Visits</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {stats.recent.map((visit, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1 border-b last:border-0">
                  <span className="font-mono text-muted-foreground truncate max-w-[120px]">{visit.ipHash}</span>
                  <span className="truncate max-w-[200px] text-foreground">{visit.path}</span>
                  <span className="text-muted-foreground flex-shrink-0">
                    {new Date(visit.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
