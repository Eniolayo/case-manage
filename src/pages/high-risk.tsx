import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CaseList } from "@/components/case-list";
import { useCases } from "@/hooks/use-api";
import { CaseStatus, CaseSummary } from "@/lib/api-types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { PageHeader } from "@/components/page-header";
import { CaseListSkeleton } from "@/components/skeleton-loaders";

type FilterType = "ALL" | "DEBIT_CARD" | "CREDIT_CARD" | "WALLET";
type StatusFilter = "ALL" | "IN_PROGRESS" | "RESOLVED" | "ESCALATED";

export default function HighRiskPage() {
  const [primaryFilter, setPrimaryFilter] = useState<FilterType>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Use the API hook with proper filtering for high priority cases
  const {
    data: casesData,
    isLoading,
    error,
  } = useCases({
    page: currentPage,
    pageSize,
    status: statusFilter === "ALL" ? undefined : (statusFilter as CaseStatus),
    search: searchQuery || undefined,
    priority: "High", // Always filter for high priority cases
    sortBy: "createdAt", // Sort by creation date by default
    sortOrder: "desc", // Show newest first
  });

  if (isLoading) {
    return <CaseListSkeleton />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <PageHeader title="High Risk Cases" />
        <main className="flex-1 p-6">
          <div className="text-center py-8">
            <p className="text-red-500">
              Error loading cases: {error?.message || "Unknown error"}
            </p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const cases = casesData?.data || [];
  // Convert API cases to the format expected by CaseList
  const listData = cases.map((case_) => ({
    id: case_.id.toString(),
    entityId: case_.entityId.toString(),
    status: case_.status,
    priority: case_.priority.toLowerCase() as "high" | "medium" | "low",
    assignee: case_.assignedTo ? `User ${case_.assignedTo}` : "Unassigned",
    created: new Date(case_.createdAt).toLocaleString(),
    cardType: "DEBIT_CARD", // Default since not available in CaseSummary
  }));

  // Apply card type filter if selected
  const filteredCases =
    primaryFilter === "ALL"
      ? listData
      : listData.filter((c) => c.cardType === primaryFilter);

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title="High Risk Cases" />
      <main className="flex-1 p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>High Risk Cases</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Type:</label>
              <Select
                value={primaryFilter}
                onValueChange={(value: FilterType) => setPrimaryFilter(value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="DEBIT_CARD">Debit Card</SelectItem>
                  <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                  <SelectItem value="WALLET">Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Status:</label>
              <Select
                value={statusFilter}
                onValueChange={(value: StatusFilter) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="ESCALATED">Escalated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <ArrowUpDown className="h-4 w-4" />
                <span>Sort</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">
              High Risk Cases ({casesData?.pagination.totalItems || 0})
            </h3>
            {(primaryFilter !== "ALL" || statusFilter !== "ALL") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setPrimaryFilter("ALL");
                  setStatusFilter("ALL");
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        <CaseList cases={filteredCases} />

        {/* Pagination */}
        {casesData?.pagination?.totalPages &&
          casesData.pagination.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * pageSize + 1} to{" "}
                {Math.min(
                  currentPage * pageSize,
                  casesData?.pagination.totalItems
                )}{" "}
                of {casesData?.pagination.totalItems} cases
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  disabled
                >
                  {currentPage}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === casesData?.pagination.totalPages}
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(casesData?.pagination.totalPages || 1, prev + 1)
                    )
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}
      </main>
    </div>
  );
}
