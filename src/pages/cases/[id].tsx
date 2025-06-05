"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LinkIcon,
  Clock,
  FileText,
  Send,
  Eye,
  EyeOff,
  Play,
  Pause,
  Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/page-header";
import { CaseDetailSkeleton } from "@/components/skeleton-loaders";
import { DataTable } from "@/components/data-table";
import type { Column } from "@/components/data-table";
import {
  useCase,
  useCaseComments,
  useCreateComment,
  useCustomer,
} from "@/hooks/use-api";
import type { Comment, LinkedCase } from "@/lib/api-types";

type Transaction = {
  id: string;
  date: string;
  amount: number;
  status: string;
  fraudSeverity: string;
  scenarioName: string;
  transactionType: string;
  channel: string;
  country: string;
  details: string;
};

// Sample transaction data
const transactionData: Transaction[] = [
  {
    id: "TXN123456789",
    date: "2023-05-20 08:45",
    amount: 1250.0,
    status: "Pending",
    fraudSeverity: "High",
    scenarioName: "Unusual Location",
    transactionType: "Purchase",
    channel: "POS",
    country: "USA",
    details: "TXN123456789",
  },
  {
    id: "TXN123456790",
    date: "2023-05-20 08:47",
    amount: 750.0,
    status: "Pending",
    fraudSeverity: "High",
    scenarioName: "Multiple Attempts",
    transactionType: "Purchase",
    channel: "POS",
    country: "USA",
    details: "TXN123456790",
  },
  {
    id: "TXN123456788",
    date: "2023-05-19 14:30",
    amount: 45.0,
    status: "Genuine",
    fraudSeverity: "Low",
    scenarioName: "-",
    transactionType: "Purchase",
    channel: "Online",
    country: "India",
    details: "TXN123456788",
  },
];

// Transaction table columns
const transactionColumns: Column<Transaction>[] = [
  {
    key: "date",
    title: "Transaction Date",
    sortable: true,
  },
  {
    key: "fraudSeverity",
    title: "Fraud Severity",
    sortable: true,
  },
  {
    key: "scenarioName",
    title: "Scenario Name",
    sortable: true,
  },
  {
    key: "transactionType",
    title: "Transaction Type",
    sortable: true,
  },
  {
    key: "amount",
    title: "Amount",
    sortable: true,
    render: (value) => `$${value.toFixed(2)}`,
  },
  {
    key: "id",
    title: "Transaction ID",
    render: (value) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-help underline decoration-dotted">
              {value}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Click to view full transaction details</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    key: "channel",
    title: "Channel",
    sortable: true,
  },
  {
    key: "country",
    title: "Country",
    sortable: true,
  },
];

// Comments table columns
const commentsColumns: Column<Comment>[] = [
  {
    key: "createdAt",
    title: "Datetime",
    sortable: true,
    render: (value) => new Date(value).toLocaleString(),
  },
  {
    key: "authorId",
    title: "User ID",
    render: (value) => `user.${value}`,
  },
  {
    key: "header",
    title: "Header",
    render: (value) => (
      <Badge
        variant="outline"
        className={
          value === "Investigation"
            ? "bg-blue-50"
            : value === "Customer Contact"
            ? "bg-purple-50"
            : value === "Resolution"
            ? "bg-green-50"
            : "bg-gray-50"
        }
      >
        {value}
      </Badge>
    ),
  },
  {
    key: "content",
    title: "Comment",
  },
];

// Audit history data type and columns
type AuditEntry = {
  id: string;
  datetime: string;
  userId: string;
  action: string;
};

const auditData: AuditEntry[] = [
  {
    id: "1",
    datetime: "2023-05-20 09:30",
    userId: "system",
    action: "Case created",
  },
  {
    id: "2",
    datetime: "2023-05-20 09:30",
    userId: "system",
    action: "Assigned to john.doe",
  },
  {
    id: "3",
    datetime: "2023-05-20 09:35",
    userId: "john.doe",
    action: "Status changed to WIP",
  },
  {
    id: "4",
    datetime: "2023-05-22 14:45",
    userId: "jane.smith",
    action: "Comment added",
  },
];

