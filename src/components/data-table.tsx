import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Column definition interface
export interface Column<T = any> {
  key: string;
  title: string;
  dataIndex?: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  fixed?: "left" | "right";
  className?: string;
  align?: "left" | "center" | "right";
  responsive?: {
    hidden?: "sm" | "md" | "lg" | "xl";
    visible?: "sm" | "md" | "lg" | "xl";
  };
}

// Action configuration for table header actions
export interface TableAction {
  label: string;
  onClick?: () => void;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

// Action configuration for row actions
export interface RowAction<T = any> {
  label: string;
  onClick?: (record: T) => void;
  href?: string | ((record: T) => string);
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean | ((record: T) => boolean);
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  show?: boolean | ((record: T) => boolean);
  external?: boolean;
}

// Table props interface
export interface DataTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  rowKey?: string | ((record: T) => string);
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onChange?: (page: number, pageSize: number) => void;
  };
  onSort?: (column: string, direction: "asc" | "desc" | null) => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  searchValue?: string;
  filterable?: boolean;
  onFilter?: (filters: Record<string, any>) => void;
  filters?: Record<string, any>;
  actions?: TableAction[];
  rowActions?: RowAction<T>[];
  selectable?: boolean;
  selectedRows?: (string | number)[];
  onRowSelect?: (selectedKeys: (string | number)[]) => void;
  title?: string;
  subtitle?: string;
  className?: string;
  size?: "sm" | "default" | "lg";
  striped?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
  sticky?: boolean;
  maxHeight?: string | number;
  emptyText?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  showHeader?: boolean;
  expandable?: {
    expandedRowRender: (record: T) => React.ReactNode;
    expandedRowKeys?: (string | number)[];
    onExpand?: (expanded: boolean, record: T) => void;
  };
}

// Sort direction type
type SortDirection = "asc" | "desc" | null;

// Helper functions for responsive classes
const getResponsiveClass = (responsive?: Column["responsive"]) => {
  if (!responsive) return "";

  const classes = [];
  if (responsive.hidden) {
    classes.push(`${responsive.hidden}:hidden`);
  }
  if (responsive.visible) {
    classes.push(`hidden ${responsive.visible}:table-cell`);
  }
  return classes.join(" ");
};

// Status badge component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "in_progress":
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "resolved":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "escalated":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "new":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "closed":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <Badge className={getStatusClass(status)}>
      {status.replace("_", " ").replace("-", " ")}
    </Badge>
  );
};

// Priority badge component
const PriorityBadge: React.FC<{ priority: "high" | "medium" | "low" }> = ({
  priority,
}) => {
  const getPriorityClass = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <Badge className={getPriorityClass(priority)}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  );
};

