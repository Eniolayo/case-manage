import { http, HttpResponse } from "msw";
import type {
  CaseDetail,
  Comment,
  CreateCommentRequest,
  UpdateCommentRequest,
  CaseStatus,
  CasePriority,
  Customer,
  CaseSummaryResponse,
  CaseStatusSummary,
  Alert,
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

  // PUT /cases/:caseId/comments/:commentId - Update comment
  http.put(
    "https://api.frm.com/v1/cases/:caseId/comments/:commentId",
    async ({ params, request }) => {
      const caseId = parseInt(params.caseId as string);
      const commentId = parseInt(params.commentId as string);
      const body = (await request.json()) as UpdateCommentRequest;

      const comments = mockComments.get(caseId) || [];
      const commentIndex = comments.findIndex((c) => c.id === commentId);

      if (commentIndex === -1) {
        return HttpResponse.json(
          { code: "COMMENT_NOT_FOUND", message: "Comment not found" },
          { status: 404 }
        );
      }

      // Update the comment
      const updatedComment: Comment = {
        ...comments[commentIndex],
        header: body.header,
        content: body.content,
        updatedAt: Date.now(),
      };

      comments[commentIndex] = updatedComment;
      mockComments.set(caseId, comments);

      return HttpResponse.json(updatedComment);
    }
  ),

  // GET /cases/summary - Get case statistics summary
  http.get("https://api.frm.com/v1/cases/summary", () => {
    const allCases = Array.from(mockCases.values());
    const statusCounts: Record<CaseStatus, number> = {
      NEW: 0,
      IN_PROGRESS: 0,
      RESOLVED: 0,
      ESCALATED: 0,
      CLOSED: 0,
    };

    // Count cases by status
    allCases.forEach((case_) => {
      statusCounts[case_.status]++;
    });

    // Generate mock growth percentages (random between -10% and +20%)
    const statusSummaries: CaseStatusSummary[] = Object.entries(
      statusCounts
    ).map(([status, count]) => ({
      status: status as CaseStatus,
      count,
      growthPercent: Math.round((Math.random() * 30 - 10) * 100) / 100, // Random between -10 and +20
    }));

    const response: CaseSummaryResponse = {
      data: statusSummaries,
      totalCases: allCases.length,
      lastUpdated: Date.now(),
    };

    return HttpResponse.json(response);
  }),

  // GET /alerts/:id - Get alert details
  http.get("https://api.frm.com/v1/alerts/:id", ({ params }) => {
    const id = params.id as string;

    // Mock alert data structure based on the provided example
    const mockAlert: Alert = {
      id,
      transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`,
      anomalies: [
        {
          id: "1892478256079179786",
          title: "Invalid courier assignment",
          description: "Invalid courier assignment",
          expression: "order_status == 'PENDING' && courierid != ''",
        },
        {
          id: "1920383943543099392",
          title: "Transaction currency is not INR",
          description: "Currency code used in transaction is not equal to INR",
          expression: "txn_currencycode != 'INR'",
        },
        {
          id: "1920413983215456256",
          title: "Day limit transaction more than 50k",
          description:
            "sum of transactions amount not more than 50k in one day",
          expression: "sum_txn_amount_1d > 50000",
        },
      ],
      payload: {
        data: {
          account_balance: 10000,
          account_id: "acc_789",
          account_type: "SAVINGS",
          acquiring_bankname: "Sample Bank",
          acquiring_country: "US",
          card_masked: true,
          card_number: "411111******1111",
          card_type: "CREDIT",
          count_txn_id_1d: 5,
          counter_partyid: "cp_303",
          courier_fingerprint: "cour_fp_505",
          courierid: "cour_404",
          customer_fingerprint: "fp_789",
          customer_id: "cust_456",
          customer_name: "John Doe",
          device_appcloned: false,
          device_id: "dev_101",
          device_ip: "192.168.1.1",
          device_iplocation: "US",
          device_mockgps: false,
          device_vpnactive: false,
          event_type: "FT",
          issuing_bankname: "Issuing Bank",
          issuing_country: "US",
          merchant_addresscity: "San Francisco",
          merchant_addresscountry: "US",
          merchant_addressdistrict: "Downtown",
          merchant_addressline1: "123 Main St",
          merchant_addresslocality: "San Francisco",
          merchant_addresspostalcode: "94105",
          merchant_addressstate: "CA",
          order_dest_latitude: 37.7749,
          order_dest_longitude: -122.4194,
          order_id: "order_123",
          order_origin_latitude: 37.7849,
          order_origin_longitude: -122.4094,
          order_received_timestamp: "2025-03-27T12:40:00Z",
          order_size: 2,
          order_status: "PENDING",
          order_timestamp: "2025-03-27T12:45:00Z",
          sum_txn_amount_1d: 75000,
          transaction_id: "txn_123",
          txn_amount: 1000,
          txn_beneficiarymobileno: "+911234567890",
          txn_beneficiaryname: "Jane Smith",
          txn_currencycode: "840",
          txn_date: "2025-03-27",
          txn_foreignamount: 1000,
          txn_foreigncurrencycode: "USD",
          txn_id: "txn_123",
          txn_inramount: 75000,
          txn_narration: "Payment for services",
          txn_sendermobileno: "+911234567890",
          txn_sendername: "John Doe",
          txn_time: "12:45:00",
          txn_type: "WALLET",
          txn_typeother: "",
          wallet_balance: 5000,
          wallet_id: "wallet_123",
        },
      },
      caseStatus: "REQUIRED",
      createdAt:
        Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000,
    };

    return HttpResponse.json(mockAlert);
  }),
];
