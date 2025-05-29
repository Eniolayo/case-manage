import { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Filter, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CaseList } from "@/components/case-list";
import { PageHeader } from "@/components/page-header";
import { CaseCharts } from "@/components/case-charts";
import { AlertToast } from "@/components/alert-toast";
import { CaseListSkeleton } from "@/components/skeleton-loaders";
import { useCases } from "@/hooks/use-api";
import { CaseSummary, CaseStatus, CasePriority } from "@/lib/api-types";

import { Calendar, TrendingUp, Minus, TrendingDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type FilterType = "ALL" | "DEBIT_CARD" | "CREDIT_CARD" | "WALLET";
type StatusFilter =
  | "all"
  | "HIGH_PRIORITY"
  | "NEW"
  | "IN_PROGRESS"
  | "ESCALATED"
  | "RESOLVED";

export default function Home() {
  const [primaryFilter, setPrimaryFilter] = useState<FilterType>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<CasePriority | "all">(
    "all"
  );
  const [sortBy, setSortBy] = useState<"created" | "priority" | "status">(
    "created"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  // API hooks with proper filtering
  const {
    data: casesData,
    isLoading: casesLoading,
    error: casesError,
  } = useCases({
    page: currentPage,
    pageSize: 20,
    status:
      statusFilter === "all" || statusFilter === "HIGH_PRIORITY"
        ? undefined
        : (statusFilter as CaseStatus),
    priority: priorityFilter === "all" ? undefined : priorityFilter,
  });

  // Separate API call to get ALL cases for stats calculation (without pagination)
  const { data: allCasesData, error: allCasesError } = useCases({
    page: 1,
    pageSize: 1000, // Large page size to get all cases for stats
  });

  const cases = casesData?.data || [];
  const allCases = allCasesData?.data || [];
  const pagination = casesData?.pagination;

  // Memoize filtered cases to avoid recalculation on every render
  const filteredCases = useMemo(() => {
    let filtered = [...cases];

    // Filter by primary filter (card type)
    if (primaryFilter !== "ALL") {
      // Since the API doesn't support card type filtering, we'll simulate it
      // In a real app, this would be handled by the API
      filtered = filtered.filter((_, index) => {
        // Simulate card type filtering based on index for demo
        const mockCardTypes: FilterType[] = [
          "DEBIT_CARD",
          "CREDIT_CARD",
          "WALLET",
        ];
        const mockType = mockCardTypes[index % 3];
        return mockType === primaryFilter;
      });
    }

    // Filter for high priority when status filter is "HIGH_PRIORITY"
    if (statusFilter === "HIGH_PRIORITY") {
      filtered = filtered.filter((c) => c.priority === "High");
    }

    return filtered;
  }, [cases, primaryFilter, statusFilter]);
  // Memoize sorted cases to avoid recalculation on every render
  const filteredAndSortedCases = useMemo(() => {
    return [...filteredCases].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "created":
          comparison = a.createdAt - b.createdAt;
          break;
        case "priority":
          const priorityOrder = { High: 3, Medium: 2, Low: 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = a.createdAt - b.createdAt; // Default to created date sorting
      }

      return sortOrder === "desc" ? -comparison : comparison;
    });
  }, [filteredCases, sortBy, sortOrder]); // Memoize stats calculation based on ALL cases data to avoid recalculation on every render
  const stats = useMemo(() => {
    const statsData = allCases; // Use all cases data instead of filtered/paginated data

    // For demo purposes, let's consider cases created within the last 24 hours as "new"
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

    const newCases = statsData.filter((c: CaseSummary) => {
      return c.createdAt >= oneDayAgo;
    });

    return {
      total: statsData.length,
      new: newCases.length,
      highPriority: statsData.filter((c: CaseSummary) => c.priority === "High")
        .length,
      inProgress: statsData.filter(
        (c: CaseSummary) => c.status === "IN_PROGRESS"
      ).length,
      resolved: statsData.filter((c: CaseSummary) => c.status === "RESOLVED")
        .length,
      escalated: statsData.filter((c: CaseSummary) => c.status === "ESCALATED")
        .length,
    };
  }, [allCases]);
  // Memoize chart data conversion based on ALL cases data to avoid recalculation on every render
  const chartsData = useMemo(() => {
    return allCases.map((case_) => ({
      id: case_.id.toString(),
      entityId: case_.entityId.toString(),
      status:
        case_.status === "IN_PROGRESS"
          ? ("In Progress" as const)
          : case_.status === "RESOLVED"
          ? ("Resolved" as const)
          : case_.status === "ESCALATED"
          ? ("Escalated" as const)
          : ("In Progress" as const),
      score: 500, // Default score since not available in CaseSummary
      assignee: case_.assignedTo ? `User ${case_.assignedTo}` : "Unassigned",
      created: new Date(case_.createdAt).toISOString().split("T")[0], // Convert to YYYY-MM-DD format for charts
      cardType: "ALL" as FilterType, // Default since not available in CaseSummary
      priority: case_.priority.toLowerCase() as "high" | "medium" | "low",
    }));
  }, [allCases]);

  // Memoize list data conversion to avoid recalculation on every render
  const listData = useMemo(() => {
    return filteredAndSortedCases.map((case_) => ({
      id: case_.id.toString(),
      entityId: case_.entityId.toString(),
      status: case_.status,
      priority: case_.priority.toLowerCase() as "high" | "medium" | "low",
      assignee: case_.assignedTo ? `User ${case_.assignedTo}` : "Unassigned",
      created: new Date(case_.createdAt).toLocaleString(),
      cardType: "ALL", // Default since not available in CaseSummary
    }));
  }, [filteredAndSortedCases]);

  // Memoize filter title getter
  const getFilterTitle = useCallback((filter: StatusFilter) => {
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
  }, []);

  // Optimize event handlers with useCallback
  const handleCardClick = useCallback((status: StatusFilter) => {
    setStatusFilter((current) => (current === status ? "all" : status));
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  const handlePrimaryFilterChange = useCallback((value: FilterType) => {
    setPrimaryFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  const handlePriorityChange = useCallback((priority: string) => {
    setPriorityFilter(priority as CasePriority | "all");
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  const handleSortChange = useCallback(
    (newSortBy: string) => {
      if (newSortBy === sortBy) {
        // If clicking the same sort field, toggle order
        setSortOrder((current) => (current === "asc" ? "desc" : "asc"));
      } else {
        // If clicking a different sort field, set new field with desc order
        setSortBy(newSortBy as "created" | "priority" | "status");
        setSortOrder("desc");
      }
    },
    [sortBy]
  );
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Optimize alert handlers with useCallback
  const handleShowAlert = useCallback(() => {
    setShowAlert(true);
  }, []);

  const handleCloseAlert = useCallback(() => {
    setShowAlert(false);
  }, []);

  const handleViewAlert = useCallback(() => {
    setShowAlert(false);
    // In a real app, you'd navigate to the case detail page
    console.log("View case details");
  }, []);
  return (
    <div className="flex  flex-col">
      <PageHeader title="Dashboard" />{" "}
      {allCasesError ? (
        <main className="flex-1 p-4 sm:p-6">
          <div className="text-center py-8">
            <p className="text-red-500">
              Error loading cases: {allCasesError?.message}
            </p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </div>
        </main>
      ) : (
        <main className="flex-1 p-4 sm:p-6">
          <div className="mb-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
                <label className="text-sm font-medium">Filter by Type:</label>
                <div className="flex items-center gap-4">
                  {" "}
                  <Select
                    value={primaryFilter}
                    onValueChange={handlePrimaryFilterChange}
                  >
                    <SelectTrigger className="w-full sm:w-48">
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
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Filter className="h-4 w-4" />
                      <span className="hidden sm:inline">Filter</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="text-xs text-muted-foreground">
                        Date Range
                      </DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Calendar className="mr-2 h-4 w-4" />
                        Last 7 days
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="mr-2 h-4 w-4" />
                        Last 30 days (Default)
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />{" "}
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="text-xs text-muted-foreground">
                        Case Priority
                      </DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => handlePriorityChange("all")}
                      >
                        <TrendingUp className="mr-2 h-4 w-4" />
                        All Priorities
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handlePriorityChange("High")}
                      >
                        <TrendingUp className="mr-2 h-4 w-4" />
                        High
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handlePriorityChange("Medium")}
                      >
                        <Minus className="mr-2 h-4 w-4" />
                        Medium
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handlePriorityChange("Low")}
                      >
                        <TrendingDown className="mr-2 h-4 w-4" />
                        Low
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>{" "}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <ArrowUpDown className="h-4 w-4" />
                      <span className="hidden sm:inline">Sort</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => handleSortChange("created")}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Created Date{" "}
                        {sortBy === "created" &&
                          (sortOrder === "desc" ? "↓" : "↑")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSortChange("priority")}
                      >
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Priority{" "}
                        {sortBy === "priority" &&
                          (sortOrder === "desc" ? "↓" : "↑")}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSortChange("status")}
                      >
                        <Badge className="mr-2 h-4 w-4" />
                        Status{" "}
                        {sortBy === "status" &&
                          (sortOrder === "desc" ? "↓" : "↑")}
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <section className="mt-6">
              <div className="grid gap-4  grid-cols-1 auto-rows-auto md:grid-cols-3 lg:grid-cols-5">
                {" "}
                <Card
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    statusFilter === "HIGH_PRIORITY"
                      ? "ring-2 ring-purple-500 bg-purple-50"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCardClick("HIGH_PRIORITY");
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-muted-foreground">
                        High Priority
                      </p>{" "}
                      <div className="flex items-center justify-between">
                        {" "}
                        <p className="text-2xl font-bold">
                          {stats.highPriority}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-xs flex items-center gap-1 bg-purple-100 border-none text-purple-800"
                        >
                          <TrendingUp className="h-3 w-3" />
                          <span>+8%</span>
                          <span className="inline-flex items-center ml-0.5 text-muted-foreground">
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            <span className="ml-0.5">24h</span>
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>{" "}
                <Card
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    statusFilter === "NEW"
                      ? "ring-2 ring-blue-500 bg-blue-50"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCardClick("NEW");
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-muted-foreground">New Cases</p>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold">{stats.new}</p>

                        <Badge
                          variant="outline"
                          className="text-xs flex items-center gap-1 bg-blue-100 border-none text-blue-800"
                        >
                          <TrendingUp className="h-3 w-3" />
                          <span>+12%</span>
                          <span className="inline-flex items-center ml-0.5 text-muted-foreground">
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            <span className="ml-0.5">24h</span>
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>{" "}
                <Card
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    statusFilter === "IN_PROGRESS"
                      ? "ring-2 ring-yellow-500 bg-yellow-50"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCardClick("IN_PROGRESS");
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-muted-foreground">
                        In Progress
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold">{stats.inProgress}</p>
                        <Badge
                          variant="outline"
                          className="text-xs flex items-center gap-1 bg-yellow-100 border-none text-yellow-800"
                        >
                          <TrendingUp className="h-3 w-3" />
                          <span>+5%</span>
                          <span className="inline-flex items-center ml-0.5 text-muted-foreground">
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            <span className="ml-0.5">24h</span>
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>{" "}
                <Card
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    statusFilter === "ESCALATED"
                      ? "ring-2 ring-red-500 bg-red-50"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCardClick("ESCALATED");
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-muted-foreground">Escalated</p>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold">{stats.escalated}</p>
                        <Badge
                          variant="outline"
                          className="text-xs flex items-center gap-1 bg-red-100 border-none text-red-800"
                        >
                          <TrendingUp className="h-3 w-3" />
                          <span>+2%</span>
                          <span className="inline-flex items-center ml-0.5 text-muted-foreground">
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            <span className="ml-0.5">24h</span>
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>{" "}
                <Card
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    statusFilter === "RESOLVED"
                      ? "ring-2 ring-green-500 bg-green-50"
                      : ""
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCardClick("RESOLVED");
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-2">
                      <p className="text-sm text-muted-foreground">Resolved</p>
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold">{stats.resolved}</p>
                        <Badge
                          variant="outline"
                          className="text-xs flex items-center gap-1 bg-green-100 border-none text-green-800"
                        >
                          <TrendingUp className="h-3 w-3" />
                          <span>+18%</span>
                          <span className="inline-flex items-center ml-0.5 text-muted-foreground">
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            <span className="ml-0.5">24h</span>
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>{" "}
              </div>

              {/* Charts Section */}
              <div className="mt-8">
                <h3 className="text-lg sm:text-xl font-bold mb-4">
                  Analytics Overview
                </h3>
                <CaseCharts cases={chartsData} primaryFilter={primaryFilter} />
              </div>

              <div className="mt-8">
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  {" "}
                  <h3 className="text-lg sm:text-xl font-bold">
                    {statusFilter !== "all"
                      ? getFilterTitle(statusFilter)
                      : "Recent Cases"}
                    {primaryFilter !== "ALL" &&
                      ` - ${primaryFilter.replace("_", " ")}`}
                  </h3>{" "}
                  <Link to="/cases">
                    <Button variant="link" size="sm">
                      View All Cases
                    </Button>
                  </Link>
                </div>
                {casesLoading ? (
                  <CaseListSkeleton />
                ) : casesError ? (
                  <div className="text-center py-8">
                    <p className="text-red-500">
                      Error loading cases: {casesError?.message}
                    </p>
                    <Button
                      onClick={() => window.location.reload()}
                      className="mt-4"
                    >
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <CaseList cases={listData} />
                )}
                <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage <= 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </Button>
                    {pagination && (
                      <>
                        {Array.from(
                          { length: Math.min(pagination.totalPages, 5) },
                          (_, i) => {
                            const startPage = Math.max(1, currentPage - 2);
                            const pageNum = startPage + i;
                            if (pageNum > pagination.totalPages) return null;
                            return (
                              <Button
                                key={pageNum}
                                variant={
                                  currentPage === pageNum
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handlePageChange(pageNum)}
                              >
                                {pageNum}
                              </Button>
                            );
                          }
                        )}
                        {pagination.totalPages > currentPage + 2 && (
                          <span className="text-sm text-muted-foreground">
                            ...
                          </span>
                        )}
                        {pagination.totalPages > 5 &&
                          currentPage < pagination.totalPages - 2 && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() =>
                                handlePageChange(pagination.totalPages)
                              }
                            >
                              {pagination.totalPages}
                            </Button>
                          )}
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={
                        !pagination || currentPage >= pagination.totalPages
                      }
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </Button>
                  </div>
                  {pagination && (
                    <div className="text-sm text-muted-foreground">
                      Page {pagination.page} of {pagination.totalPages} (
                      {pagination.totalItems} total items)
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>{" "}
        </main>
      )}{" "}
      <div className="flex justify-center p-4">
        <Button
          onClick={handleShowAlert}
          variant="outline"
          className="flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          Simulate Alert Toast
        </Button>
      </div>
      {showAlert && (
        <AlertToast
          alert={{
            id: "alert-1",
            title: "Suspicious transaction detected on card ending with 0789",
            riskLevel: "High" as const,
            severity: "High" as const,
            amount: "$1,299.00",
            status: "Active" as const,
            timestamp: new Date().toISOString(),
            description: "Multiple transactions from unusual location",
            category: "Transaction Fraud",
            isNew: true,
          }}
          onClose={handleCloseAlert}
          onView={handleViewAlert}
        />
      )}
    </div>
  );
}
