import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Filter, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent } from "@/components/ui/tabs";
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
import { DashboardSkeleton } from "@/components/skeleton-loaders";
import { useCases } from "@/hooks/use-api";
import { CaseSummary, CaseStatus } from "@/lib/api-types";

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
type TabType = "all" | "my" | "high-priority";
type StatusFilter =
  | "all"
  | "high-priority"
  | "NEW"
  | "IN_PROGRESS"
  | "ESCALATED"
  | "RESOLVED";

export default function Home() {
  const [primaryFilter, setPrimaryFilter] = useState<FilterType>("ALL");
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showAlert, setShowAlert] = useState(false); // API hooks
  const {
    data: casesData,
    isLoading: casesLoading,
    error: casesError,
  } = useCases({
    page: 1,
    pageSize: 20,
    status:
      statusFilter === "all" || statusFilter === "high-priority"
        ? undefined
        : (statusFilter as CaseStatus),
    priority: statusFilter === "high-priority" ? "High" : undefined,
  });

  const cases = casesData?.data || [];
  // Show loading skeleton while data is loading
  if (casesLoading) {
    return <DashboardSkeleton />;
  }

  // Show error state if there's an error
  if (casesError) {
    return (
      <div className="flex flex-col">
        <PageHeader title="Dashboard" />
        <main className="flex-1 p-4 sm:p-6">
          <div className="text-center py-8">
            <p className="text-red-500">
              Error loading cases: {casesError.message}
            </p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </div>
        </main>
      </div>
    );
  }
  const getFilteredCases = () => {
    let filtered = cases;

    // Apply tab filter
    switch (activeTab) {
      case "my":
        filtered = filtered.filter(
          (case_: CaseSummary) => case_.assignedTo === 1
        ); // Assuming John Doe has ID 1
        break;
      case "high-priority":
        filtered = filtered.filter(
          (case_: CaseSummary) => case_.priority === "High"
        );
        break;
    }

    return filtered;
  };
  const getStatsForFilter = () => {
    const filteredCases = cases;

    // For demo purposes, let's consider cases created within the last 24 hours as "new"
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const newCases = filteredCases.filter((c: CaseSummary) => {
      const createdDate = new Date(c.createdAt);
      return createdDate >= oneDayAgo;
    });

    return {
      total: filteredCases.length,
      new: newCases.length,
      inProgress: filteredCases.filter(
        (c: CaseSummary) => c.status === "IN_PROGRESS"
      ).length,
      resolved: filteredCases.filter(
        (c: CaseSummary) => c.status === "RESOLVED"
      ).length,
      escalated: filteredCases.filter(
        (c: CaseSummary) => c.status === "ESCALATED"
      ).length,
    };
  };
  const getFilterTitle = (filter: StatusFilter) => {
    switch (filter) {
      case "high-priority":
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
  };

  const handleCardClick = (status: StatusFilter) => {
    // Toggle filter: if clicking the same card, reset to "all", otherwise set new filter
    setStatusFilter(statusFilter === status ? "all" : status);
  }; // Convert API cases to format expected by CaseCharts component
  const convertCasesForCharts = (apiCases: CaseSummary[]) => {
    return apiCases.map((case_) => ({
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
  }; // Convert API cases to format expected by CaseList component
  const convertCasesForList = (apiCases: CaseSummary[]) => {
    return apiCases.map((case_) => ({
      id: case_.id.toString(),
      entityId: case_.entityId.toString(),
      status: case_.status,
      priority: case_.priority.toLowerCase() as "high" | "medium" | "low",
      assignee: case_.assignedTo ? `User ${case_.assignedTo}` : "Unassigned",
      created: new Date(case_.createdAt).toLocaleString(),
      cardType: "ALL", // Default since not available in CaseSummary
    }));
  };
  const stats = getStatsForFilter();
  const filteredCases = getFilteredCases();
  const chartsData = convertCasesForCharts(filteredCases);
  const listData = convertCasesForList(filteredCases);

  return (
    <div className="flex  flex-col">
      <PageHeader title="Dashboard" />
      <main className="flex-1 p-4 sm:p-6">
        <Tabs
          value={activeTab}
          onValueChange={(value: string) => setActiveTab(value as TabType)}
          className="mb-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
              <label className="text-sm font-medium">Filter by Type:</label>
              <div className="flex items-center gap-4">
                <Select
                  value={primaryFilter}
                  onValueChange={(value: FilterType) => setPrimaryFilter(value)}
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

                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs text-muted-foreground">
                      Case Prority
                    </DropdownMenuLabel>
                    <DropdownMenuItem>
                      <TrendingUp className="mr-2 h-4 w-4" />
                      High
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Minus className="mr-2 h-4 w-4" />
                      Medium
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <TrendingDown className="mr-2 h-4 w-4" />
                      Low
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <ArrowUpDown className="h-4 w-4" />
                <span className="hidden sm:inline">Sort</span>
              </Button>
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-6">
            <div className="grid gap-4  grid-cols-1 auto-rows-auto md:grid-cols-3 lg:grid-cols-5">
              {" "}
              <Card
                className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                  statusFilter === "high-priority"
                    ? "ring-2 ring-purple-500 bg-purple-50"
                    : ""
                }`}
                onClick={() => handleCardClick("high-priority")}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">
                      High Priority
                    </p>{" "}
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold">
                        {
                          cases.filter(
                            (c: CaseSummary) => c.priority === "High"
                          ).length
                        }
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
                onClick={() => handleCardClick("NEW")}
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
                onClick={() => handleCardClick("IN_PROGRESS")}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">In Progress</p>
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
                onClick={() => handleCardClick("ESCALATED")}
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
                onClick={() => handleCardClick("RESOLVED")}
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
                  {statusFilter !== "all" && getFilterTitle(statusFilter)}
                  {statusFilter === "all" &&
                    activeTab === "all" &&
                    "Recent Cases"}
                  {statusFilter === "all" && activeTab === "my" && "My Cases"}
                  {statusFilter === "all" &&
                    activeTab === "high-priority" &&
                    "High Priority Cases"}
                  {primaryFilter !== "ALL" &&
                    ` - ${primaryFilter.replace("_", " ")}`}
                </h3>
                <Link to="/cases">
                  <Button variant="link" size="sm">
                    View All Cases
                  </Button>
                </Link>
              </div>
              <CaseList cases={listData} />

              <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    1
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    2
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                    3
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>{" "}
      </main>
      <div className="flex justify-center p-4">
        <Button
          onClick={() => setShowAlert(true)}
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
          onClose={() => setShowAlert(false)}
          onView={() => {
            setShowAlert(false);
            // In a real app, you'd navigate to the case detail page
            console.log("View case details");
          }}
        />
      )}
    </div>
  );
}
