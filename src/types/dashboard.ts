import { CaseSummary, CaseStatus, CasePriority } from "@/lib/api-types";

export type FilterType = "ALL" | "DEBIT_CARD" | "CREDIT_CARD" | "WALLET";
export type StatusFilter =
  | "all"
  | "HIGH_PRIORITY"
  | "NEW"
  | "IN_PROGRESS"
  | "ESCALATED"
  | "RESOLVED";

export interface DashboardStats {
  total: number;
  new: number;
  highPriority: number;
  inProgress: number;
  resolved: number;
  escalated: number;
}

export interface DashboardChartData {
  id: string;
  entityId: string;
  status: "In Progress" | "Resolved" | "Escalated";
  score: number;
  assignee: string;
  created: string;
  cardType: FilterType;
  priority: "high" | "medium" | "low";
}

export interface DashboardListData {
  id: string;
  entityId: string;
  status: CaseStatus;
  priority: "high" | "medium" | "low";
  assignee: string;
  created: string;
  cardType: FilterType;
}
