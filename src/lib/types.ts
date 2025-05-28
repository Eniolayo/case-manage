export interface Case {
  id: string;
  entityId: string;
  status: string;
  priority: "high" | "medium" | "low";
  assignee: string;
  created: string;
  resolution?: string;
  resolutionDate?: string;
  age?: string;
  customerId?: string;
  customerName?: string;
  phoneNumber?: string;
  accountId?: string;
  cardIssueDate?: string;
  fathersName?: string;
  cardStatus?: string;
  cardType?: string;
  alertId?: string;
  voiceNote?: Blob;
  voiceNoteTranscription?: string;
}

export interface Comment {
  id: string;
  caseId: string;
  datetime: string;
  userId: string;
  text: string;
  header?: string;
}

export interface AuditEntry {
  id: string;
  caseId: string;
  datetime: string;
  userId: string;
  action: string;
  details?: string;
}

export interface Transaction {
  id: string;
  caseId: string;
  date: string;
  response: string;
  fraudTag: string;
  scenarioName: string;
  type: string;
  amount: string;
  transactionId: string;
  channel: string;
  country: string;
  terminalId: string;
  mcc: string;
  isSuspicious: boolean;
}

export interface LinkedCase {
  id: string;
  mainCaseId: string;
  linkedCaseId: string;
  linkDate: string;
  description: string;
  status: string;
  created: string;
  entityId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  phoneNumber?: string;
}

export interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
  accountId: string;
  cardIssueDate?: string;
  fathersName?: string;
  cardStatus: string;
  cardType: string;
  address?: string;
  email?: string;
}