const auditColumns: Column<AuditEntry>[] = [
  {
    key: "datetime",
    title: "Datetime",
    sortable: true,
  },
  {
    key: "userId",
    title: "User ID",
  },
  {
    key: "action",
    title: "Action",
  },
];
export default function CaseDetailPage() {
  const params = useParams();
  const caseId = params.id ? parseInt(params.id, 10) : 0;

  // Pagination state for comments
  const [commentsPage, setCommentsPage] = useState(1);
  const commentsPageSize = 10;

  // API hooks
  const {
    data: caseData,
    isLoading: caseLoading,
    error: caseError,
  } = useCase(caseId);
  const { data: commentsData, isLoading: commentsLoading } = useCaseComments(
    caseId,
    { page: commentsPage, pageSize: commentsPageSize }
  );
  const createCommentMutation = useCreateComment(caseId);
  const isSubmittingComment = createCommentMutation.isPending;
  const { data: customerData, isLoading: customerLoading } = useCustomer(
    caseData?.customerId || 0
  );

  const [showForwardDialog, setShowForwardDialog] = useState(false);
  const [comment, setComment] = useState("");
  const [commentHeader, setCommentHeader] = useState("");
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [voiceNoteTranscription] = useState(
    "This is a simulated transcription of the case voice note. The customer is reporting suspicious transactions on their card that they did not authorize."
  );
  // Voice note states
  const [isVoiceNotePlaying, setIsVoiceNotePlaying] = useState(false);
  const [voiceNoteCurrentTime, setVoiceNoteCurrentTime] = useState(0);
  const voiceNoteDuration = 45; // 45 seconds dummy duration
  const voiceNoteTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (voiceNoteTimerRef.current) {
        clearInterval(voiceNoteTimerRef.current);
      }
    };
  }, []);
  // Show loading skeleton while data is loading
  if (caseLoading || commentsLoading || customerLoading) {
    return <CaseDetailSkeleton />;
  }

  // Show error state if there's an error
  if (caseError || !caseData) {
    return (
      <div className="flex min-h-screen flex-col">
        <PageHeader title="Case Details" />
        <main className="flex-1 p-6">
          <div className="text-center py-8">
            <p className="text-red-500">
              Error loading case: {caseError?.message || "Case not found"}
            </p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Try Again
            </Button>
          </div>
        </main>
      </div>
    );
  }
  const handleAddComment = async () => {
    if (!comment.trim() || !commentHeader) return;

    try {
      await createCommentMutation.mutateAsync({
        content: comment,
        header: commentHeader as any,
      });
      setComment("");
      setCommentHeader("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };
  // Voice note functions
  const handleVoiceNotePlay = () => {
    if (!isVoiceNotePlaying) {
      setIsVoiceNotePlaying(true);
      // Simulate playback progress
      voiceNoteTimerRef.current = setInterval(() => {
        setVoiceNoteCurrentTime((prev) => {
          if (prev >= voiceNoteDuration - 1) {
            setIsVoiceNotePlaying(false);
            if (voiceNoteTimerRef.current) {
              clearInterval(voiceNoteTimerRef.current);
            }
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setIsVoiceNotePlaying(false);
      if (voiceNoteTimerRef.current) {
        clearInterval(voiceNoteTimerRef.current);
      }
    }
  };

  const handleVoiceNoteDownload = () => {
    // Simulate download of voice note
    alert("Voice note download started (simulated)");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "in_progress":
      case "in-progress":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            In Progress
          </Badge>
        );
      case "resolved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Resolved
          </Badge>
        );
      case "escalated":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Escalated
          </Badge>
        );
      case "new":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            New
          </Badge>
        );
      case "closed":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            Closed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  const formatPhoneNumber = (phone: string, masked: boolean) => {
    if (masked) {
      // Show first 3 and last 5 digits, mask the middle
      const cleaned = phone.replace(/\D/g, "");
      if (cleaned.length >= 8) {
        const start = cleaned.slice(0, 3);
        const end = cleaned.slice(-5);
        return `+${start}-XXXXX-${end}`;
      }
      return "XXX-XXXXX-XXXXX";
    }
    return phone;
  };

  return (
    <div className="min-h-screen">
      <PageHeader title="Case Details" />{" "}
      <div className=" flex flex-col items-start justify-between gap-4 px-4 py-4 sm:flex-row sm:items-center">
        <div>
          <Breadcrumb className="mb-2">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Case {caseData.id}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-bold">
            Case {caseData.id} - {customerData?.name || "Loading..."}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Dialog open={showForwardDialog} onOpenChange={setShowForwardDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Send className="h-4 w-4" />
                <span>Case Forward</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Forward Case</DialogTitle>
                <DialogDescription>
                  Forward this case to another analyst or team for further
                  investigation.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="forward-to">Forward To</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="self">Myself</SelectItem>
                      <SelectItem value="high">High Priority Queue</SelectItem>
                      <SelectItem value="general">General Queue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="forward-reason">Reason</Label>
                  <Textarea
                    placeholder="Explain why you're forwarding this case..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowForwardDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setShowForwardDialog(false)}>
                  Forward Case
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <main className=" flex-1 px-4 pb-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              {" "}
              <CardContent className="p-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Case ID
                    </Label>
                    <p className="font-medium">Case - {params.id}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Entity ID
                    </Label>
                    <p className="font-medium">{caseData.entityId}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Case Status
                    </Label>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(caseData.status)}
                    </div>
                  </div>{" "}
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Case Priority
                    </Label>
                    <div className="flex items-center gap-1">
                      {" "}
                      <Badge
                        className={`${
                          caseData.priority === "High"
                            ? "bg-red-100 text-red-800 hover:bg-red-100"
                            : caseData.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            : "bg-green-100 text-green-800 hover:bg-green-100"
                        }`}
                      >
                        {caseData.priority.charAt(0).toUpperCase() +
                          caseData.priority.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Assignee
                    </Label>
                    <p className="font-medium">
                      {caseData.assignedTo || "Unassigned"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Created Datetime
                    </Label>
                    <div className="flex items-center gap-1">
                      <p className="font-medium">
                        {new Date(caseData.createdAt).toLocaleDateString()}{" "}
                        <br />
                        {new Date(caseData.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Resolution Datetime
                    </Label>{" "}
                    <p className="font-medium">
                      {caseData.status === "RESOLVED"
                        ? new Date(caseData.updatedAt).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Case Age
                    </Label>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <p className="font-medium">3d 5h 26m</p>
                    </div>
                  </div>
                </div>{" "}
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="resolution-type">Resolution Type</Label>
                    <Select disabled={caseData.status.toLowerCase() !== "new"}>
                      <SelectTrigger id="resolution-type">
                        <SelectValue placeholder="Select Resolution Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="genuine">Genuine Case</SelectItem>
                        <SelectItem value="fraud">Confirm Fraud</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comment-header">Comment Header</Label>
                    <Select
                      value={commentHeader}
                      onValueChange={setCommentHeader}
                      disabled={
                        !["new", "in_progress", "in-progress"].includes(
                          caseData.status.toLowerCase()
                        )
                      }
                    >
                      <SelectTrigger id="comment-header">
                        <SelectValue placeholder="Select Comment Header" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="investigation">
                          Investigation
                        </SelectItem>
                        <SelectItem value="customer-contact">
                          Customer Contact
                        </SelectItem>
                        <SelectItem value="resolution">Resolution</SelectItem>
                        <SelectItem value="note">General Note</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>{" "}
                  <div className="border col-span-full rounded-lg p-3 bg-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Voice Note Transcription
                      </span>
                    </div>

                    {/* Voice Note Player */}
                    <div className="mb-3 p-3 bg-white rounded border">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleVoiceNotePlay}
                            className="flex items-center gap-2"
                          >
                            {isVoiceNotePlaying ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                            {isVoiceNotePlaying ? "Pause" : "Play"}
                          </Button>
                          <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700"
                          >
                            {formatTime(voiceNoteCurrentTime)} /{" "}
                            {formatTime(voiceNoteDuration)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleVoiceNoteDownload}
                            className="flex items-center gap-1"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              (voiceNoteCurrentTime / voiceNoteDuration) * 100
                            }%`,
                          }}
                        />
                      </div>

                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Recorded: May 20, 2023 09:25 AM</span>
                        <span>Duration: {formatTime(voiceNoteDuration)}</span>
                      </div>
                    </div>

                    <p className="text-sm mt-1 bg-muted/30 rounded p-2">
                      {voiceNoteTranscription}
                    </p>
                  </div>{" "}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="comment">Enter comment</Label>
                    <div className="flex flex-col gap-2">
                      <Textarea
                        id="comment"
                        placeholder="Add your comment here..."
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        disabled={
                          !["new", "in_progress", "in-progress"].includes(
                            caseData.status.toLowerCase()
                          )
                        }
                      />
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          onClick={handleAddComment}
                          disabled={
                            !comment.trim() ||
                            !commentHeader ||
                            isSubmittingComment ||
                            !["new", "in_progress", "in-progress"].includes(
                              caseData.status.toLowerCase()
                            )
                          }
                        >
                          {isSubmittingComment ? "Adding..." : "Add Comment"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>{" "}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between px-6 py-4">
                <CardTitle className="text-base font-medium">
                  Transaction Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <DataTable
                  columns={transactionColumns}
                  data={transactionData}
                  rowActions={[
                    {
                      label: "View Details",
                      onClick: (transaction: Transaction) =>
                        setSelectedTransaction(transaction),
                    },
                  ]}
                  className="[&_tr]:cursor-pointer"
                  striped
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-0">
                <Tabs defaultValue="comments">
                  <div className="border-b px-0 ">
                    <TabsList className="border-0 p-0">
                      <TabsTrigger
                        value="comments"
                        className="rounded-none border-b-2 border-transparent py-3 data-[state=active]:border-primary"
                      >
                        Comments
                      </TabsTrigger>
                      <TabsTrigger
                        value="audit"
                        className="rounded-none border-b-2 border-transparent py-3 data-[state=active]:border-primary"
                      >
                        Audit History
                      </TabsTrigger>
                    </TabsList>
                  </div>{" "}
                  <TabsContent value="comments" className="p-0">
                    <div className="h-[300px]">
                      <DataTable
                        columns={commentsColumns}
                        data={commentsData?.data || []}
                        loading={commentsLoading}
                        emptyText="No comments available"
                        maxHeight="300px"
                        pagination={
                          commentsData?.pagination
                            ? {
                                page: commentsData.pagination.page,
                                pageSize: commentsData.pagination.pageSize,
                                total: commentsData.pagination.totalItems,
                                onChange: (page: number, pageSize: number) => {
                                  setCommentsPage(page);
                                },
                              }
                            : undefined
                        }
                      />
                    </div>
                  </TabsContent>{" "}
                  <TabsContent value="audit" className="p-0">
                    <div className="h-[300px]">
                      <DataTable
                        columns={auditColumns}
                        data={auditData}
                        maxHeight="300px"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {" "}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-medium">Customer Details</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Customer Name
                    </Label>
                    <p className="font-medium">
                      {customerData?.name || "Loading..."}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Phone Number
                    </Label>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {customerData
                          ? formatPhoneNumber(
                              customerData.phoneNumber,
                              !showPhoneNumber
                            )
                          : "Loading..."}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => setShowPhoneNumber(!showPhoneNumber)}
                        disabled={!customerData}
                      >
                        {showPhoneNumber ? (
                          <EyeOff className="h-3 w-3" />
                        ) : (
                          <Eye className="h-3 w-3" />
                        )}
                        <span className="sr-only">
                          {showPhoneNumber ? "Hide" : "Show"} phone number
                        </span>
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Customer ID
                    </Label>
                    <p className="font-medium">
                      {customerData?.id || "Loading..."}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Account ID
                    </Label>
                    <p className="font-medium">
                      {customerData?.accountId || "Loading..."}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Email
                    </Label>
                    <p className="font-medium">
                      {customerData?.email || "Loading..."}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Date of Birth
                    </Label>
                    <p className="font-medium">
                      {customerData?.dob || "Loading..."}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Card Status
                    </Label>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        Active
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Debit Card Type
                    </Label>
                    <p className="font-medium">Platinum</p>
                  </div>
                </div>
              </CardContent>
            </Card>{" "}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between px-6 py-4">
                <CardTitle className="text-base font-medium">
                  Linked Cases
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <LinkIcon className="h-3 w-3" />
                  <span>Link Case</span>
                </Button>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="space-y-3">
                  {caseData?.linkedCases?.length ? (
                    caseData.linkedCases.map((linkedCase: LinkedCase) => (
                      <Link
                        key={linkedCase.id}
                        to={`/cases/${linkedCase.id}`}
                        className="block rounded-lg border p-3 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">
                            Case - {linkedCase.id}
                          </span>
                          <Badge variant="outline" className="bg-green-50">
                            Linked
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            Related fraud investigation
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(linkedCase.linkedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      No linked cases
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <Link to={`/cases/${params.id}/linked`}>
                    <Button variant="link" size="sm" className="w-full">
                      View All Linked Cases
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="px-6 py-4">
                <CardTitle className="text-base font-medium">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2 p-6 pt-0">
                <Button variant="outline" className="justify-start">
                  Block Card
                </Button>
                <Button variant="outline" className="justify-start">
                  Request Customer Contact
                </Button>
                <Button variant="outline" className="justify-start">
                  Generate Case Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Dialog
        open={!!selectedTransaction}
        onOpenChange={(open) => {
          if (!open) setSelectedTransaction(null);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Full details of the selected transaction.
            </DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm mt-4">
              <div>
                <span className="font-semibold text-gray-700">ID:</span>
                <p className="text-gray-900">{selectedTransaction.id}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Date:</span>
                <p className="text-gray-900">{selectedTransaction.date}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Amount:</span>
                <p className="text-gray-900">
                  ${selectedTransaction.amount.toFixed(2)}
                </p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Country:</span>
                <p className="text-gray-900">{selectedTransaction.country}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Channel:</span>
                <p className="text-gray-900">{selectedTransaction.channel}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">
                  Transaction Type:
                </span>
                <p className="text-gray-900">
                  {selectedTransaction.transactionType}
                </p>
              </div>
              <div>
                <span className="font-semibold text-gray-700">
                  Scenario Name:
                </span>
                <p className="text-gray-900">
                  {selectedTransaction.scenarioName}
                </p>
              </div>

              <div>
                <span className="font-semibold text-gray-700">
                  Fraud Severity:
                </span>
                <p className="text-gray-900">
                  {selectedTransaction.fraudSeverity}
                </p>
              </div>
              <div className="col-span-2">
                <span className="font-semibold text-gray-700">Details:</span>
                <p className="text-gray-900">{selectedTransaction.details}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setSelectedTransaction(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
