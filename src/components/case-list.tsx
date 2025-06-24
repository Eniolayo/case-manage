import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { DataTable, Column, RowAction } from "@/components/data-table";

type Case = {
  id: string;
  entityId: string;
  status: string;
  priority: "high" | "medium" | "low";
  assignee: string;
  created: string;
  createdDisplay?: string; // Optional formatted display version
  cardType?: string;
};

type CaseListProps = {
  cases: Case[];
  showAssignToMe?: boolean;
};

export function CaseList({ cases, showAssignToMe = true }: CaseListProps) {
  // Define columns for the data table
  const columns: Column<Case>[] = [
    {
      key: "id",
      title: "Case ID",
      render: (value, record) => (
        <Link
          to={`/cases/${record.id}`}
          className="text-primary hover:underline font-medium"
        >
          Case - {value}
        </Link>
      ),
      sortable: true,
    },
    {
      key: "entityId",
      title: "Entity ID",
      sortable: true,
    },
    {
      key: "status",
      title: "Status",
      sortable: true,
      // Auto-renders using StatusBadge from DataTable
    },
    {
      key: "priority",
      title: "Priority",
      sortable: true,
      // Auto-renders using PriorityBadge from DataTable
    },
    {
      key: "assignee",
      title: "Assignee",
      responsive: { hidden: "sm" },
      sortable: true,
    },
    {
      key: "created",
      title: "Created",
      responsive: { hidden: "lg" },
      sortable: true,
      render: (value, record) => {
        // Use createdDisplay if available, otherwise use the original created value
        const displayValue = record.createdDisplay || value;
        return <span className="whitespace-nowrap">{displayValue}</span>;
      },
    },
  ];

  // Define row actions
  const rowActions: RowAction<Case>[] = [
    {
      label: "View case",
      icon: FileText,
      href: (record: Case) => `/cases/${record.id}`,
    },
    {
      label: "Assign to me",
      show: showAssignToMe,
      onClick: (record: Case) => {
        // TODO: Implement assign to me functionality
        console.log("Assign to me:", record);
      },
    },
    {
      label: "Forward case",
      onClick: (record: Case) => {
        // TODO: Implement forward case functionality
        console.log("Forward case:", record);
      },
    },
    {
      label: "Export details",
      onClick: (record: Case) => {
        // TODO: Implement export functionality
        console.log("Export details:", record);
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={cases}
      rowActions={rowActions}
      hoverable
      bordered
      size="default"
    />
  );
}
