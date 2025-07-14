import { apiClient } from "./api-client";
import type {
  CaseListResponse,
  CaseSummaryResponse,
  CaseDetail,
  CommentListResponse,
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
  Alert,
  Customer,
  CaseListParams,
  CommentListParams,
  EvidenceConfigResponse,
  SourceConfigResponse,
} from "./api-types";

// Cases API
export const casesApi = {
  // Get list of cases
  list: (params?: CaseListParams): Promise<CaseListResponse> =>
    apiClient.get("/cases", { params }).then((res) => res.data),

  // Get case summary/statistics
  summary: (): Promise<CaseSummaryResponse> =>
    apiClient.get("/cases/summary").then((res) => res.data),

  // Get case details by ID
  getById: (id: number): Promise<CaseDetail> =>
    apiClient.get(`/cases/${id}`).then((res) => res.data),

  // Get comments for a case
  getComments: (
    caseId: number,
    params?: CommentListParams
  ): Promise<CommentListResponse> =>
    apiClient
      .get(`/cases/${caseId}/comments`, { params })
      .then((res) => res.data),

  // Create a new comment
  createComment: (
    caseId: number,
    data: CreateCommentRequest
  ): Promise<Comment> =>
    apiClient.post(`/cases/${caseId}/comments`, data).then((res) => res.data),

  // Get comment by ID
  getComment: (caseId: number, commentId: number): Promise<Comment> =>
    apiClient
      .get(`/cases/${caseId}/comments/${commentId}`)
      .then((res) => res.data),

  // Update comment
  updateComment: (
    caseId: number,
    commentId: number,
    data: UpdateCommentRequest
  ): Promise<Comment> =>
    apiClient
      .put(`/cases/${caseId}/comments/${commentId}`, data)
      .then((res) => res.data),
};

// Alerts API
export const alertsApi = {
  // Get alert details by ID
  getById: (id: string): Promise<Alert> =>
    apiClient.get(`/alerts/${id}`).then((res) => res.data),
};

// Customers API
export const customersApi = {
  // Get customer details by ID
  getById: (id: number): Promise<Customer> =>
    apiClient.get(`/customers/${id}`).then((res) => res.data),
};

// Config API
export const configApi = {
  // Get evidence configuration by source system and evidence type
  getEvidenceConfig: (
    sourceSystem: string,
    evidenceType: string
  ): Promise<EvidenceConfigResponse> =>
    apiClient
      .get(`/config/evidences`, {
        params: { source_system: sourceSystem, evidence_type: evidenceType },
      })
      .then((res) => res.data),

  // Get source configuration by source system
  getSourceConfig: (sourceSystem: string): Promise<SourceConfigResponse> =>
    apiClient
      .get(`/config/sources`, {
        params: { source_system: sourceSystem },
      })
      .then((res) => res.data),
};
