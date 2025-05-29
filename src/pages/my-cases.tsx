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
import { PageHeader } from "@/components/page-header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

type FilterType = "ALL" | "DEBIT_CARD" | "CREDIT_CARD" | "WALLET";
type StatusFilter = "ALL" | "IN_PROGRESS" | "RESOLVED" | "ESCALATED";

export default function MyCasesPage() {
  const [primaryFilter, setPrimaryFilter] = useState<FilterType>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  // Sample data for demonstration - filtered to show only current user's cases
  const myCases: {
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
      id: "1027",
      entityId: "4567 89XX XXXX 0123",
      status: "In Progress",
      priority: "low",
      assignee: "John Doe",
      created: "2023-05-17 16:20",
      cardType: "DEBIT_CARD",
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

  /* 
  "high" | "low" | "medium"
  */
  const getFilteredCases = (): {
    id: string;
    entityId: string;
    status: string;
    priority: "high" | "low" | "medium";
    assignee: string;
    created: string;
    cardType: string;
  }[] => {
    let filtered = myCases;

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
          case_.entityId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredCases = getFilteredCases();

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
              My Cases ({filteredCases.length})
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

        <CaseList cases={filteredCases} showAssignToMe={false} />

        {filteredCases.length === 0 && (
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
        )}

        {/* Pagination */}
        {filteredCases.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredCases.length} of {myCases.length} cases
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
