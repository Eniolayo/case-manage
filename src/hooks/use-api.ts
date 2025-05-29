import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { casesApi, alertsApi, customersApi } from "@/lib/api";
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
    enabled: !!id,
  });
};
