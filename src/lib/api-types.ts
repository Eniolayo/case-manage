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

// External link configuration types
export interface ExternalLinkConfig {
  url_template: string;
  display_name: string;
  icon?: string;
  open_in_new_tab: boolean;
}

export interface EvidenceConfig {
  id: number;
  source_system: string;
  evidence_type: string;
  external_link_config?: ExternalLinkConfig;
  evidence_schema: Record<string, any>;
  ui_config: Record<string, any>;
}

export interface EvidenceConfigResponse {
  data: EvidenceConfig[];
}

export interface SourceConfig {
  id: number;
  source_system: string;
  entity_type: string;
  external_link_config?: {
    customer_portal_url: string;
    display_name: string;
    open_in_new_tab: boolean;
  };
  ui_config: Array<{
    path: string;
    field: string;
    display_text: string;
    component_type: string;
  }>;
  source_api: {
    url: string;
    headers: Record<string, any>;
    query_params: Record<string, any>;
    response_schema: Record<string, any>;
  };
}

export interface SourceConfigResponse {
  data: SourceConfig[];
}

// Generic Evidence types for case management system
export type EvidenceType =
  | "transaction"
  | "alert"
  | "kyc_document"
  | "aml_screening"
  | "device_fingerprint"
  | "behavioral_analysis";
export type EvidenceStatus =
  | "flagged"
  | "cleared"
  | "pending"
  | "reviewed"
  | "escalated";
export type RiskLevel = "High" | "Medium" | "Low" | "Critical";

export interface RuleFlagged {
  id?: string;
  title: string;
  description?: string;
  expression?: string;
}

export interface EvaluationSummary {
  id?: string;
  title: string;
  description?: string;
  expression?: string;
  flagged: boolean;
  isExecuted: boolean;
}

export interface Evidence {
  id: string;
  evidence_type: EvidenceType;
  source_system: string;
  created_at: string;
  updated_at: string;
  status: EvidenceStatus;
  risk_level: RiskLevel;
  title: string;
  description: string;
  linked_at: string;
  // Real evidence structure based on RealEvidenceConfig
  payload: {
    data: Record<string, any>;
  };
  rulesFlagged: RuleFlagged[];
  evaluationSummary: EvaluationSummary[];
  action: string;
  receivedAt?: number;
}
