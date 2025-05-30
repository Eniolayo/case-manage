// Generated types based on OpenAPI spec with corrections
export interface Error {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export type CaseStatus =
  | "NEW"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "ESCALATED"
  | "CLOSED";
export type CasePriority = "High" | "Medium" | "Low";
export type CommentHeader =
  | "Investigation"
  | "Customer Contact"
  | "Resolution"
  | "Note";
export type AlertCaseStatus = "REQUIRED" | "NOT_REQUIRED";

export interface CaseSummary {
  id: number;
  entityId: number;
  customerId?: number;
  status: CaseStatus;
  priority: CasePriority;
  assignedTo?: number;
  createdAt: number;
  updatedAt: number;
}

export interface CaseListResponse {
  data: CaseSummary[];
  pagination: Pagination;
}

export interface CaseStatusSummary {
  status: CaseStatus;
  count: number;
  growthPercent: number;
}

export interface CaseSummaryResponse {
  data: CaseStatusSummary[];
  totalCases: number;
  lastUpdated: number;
}

export interface TransactionMiniSummary {
  id: number;
  createdAt: number;
}

export interface LinkedCase {
  id: number;
  linkedAt: number;
}

export interface CaseDetail {
  id: number;
  entityId: number;
  customerId?: number;
  parentAlertId: number;
  status: CaseStatus;
  priority: CasePriority;
  assignedTo?: number;
  age: string;
  resolutionType?: string;
  linkedCases: LinkedCase[];
  createdAt: number;
  updatedAt: number;
}

export interface Comment {
  id: number;
  authorId: number;
  header: CommentHeader;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface CommentListResponse {
  data: Comment[];
  pagination: Pagination;
}

export interface CreateCommentRequest {
  header: CommentHeader;
  content: string;
}

export interface UpdateCommentRequest {
  header: CommentHeader;
  content: string;
}

export interface Anomaly {
  id: string;
  title: string;
  description: string;
  expression: string;
}

export interface Alert {
  id: string; // Updated from number to string based on actual response
  transactionId: string; // Updated from number to string
  anomalies: Anomaly[];
  payload: {
    data: Record<string, any>;
  };
  caseStatus: AlertCaseStatus;
  createdAt: number;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  dob: string; // dd-mm-yyyy format
  phoneNumber: string;
  accountId: number;
  createdAt: number;
  updatedAt: number;
}

// Query parameters for list endpoints
export interface CaseListParams {
  page?: number;
  pageSize?: number;
  status?: CaseStatus;
  priority?: CasePriority;
  search?: string;
  createdFrom?: number;
  createdTo?: number;
  sortBy?: "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  assignedTo?: number;
}

export interface CommentListParams {
  page?: number;
  pageSize?: number;
}

export interface TransactionDetail {
  account_balance: number;
  account_id: string;
  account_type: string;
  acquiring_bankname: string;
  acquiring_country: string;
  card_masked: boolean;
  card_number: string;
  card_type: string;
  count_txn_id_1d: number;
  counter_partyid: string;
  courier_fingerprint: string;
  courierid: string;
  customer_fingerprint: string;
  customer_id: string;
  customer_name: string;
  device_appcloned: boolean;
  device_id: string;
  device_ip: string;
  device_iplocation: string;
  device_mockgps: boolean;
  device_vpnactive: boolean;
  event_type: string;
  issuing_bankname: string;
  issuing_country: string;
  merchant_addresscity: string;
  merchant_addresscountry: string;
  merchant_addressdistrict: string;
  merchant_addressline1: string;
  merchant_addresslocality: string;
  merchant_addresspostalcode: string;
  merchant_addressstate: string;
}

export interface Transaction {
  id: string;
  amount: number;
  currencyCode: string;
  status: string;
  type: string;
  fraudSeverity: "High" | "Medium" | "Low";
  scenarioName: string;
  channel: "POS" | "ATM" | "Online" | "Mobile";
  country: string;
  createdAt: number;
  details: TransactionDetail;
}
