import { http, HttpResponse } from "msw";
import type {
  CaseDetail,
  Comment,
  CreateCommentRequest,
  CaseStatus,
  CasePriority,
  Customer,
} from "./api-types";
import {
  FIXED_CASES,
  FIXED_COMMENTS,
  FIXED_CUSTOMERS,
  FIXED_TRANSACTIONS,
} from "./mock-data";

// Mock data storage initialized with fixed data
const mockCases = new Map<number, CaseDetail>(
  FIXED_CASES.map((caseItem) => [caseItem.id, caseItem])
);

const mockComments = new Map<number, Comment[]>(
  Object.entries(FIXED_COMMENTS).map(([caseId, comments]) => [
    parseInt(caseId),
    [...comments],
  ])
);

const mockCustomers = new Map<number, Customer>(
  FIXED_CUSTOMERS.map((customer) => [customer.id, customer])
);

const mockTransactions = new Map(
  Object.entries(FIXED_TRANSACTIONS).map(([caseId, transactions]) => [
    parseInt(caseId),
    [...transactions],
  ])
);

export const handlers = [
  // GET /cases - List cases
  http.get("https://api.frm.com/v1/cases", ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "20");
    const status = url.searchParams.get("status") as CaseStatus | null;
    const priority = url.searchParams.get("priority") as CasePriority | null;
    const searchQuery = url.searchParams.get("search")?.toLowerCase();

    let allCases = Array.from(mockCases.values());

    // Apply filters
    if (status) {
      allCases = allCases.filter((case_) => case_.status === status);
    }
    if (priority) {
      allCases = allCases.filter((case_) => case_.priority === priority);
    }
    if (searchQuery) {
      allCases = allCases.filter(
        (case_) =>
          case_.id.toString().includes(searchQuery) ||
          case_.entityId.toString().includes(searchQuery)
      );
    }

    const totalItems = allCases.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCases = allCases.slice(startIndex, endIndex);

    return HttpResponse.json({
      data: paginatedCases,
      pagination: {
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      },
    });
  }),

  // GET /cases/:id - Get case details with transactions
  http.get("https://api.frm.com/v1/cases/:id", ({ params }) => {
    const id = parseInt(params.id as string);
    const case_ = mockCases.get(id);
    const transactions = mockTransactions.get(id) || [];

    if (!case_) {
      return HttpResponse.json(
        { code: "CASE_NOT_FOUND", message: "Case not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      ...case_,
      transactions,
    });
  }),

  // GET /cases/:id/comments - List case comments
  http.get(
    "https://api.frm.com/v1/cases/:id/comments",
    ({ params, request }) => {
      const caseId = parseInt(params.id as string);
      const url = new URL(request.url);
      const page = parseInt(url.searchParams.get("page") || "1");
      const pageSize = parseInt(url.searchParams.get("pageSize") || "20");

      const comments = mockComments.get(caseId) || [];
      const totalItems = comments.length;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedComments = comments.slice(startIndex, endIndex);

      return HttpResponse.json({
        data: paginatedComments,
        pagination: {
          page,
          pageSize,
          totalItems,
          totalPages: Math.ceil(totalItems / pageSize),
        },
      });
    }
  ),

  // POST /cases/:id/comments - Create comment
  http.post(
    "https://api.frm.com/v1/cases/:id/comments",
    async ({ params, request }) => {
      const caseId = parseInt(params.id as string);
      const body = (await request.json()) as CreateCommentRequest;

      const comments = mockComments.get(caseId) || [];
      const newComment: Comment = {
        id: Date.now(),
        authorId: 1, // Mock current user
        header: body.header,
        content: body.content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      comments.push(newComment);
      mockComments.set(caseId, comments);

      return HttpResponse.json(newComment, { status: 201 });
    }
  ),

  // GET /customers/:id - Get customer details
  http.get("https://api.frm.com/v1/customers/:id", ({ params }) => {
    const id = parseInt(params.id as string);
    const customer = mockCustomers.get(id);

    if (!customer) {
      return HttpResponse.json(
        { code: "CUSTOMER_NOT_FOUND", message: "Customer not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json(customer);
  }),

  // GET /cases/:caseId/comments/:commentId - Get comment details
  http.get(
    "https://api.frm.com/v1/cases/:caseId/comments/:commentId",
    ({ params }) => {
      const caseId = parseInt(params.caseId as string);
      const commentId = parseInt(params.commentId as string);

      const comments = mockComments.get(caseId) || [];
      const comment = comments.find((c) => c.id === commentId);

      if (!comment) {
        return HttpResponse.json(
          { code: "COMMENT_NOT_FOUND", message: "Comment not found" },
          { status: 404 }
        );
      }

      return HttpResponse.json(comment);
    }
  ),
];
