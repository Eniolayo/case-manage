import { useState, useCallback } from "react";
import { PageHeader } from "@/components/page-header";
import { AlertControls } from "@/components/alert-controls";
import { AnalyticsOverview } from "@/components/dashboard/analytics-overview";
import { DashboardCaseList } from "@/components/dashboard/case-list";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { Filters } from "@/components/dashboard/filters";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import {
  StatsCardsSkeleton,
  FiltersSkeleton,
  AnalyticsOverviewSkeleton,
  DashboardCaseListSkeleton,
  ErrorDisplay,
} from "@/components/skeletons";

export default function Home() {
  const [showAlert, setShowAlert] = useState(false);
  const {
    stats,
    chartsData,
    listData,
    pagination,
    loading,
    errors,
    filters: { primaryFilter, statusFilter, currentPage },
    actions: {
      handleCardClick,
      handlePrimaryFilterChange,
      handlePriorityChange,
      handleSortChange,
      handlePageChange,
      sortBy,
      sortOrder,
      retryStats,
      retryCharts,
      retryCases,
    },
  } = useDashboardData();

  // Alert handlers
  const handleShowAlert = useCallback(() => setShowAlert(true), []);
  const handleCloseAlert = useCallback(() => setShowAlert(false), []);
  const handleViewAlert = useCallback(() => {
    setShowAlert(false);
    console.log("View case details");
  }, []);
  return (
    <div className="flex flex-col">
      <PageHeader title="Dashboard" />
      <main className="flex-1 p-4 sm:p-6">
        <div className="mb-8">
          {/* Filters Section */}
          {loading.filters ? (
            <FiltersSkeleton />
          ) : errors.filters ? (
            <ErrorDisplay error={errors.filters} />
          ) : (
            <Filters
              primaryFilter={primaryFilter}
              onPrimaryFilterChange={handlePrimaryFilterChange}
              onPriorityChange={handlePriorityChange}
              onSortChange={handleSortChange}
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          )}

          <section className="mt-6">
            {/* Stats Cards Section */}
            {loading.stats ? (
              <StatsCardsSkeleton />
            ) : errors.stats ? (
              <ErrorDisplay error={errors.stats} onRetry={retryStats} />
            ) : (
              <StatsCards
                stats={stats}
                statusFilter={statusFilter}
                onCardClick={handleCardClick}
              />
            )}

            {/* Analytics Overview Section */}
            {loading.charts ? (
              <AnalyticsOverviewSkeleton />
            ) : errors.charts ? (
              <ErrorDisplay error={errors.charts} onRetry={retryCharts} />
            ) : (
              <AnalyticsOverview
                chartsData={chartsData}
                primaryFilter={primaryFilter}
              />
            )}

            {/* Dashboard Case List Section */}
            {loading.cases ? (
              <DashboardCaseListSkeleton />
            ) : errors.cases ? (
              <ErrorDisplay error={errors.cases} onRetry={retryCases} />
            ) : (
              <DashboardCaseList
                listData={listData}
                loading={false}
                statusFilter={statusFilter}
                primaryFilter={primaryFilter}
                pagination={pagination}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            )}
          </section>
        </div>
      </main>

      <AlertControls
        showAlert={showAlert}
        onShowAlert={handleShowAlert}
        onCloseAlert={handleCloseAlert}
        onViewAlert={handleViewAlert}
      />
    </div>
  );
}
