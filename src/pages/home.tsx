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

// Sample data for demonstration
type CaseStatus = "In Progress" | "Resolved" | "Escalated";

type Case = {
  id: string;
  entityId: string;
  status: CaseStatus;
  score: number;
  assignee: string;
  created: string;
  cardType: FilterType;
  priority: "high" | "medium" | "low"; // Optional field for priority
};

const allCases: Case[] = [
  {
    id: "1050",
    entityId: "1234 56XX XXXX 0789",
    status: "In Progress",
    score: 800,
    assignee: "John Doe",
    created: "2025-05-28 09:30",
    cardType: "DEBIT_CARD",
    priority: "high",
  },
  {
    id: "1049",
    entityId: "5678 90XX XXXX 1234",
    status: "Resolved",
    score: 450,
    assignee: "Jane Smith",
    created: "2025-05-27 14:15",
    cardType: "CREDIT_CARD",
    priority: "medium",
  },
  {
    id: "1048",
    entityId: "9012 34XX XXXX 5678",
    status: "Escalated",
    score: 850,
    assignee: "Robert Johnson",
    created: "2025-05-27 11:45",
    cardType: "WALLET",
    priority: "high",
  },
  {
    id: "1047",
    entityId: "4567 89XX XXXX 0123",
    status: "In Progress",
    score: 720,
    assignee: "John Doe",
    created: "2025-05-26 16:20",
    cardType: "DEBIT_CARD",
    priority: "medium",
  },
  {
    id: "1046",
    entityId: "7890 12XX XXXX 3456",
    status: "Escalated",
    score: 900,
    assignee: "Jane Smith",
    created: "2025-05-26 08:15",
    cardType: "CREDIT_CARD",
    priority: "high",
  },
  {
    id: "1045",
    entityId: "2345 67XX XXXX 8901",
    status: "In Progress",
    score: 650,
    assignee: "Robert Johnson",
    created: "2025-05-25 13:40",
    cardType: "WALLET",
    priority: "medium",
  },
  {
    id: "1044",
    entityId: "6789 01XX XXXX 2345",
    status: "Resolved",
    score: 300,
    assignee: "John Doe",
    created: "2025-05-25 10:25",
    cardType: "DEBIT_CARD",
    priority: "low",
  },
  {
    id: "1043",
    entityId: "0123 45XX XXXX 6789",
    status: "In Progress",
    score: 750,
    assignee: "Jane Smith",
    created: "2025-05-24 15:50",
    cardType: "CREDIT_CARD",
    priority: "medium",
  },
  {
    id: "1042",
    entityId: "3456 78XX XXXX 9012",
    status: "Escalated",
    score: 820,
    assignee: "Robert Johnson",
    created: "2025-05-23 12:10",
    cardType: "WALLET",
    priority: "high",
  },
  {
    id: "1041",
    entityId: "8901 23XX XXXX 4567",
    status: "Resolved",
    score: 400,
    assignee: "John Doe",
    created: "2025-05-22 09:30",
    cardType: "DEBIT_CARD",
    priority: "low",
  },
  // Additional cases for better trend visualization
  {
    id: "1040",
    entityId: "1111 22XX XXXX 3333",
    status: "In Progress",
    score: 680,
    assignee: "Jane Smith",
    created: "2025-05-21 14:20",
    cardType: "CREDIT_CARD",
    priority: "medium",
  },
  {
    id: "1039",
    entityId: "4444 55XX XXXX 6666",
    status: "Escalated",
    score: 920,
    assignee: "Robert Johnson",
    created: "2025-05-20 11:15",
    cardType: "WALLET",
    priority: "high",
  },
  {
    id: "1038",
    entityId: "7777 88XX XXXX 9999",
    status: "Resolved",
    score: 520,
    assignee: "John Doe",
    created: "2025-05-19 16:45",
    cardType: "DEBIT_CARD",
    priority: "medium",
  },
  {
    id: "1037",
    entityId: "2222 33XX XXXX 4444",
    status: "In Progress",
    score: 760,
    assignee: "Jane Smith",
    created: "2025-05-18 10:30",
    cardType: "CREDIT_CARD",
    priority: "high",
  },
  {
    id: "1036",
    entityId: "5555 66XX XXXX 7777",
    status: "Escalated",
    score: 880,
    assignee: "Robert Johnson",
    created: "2025-05-17 13:20",
    cardType: "WALLET",
    priority: "high",
  },
  {
    id: "1035",
    entityId: "8888 99XX XXXX 0000",
    status: "Resolved",
    score: 350,
    assignee: "John Doe",
    created: "2025-05-16 09:10",
    cardType: "DEBIT_CARD",
    priority: "low",
  },
  {
    id: "1034",
    entityId: "3333 44XX XXXX 5555",
    status: "In Progress",
    score: 640,
    assignee: "Jane Smith",
    created: "2025-05-15 15:35",
    cardType: "CREDIT_CARD",
    priority: "medium",
  },
];
export default function Home() {
  const [primaryFilter, setPrimaryFilter] = useState<FilterType>("ALL");
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const getFilteredCases = () => {
    let filtered = allCases;

    // Apply primary filter
    if (primaryFilter !== "ALL") {
      filtered = filtered.filter((case_) => case_.cardType === primaryFilter);
    }

    // Apply tab filter
    switch (activeTab) {
      case "my":
        filtered = filtered.filter((case_) => case_.assignee === "John Doe");
        break;
      case "high-priority":
        filtered = filtered.filter((case_) => case_.score >= 700);
        break;
    }

    return filtered;
  };

  const getStatsForFilter = (filter: FilterType) => {
    const cases =
      filter === "ALL"
        ? allCases
        : allCases.filter((case_) => case_.cardType === filter);

    // For demo purposes, let's consider cases created within the last 24 hours as "new"
    // In a real app, you'd compare the created date with the current date
    const newCases = cases.filter((c) => {
      const createdDate = new Date(c.created);
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      return createdDate >= oneDayAgo;
    });

    return {
      total: cases.length,
      new: newCases.length,
      inProgress: cases.filter((c) => c.status === "In Progress").length,
      resolved: cases.filter((c) => c.status === "Resolved").length,
      escalated: cases.filter((c) => c.status === "Escalated").length,
    };
  };

  const handleCardClick = (status: string) => {
    // Filter cases by status when card is clicked
    console.log(`Filtering by status: ${status}`);
    // In a real app, you would update the filter state here
  };

  const stats = getStatsForFilter(primaryFilter);
  const filteredCases = getFilteredCases();

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
                      Risk Score
                    </DropdownMenuLabel>
                    <DropdownMenuItem>
                      <TrendingUp className="mr-2 h-4 w-4" />
                      High Risk (700+)
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Minus className="mr-2 h-4 w-4" />
                      Medium Risk (400-699)
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <TrendingDown className="mr-2 h-4 w-4" />
                      Low Risk (0-399)
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
              <Card
                className="cursor-pointer transition-colors hover:bg-muted/50"
                onClick={() => handleCardClick("high-priority")}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">
                      High Priority
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold">
                        {allCases.filter((c) => c.score >= 700).length}
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
              </Card>
              <Card
                className="cursor-pointer transition-colors hover:bg-muted/50"
                onClick={() => handleCardClick("new")}
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
              </Card>
              <Card
                className="cursor-pointer transition-colors hover:bg-muted/50"
                onClick={() => handleCardClick("in-progress")}
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
              </Card>
              <Card
                className="cursor-pointer transition-colors hover:bg-muted/50"
                onClick={() => handleCardClick("escalated")}
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
              </Card>
              <Card
                className="cursor-pointer transition-colors hover:bg-muted/50"
                onClick={() => handleCardClick("resolved")}
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
              <CaseCharts cases={filteredCases} primaryFilter={primaryFilter} />
            </div>

            <div className="mt-8">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg sm:text-xl font-bold">
                  {activeTab === "all" && "Recent Cases"}
                  {activeTab === "my" && "My Cases"}
                  {activeTab === "high-priority" && "High Priority Cases"}
                  {primaryFilter !== "ALL" &&
                    ` - ${primaryFilter.replace("_", " ")}`}
                </h3>
                <Link to="/cases">
                  <Button variant="link" size="sm">
                    View All Cases
                  </Button>
                </Link>
              </div>
              <CaseList cases={filteredCases} />

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
        </Tabs>
      </main>
    </div>
  );
}
