import { useState, useCallback, useMemo } from "react";
import { CasePriority } from "@/lib/api-types";
import {
  FilterType,
  StatusFilter,
  DashboardStats,
  DashboardListData,
} from "@/types/dashboard";
import { useCases } from "@/hooks/use-api";
import { formatDateTime } from "@/lib/date-utils";

interface DashboardDataHookResult {
  stats: DashboardStats;
  chartsData: DashboardListData[];
  listData: DashboardListData[];
  pagination: {
    totalPages: number;
    itemsPerPage: number;
    page: number;
    pageSize: number;
    totalItems: number;
  };
  loading: {
    stats: boolean;
    charts: boolean;
    cases: boolean;
    filters: boolean;
    overall: boolean;
  };
  errors: {
    stats: Error | null;
    charts: Error | null;
    cases: Error | null;
    filters: Error | null;
  };
  filters: {
    primaryFilter: FilterType;
    statusFilter: StatusFilter;
    priorityFilter: CasePriority | "all";
    sortBy: "created" | "priority" | "status";
    sortOrder: "asc" | "desc";
    currentPage: number;
  };
  actions: {
    handleCardClick: (status: StatusFilter) => void;
    handlePrimaryFilterChange: (value: FilterType) => void;
    handlePriorityChange: (priority: string) => void;
    handleSortChange: (sortBy: string) => void;
    handlePageChange: (page: number) => void;
    sortBy: "created" | "priority" | "status";
    sortOrder: "asc" | "desc";
    retryStats: () => void;
    retryCharts: () => void;
    retryCases: () => void;
  };
}

export function useDashboardData(): DashboardDataHookResult {
  // Filter state
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
  const [itemsPerPage] = useState(10);
  // Use TanStack Query hooks
  const {
    data: casesResponse,
    isLoading: casesLoading,
    error: casesError,
    refetch: refetchCases,
  } = useCases();

  // const {
  //   data: summaryResponse,
  //   isLoading: summaryLoading,
  //   error: summaryError,
  // } = useCaseSummary();

  // Section-specific loading states
  const loading = useMemo(() => {
    return {
      stats: casesLoading, // Stats depend on cases data
      charts: casesLoading, // Charts depend on cases data
      cases: casesLoading, // Cases list loading
      filters: false, // Filters are always ready
      overall: casesLoading, // Overall loading state
    };
  }, [casesLoading]);

  // Section-specific error states
  const errors = useMemo(() => {
    return {
      stats: casesError || null,
      charts: casesError || null,
      cases: casesError || null,
      filters: null, // Filters don't have separate errors
    };
  }, [casesError]);

  // Transform data using useMemo for performance
  const data = useMemo(() => {
    if (!casesResponse?.data) return [];

    return casesResponse.data.map(
      (item): DashboardListData => ({
        id: item.id.toString(),
        entityId: item.entityId.toString(),
        status: item.status,
        priority: item.priority.toLowerCase() as "high" | "medium" | "low",
        assignee: item.assignedTo?.toString() || "",
        created: new Date(item.createdAt).toISOString(), // Keep original for sorting/filtering
        createdDisplay: formatDateTime(item.createdAt), // Formatted for display
        cardType: "ALL",
      })
    );
  }, [casesResponse?.data]);

  // Calculate stats using useMemo
  const stats = useMemo((): DashboardStats => {
    return {
      total: data.length,
      new: data.filter((item) => item.status === "NEW").length,
      highPriority: data.filter((item) => item.priority === "high").length,
      inProgress: data.filter((item) => item.status === "IN_PROGRESS").length,
      resolved: data.filter((item) => item.status === "RESOLVED").length,
      escalated: data.filter((item) => item.status === "ESCALATED").length,
    };
  }, [data]);
  // Combine loading states
  // const isLoading = casesLoading;

  // Combine errors
  // const error = casesError || null;

  // Retry functions
  const retryStats = useCallback(() => {
    refetchCases();
  }, [refetchCases]);

  const retryCharts = useCallback(() => {
    refetchCases();
  }, [refetchCases]);

  const retryCases = useCallback(() => {
    refetchCases();
  }, [refetchCases]);

  // Filter handlers
  const handleCardClick = useCallback((status: StatusFilter) => {
    setStatusFilter((current) => (current === status ? "all" : status));
    setCurrentPage(1);
  }, []);

  const handlePrimaryFilterChange = useCallback((value: FilterType) => {
    setPrimaryFilter(value);
    setCurrentPage(1);
  }, []);

  const handlePriorityChange = useCallback((priority: string) => {
    setPriorityFilter(priority as CasePriority | "all");
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback(
    (newSortBy: string) => {
      if (newSortBy === sortBy) {
        setSortOrder((current) => (current === "asc" ? "desc" : "asc"));
      } else {
        setSortBy(newSortBy as "created" | "priority" | "status");
        setSortOrder("desc");
      }
    },
    [sortBy]
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);
  // Filter and sort data using useMemo for performance
  const filteredData = useMemo(() => {
    return data
      .filter((item) => {
        const matchesCardType =
          primaryFilter === "ALL" || item.cardType === primaryFilter;
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "HIGH_PRIORITY" && item.priority === "high") ||
          item.status === statusFilter;
        const matchesPriority =
          priorityFilter === "all" ||
          item.priority ===
            (priorityFilter.toLowerCase() as "high" | "medium" | "low");
        return matchesCardType && matchesStatus && matchesPriority;
      })
      .sort((a, b) => {
        const multiplier = sortOrder === "asc" ? 1 : -1;
        switch (sortBy) {
          case "priority":
            return multiplier * b.priority.localeCompare(a.priority);
          case "status":
            return multiplier * b.status.localeCompare(a.status);
          default:
            return (
              multiplier *
              (new Date(b.created).getTime() - new Date(a.created).getTime())
            );
        }
      });
  }, [data, primaryFilter, statusFilter, priorityFilter, sortBy, sortOrder]);

  // Calculate pagination using useMemo
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    return {
      totalPages,
      paginatedData,
      totalItems: filteredData.length,
    };
  }, [filteredData, currentPage, itemsPerPage]);
  return {
    stats,
    chartsData: data,
    listData: paginationData.paginatedData,
    pagination: {
      totalPages: paginationData.totalPages,
      itemsPerPage,
      page: currentPage,
      pageSize: itemsPerPage,
      totalItems: paginationData.totalItems,
    },
    loading,
    errors,
    filters: {
      primaryFilter,
      statusFilter,
      priorityFilter,
      sortBy,
      sortOrder,
      currentPage,
    },
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
  };
}
