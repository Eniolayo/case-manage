import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Case = {
  id: string;
  entityId: string;
  status: string;
  priority: "high" | "medium" | "low";
  assignee: string;
  created: string;
  cardType?: string;
};

type CaseListProps = {
  cases: Case[];
  showAssignToMe?: boolean;
};

export function CaseList({ cases, showAssignToMe = true }: CaseListProps) {
  return (
    <div className="rounded-lg border overflow-x-auto w-full">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium">
              Case ID
            </th>
            <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium">
              Entity ID
            </th>
            <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium">
              Status
            </th>
            <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium">
              Priority
            </th>
            <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium hidden sm:table-cell">
              Assignee
            </th>
            <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium hidden lg:table-cell">
              Created
            </th>
            <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {cases.map((caseItem) => (
            <tr key={caseItem.id} className="border-b">
              <td className="px-2 sm:px-4 py-3 text-xs whitespace-nowrap sm:text-sm">
                <Link
                  to={`/cases/${caseItem.id}`}
                  className="text-primary hover:underline"
                >
                  Case - {caseItem.id}
                </Link>
              </td>
              <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm whitespace-nowrap">
                {caseItem.entityId}
              </td>
              <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm whitespace-nowrap">
                <StatusBadge status={caseItem.status} />
              </td>
              <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm">
                <PriorityBadge priority={caseItem.priority} />
              </td>
              <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm hidden sm:table-cell">
                {caseItem.assignee}
              </td>
              <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm hidden lg:table-cell">
                {caseItem.created}
              </td>
              <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm">
                <div className="flex items-center gap-1">
                  <Link to={`/cases/${caseItem.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <FileText className="h-4 w-4" />
                      <span className="sr-only">View case</span>
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {showAssignToMe && (
                        <DropdownMenuItem>Assign to me</DropdownMenuItem>
                      )}
                      <DropdownMenuItem>Forward case</DropdownMenuItem>
                      <DropdownMenuItem>Export details</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  let className = "rounded-full px-2 py-1 text-xs ";

  switch (status.toLowerCase()) {
    case "in progress":
      className += "bg-yellow-100 text-yellow-800";
      break;
    case "resolved":
      className += "bg-green-100 text-green-800";
      break;
    case "escalated":
      className += "bg-red-100 text-red-800";
      break;
    case "pending":
      className += "bg-blue-100 text-blue-800";
      break;
    default:
      className += "bg-gray-100 text-gray-800";
  }

  return <span className={className}>{status}</span>;
}

function PriorityBadge({ priority }: { priority: "high" | "medium" | "low" }) {
  switch (priority) {
    case "high":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High</Badge>
      );
    case "medium":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          Medium
        </Badge>
      );
    case "low":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Low
        </Badge>
      );
    default:
      return null;
  }
}
