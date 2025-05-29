import { http, HttpResponse } from "msw";
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
  CaseSummary,
  CaseStatusSummary,
  LinkedCase,
} from "../lib/api-types";

// Mock data generators
const generateMockCase = (id: number): CaseSummary => ({
  id,
  entityId: Math.floor(Math.random() * 10000) + 1000,
  customerId:
    Math.random() > 0.3 ? Math.floor(Math.random() * 1000) + 100 : undefined,
  status: ["NEW", "IN_PROGRESS", "RESOLVED", "ESCALATED", "CLOSED"][
    Math.floor(Math.random() * 5)
  ] as any,
  priority: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)] as any,
  assignedTo:
    Math.random() > 0.2 ? Math.floor(Math.random() * 50) + 1 : undefined,
  createdAt: Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000), // Last 30 days
  updatedAt: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000), // Last 7 days
});

const generateMockCaseDetail = (id: number): CaseDetail => {
  const baseCaseData = generateMockCase(id);
  const linkedCases: LinkedCase[] = [];

  // Randomly generate 0-3 linked cases
  const numLinkedCases = Math.floor(Math.random() * 4);
  for (let i = 0; i < numLinkedCases; i++) {
    linkedCases.push({
      id: Math.floor(Math.random() * 10000) + 1,
      linkedAt:
        baseCaseData.createdAt +
        Math.floor(Math.random() * 24 * 60 * 60 * 1000),
    });
  }

  return {
    ...baseCaseData,
    parentAlertId: Math.floor(Math.random() * 10000) + 1000,
    age: `${Math.floor(Math.random() * 30) + 1} days`,
    resolutionType:
      baseCaseData.status === "RESOLVED" ? "False Positive" : undefined,
    linkedCases,
  };
};

const generateMockComment = (id: number): Comment => ({
  id,
  authorId: Math.floor(Math.random() * 50) + 1,
  header: ["Investigation", "Customer Contact", "Resolution", "Note"][
    Math.floor(Math.random() * 4)
  ] as any,
  content: [
    "Initial investigation shows suspicious activity patterns.",
    "Customer contacted via phone - confirmed legitimate transaction.",
    "Transaction verified through additional documentation.",
    "Case resolved - marked as false positive.",
    "Escalating to senior analyst for further review.",
    "Additional evidence collected from merchant records.",
  ][Math.floor(Math.random() * 6)],
  createdAt: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000),
  updatedAt: Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000),
});

const mockAlert: Alert = {
  id: "CfCZqRVEfpHXM824bSUwWe",
  transactionId: "fHYHxFybnr6Xbv6FgvJRNf",
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
      description: "sum of transactions amount not more than 50k in one day",
      expression: "sum_txn_amount_1d <= 50000.0 && customer_id != ''",
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
      card_number: "4111111111111111",
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
      merchant_categorycode: "5411",
      merchant_country: "US",
      merchant_id: "merch_123",
      merchant_name: "Sample Store",
      merchant_posid: "pos_456",
      order_dest_latitude: 37.7833,
      order_dest_longitude: -122.4167,
      order_id: "ord_202",
      order_origin_latitude: 37.7749,
      order_origin_longitude: -122.4194,
      order_received_timestamp: "2025-03-27T12:47:00Z",
      order_size: 2,
      order_status: "PENDING",
      order_timestamp: "2025-03-27T12:45:00Z",
      sum_txn_amount_1d: 5000,
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
  createdAt: 1748339826,
};

const generateMockCustomer = (id: number): Customer => ({
  id,
  name: [
    "John Doe",
    "Jane Smith",
    "Bob Johnson",
    "Alice Williams",
    "Charlie Brown",
  ][Math.floor(Math.random() * 5)],
  email: `user${id}@example.com`,
  dob: `${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}-${String(
    Math.floor(Math.random() * 12) + 1
  ).padStart(2, "0")}-${1970 + Math.floor(Math.random() * 30)}`,
  phoneNumber: `+91${Math.floor(Math.random() * 9000000000) + 1000000000}`,
  accountId: Math.floor(Math.random() * 10000) + 1000,
  createdAt: Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000),
  updatedAt: Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000),
});

// Mock data storage (in real app, this would be a database)
let mockCases: Map<number, CaseDetail> = new Map();
let mockComments: Map<string, Comment[]> = new Map(); // key: caseId
let mockCustomers: Map<number, Customer> = new Map();

// Initialize with some mock data
for (let i = 1; i <= 50; i++) {
  const caseDetail = generateMockCaseDetail(i);
  mockCases.set(i, caseDetail);

  // Generate 3-8 comments per case
  const numComments = Math.floor(Math.random() * 6) + 3;
  const comments: Comment[] = [];
  for (let j = 1; j <= numComments; j++) {
    comments.push(generateMockComment(j + i * 100));
  }
  mockComments.set(i.toString(), comments);
}

for (let i = 1; i <= 20; i++) {
  mockCustomers.set(i, generateMockCustomer(i));
}

