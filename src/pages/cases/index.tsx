import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Download } from "lucide-react";
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
} from "@/components/ui/breadcrumb";

type FilterType = "ALL" | "DEBIT_CARD" | "CREDIT_CARD" | "WALLET";
type StatusFilter = "ALL" | "IN_PROGRESS" | "RESOLVED" | "ESCALATED";

export default function AllCasesPage() {
  const [primaryFilter, setPrimaryFilter] = useState<FilterType>("ALL");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  // Sample data for demonstration
  const allCases: {
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
      id: "1029",
      entityId: "5678 90XX XXXX 1234",
      status: "Resolved",
      priority: "medium",
      assignee: "Jane Smith",
      created: "2023-05-19 14:15",
      cardType: "CREDIT_CARD",
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
      id: "1027",
      entityId: "4567 89XX XXXX 0123",
      status: "In Progress",
      priority: "low",
      assignee: "John Doe",
      created: "2023-05-17 16:20",
      cardType: "DEBIT_CARD",
    },
    {
      id: "1026",
      entityId: "7890 12XX XXXX 3456",
      status: "Resolved",
      priority: "medium",
      assignee: "Alice Brown",
      created: "2023-05-16 10:15",
      cardType: "CREDIT_CARD",
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
  ];

  const getFilteredCases = (): {
    id: string;
    entityId: string;
    status: string;
    priority: "high" | "low" | "medium";
    assignee: string;
    created: string;
    cardType: string;
  }[] => {
    let filtered = allCases;

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

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title="All Cases" />
      <main className="flex-1 p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/cases">All Cases</BreadcrumbLink>
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
              Cases ({filteredCases.length})
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
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredCases.length} of {allCases.length} cases
          </p>
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
      </main>
    </div>
  );
}
