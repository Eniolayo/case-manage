import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { casesApi, alertsApi, customersApi, configApi } from "@/lib/api";
import {
  MOCK_EVIDENCE_CONFIG,
  MOCK_SOURCE_CONFIG,
  MOCK_CUSTOMER_SOURCE_DATA,
} from "@/lib/mock-data";
import type {
  CaseListParams,
  CommentListParams,
  CreateCommentRequest,
  UpdateCommentRequest,
} from "@/lib/api-types";

// Query keys for consistent cache management
export const queryKeys = {
  cases: {
    all: ["cases"] as const,
    lists: () => [...queryKeys.cases.all, "list"] as const,
    list: (params?: CaseListParams) =>
      [...queryKeys.cases.lists(), params] as const,
    details: () => [...queryKeys.cases.all, "detail"] as const,
    detail: (id: number) => [...queryKeys.cases.details(), id] as const,
    summary: () => [...queryKeys.cases.all, "summary"] as const,
    comments: {
      all: (caseId: number) =>
        [...queryKeys.cases.detail(caseId), "comments"] as const,
      list: (caseId: number, params?: CommentListParams) =>
        [...queryKeys.cases.comments.all(caseId), "list", params] as const,
      detail: (caseId: number, commentId: number) =>
        [...queryKeys.cases.comments.all(caseId), "detail", commentId] as const,
    },
  },
  alerts: {
    all: ["alerts"] as const,
    detail: (id: string) => [...queryKeys.alerts.all, "detail", id] as const,
  },
  customers: {
    all: ["customers"] as const,
    detail: (id: number) => [...queryKeys.customers.all, "detail", id] as const,
  },
  config: {
    all: ["config"] as const,
    evidences: {
      all: () => [...queryKeys.config.all, "evidences"] as const,
      list: (sourceSystem: string, evidenceType: string) =>
        [
          ...queryKeys.config.evidences.all(),
          sourceSystem,
          evidenceType,
        ] as const,
    },
    sources: {
      all: () => [...queryKeys.config.all, "sources"] as const,
      list: (sourceSystem: string) =>
        [...queryKeys.config.sources.all(), sourceSystem] as const,
    },
  },
} as const;

// Cases hooks
export const useCases = (params?: CaseListParams) => {
  return useQuery({
    queryKey: queryKeys.cases.list(params),
    queryFn: () => casesApi.list(params),
  });
};

export const useCaseSummary = () => {
  return useQuery({
    queryKey: queryKeys.cases.summary(),
    queryFn: () => casesApi.summary(),
    refetchInterval: 60000, // Refetch every minute
  });
};

export const useCase = (id: number) => {
  return useQuery({
    queryKey: queryKeys.cases.detail(id),
    queryFn: () => casesApi.getById(id),
    enabled: !!id,
  });
};

export const useCaseComments = (caseId: number, params?: CommentListParams) => {
  return useQuery({
    queryKey: queryKeys.cases.comments.list(caseId, params),
    queryFn: () => casesApi.getComments(caseId, params),
    enabled: !!caseId,
  });
};

export const useComment = (caseId: number, commentId: number) => {
  return useQuery({
    queryKey: queryKeys.cases.comments.detail(caseId, commentId),
    queryFn: () => casesApi.getComment(caseId, commentId),
    enabled: !!caseId && !!commentId,
  });
};

export const useCreateComment = (caseId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentRequest) =>
      casesApi.createComment(caseId, data),
    onSuccess: () => {
      // Invalidate and refetch comments list
      queryClient.invalidateQueries({
        queryKey: queryKeys.cases.comments.all(caseId),
      });
    },
  });
};

export const useUpdateComment = (caseId: number, commentId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCommentRequest) =>
      casesApi.updateComment(caseId, commentId, data),
    onSuccess: () => {
      // Invalidate and refetch comments
      queryClient.invalidateQueries({
        queryKey: queryKeys.cases.comments.all(caseId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.cases.comments.detail(caseId, commentId),
      });
    },
  });
};

// Alerts hooks
export const useAlert = (id: string) => {
  return useQuery({
    queryKey: queryKeys.alerts.detail(id),
    queryFn: () => alertsApi.getById(id),
    enabled: !!id,
  });
};

// Customers hooks
export const useCustomer = (id: number) => {
  return useQuery({
    queryKey: queryKeys.customers.detail(id),
    queryFn: () => customersApi.getById(id),
    enabled: id > 0,
  });
};

// Config hooks - using mock data until APIs are deployed
export const useEvidenceConfig = (
  sourceSystem: string,
  evidenceType: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: queryKeys.config.evidences.list(sourceSystem, evidenceType),
    queryFn: async () => {
      // Using mock data for now - replace with real API call when ready
      // return configApi.getEvidenceConfig(sourceSystem, evidenceType);

      // Simulate API delay for realism
      await new Promise((resolve) => setTimeout(resolve, 500));
      return MOCK_EVIDENCE_CONFIG;
    },
    enabled: enabled && !!sourceSystem && !!evidenceType,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};

export const useSourceConfig = (
  sourceSystem: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: queryKeys.config.sources.list(sourceSystem),
    queryFn: async () => {
      // Using mock data for now - replace with real API call when ready
      // return configApi.getSourceConfig(sourceSystem);

      // Simulate API delay for realism
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_SOURCE_CONFIG;
    },
    enabled: enabled && !!sourceSystem,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};

// Hook to fetch customer source data based on the source API configuration
export const useCustomerSourceData = (
  customerId: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["customerSourceData", customerId],
    queryFn: async () => {
      // Using mock data for now - replace with real API call when ready
      // This would normally call the source_api.url with the customerId

      // Simulate API delay for realism
      await new Promise((resolve) => setTimeout(resolve, 200));

      const mockData = MOCK_CUSTOMER_SOURCE_DATA[customerId];

      if (mockData) {
        return mockData;
      }

      // If no mock data found, return a default structure
      // This handles cases where new customer IDs are added but mock data hasn't been updated
      return {
        customer_id: `CUST_${customerId}`,
        customer_name: "", // Will fall back to customerData.name
        phone_number: "", // Will fall back to customerData.phoneNumber
        account_id: `ACC_${customerId + 1000}`,
        card_issue_date: "2023-01-01",
        card_status: "Active",
        card_type: "Standard",
      };
    },
    enabled: enabled && !!customerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
};
