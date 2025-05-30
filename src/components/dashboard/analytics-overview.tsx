import { FilterType } from "@/types/dashboard";
import { CaseCharts } from "@/components/case-charts";

interface AnalyticsOverviewProps {
  chartsData: any[];
  primaryFilter: FilterType;
}

export function AnalyticsOverview({
  chartsData,
  primaryFilter,
}: AnalyticsOverviewProps) {
  return (
    <div className="mt-8">
      <h3 className="text-lg sm:text-xl font-bold mb-4">Analytics Overview</h3>
      <CaseCharts cases={chartsData} primaryFilter={primaryFilter} />
    </div>
  );
}
