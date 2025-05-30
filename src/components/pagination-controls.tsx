import { Button } from "@/components/ui/button";
import { Pagination } from "@/lib/api-types";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationControlsProps {
  pagination: Pagination | undefined;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  pagination,
  currentPage,
  onPageChange,
}: PaginationControlsProps) {
  if (!pagination) return null;

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const totalPages = pagination.totalPages;
    const current = currentPage;

    // Always show first page
    if (current > 3) {
      pageNumbers.push(
        <Button
          key={1}
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0 hover:bg-primary/10 transition-colors"
          onClick={() => onPageChange(1)}
        >
          1
        </Button>
      );

      if (current > 4) {
        pageNumbers.push(
          <span key="dots1" className="px-2 text-muted-foreground">
            ⋯
          </span>
        );
      }
    }

    // Show pages around current page
    const startPage = Math.max(1, current - 1);
    const endPage = Math.min(totalPages, current + 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          variant={current === i ? "default" : "outline"}
          size="sm"
          className={`h-9 w-9 p-0 transition-all duration-200 ${
            current === i
              ? "bg-primary text-primary-foreground shadow-md scale-105"
              : "hover:bg-primary/10 hover:scale-105"
          }`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </Button>
      );
    }

    // Always show last page
    if (current < totalPages - 2) {
      if (current < totalPages - 3) {
        pageNumbers.push(
          <span key="dots2" className="px-2 text-muted-foreground">
            ⋯
          </span>
        );
      }

      pageNumbers.push(
        <Button
          key={totalPages}
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0 hover:bg-primary/10 transition-colors"
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="mt-8 mb-4">
      {/* Main pagination controls */}
      <div className="flex flex-col items-center gap-4 sm:gap-6">
        <nav className="flex items-center gap-1 rounded-lg border bg-background/50 backdrop-blur-sm p-1 shadow-sm">
          {/* First page button */}
          <Button
            variant="ghost"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(1)}
            className="h-9 w-9 p-0 hover:bg-primary/10 disabled:opacity-50 transition-all duration-200"
            title="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          {/* Previous page button */}
          <Button
            variant="ghost"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="h-9 px-3 hover:bg-primary/10 disabled:opacity-50 transition-all duration-200 font-medium"
            title="Previous page"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          {/* Page numbers */}
          <div className="flex items-center gap-1 mx-2">
            {renderPageNumbers()}
          </div>

          {/* Next page button */}
          <Button
            variant="ghost"
            size="sm"
            disabled={!pagination || currentPage >= pagination.totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="h-9 px-3 hover:bg-primary/10 disabled:opacity-50 transition-all duration-200 font-medium"
            title="Next page"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>

          {/* Last page button */}
          <Button
            variant="ghost"
            size="sm"
            disabled={!pagination || currentPage >= pagination.totalPages}
            onClick={() => onPageChange(pagination.totalPages)}
            className="h-9 w-9 p-0 hover:bg-primary/10 disabled:opacity-50 transition-all duration-200"
            title="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </nav>

        {/* Pagination info */}
        <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground sm:flex-row sm:gap-4">
          <div className="flex items-center gap-1">
            <span className="font-medium text-foreground">
              Page {pagination.page}
            </span>
            <span>of</span>
            <span className="font-medium text-foreground">
              {pagination.totalPages}
            </span>
          </div>
          <div className="hidden sm:block">•</div>
          <div className="flex items-center gap-1">
            <span className="font-medium text-foreground">
              {pagination.totalItems.toLocaleString()}
            </span>
            <span>total items</span>
          </div>
        </div>
      </div>
    </div>
  );
}
