import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { DashboardStats, StatusFilter } from "@/types/dashboard";

interface StatsCardsProps {
  stats: DashboardStats;
  statusFilter: StatusFilter;
  onCardClick: (status: StatusFilter) => void;
}

export function StatsCards({
  stats,
  statusFilter,
  onCardClick,
}: StatsCardsProps) {
  const statsConfig = [
    {
      label: "High Priority",
      value: stats.highPriority,
      status: "HIGH_PRIORITY" as const,
      growth: "+8%",
      color: "purple",
    },
    {
      label: "New Cases",
      value: stats.new,
      status: "NEW" as const,
      growth: "+12%",
      color: "blue",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      status: "IN_PROGRESS" as const,
      growth: "+5%",
      color: "yellow",
    },
    {
      label: "Escalated",
      value: stats.escalated,
      status: "ESCALATED" as const,
      growth: "+2%",
      color: "red",
    },
    {
      label: "Resolved",
      value: stats.resolved,
      status: "RESOLVED" as const,
      growth: "+18%",
      color: "green",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 auto-rows-auto md:grid-cols-3 lg:grid-cols-5">
      {statsConfig.map((stat) => (
        <Card
          key={stat.status}
          className={`cursor-pointer transition-colors hover:bg-muted/50 ${
            statusFilter === stat.status
              ? `ring-2 ring-${stat.color}-500 bg-${stat.color}-50`
              : ""
          }`}
          onClick={(e) => {
            e.preventDefault();
            onCardClick(stat.status);
          }}
        >
          <CardContent className="p-4">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{stat.value}</p>
                <Badge
                  variant="outline"
                  className={`text-xs flex items-center gap-1 bg-${stat.color}-100 border-none text-${stat.color}-800`}
                >
                  <TrendingUp className="h-3 w-3" />
                  <span>{stat.growth}</span>
                  <span className="inline-flex items-center ml-0.5 text-muted-foreground">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span className="ml-0.5">24h</span>
                  </span>
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
