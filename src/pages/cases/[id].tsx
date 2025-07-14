"use client";

import { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Send } from "lucide-react";
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
import { EvidenceSection } from "@/components/case/evidence-section";
import { ActivitySection } from "@/components/case/activity-section";
import { CaseSidebar } from "@/components/case/case-sidebar";
import { VoiceNoteSection } from "@/components/case/voice-note-section";
import { useCase, useCreateComment, useCustomer } from "@/hooks/use-api";
import { formatDateTime } from "@/lib/date-utils";

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = params.id ? parseInt(params.id, 10) : 0;

  // API hooks
  const {
    data: caseData,
    isLoading: caseLoading,
    error: caseError,
  } = useCase(caseId);
  const { data: customerData, isLoading: customerLoading } = useCustomer(
    caseData?.customerId || 0
  );

  const [showForwardDialog, setShowForwardDialog] = useState(false);
  const [comment, setComment] = useState("");
  const [commentHeader, setCommentHeader] = useState("");

  // Additional hooks that need to be called before any conditional logic
  const createCommentMutation = useCreateComment(caseId);
  const isSubmittingComment = createCommentMutation.isPending;

  // Show loading skeleton while essential data is loading
  if (caseLoading || customerLoading) {
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
                        {formatDateTime(caseData.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Resolution Datetime
                    </Label>{" "}
                    <p className="font-medium">
                      {caseData.status === "RESOLVED"
                        ? formatDateTime(caseData.updatedAt)
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
                  <VoiceNoteSection />
                  <div className="space-y-2 col-span-full">
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
            <EvidenceSection caseId={caseId} />
            <ActivitySection caseId={caseId} />
          </div>

          <CaseSidebar
            customerId={caseData.customerId || 0}
            linkedCases={caseData.linkedCases}
          />
        </div>
      </main>
    </div>
  );
}
