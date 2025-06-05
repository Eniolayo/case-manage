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
import { PageHeader } from "@/components/page-header";
import { CaseListSkeleton } from "@/components/skeleton-loaders";
import { PaginationControls } from "@/components/pagination-controls";
import { useCases } from "@/hooks/use-api";
import type { CaseSummary, CaseStatus } from "@/lib/api-types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

type FilterType = "ALL" | "DEBIT_CARD" | "CREDIT_CARD" | "WALLET";
type StatusFilter = "ALL" | "NEW" | "IN_PROGRESS" | "RESOLVED" | "ESCALATED";

export default function AllCasesPage() {
  const [primaryFilter, setPrimaryFilter] = useState<FilterType>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  // API hook
  const {
    data: casesData,
    isLoading,
    error,
  } = useCases({
    page: currentPage,
    pageSize,
    status: statusFilter === "ALL" ? undefined : (statusFilter as CaseStatus),
    search: searchQuery || undefined,
  });

  const cases = casesData?.data || [];
  const totalPages = Math.ceil(
    (casesData?.pagination.totalItems || 0) / pageSize
  );

  // Convert API cases to format expected by CaseList component
  const convertCasesForList = () => {
    return cases.map((case_: CaseSummary) => ({
      id: case_.id.toString(),
      entityId: case_.entityId.toString(),
      status: case_.status,
      priority: case_.priority.toLowerCase() as "high" | "medium" | "low",
      assignee: case_.assignedTo ? `User ${case_.assignedTo}` : "Unassigned",
      created: new Date(case_.createdAt).toLocaleString(),
      cardType: "DEBIT_CARD", // Default since not available in summary
    }));
  };

  const listData = convertCasesForList();
  if (isLoading) {
    return <CaseListSkeleton />;
  }
  if (error) {
    return (
      <div className="flex min-h-screen flex-col">
        <PageHeader title="All Cases" />
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

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title="All Cases" />
      <main className="flex-1 p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/cases">All Cases</BreadcrumbLink>
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
                </SelectTrigger>{" "}
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="NEW">New</SelectItem>
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
        </div>{" "}
        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {" "}
            <h3 className="text-lg font-medium">
              Cases ({casesData?.pagination.totalItems || 0})
            </h3>
            {(primaryFilter !== "ALL" ||
              statusFilter !== "ALL" ||
              searchQuery) && (
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
        <CaseList cases={listData} /> {/* Pagination */}
        {casesData?.pagination && casesData.pagination.totalPages > 1 && (
          <PaginationControls
            pagination={casesData.pagination}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
      </main>
    </div>
  );
}
