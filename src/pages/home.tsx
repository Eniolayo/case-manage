import { useState, useCallback } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { AlertControls } from "@/components/alert-controls";
import { AnalyticsOverview } from "@/components/dashboard/analytics-overview";
import { DashboardCaseList } from "@/components/dashboard/case-list";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { Filters } from "@/components/dashboard/filters";
import { useDashboardData } from "@/hooks/use-dashboard-data";

export default function Home() {
  const [showAlert, setShowAlert] = useState(false);
  const {
    stats,
    chartsData,
    listData,
    pagination,
    isLoading: casesLoading,
    error: casesError,
    filters: { primaryFilter, statusFilter, currentPage },
    actions: {
      handleCardClick,
      handlePrimaryFilterChange,
      handlePriorityChange,
      handleSortChange,
      handlePageChange,
      sortBy,
      sortOrder,
    },
  } = useDashboardData();

  // Alert handlers
  const handleShowAlert = useCallback(() => setShowAlert(true), []);
  const handleCloseAlert = useCallback(() => setShowAlert(false), []);
  const handleViewAlert = useCallback(() => {
    setShowAlert(false);
    console.log("View case details");
  }, []);
  console.log(listData, "listData");

  return (
    <div className="flex flex-col">
      <PageHeader title="Dashboard" />
      {casesError ? (
        <main className="flex-1 p-4 sm:p-6">
          <div className="text-center py-8">
            <p className="text-red-500">
              Error loading cases: {casesError?.message}
            </p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </div>
        </main>
      ) : (
        <main className="flex-1 p-4 sm:p-6">
          <div className="mb-8">
            <Filters
              primaryFilter={primaryFilter}
              onPrimaryFilterChange={handlePrimaryFilterChange}
              onPriorityChange={handlePriorityChange}
              onSortChange={handleSortChange}
              sortBy={sortBy}
              sortOrder={sortOrder}
            />

            <section className="mt-6">
              <StatsCards
                stats={stats}
                statusFilter={statusFilter}
                onCardClick={handleCardClick}
              />

              <AnalyticsOverview
                chartsData={chartsData}
                primaryFilter={primaryFilter}
              />

              <DashboardCaseList
                listData={listData}
                loading={casesLoading}
                statusFilter={statusFilter}
                primaryFilter={primaryFilter}
                pagination={pagination}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            </section>
          </div>
        </main>
      )}

      <AlertControls
        showAlert={showAlert}
        onShowAlert={handleShowAlert}
        onCloseAlert={handleCloseAlert}
        onViewAlert={handleViewAlert}
      />
    </div>
  );
}
