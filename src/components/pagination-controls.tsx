import { Pagination } from "@/lib/api-types";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationControlsProps = {
  pagination: Pagination | undefined;
  currentPage: number;
  onPageChange: (page: number) => void;
};

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
        <button
          key={1}
          className="h-7 w-7 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-all"
          onClick={() => onPageChange(1)}
        >
          1
        </button>
      );

      if (current > 4) {
        pageNumbers.push(
          <span key="dots1" className="px-1 text-muted-foreground/50 text-xs">
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
        <button
          key={i}
          className={`h-7 w-7 text-xs font-medium rounded-full transition-all ${
            current === i
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }

    // Always show last page
    if (current < totalPages - 2) {
      if (current < totalPages - 3) {
        pageNumbers.push(
          <span key="dots2" className="px-1 text-muted-foreground/50 text-xs">
            ⋯
          </span>
        );
      }

      pageNumbers.push(
        <button
          key={totalPages}
          className="h-7 w-7 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-all"
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };
  return (
    <div className="flex flex-col items-center gap-3 mt-4">
      {/* Minimal navigation controls */}
      <div className="flex items-center gap-2">
        {/* Previous button */}
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-all hover:bg-muted/50 rounded-full"
          title="Previous page"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-1">{renderPageNumbers()}</div>

        {/* Next button */}
        <button
          disabled={!pagination || currentPage >= pagination.totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-all hover:bg-muted/50 rounded-full"
          title="Next page"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Subtle info line */}
      <div className="text-xs text-muted-foreground/70 flex items-center gap-2">
        <span>{pagination.totalItems.toLocaleString()} items</span>
        <span className="w-1 h-1 bg-muted-foreground/30 rounded-full"></span>
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
      </div>
    </div>
  );
}
