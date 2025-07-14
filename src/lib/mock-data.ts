import type {
  CaseDetail,
  Comment,
  Customer,
  Transaction,
  TransactionDetail,
  EvidenceConfigResponse,
  SourceConfigResponse,
  Evidence,
} from "./api-types";

// Fixed transaction details matching the API spec and alert payload
export const MOCK_TRANSACTION_DETAILS: TransactionDetail = {
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
};

// Fixed customers data
export const FIXED_CUSTOMERS: Customer[] = [
  {
    id: 2001,
    name: "John Smith",
    email: "john.smith@example.com",
    dob: "15-06-1985",
    phoneNumber: "+1-555-0123",
    accountId: 3001,
    createdAt: Date.now() - 365 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
  },
  {
    id: 2002,
    name: "Emma Wilson",
    email: "emma.wilson@example.com",
    dob: "23-09-1990",
    phoneNumber: "+1-555-0124",
    accountId: 3002,
    createdAt: Date.now() - 180 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
  },
  {
    id: 2003,
    name: "Michael Chen",
    email: "michael.chen@example.com",
    dob: "07-12-1988",
    phoneNumber: "+1-555-0125",
    accountId: 3003,
    createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: 2004,
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    dob: "30-03-1992",
    phoneNumber: "+1-555-0126",
    accountId: 3004,
    createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: 2005,
    name: "David Brown",
    email: "david.brown@example.com",
    dob: "18-11-1987",
    phoneNumber: "+1-555-0127",
    accountId: 3005,
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
];

// Fixed transactions for each case with more variety
export const FIXED_TRANSACTIONS: Record<number, Transaction[]> = {
  1001: [
    {
      id: "TXN1001001",
      amount: 1250.0,
      currencyCode: "USD",
      status: "SUSPICIOUS",
      type: "Purchase",
      fraudSeverity: "High",
      scenarioName: "Unusual Location",
      channel: "POS",
      country: "US",
      createdAt: Date.now() - 6 * 24 * 60 * 60 * 1000,
      details: { ...MOCK_TRANSACTION_DETAILS, device_iplocation: "RU" },
    },
    {
      id: "TXN1001002",
      amount: 750.0,
      currencyCode: "USD",
      status: "SUSPICIOUS",
      type: "Purchase",
      fraudSeverity: "High",
      scenarioName: "Multiple Attempts",
      channel: "Online",
      country: "IN",
      createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
      details: { ...MOCK_TRANSACTION_DETAILS, count_txn_id_1d: 15 },
    },
  ],
  1002: [
    {
      id: "TXN1002001",
      amount: 45.0,
      currencyCode: "USD",
      status: "GENUINE",
      type: "Purchase",
      fraudSeverity: "Low",
      scenarioName: "-",
      channel: "Online",
      country: "US",
      createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
      details: MOCK_TRANSACTION_DETAILS,
    },
  ],
  1003: [
    {
      id: "TXN1003001",
      amount: 1200.0,
      currencyCode: "USD",
      status: "SUSPICIOUS",
      type: "Withdrawal",
      fraudSeverity: "High",
      scenarioName: "Large Withdrawal",
      channel: "ATM",
      country: "MX",
      createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
      details: { ...MOCK_TRANSACTION_DETAILS, account_balance: 1500 },
    },
    {
      id: "TXN1003002",
      amount: 50.0,
      currencyCode: "USD",
      status: "SUSPICIOUS",
      type: "Purchase",
      fraudSeverity: "Medium",
      scenarioName: "Unusual Time",
      channel: "Online",
      country: "US",
      createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
      details: MOCK_TRANSACTION_DETAILS,
    },
  ],
  1004: [
    {
      id: "TXN1004001",
      amount: 5000.0,
      currencyCode: "EUR",
      status: "SUSPICIOUS",
      type: "Transfer",
      fraudSeverity: "High",
      scenarioName: "International Transfer",
      channel: "Online",
      country: "FR",
      createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
      details: { ...MOCK_TRANSACTION_DETAILS, device_vpnactive: true },
    },
  ],
  1005: [
    {
      id: "TXN1005001",
      amount: 100.0,
      currencyCode: "USD",
      status: "GENUINE",
      type: "Purchase",
      fraudSeverity: "Low",
      scenarioName: "False Positive",
      channel: "Mobile",
      country: "US",
      createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
      details: MOCK_TRANSACTION_DETAILS,
    },
  ],
};

// Fixed comments for each case
export const FIXED_COMMENTS: Record<number, Comment[]> = {
  1001: [
    {
      id: 1,
      authorId: 101,
      header: "Investigation",
      content:
        "Multiple high-value transactions from unusual locations detected. IP address traced to known VPN service.",
      createdAt: Date.now() - 6 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 6 * 24 * 60 * 60 * 1000,
    },
    {
      id: 2,
      authorId: 101,
      header: "Customer Contact",
      content:
        "Customer contacted and confirmed they are traveling abroad. However, some transactions were not recognized.",
      createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    },
  ],
  1002: [
    {
      id: 3,
      authorId: 102,
      header: "Note",
      content:
        "Small value transaction flagged due to unusual pattern. Requires further investigation.",
      createdAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
    },
  ],
  1003: [
    {
      id: 4,
      authorId: 102,
      header: "Investigation",
      content:
        "Large ATM withdrawal followed by multiple small online purchases. Typical money mule pattern.",
      createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    },
  ],
  1004: [
    {
      id: 5,
      authorId: 103,
      header: "Resolution",
      content:
        "Case confirmed as fraudulent. Customer's card has been blocked and new card issued.",
      createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    },
  ],
  1005: [
    {
      id: 6,
      authorId: 104,
      header: "Resolution",
      content:
        "Transaction pattern matches customer's normal behavior. Case closed as false positive.",
      createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    },
  ],
};

// Fixed cases data
export const FIXED_CASES: CaseDetail[] = [
  {
    id: 1001,
    entityId: 5001,
    customerId: 2001,
    parentAlertId: 3001,
    status: "IN_PROGRESS",
    priority: "High",
    assignedTo: 101,
    age: "6d",
    resolutionType: undefined,
    linkedCases: [{ id: 1002, linkedAt: Date.now() - 5 * 24 * 60 * 60 * 1000 }],
    createdAt: Date.now() - 6 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    id: 1002,
    entityId: 5002,
    customerId: 2002,
    parentAlertId: 3002,
    status: "NEW",
    priority: "Medium",
    assignedTo: undefined,
    age: "5d",
    resolutionType: undefined,
    linkedCases: [],
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: 1003,
    entityId: 5003,
    customerId: 2003,
    parentAlertId: 3003,
    status: "ESCALATED",
    priority: "High",
    assignedTo: 102,
    age: "3d",
    resolutionType: undefined,
    linkedCases: [{ id: 1001, linkedAt: Date.now() - 2 * 24 * 60 * 60 * 1000 }],
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 60 * 60 * 1000,
  },
  {
    id: 1004,
    entityId: 5004,
    customerId: 2004,
    parentAlertId: 3004,
    status: "RESOLVED",
    priority: "Medium",
    assignedTo: 103,
    age: "10d",
    resolutionType: "Confirmed Fraud",
    linkedCases: [],
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: 1005,
    entityId: 5005,
    customerId: 2005,
    parentAlertId: 3005,
    status: "CLOSED",
    priority: "Low",
    assignedTo: 104,
    age: "15d",
    resolutionType: "False Positive",
    linkedCases: [],
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
];

// Mock source configuration for customer portal links
export const MOCK_SOURCE_CONFIG: SourceConfigResponse = {
  data: [
    {
      id: 1,
      source_system: "FRM",
      entity_type: "customer",
      external_link_config: {
        customer_portal_url:
          "https://customer-portal.demo.company.com/customers/{customer_id}",
        display_name: "Customer Portal",
        open_in_new_tab: true,
      },
      ui_config: [
        {
          path: "$.customer_id",
          field: "customer_id",
          display_text: "Customer ID",
          component_type: "text",
        },
        {
          path: "$.name",
          field: "name",
          display_text: "Customer Name",
          component_type: "text",
        },
      ],
      source_api: {
        url: "https://customer-api.demo.company.com/customers/{entityId}",
        headers: {
          Authorization: "Bearer demo-token",
          "Content-Type": "application/json",
        },
        query_params: {},
        response_schema: {
          type: "object",
          properties: {
            id: { type: "number" },
            name: { type: "string" },
            email: { type: "string" },
          },
        },
      },
    },
  ],
};

const RealEvidenceConfig = {
  data: [
    {
      id: 1,
      source_system: "frm",
      evidence_type: "transaction",
      evidence_schema: {
        type: "object",
        $schema: "http://json-schema.org/draft-04/schema#",
        required: [
          "payload",
          "rulesFlagged",
          "evaluationSummary",
          "action",
          "createdAt",
        ],
        properties: {
          action: {
            type: "string",
          },
          payload: {
            type: "object",
            required: ["data"],
            properties: {
              data: {
                type: "object",
                required: [
                  "account_id",
                  "account_type",
                  "card_number",
                  "card_type",
                  "wallet_id",
                ],
                properties: {
                  card_type: {
                    type: "string",
                  },
                  wallet_id: {
                    type: "string",
                  },
                  account_id: {
                    type: "string",
                  },
                  card_number: {
                    type: "string",
                  },
                  account_type: {
                    type: "string",
                  },
                },
              },
            },
          },
          createdAt: {
            type: "integer",
          },
          rulesFlagged: {
            type: "array",
            items: [
              {
                type: "object",
                required: ["title"],
                properties: {
                  title: {
                    type: "string",
                  },
                },
              },
            ],
          },
          evaluationSummary: {
            type: "array",
            items: [
              {
                type: "object",
                required: ["title", "flagged", "isExecuted"],
                properties: {
                  title: {
                    type: "string",
                  },
                  flagged: {
                    type: "boolean",
                  },
                  isExecuted: {
                    type: "boolean",
                  },
                },
              },
            ],
          },
        },
      },
      ui_config: {
        fields: [
          {
            name: "account_id",
            path: "$.payload.data.account_id",
            display_name: "Account ID",
          },
          {
            name: "account_type",
            path: "$.payload.data.account_type",
            display_name: "Account Type",
          },
          {
            name: "card_number",
            path: "$.payload.data.card_number",
            display_name: "Card Number",
          },
          {
            name: "card_type",
            path: "$.payload.data.card_type",
            display_name: "Card Type",
          },
          {
            name: "wallet_id",
            path: "$.payload.data.wallet_id",
            display_name: "Wallet ID",
          },
          {
            name: "rule_flagged_title",
            path: "$.rulesFlagged[*].title",
            display_name: "Rule Flagged Title",
          },
          {
            name: "evaluation_summary_title",
            path: "$.evaluationSummary[*].title",
            display_name: "Evaluation Summary Title",
          },
          {
            name: "evaluation_summary_flagged",
            path: "$.evaluationSummary[*].flagged",
            display_name: "Evaluation Flagged",
          },
          {
            name: "evaluation_summary_is_executed",
            path: "$.evaluationSummary[*].isExecuted",
            display_name: "Evaluation Executed",
          },
          {
            name: "action",
            path: "$.action",
            display_name: "Action",
          },
          {
            name: "created_at",
            path: "$.createdAt",
            display_name: "Created At",
          },
        ],
      },
      created_at: "2025-07-07T22:42:20+05:30",
      updated_at: "2025-07-07T22:42:20+05:30",
      created_by: 1,
      updated_by: 1,
    },
  ],
  total: 1,
};

// Realistic evidence data from multiple source systems - based on RealEvidenceConfig structure
export const MOCK_EVIDENCE_DATA: Evidence[] = [
  {
    id: "FRM_TXN_123456789",
    evidence_type: "transaction",
    source_system: "FRM",
    created_at: "2023-05-20T08:45:00Z",
    updated_at: "2023-05-20T08:45:00Z",
    status: "flagged",
    risk_level: "High",
    title: "Suspicious Transaction - Unusual Location",
    description:
      "High-value transaction ($1,250) from unusual geographic location",
    linked_at: "2023-05-20T09:00:00Z",
    action: "DECLINE",
    receivedAt: 1684572300,
    payload: {
      data: {
        account_balance: 10000,
        account_id: "acc_789",
        account_type: "SAVINGS",
        card_masked: true,
        card_number: "4111111111111111",
        card_type: "CREDIT",
        count_txn_id_1d: 5,
        counter_partyid: "cp_303",
        wallet_id: "wallet_123",
        amount: 1250.0,
        currency: "USD",
        merchant: "Electronics Store XYZ",
        location: "Mumbai, India",
        transaction_type: "Purchase",
      },
    },
    rulesFlagged: [
      {
        id: "1920386885251764224",
        title: "Unusual Location Transaction",
        description:
          "Transaction from location significantly different from customer's usual pattern",
        expression:
          "transaction_location_distance > 1000km && account_velocity_24h > 3",
      },
      {
        id: "1920386885251764225",
        title: "High Value Transaction",
        description:
          "Transaction amount exceeds customer's typical spending pattern",
        expression: "transaction_amount > avg_monthly_spend * 0.5",
      },
    ],
    evaluationSummary: [
      {
        id: "1920386885251764224",
        title: "Unusual Location Transaction",
        description:
          "Transaction from location significantly different from customer's usual pattern",
        expression:
          "transaction_location_distance > 1000km && account_velocity_24h > 3",
        flagged: true,
        isExecuted: true,
      },
      {
        id: "1920386885251764225",
        title: "High Value Transaction",
        description:
          "Transaction amount exceeds customer's typical spending pattern",
        expression: "transaction_amount > avg_monthly_spend * 0.5",
        flagged: true,
        isExecuted: true,
      },
    ],
  },
  {
    id: "FRM_TXN_123456790",
    evidence_type: "transaction",
    source_system: "FRM",
    created_at: "2023-05-20T08:47:00Z",
    updated_at: "2023-05-20T08:47:00Z",
    status: "flagged",
    risk_level: "High",
    title: "Multiple Failed Attempts",
    description: "3 consecutive failed transactions within 2 minutes",
    linked_at: "2023-05-20T09:00:00Z",
    action: "BLOCK",
    receivedAt: 1684572420,
    payload: {
      data: {
        account_balance: 10000,
        account_id: "acc_789",
        account_type: "SAVINGS",
        card_masked: true,
        card_number: "4111111111111111",
        card_type: "CREDIT",
        count_txn_id_1d: 15,
        counter_partyid: "cp_404",
        wallet_id: "wallet_123",
        amount: 750.0,
        currency: "USD",
        merchant: "Online Retailer ABC",
        failed_attempts: 3,
        time_window: "2 minutes",
      },
    },
    rulesFlagged: [
      {
        id: "1920386885251764226",
        title: "Multiple Failed Attempts",
        description:
          "Multiple consecutive transaction failures in short time window",
        expression: "failed_attempts >= 3 && time_window <= 300",
      },
    ],
    evaluationSummary: [
      {
        id: "1920386885251764226",
        title: "Multiple Failed Attempts",
        description:
          "Multiple consecutive transaction failures in short time window",
        expression: "failed_attempts >= 3 && time_window <= 300",
        flagged: true,
        isExecuted: true,
      },
    ],
  },
  {
    id: "AML_SCREEN_456789",
    evidence_type: "aml_screening",
    source_system: "AML_ENGINE",
    created_at: "2023-05-20T09:15:00Z",
    updated_at: "2023-05-20T09:15:00Z",
    status: "pending",
    risk_level: "Medium",
    title: "AML Screening Alert",
    description: "Customer appears on enhanced due diligence watchlist",
    linked_at: "2023-05-20T09:20:00Z",
    action: "REVIEW",
    receivedAt: 1684574100,
    payload: {
      data: {
        customer_id: "cust_456",
        watchlist_type: "Enhanced Due Diligence",
        match_score: 0.85,
        screening_provider: "Thomson Reuters World-Check",
        customer_segment: "High Net Worth",
        last_screening: "2023-05-15T10:30:00Z",
      },
    },
    rulesFlagged: [
      {
        id: "AML_001",
        title: "Watchlist Match",
        description:
          "Customer profile matches enhanced due diligence watchlist",
        expression:
          "match_score > 0.8 && watchlist_type == 'Enhanced Due Diligence'",
      },
    ],
    evaluationSummary: [
      {
        id: "AML_001",
        title: "Watchlist Match",
        description:
          "Customer profile matches enhanced due diligence watchlist",
        expression:
          "match_score > 0.8 && watchlist_type == 'Enhanced Due Diligence'",
        flagged: true,
        isExecuted: true,
      },
    ],
  },
  {
    id: "KYC_DOC_789123",
    evidence_type: "kyc_document",
    source_system: "KYC_PORTAL",
    created_at: "2023-05-19T14:30:00Z",
    updated_at: "2023-05-20T10:15:00Z",
    status: "reviewed",
    risk_level: "Low",
    title: "Document Verification Completed",
    description: "ID document verification passed with high confidence",
    linked_at: "2023-05-20T09:00:00Z",
    action: "APPROVE",
    receivedAt: 1684498200,
    payload: {
      data: {
        document_type: "Passport",
        verification_method: "OCR + Face Match",
        confidence_score: 0.96,
        issuing_country: "United States",
        expiry_date: "2028-03-15",
        verification_provider: "Jumio",
        document_id: "DOC_789123",
      },
    },
    rulesFlagged: [],
    evaluationSummary: [
      {
        id: "KYC_001",
        title: "Document Verification",
        description: "Automated document verification check",
        expression: "confidence_score > 0.9 && document_expiry > current_date",
        flagged: false,
        isExecuted: true,
      },
    ],
  },
  {
    id: "DEV_FP_987654",
    evidence_type: "device_fingerprint",
    source_system: "DEVICE_INTEL",
    created_at: "2023-05-20T08:44:00Z",
    updated_at: "2023-05-20T08:44:00Z",
    status: "flagged",
    risk_level: "Critical",
    title: "Suspicious Device Detected",
    description: "Device shows signs of emulation and VPN usage",
    linked_at: "2023-05-20T09:00:00Z",
    action: "BLOCK",
    receivedAt: 1684572240,
    payload: {
      data: {
        device_id: "fp_abc123xyz",
        ip_address: "192.168.1.100",
        user_agent: "Modified browser signature",
        vpn_detected: true,
        emulator_detected: true,
        location_spoofing: true,
        ip_reputation: "malicious",
        provider: "ThreatMetrix",
      },
    },
    rulesFlagged: [
      {
        id: "DEV_001",
        title: "Device Emulation Detected",
        description: "Device shows characteristics of mobile emulator",
        expression: "emulator_detected == true",
      },
      {
        id: "DEV_002",
        title: "VPN Usage Detected",
        description: "Traffic routed through VPN service",
        expression: "vpn_detected == true",
      },
    ],
    evaluationSummary: [
      {
        id: "DEV_001",
        title: "Device Emulation Detected",
        description: "Device shows characteristics of mobile emulator",
        expression: "emulator_detected == true",
        flagged: true,
        isExecuted: true,
      },
      {
        id: "DEV_002",
        title: "VPN Usage Detected",
        description: "Traffic routed through VPN service",
        expression: "vpn_detected == true",
        flagged: true,
        isExecuted: true,
      },
    ],
  },
  {
    id: "BEHAV_ANALYSIS_654321",
    evidence_type: "behavioral_analysis",
    source_system: "BEHAVIORAL_AI",
    created_at: "2023-05-20T08:30:00Z",
    updated_at: "2023-05-20T08:30:00Z",
    status: "flagged",
    risk_level: "High",
    title: "Anomalous User Behavior",
    description:
      "Typing patterns and navigation behavior significantly different from baseline",
    linked_at: "2023-05-20T09:00:00Z",
    action: "CHALLENGE",
    receivedAt: 1684571400,
    payload: {
      data: {
        behavioral_score: 0.23,
        baseline_score: 0.89,
        session_id: "sess_789456",
        confidence_level: 0.91,
        model_version: "v2.1.3",
        provider: "BioCatch",
        typing_cadence_variance: 0.75,
        mouse_movement_entropy: 0.45,
      },
    },
    rulesFlagged: [
      {
        id: "BEHAV_001",
        title: "Behavioral Score Anomaly",
        description:
          "User behavior significantly deviates from established baseline",
        expression: "behavioral_score < baseline_score * 0.3",
      },
    ],
    evaluationSummary: [
      {
        id: "BEHAV_001",
        title: "Behavioral Score Anomaly",
        description:
          "User behavior significantly deviates from established baseline",
        expression: "behavioral_score < baseline_score * 0.3",
        flagged: true,
        isExecuted: true,
      },
    ],
  },
];

// Updated evidence configuration to support multiple evidence types
export const MOCK_EVIDENCE_CONFIG: EvidenceConfigResponse = {
  data: [
    {
      id: 1,
      source_system: "FRM",
      evidence_type: "transaction",
      external_link_config: {
        url_template:
          "https://frm-dashboard.demo.company.com/transactions/{evidence_id}",
        display_name: "FRM Dashboard",
        icon: "external-link",
        open_in_new_tab: true,
      },
      evidence_schema: {
        type: "object",
        properties: {
          id: { type: "string" },
          amount: { type: "number" },
          merchant: { type: "string" },
        },
      },
      ui_config: {
        fields: [
          {
            name: "transaction_id",
            path: "$.id",
            display_text: "Transaction ID",
            component_type: "text",
          },
        ],
      },
    },
    {
      id: 2,
      source_system: "AML_ENGINE",
      evidence_type: "aml_screening",
      external_link_config: {
        url_template:
          "https://aml-portal.demo.company.com/screenings/{evidence_id}",
        display_name: "AML Portal",
        icon: "external-link",
        open_in_new_tab: true,
      },
      evidence_schema: {
        type: "object",
        properties: {
          id: { type: "string" },
          match_score: { type: "number" },
          watchlist_type: { type: "string" },
        },
      },
      ui_config: {
        fields: [
          {
            name: "screening_id",
            path: "$.id",
            display_text: "Screening ID",
            component_type: "text",
          },
        ],
      },
    },
    {
      id: 3,
      source_system: "KYC_PORTAL",
      evidence_type: "kyc_document",
      external_link_config: {
        url_template:
          "https://kyc-system.demo.company.com/documents/{evidence_id}",
        display_name: "KYC System",
        icon: "external-link",
        open_in_new_tab: true,
      },
      evidence_schema: {
        type: "object",
        properties: {
          id: { type: "string" },
          document_type: { type: "string" },
          verification_status: { type: "string" },
        },
      },
      ui_config: {
        fields: [
          {
            name: "document_id",
            path: "$.id",
            display_text: "Document ID",
            component_type: "text",
          },
        ],
      },
    },
  ],
};
