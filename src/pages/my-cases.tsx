import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpDown, Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CaseList } from "@/components/case-list";
import { PaginationControls } from "@/components/pagination-controls";
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

export default function MyCasesPage() {
  const [primaryFilter, setPrimaryFilter] = useState<FilterType>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  // Get current user ID from local storage
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = parseInt(currentUser.id);

  // Use the API hook with proper filtering including assignedTo
  const { data: casesData, isLoading } = useCases({
    page: currentPage,
    pageSize,
    status: statusFilter === "ALL" ? undefined : (statusFilter as CaseStatus),
    search: searchQuery || undefined,
    assignedTo: currentUserId, // Filter by current user
  });

  if (isLoading) {
    return <CaseListSkeleton />;
  }

  const cases = casesData?.data || [];
  const listData = cases.map((case_: CaseSummary) => ({
    id: case_.id.toString(),
    entityId: case_.entityId.toString(),
    status: case_.status,
    priority: case_.priority.toLowerCase() as "high" | "medium" | "low",
    assignee: case_.assignedTo ? `User ${case_.assignedTo}` : "Unassigned",
    created: new Date(case_.createdAt).toLocaleString(),
    cardType: "DEBIT_CARD", // This would come from the API in a real app
  }));

  // Filter by card type (this would ideally be done by the API)
  const filteredList =
    primaryFilter === "ALL"
      ? listData
      : listData.filter((c) => c.cardType === primaryFilter);

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title="My Cases" />
      <main className="flex-1 p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>My Cases</BreadcrumbPage>
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
              My Cases ({casesData?.pagination?.totalItems || 0})
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
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
        <CaseList cases={filteredList} showAssignToMe={false} />
        {filteredList.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No cases found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || primaryFilter !== "ALL" || statusFilter !== "ALL"
                ? "Try adjusting your filters or search query."
                : "You don't have any cases assigned yet."}
            </p>
            <Link to="/cases/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New Case
              </Button>
            </Link>
          </div>
        )}{" "}
        {/* Pagination */}
        {filteredList.length > 0 &&
          casesData?.pagination &&
          casesData.pagination.totalPages > 1 && (
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