export const handlers = [
  // GET /cases - List cases
  http.get("https://api.frm.com/v1/cases", ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "20");
    const status = url.searchParams.get("status");
    const priority = url.searchParams.get("priority");
    const search = url.searchParams.get("search");
    const sortBy = url.searchParams.get("sortBy") || "createdAt";
    const sortOrder = url.searchParams.get("sortOrder") || "desc";

    let filteredCases = Array.from(mockCases.values());

    // Apply filters
    if (status) {
      filteredCases = filteredCases.filter((case_) => case_.status === status);
    }
    if (priority) {
      filteredCases = filteredCases.filter(
        (case_) => case_.priority === priority
      );
    }
    if (search) {
      const searchNum = parseInt(search);
      if (!isNaN(searchNum)) {
        filteredCases = filteredCases.filter(
          (case_) =>
            case_.id === searchNum ||
            case_.entityId === searchNum ||
            case_.assignedTo === searchNum
        );
      }
    }

    // Apply sorting
    filteredCases.sort((a, b) => {
      const aVal = a[sortBy as keyof CaseDetail] as number;
      const bVal = b[sortBy as keyof CaseDetail] as number;
      return sortOrder === "desc" ? bVal - aVal : aVal - bVal;
    });

    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCases = filteredCases.slice(startIndex, endIndex);

    const response: CaseListResponse = {
      data: paginatedCases.map((case_) => ({
        id: case_.id,
        entityId: case_.entityId,
        customerId: case_.customerId,
        status: case_.status,
        priority: case_.priority,
        assignedTo: case_.assignedTo,
        createdAt: case_.createdAt,
        updatedAt: case_.updatedAt,
      })),
      pagination: {
        page,
        pageSize,
        totalItems: filteredCases.length,
        totalPages: Math.ceil(filteredCases.length / pageSize),
      },
    };

    return HttpResponse.json(response, { status: 200 });
  }),
  // GET /cases/summary - Get case statistics
  http.get("https://api.frm.com/v1/cases/summary", () => {
    const allCases = Array.from(mockCases.values());
    const statusCounts = allCases.reduce((acc, case_) => {
      acc[case_.status] = (acc[case_.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const data: CaseStatusSummary[] = Object.entries(statusCounts).map(
      ([status, count]) => ({
        status: status as any,
        count,
        growthPercent: (Math.random() - 0.5) * 20, // Random growth between -10% and +10%
      })
    );

    const response: CaseSummaryResponse = {
      data,
      totalCases: allCases.length,
      lastUpdated: Date.now(),
    };

    return HttpResponse.json(response, { status: 200 });
  }),
  // GET /cases/:id - Get case details
  http.get("https://api.frm.com/v1/cases/:id", ({ params }) => {
    const id = parseInt(params.id as string);
    const case_ = mockCases.get(id);

    if (!case_) {
      return HttpResponse.json(
        { code: "CASE_NOT_FOUND", message: "Case not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json(case_, { status: 200 });
  }),
  // GET /cases/:id/comments - List case comments
  http.get(
    "https://api.frm.com/v1/cases/:id/comments",
    ({ params, request }) => {
      const caseId = params.id as string;
      const url = new URL(request.url);
      const page = parseInt(url.searchParams.get("page") || "1");
      const pageSize = parseInt(url.searchParams.get("pageSize") || "20");

      const comments = mockComments.get(caseId) || [];

      // Apply pagination
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedComments = comments.slice(startIndex, endIndex);

      const response: CommentListResponse = {
        data: paginatedComments,
        pagination: {
          page,
          pageSize,
          totalItems: comments.length,
          totalPages: Math.ceil(comments.length / pageSize),
        },
      };

      return HttpResponse.json(response, { status: 200 });
    }
  ),
  // POST /cases/:id/comments - Create comment
  http.post(
    "https://api.frm.com/v1/cases/:id/comments",
    async ({ params, request }) => {
      const caseId = params.id as string;
      const body = (await request.json()) as CreateCommentRequest;

      const comments = mockComments.get(caseId) || [];
      const newComment: Comment = {
        id: Date.now(), // Simple ID generation
        authorId: 1, // Mock current user ID
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
  // GET /cases/:caseId/comments/:commentId - Get comment details
  http.get(
    "https://api.frm.com/v1/cases/:caseId/comments/:commentId",
    ({ params }) => {
      const caseId = params.caseId as string;
      const commentId = parseInt(params.commentId as string);

      const comments = mockComments.get(caseId) || [];
      const comment = comments.find((c) => c.id === commentId);

      if (!comment) {
        return HttpResponse.json(
          { code: "COMMENT_NOT_FOUND", message: "Comment not found" },
          { status: 404 }
        );
      }

      return HttpResponse.json(comment, { status: 200 });
    }
  ),
  // PUT /cases/:caseId/comments/:commentId - Update comment
  http.put(
    "https://api.frm.com/v1/cases/:caseId/comments/:commentId",
    async ({ params, request }) => {
      const caseId = params.caseId as string;
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

      const updatedComment = {
        ...comments[commentIndex],
        header: body.header,
        content: body.content,
        updatedAt: Date.now(),
      };

      comments[commentIndex] = updatedComment;
      mockComments.set(caseId, comments);

      return HttpResponse.json(updatedComment, { status: 200 });
    }
  ), // GET /customers/:id - Get customer details
  http.get("https://api.frm.com/v1/customers/:id", ({ params }) => {
    const id = parseInt(params.id as string);

    // Check if customer already exists in our cache
    let customer = mockCustomers.get(id);

    // If not found, generate one dynamically
    if (!customer) {
      customer = generateMockCustomer(id);
      mockCustomers.set(id, customer);
    }

    return HttpResponse.json(customer, { status: 200 });
  }),
  // GET /alerts/:id - Get alert details
  http.get("https://api.frm.com/v1/alerts/:id", ({ params }) => {
    const id = params.id as string;

    // For demo purposes, return the mock alert for any ID
    // In real implementation, you'd look up by ID
    const alertWithId = { ...mockAlert, id };

    return HttpResponse.json(alertWithId, { status: 200 });
  }),
];
