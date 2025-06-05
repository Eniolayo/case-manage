import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DashboardListData, FilterType, StatusFilter } from "@/types/dashboard";
import { PaginationControls } from "@/components/pagination-controls";
import { CaseList } from "../case-list";

interface DashboardCaseListProps {
  listData: DashboardListData[];
  loading: boolean;
  statusFilter: StatusFilter;
  primaryFilter: FilterType;
  pagination: {
    totalPages: number;
    itemsPerPage: number;
    page: number;
    pageSize: number;
    totalItems: number;
  };
  currentPage: number;
  onPageChange: (page: number) => void;
}

function getFilterTitle(filter: StatusFilter) {
  switch (filter) {
    case "HIGH_PRIORITY":
      return "High Priority Cases";
    case "NEW":
      return "New Cases";
    case "IN_PROGRESS":
      return "In Progress Cases";
    case "ESCALATED":
      return "Escalated Cases";
    case "RESOLVED":
      return "Resolved Cases";
    default:
      return "Recent Cases";
  }
}

export function DashboardCaseList({
  listData,
  statusFilter,
  primaryFilter,
  pagination,
  onPageChange,
}: DashboardCaseListProps) {
  return (
    <div className="mt-8">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg sm:text-xl font-bold">
          {statusFilter !== "all"
            ? getFilterTitle(statusFilter)
            : "Recent Cases"}
          {primaryFilter !== "ALL" && ` - ${primaryFilter.replace("_", " ")}`}
        </h3>
        <Link to="/cases">
          <Button variant="link" size="sm">
            View All Cases
          </Button>
        </Link>
      </div>
      <CaseList cases={listData} />
      <PaginationControls
        pagination={{
          page: pagination.page,
          pageSize: pagination.pageSize,
          totalItems: pagination.totalItems,
          totalPages: pagination.totalPages,
        }}
        currentPage={pagination.page}
        onPageChange={onPageChange}
      />
    </div>
  );
}
