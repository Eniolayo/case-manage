import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Download, AlertTriangle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CaseList } from "@/components/case-list";
import { PageHeader } from "@/components/page-header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";

type FilterType = "ALL" | "DEBIT_CARD" | "CREDIT_CARD" | "WALLET";
type StatusFilter = "ALL" | "IN_PROGRESS" | "RESOLVED" | "ESCALATED";

export default function HighRiskPage() {
  const [primaryFilter, setPrimaryFilter] = useState<FilterType>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  // Sample data for demonstration - only high-risk cases
  const highRiskCases: {
    id: string;
    entityId: string;
    status: string;
    priority: "high" | "low" | "medium";
    assignee: string;
    created: string;
    cardType: string;
  }[] = [
    {
      id: "1030",
      entityId: "1234 56XX XXXX 0789",
      status: "In Progress",
      priority: "high",
      assignee: "John Doe",
      created: "2023-05-20 09:30",
      cardType: "DEBIT_CARD",
    },
    {
      id: "1028",
      entityId: "9012 34XX XXXX 5678",
      status: "Escalated",
      priority: "high",
      assignee: "Robert Johnson",
      created: "2023-05-18 11:45",
      cardType: "WALLET",
    },
    {
      id: "1025",
      entityId: "2345 67XX XXXX 8901",
      status: "In Progress",
      priority: "high",
      assignee: "Bob Wilson",
      created: "2023-05-15 14:30",
      cardType: "WALLET",
    },
    {
      id: "1024",
      entityId: "8901 23XX XXXX 4567",
      status: "Escalated",
      priority: "high",
      assignee: "John Doe",
      created: "2023-05-14 13:45",
      cardType: "CREDIT_CARD",
    },
  ];

  const getFilteredCases = () => {
    let filtered = highRiskCases;

    // Apply primary filter
    if (primaryFilter !== "ALL") {
      filtered = filtered.filter((case_) => case_.cardType === primaryFilter);
    }

    // Apply status filter
    if (statusFilter !== "ALL") {
      const statusMap = {
        IN_PROGRESS: "In Progress",
        RESOLVED: "Resolved",
        ESCALATED: "Escalated",
      };
      filtered = filtered.filter(
        (case_) => case_.status === statusMap[statusFilter]
      );
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (case_) =>
          case_.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          case_.entityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          case_.assignee.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };
  const filteredCases = getFilteredCases();
  // Calculate stats
  const stats = {
    total: highRiskCases.length,
    inProgress: highRiskCases.filter((c) => c.status === "In Progress").length,
    escalated: highRiskCases.filter((c) => c.status === "Escalated").length,
    highPriorityCount: highRiskCases.filter((c) => c.priority === "high")
      .length,
    highPriorityPercentage:
      (highRiskCases.filter((c) => c.priority === "high").length /
        highRiskCases.length) *
      100,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title="High Priority Cases" />
      <main className="flex-1 p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>High Priority Cases</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Stats Cards */}

        {/* Alert Banner */}
        <div className="mb-6">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <h4 className="font-semibold text-red-800">
                    High Risk Alert
                  </h4>
                  <p className="text-sm text-red-700">
                    {stats.escalated} cases require immediate attention. Review
                    escalated cases first.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
                <span>Sort by Priority</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">
              High Priority Cases ({filteredCases.length})
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

        <CaseList cases={filteredCases} />

        {/* Pagination */}
        {filteredCases.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {" "}
              Showing {filteredCases.length} of {highRiskCases.length} high
              priority cases
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                1
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