// Main DataTable component
export const DataTable = <T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  rowKey = "id",
  pagination,
  onSort,
  sortBy,
  sortOrder,
  searchable = false,
  searchPlaceholder = "Search...",
  onSearch,
  searchValue,
  filterable = false,
  actions = [],
  rowActions = [],
  selectable = false,
  selectedRows = [],
  onRowSelect,
  title,
  subtitle,
  className,
  size = "default",
  striped = false,
  bordered = true,
  hoverable = true,
  sticky = false,
  maxHeight,
  emptyText = "No data",
  emptyDescription = "No data available to display",
  emptyAction,
  showHeader = true,
  expandable,
}: DataTableProps<T>) => {
  const [localSearch, setLocalSearch] = React.useState(searchValue || "");
  const [expandedRows, setExpandedRows] = React.useState<Set<string | number>>(
    new Set(expandable?.expandedRowKeys || [])
  );

  // Internal sort state when no external handler is provided
  const [internalSortBy, setInternalSortBy] = React.useState<
    string | undefined
  >(sortBy);
  const [internalSortOrder, setInternalSortOrder] = React.useState<
    "asc" | "desc" | undefined
  >(sortOrder);

  // Use external sort state if available, otherwise use internal
  const currentSortBy = sortBy || internalSortBy;
  const currentSortOrder = sortOrder || internalSortOrder;

  // Get row key function
  const getRowKey = React.useCallback(
    (record: T, index: number): string => {
      if (typeof rowKey === "function") {
        return String(rowKey(record));
      }
      return String(record[rowKey] || index);
    },
    [rowKey]
  );
  // Handle sort
  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;

    let newDirection: SortDirection = "desc";
    if (currentSortBy === column.key) {
      newDirection =
        currentSortOrder === "desc"
          ? "asc"
          : currentSortOrder === "asc"
          ? null
          : "desc";
    }

    // Use external handler if provided, otherwise handle internally
    if (onSort) {
      onSort(column.key, newDirection);
    } else {
      setInternalSortBy(newDirection ? column.key : undefined);
      setInternalSortOrder(newDirection || undefined);
    }
  };
  // Handle search
  const handleSearch = React.useCallback(
    (value: string) => {
      setLocalSearch(value);
      onSearch?.(value);
    },
    [onSearch]
  );

  // Sort data internally if no external sort handler
  const sortedData = React.useMemo(() => {
    if (!currentSortBy || !currentSortOrder || onSort) {
      return data; // Use original data if no internal sorting or external sorting is handled
    }

    const sortedArray = [...data].sort((a, b) => {
      const column = columns.find((col) => col.key === currentSortBy);
      const aValue = column?.dataIndex ? a[column.dataIndex] : a[currentSortBy];
      const bValue = column?.dataIndex ? b[column.dataIndex] : b[currentSortBy];

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return currentSortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return currentSortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      // For dates and other types, convert to string and compare
      const aStr = String(aValue);
      const bStr = String(bValue);
      return currentSortOrder === "asc"
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });

    return sortedArray;
  }, [data, currentSortBy, currentSortOrder, columns, onSort]);

  // Handle row selection
  const handleRowSelect = (key: string | number, selected: boolean) => {
    if (!onRowSelect) return;

    const newSelected = selected
      ? [...selectedRows, key]
      : selectedRows.filter((k) => k !== key);

    onRowSelect(newSelected);
  };

  // Handle row expansion
  const handleRowExpand = (record: T) => {
    const key = getRowKey(record, 0);
    const newExpanded = new Set(expandedRows);

    if (expandedRows.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }

    setExpandedRows(newExpanded);
    expandable?.onExpand?.(newExpanded.has(key), record);
  };

  // Render cell content
  const renderCell = (column: Column<T>, record: T, index: number) => {
    const value = column.dataIndex
      ? record[column.dataIndex]
      : record[column.key];

    if (column.render) {
      return column.render(value, record, index);
    }

    // Auto-render common data types
    if (column.key === "status" && typeof value === "string") {
      return <StatusBadge status={value} />;
    }

    if (
      column.key === "priority" &&
      (value === "high" || value === "medium" || value === "low")
    ) {
      return <PriorityBadge priority={value} />;
    }

    return value;
  };
  // Render sort icon
  const renderSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;

    if (currentSortBy === column.key) {
      return currentSortOrder === "asc" ? (
        <ArrowUp className="h-4 w-4" />
      ) : currentSortOrder === "desc" ? (
        <ArrowDown className="h-4 w-4" />
      ) : (
        <ArrowUpDown className="h-4 w-4 opacity-50" />
      );
    }

    return <ArrowUpDown className="h-4 w-4 opacity-50" />;
  };

  // Size classes
  const sizeClasses = {
    sm: "text-xs",
    default: "text-sm",
    lg: "text-base",
  };

  const paddingClasses = {
    sm: "px-2 py-2",
    default: "px-2 sm:px-4 py-3",
    lg: "px-4 py-4",
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header with title and actions */}
      {(title ||
        subtitle ||
        searchable ||
        filterable ||
        actions.length > 0) && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && <h3 className="text-lg font-semibold">{title}</h3>}
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {/* Search */}
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  value={localSearch}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-9 w-full sm:w-64"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              {filterable && (
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              )}{" "}
              {actions.map((action, index) => {
                return (
                  <Button
                    key={index}
                    variant={action.variant || "outline"}
                    size="sm"
                    onClick={action.onClick}
                    disabled={action.disabled}
                    asChild={!!action.href}
                  >
                    {action.href ? (
                      <Link to={action.href}>
                        {action.icon && (
                          <action.icon className="h-4 w-4 mr-2" />
                        )}
                        {action.label}
                      </Link>
                    ) : (
                      <>
                        {action.icon && (
                          <action.icon className="h-4 w-4 mr-2" />
                        )}
                        {action.label}
                      </>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {/* Table */}
      <div
        className={cn(
          "rounded-lg border overflow-auto w-full",
          bordered && "border",
          !bordered && "border-0"
        )}
        style={{ maxHeight }}
      >
        <table className="w-full">
          {/* Header */}
          {showHeader && (
            <thead className={cn(sticky && "sticky top-0 z-10 bg-background")}>
              <tr className="border-b bg-muted/50">
                {selectable && (
                  <th
                    className={cn(
                      "text-left font-medium",
                      paddingClasses[size]
                    )}
                  >
                    {" "}
                    <input
                      type="checkbox"
                      checked={
                        selectedRows.length === sortedData.length &&
                        sortedData.length > 0
                      }
                      onChange={(e) => {
                        const allKeys = sortedData.map((record, index) =>
                          getRowKey(record, index)
                        );
                        onRowSelect?.(e.target.checked ? allKeys : []);
                      }}
                      className="rounded border-gray-300"
                    />
                  </th>
                )}

                {expandable && (
                  <th
                    className={cn(
                      "text-left font-medium",
                      paddingClasses[size]
                    )}
                  >
                    {/* Expand column header */}
                  </th>
                )}

                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      "text-left font-medium",
                      paddingClasses[size],
                      sizeClasses[size],
                      getResponsiveClass(column.responsive),
                      column.className,
                      column.sortable &&
                        "cursor-pointer select-none hover:bg-muted/70",
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right"
                    )}
                    style={{ width: column.width }}
                    onClick={() => handleSort(column)}
                  >
                    <div className="flex items-center gap-2">
                      {column.title}
                      {renderSortIcon(column)}
                    </div>
                  </th>
                ))}

                {rowActions.length > 0 && (
                  <th
                    className={cn(
                      "text-left font-medium",
                      paddingClasses[size]
                    )}
                  >
                    Actions
                  </th>
                )}
              </tr>
            </thead>
          )}

          {/* Body */}
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (selectable ? 1 : 0) +
                    (expandable ? 1 : 0) +
                    (rowActions.length > 0 ? 1 : 0)
                  }
                  className={cn("text-center", paddingClasses[size])}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </div>
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (selectable ? 1 : 0) +
                    (expandable ? 1 : 0) +
                    (rowActions.length > 0 ? 1 : 0)
                  }
                  className={cn("text-center", paddingClasses[size])}
                >
                  <div className="py-8 space-y-2">
                    <p className="font-medium">{emptyText}</p>
                    <p className="text-sm text-muted-foreground">
                      {emptyDescription}
                    </p>
                    {emptyAction}
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((record, index) => {
                const key = getRowKey(record, index);
                const isSelected = selectedRows.includes(key);
                const isExpanded = expandedRows.has(key);

                return (
                  <React.Fragment key={key}>
                    <tr
                      className={cn(
                        "border-b",
                        hoverable && "hover:bg-muted/50",
                        striped && index % 2 === 0 && "bg-muted/25",
                        isSelected && "bg-muted"
                      )}
                    >
                      {selectable && (
                        <td className={paddingClasses[size]}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) =>
                              handleRowSelect(key, e.target.checked)
                            }
                            className="rounded border-gray-300"
                          />
                        </td>
                      )}

                      {expandable && (
                        <td className={paddingClasses[size]}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRowExpand(record)}
                            className="h-8 w-8 p-0"
                          >
                            {isExpanded ? "−" : "+"}
                          </Button>
                        </td>
                      )}

                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className={cn(
                            paddingClasses[size],
                            sizeClasses[size],
                            getResponsiveClass(column.responsive),
                            column.className,
                            column.align === "center" && "text-center",
                            column.align === "right" && "text-right"
                          )}
                          style={{ width: column.width }}
                        >
                          {renderCell(column, record, index)}
                        </td>
                      ))}

                      {rowActions.length > 0 && (
                        <td className={paddingClasses[size]}>
                          <div className="flex items-center gap-1">
                            {rowActions.map((action, actionIndex) => {
                              const shouldShow =
                                typeof action.show === "function"
                                  ? action.show(record)
                                  : action.show !== false;

                              if (!shouldShow) return null;

                              const isDisabled =
                                typeof action.disabled === "function"
                                  ? action.disabled(record)
                                  : action.disabled;

                              const href =
                                typeof action.href === "function"
                                  ? action.href(record)
                                  : action.href;

                              if (actionIndex === 0 && action.icon) {
                                // First action as primary button
                                return href ? (
                                  <Link key={actionIndex} to={href}>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      disabled={isDisabled}
                                    >
                                      <action.icon className="h-4 w-4" />
                                      <span className="sr-only">
                                        {action.label}
                                      </span>
                                    </Button>
                                  </Link>
                                ) : (
                                  <Button
                                    key={actionIndex}
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => action.onClick?.(record)}
                                    disabled={isDisabled}
                                  >
                                    <action.icon className="h-4 w-4" />
                                    <span className="sr-only">
                                      {action.label}
                                    </span>
                                  </Button>
                                );
                              }

                              return null; // Additional actions will be in dropdown
                            })}

                            {rowActions.length > 1 && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">
                                      More options
                                    </span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  {rowActions
                                    .slice(1)
                                    .map((action, actionIndex) => {
                                      const shouldShow =
                                        typeof action.show === "function"
                                          ? action.show(record)
                                          : action.show !== false;

                                      if (!shouldShow) return null;

                                      const isDisabled =
                                        typeof action.disabled === "function"
                                          ? action.disabled(record)
                                          : action.disabled;

                                      const href =
                                        typeof action.href === "function"
                                          ? action.href(record)
                                          : action.href;

                                      return href ? (
                                        <DropdownMenuItem
                                          key={actionIndex}
                                          asChild
                                          disabled={isDisabled}
                                        >
                                          <Link to={href}>
                                            {action.icon && (
                                              <action.icon className="mr-2 h-4 w-4" />
                                            )}
                                            {action.label}
                                          </Link>
                                        </DropdownMenuItem>
                                      ) : (
                                        <DropdownMenuItem
                                          key={actionIndex}
                                          onClick={() =>
                                            action.onClick?.(record)
                                          }
                                          disabled={isDisabled}
                                        >
                                          {action.icon && (
                                            <action.icon className="mr-2 h-4 w-4" />
                                          )}
                                          {action.label}
                                        </DropdownMenuItem>
                                      );
                                    })}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>

                    {/* Expanded row */}
                    {expandable && isExpanded && (
                      <tr>
                        <td
                          colSpan={
                            columns.length +
                            (selectable ? 1 : 0) +
                            (expandable ? 1 : 0) +
                            (rowActions.length > 0 ? 1 : 0)
                          }
                          className={paddingClasses[size]}
                        >
                          {expandable.expandedRowRender(record)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>{" "}
      {/* Pagination */}
      {pagination && pagination.total > pagination.pageSize && (
        <div className="mt-8 mb-4">
          {/* Main pagination controls */}
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            <nav className="flex items-center gap-1 rounded-lg border bg-background/50 backdrop-blur-sm p-1 shadow-sm">
              {/* First page button */}
              <Button
                variant="ghost"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() => pagination.onChange?.(1, pagination.pageSize)}
                className="h-9 w-9 p-0 hover:bg-primary/10 disabled:opacity-50 transition-all duration-200"
                title="First page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>

              {/* Previous page button */}
              <Button
                variant="ghost"
                size="sm"
                disabled={pagination.page <= 1}
                onClick={() =>
                  pagination.onChange?.(
                    pagination.page - 1,
                    pagination.pageSize
                  )
                }
                className="h-9 px-3 hover:bg-primary/10 disabled:opacity-50 transition-all duration-200 font-medium"
                title="Previous page"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              {/* Page numbers */}
              <div className="flex items-center gap-1 mx-2">
                {(() => {
                  const pageNumbers = [];
                  const totalPages = Math.ceil(
                    pagination.total / pagination.pageSize
                  );
                  const current = pagination.page;

                  // Always show first page
                  if (current > 3) {
                    pageNumbers.push(
                      <Button
                        key={1}
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 p-0 hover:bg-primary/10 transition-colors"
                        onClick={() =>
                          pagination.onChange?.(1, pagination.pageSize)
                        }
                      >
                        1
                      </Button>
                    );

                    if (current > 4) {
                      pageNumbers.push(
                        <span
                          key="dots1"
                          className="px-2 text-muted-foreground"
                        >
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
                        onClick={() =>
                          pagination.onChange?.(i, pagination.pageSize)
                        }
                      >
                        {i}
                      </Button>
                    );
                  }

                  // Always show last page
                  if (current < totalPages - 2) {
                    if (current < totalPages - 3) {
                      pageNumbers.push(
                        <span
                          key="dots2"
                          className="px-2 text-muted-foreground"
                        >
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
                        onClick={() =>
                          pagination.onChange?.(totalPages, pagination.pageSize)
                        }
                      >
                        {totalPages}
                      </Button>
                    );
                  }

                  return pageNumbers;
                })()}
              </div>

              {/* Next page button */}
              <Button
                variant="ghost"
                size="sm"
                disabled={
                  pagination.page >=
                  Math.ceil(pagination.total / pagination.pageSize)
                }
                onClick={() =>
                  pagination.onChange?.(
                    pagination.page + 1,
                    pagination.pageSize
                  )
                }
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
                disabled={
                  pagination.page >=
                  Math.ceil(pagination.total / pagination.pageSize)
                }
                onClick={() =>
                  pagination.onChange?.(
                    Math.ceil(pagination.total / pagination.pageSize),
                    pagination.pageSize
                  )
                }
                className="h-9 w-9 p-0 hover:bg-primary/10 disabled:opacity-50 transition-all duration-200"
                title="Last page"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </nav>

            {/* Pagination info */}
            <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground sm:flex-row sm:gap-4">
              <div className="flex items-center gap-1">
                <span>Page</span>
                <span className="font-medium text-foreground">
                  {pagination.page}
                </span>
                <span>of</span>
                <span className="font-medium text-foreground">
                  {Math.ceil(pagination.total / pagination.pageSize)}
                </span>
              </div>
              <div className="hidden sm:block">•</div>
              <div className="flex items-center gap-1">
                <span className="font-medium text-foreground">
                  {pagination.total.toLocaleString()}
                </span>
                <span>total items</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Export helper components
export { StatusBadge, PriorityBadge };
