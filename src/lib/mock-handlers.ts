import { http, HttpResponse } from "msw";
import type {
  CaseListResponse,
  CaseDetail,
  CommentListResponse,
  Comment,
  CreateCommentRequest,
  CaseSummary,
  LinkedCase,
  CommentHeader,
  CaseStatus,
  CasePriority,
  Customer,
} from "../lib/api-types";

// Mock data storage
const mockCases = new Map<number, CaseDetail>();
const mockComments = new Map<number, Comment[]>();
const mockCustomers = new Map<number, Customer>();

// Mock data generators
const FRAUD_ALERT_IDS = [
  "ALT20250329123",
  "ALT20250329124",
  "ALT20250329125",
  "ALT20250329126",
];

const MOCK_CARD_NUMBERS = [
  "4532XXXXXXXX1234",
  "5412XXXXXXXX5678",
  "3782XXXXXXXX9012",
  "6011XXXXXXXX3456",
];

const MOCK_LOCATIONS = [
  "New York, USA",
  "London, UK",
  "Sydney, Australia",
  "Tokyo, Japan",
  "Mumbai, India",
];

const MOCK_MERCHANTS = [
  { name: "Amazon", mcc: "5999" },
  { name: "Walmart", mcc: "5411" },
  { name: "Best Buy", mcc: "5732" },
  { name: "Target", mcc: "5311" },
  { name: "Nike", mcc: "5661" },
];

const generateMockCase = (id: number): CaseSummary => {
  const now = Date.now();
  const isHighPriority = Math.random() > 0.7;
  const isClosed = Math.random() > 0.8;

  return {
    id,
    entityId: Math.floor(Math.random() * 10000) + 1000,
    customerId: Math.floor(Math.random() * 1000) + 100,
    status: isClosed
      ? "CLOSED"
      : isHighPriority
      ? Math.random() > 0.5
        ? "IN_PROGRESS"
        : "ESCALATED"
      : (["NEW", "IN_PROGRESS", "RESOLVED"][
          Math.floor(Math.random() * 3)
        ] as CaseStatus),
    priority: isHighPriority
      ? "High"
      : ((Math.random() > 0.5 ? "Medium" : "Low") as CasePriority),
    assignedTo:
      Math.random() > 0.2 ? Math.floor(Math.random() * 5) + 1 : undefined,
    createdAt: now - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000),
    updatedAt: now - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000),
  };
};

const generateMockCustomer = (id: number): Customer => {
  const now = Date.now();
  const names = [
    "John Smith",
    "Emma Johnson",
    "Michael Brown",
    "Sarah Davis",
    "James Wilson",
  ];
  const emails = ["@gmail.com", "@yahoo.com", "@hotmail.com", "@outlook.com"];

  const name = names[Math.floor(Math.random() * names.length)];
  const email =
    name.toLowerCase().replace(" ", ".") +
    emails[Math.floor(Math.random() * emails.length)];

  return {
    id,
    name,
    email,
    phoneNumber: "+1" + Math.floor(Math.random() * 9000000000 + 1000000000),
    dob: "1980-01-01", // Simplified for demo
    accountId: Math.floor(Math.random() * 10000) + 1000,
    createdAt: now - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000),
    updatedAt: now - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000),
  };
};

const generateMockCaseDetail = (id: number): CaseDetail => {
  const baseCaseData = generateMockCase(id);
  const linkedCases: LinkedCase[] = [];

  // Generate 2-3 linked cases for a rich demo
  [1020, 1025].forEach((linkedId) => {
    if (linkedId !== id) {
      linkedCases.push({
        id: linkedId,
        linkedAt: baseCaseData.createdAt + 24 * 60 * 60 * 1000, // 1 day after case creation
      });
    }
  });

  // Add additional case-specific data
  return {
    ...baseCaseData,
    parentAlertId: Math.floor(Math.random() * 1000) + 1,
    age:
      Math.floor(
        (Date.now() - baseCaseData.createdAt) / (24 * 60 * 60 * 1000)
      ) + "d",
    resolutionType:
      baseCaseData.status === "RESOLVED"
        ? Math.random() > 0.7
          ? "Confirmed Fraud"
          : "False Positive"
        : undefined,
    linkedCases,
  };
};

const generateMockComments = (caseId: number): Comment[] => {
  const commentTemplates: Array<[CommentHeader, string]> = [
    [
      "Investigation",
      "Initial review shows suspicious transactions from multiple locations within a short timeframe.",
    ],
    [
      "Customer Contact",
      "Called customer at primary number. Customer confirmed they are traveling but did not make all transactions.",
    ],
    [
      "Investigation",
      "Analysis of transaction pattern shows potential card skimming at location: MERCHANT-1234",
    ],
    [
      "Resolution",
      "Case verified as fraud. Card has been blocked and replacement requested.",
    ],
    [
      "Note",
      "Forwarded merchant details to Merchant Risk team for investigation.",
    ],
    [
      "Customer Contact",
      "Follow-up call with customer to confirm receipt of replacement card.",
    ],
  ];

  return commentTemplates.map((template, index) => {
    const [header, content] = template;
    const baseTime = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days ago
    const timeIncrement = 24 * 60 * 60 * 1000 * index; // Space comments 1 day apart

    return {
      id: caseId * 100 + index,
      authorId: (index % 2) + 1, // Alternate between 2 users for demo
      header,
      content,
      createdAt: baseTime + timeIncrement,
      updatedAt: baseTime + timeIncrement,
    };
  });
};

// Initialize mock data with high volume
// Generate 100 cases for a high traffic scenario
Array.from({ length: 100 }, (_, i) => 1000 + i).forEach((id) => {
  const caseDetail = generateMockCaseDetail(id);
  mockCases.set(id, caseDetail);
  mockComments.set(id, generateMockComments(id));
  if (caseDetail.customerId) {
    mockCustomers.set(
      caseDetail.customerId,
      generateMockCustomer(caseDetail.customerId)
    );
  }
});

// API request handlers
export const handlers = [
  // GET /cases - List cases
  http.get("https://api.frm.com/v1/cases", ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const pageSize = parseInt(url.searchParams.get("pageSize") || "20");
    const status = url.searchParams.get("status") as CaseStatus | null;
    const priority = url.searchParams.get("priority") as CasePriority | null;
    const search = url.searchParams.get("search");
    const assignedToStr = url.searchParams.get("assignedTo");
    const assignedTo = assignedToStr ? parseInt(assignedToStr) : undefined;

    let allCases = Array.from(mockCases.values());

    // Apply filters
    if (status) {
      allCases = allCases.filter((case_) => case_.status === status);
    }
    if (priority) {
      allCases = allCases.filter((case_) => case_.priority === priority);
    }
    if (assignedTo !== undefined) {
      allCases = allCases.filter((case_) => case_.assignedTo === assignedTo);
    }
    if (search) {
      const searchLower = search.toLowerCase();
      allCases = allCases.filter(
        (case_) =>
          case_.id.toString().includes(searchLower) ||
          case_.entityId.toString().includes(searchLower)
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

    return HttpResponse.json(case_);
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
