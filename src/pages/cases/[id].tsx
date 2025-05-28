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
  Filter,
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
export default function CaseDetailPage() {
  const params = useParams();

  const [commentTab, setCommentTab] = useState("comments");
  const [showForwardDialog, setShowForwardDialog] = useState(false);
  const [comment, setComment] = useState("");
  const [commentHeader, setCommentHeader] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [voiceNoteTranscription, setVoiceNoteTranscription] = useState(
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
  const handleAddComment = () => {
    if (!comment.trim() || !commentHeader) return;

    setIsSubmittingComment(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmittingComment(false);
      setComment("");
      setCommentHeader("");
      // In a real app, you would update the comments list here
    }, 1000);
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
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatPhoneNumber = (phone: string, masked: boolean) => {
    if (masked) {
      return "+91-XXXXX-43210";
    }
    return "+91-98765-43210";
  };

  return (
    <div className="min-h-screen">
      <PageHeader title="Case Details" />

      <div className=" flex flex-col items-start justify-between gap-4 px-4 py-4 sm:flex-row sm:items-center">
        <div>
          <Breadcrumb className="mb-2">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Case {params.id}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-bold">Case Details</h1>
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
                    <p className="font-medium">1234 56XX XXXX 0789</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Case Status
                    </Label>
                    <div className="flex items-center gap-2">
                      {getStatusBadge("in-progress")}
                    </div>
                  </div>{" "}
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Case Priority
                    </Label>
                    <div className="flex items-center gap-1">
                      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                        High
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Assignee
                    </Label>
                    <p className="font-medium">John Doe</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Created Datetime
                    </Label>
                    <div className="flex items-center gap-1">
                      <p className="font-medium">
                        May 20, 2023 <br /> 09:30 AM
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Resolution Datetime
                    </Label>
                    <p className="font-medium">-</p>
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
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="resolution-type">Resolution Type</Label>
                    <Select>
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
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="comment">Enter comment</Label>
                    <div className="flex flex-col gap-2">
                      <Textarea
                        id="comment"
                        placeholder="Add your comment here..."
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          onClick={handleAddComment}
                          disabled={
                            !comment.trim() ||
                            !commentHeader ||
                            isSubmittingComment
                          }
                        >
                          {isSubmittingComment ? "Adding..." : "Add Comment"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between px-6 py-4">
                <CardTitle className="text-base font-medium">
                  Transaction Details
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 flex items-center gap-1"
                  >
                    <Filter className="h-3 w-3" />
                    <span>Filter</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full relative">
                    <thead className="sticky top-0 z-10 bg-background">
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Transaction Date
                        </th>

                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Fraud Severity
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Scenario Name
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Transaction Type
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Transaction ID
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Channel
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium">
                          Country
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        className="border-b bg-red-50 cursor-pointer"
                        onClick={() =>
                          setSelectedTransaction({
                            amount: 1250.0,
                            country: "USA",
                            date: "2023-05-20 08:45",
                            details: "TXN123456789",
                            fraudSeverity: "High",
                            id: "TXN123456789",
                            scenarioName: "Unusual Location",
                            status: "Pending",
                            transactionType: "Purchase",
                            channel: "POS",
                          })
                        }
                      >
                        <td className="px-4 py-3 text-sm">2023-05-20 08:45</td>

                        <td className="px-4 py-3 text-sm">
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                            High
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">Unusual Location</td>
                        <td className="px-4 py-3 text-sm">Purchase</td>
                        <td className="px-4 py-3 text-sm font-medium">
                          $1,250.00
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help underline decoration-dotted">
                                  TXN123456789
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">
                                  Click to view full transaction details
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </td>
                        <td className="px-4 py-3 text-sm">POS</td>
                        <td className="px-4 py-3 text-sm">USA</td>
                      </tr>
                      <tr
                        className="border-b bg-red-50 cursor-pointer"
                        onClick={() =>
                          setSelectedTransaction({
                            amount: 750.0,
                            country: "USA",
                            date: "2023-05-20 08:47",
                            details: "TXN123456790",
                            fraudSeverity: "High",
                            id: "TXN123456790",
                            scenarioName: "Multiple Attempts",
                            status: "Pending",
                            transactionType: "Purchase",
                            channel: "POS",
                          })
                        }
                      >
                        <td className="px-4 py-3 text-sm">2023-05-20 08:47</td>

                        <td className="px-4 py-3 text-sm">
                          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                            High
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">Multiple Attempts</td>
                        <td className="px-4 py-3 text-sm">Purchase</td>
                        <td className="px-4 py-3 text-sm font-medium">
                          $750.00
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help underline decoration-dotted">
                                  TXN123456790
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">
                                  Click to view full transaction details
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </td>
                        <td className="px-4 py-3 text-sm">POS</td>
                        <td className="px-4 py-3 text-sm">USA</td>
                      </tr>
                      <tr
                        className=" cursor-pointer"
                        onClick={() =>
                          setSelectedTransaction({
                            amount: 45.0,
                            country: "India",
                            date: "2023-05-19 14:30",
                            details: "TXN123456788",
                            fraudSeverity: "Low",
                            id: "TXN123456788",
                            scenarioName: "-",
                            status: "Genuine",
                            transactionType: "Purchase",
                            channel: "Online",
                          })
                        }
                      >
                        <td className="px-4 py-3 text-sm">2023-05-19 14:30</td>

                        <td className="px-4 py-3 text-sm">
                          <Badge variant="outline" className="bg-blue-50">
                            Low
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">-</td>
                        <td className="px-4 py-3 text-sm">Purchase</td>
                        <td className="px-4 py-3 text-sm">$45.00</td>
                        <td className="px-4 py-3 text-sm">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help underline decoration-dotted">
                                  TXN123456788
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">
                                  Click to view full transaction details
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </td>
                        <td className="px-4 py-3 text-sm">Online</td>
                        <td className="px-4 py-3 text-sm">India</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between border-t px-4 py-2">
                  <p className="text-sm text-muted-foreground">
                    Showing 3 transactions
                  </p>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                      disabled
                    >
                      <span>1</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span>2</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-0">
                <Tabs defaultValue="comments" onValueChange={setCommentTab}>
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
                  </div>

                  <TabsContent value="comments" className="p-0">
                    <div className="overflow-x-auto h-[300px]">
                      <table className="w-full relative">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="px-4 py-3 text-left text-sm font-medium">
                              Datetime
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium">
                              User ID
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium">
                              Header
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium">
                              Comment
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="px-4 py-3 text-sm">
                              2023-05-20 09:35
                            </td>
                            <td className="px-4 py-3 text-sm">john.doe</td>
                            <td className="px-4 py-3 text-sm whitespace-nowrap">
                              <Badge variant="outline" className="bg-blue-50">
                                Investigation
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              Case opened for investigation due to suspicious
                              transaction pattern.
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="px-4 py-3 text-sm">
                              2023-05-21 11:20
                            </td>
                            <td className="px-4 py-3 text-sm">john.doe</td>
                            <td className="px-4 py-3 text-sm whitespace-nowrap">
                              <Badge variant="outline" className="bg-purple-50">
                                Customer Contact
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              Attempted to contact customer. No response.
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm">
                              2023-05-22 14:45
                            </td>
                            <td className="px-4 py-3 text-sm">jane.smith</td>
                            <td className="px-4 py-3 text-sm whitespace-nowrap">
                              <Badge variant="outline" className="bg-purple-50">
                                Customer Contact
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              Customer contacted. They confirmed they did not
                              authorize the transaction.
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>

                  <TabsContent value="audit" className="p-0">
                    <div className="overflow-auto h-[300px]">
                      <table className="w-full relative">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="px-4 py-3 text-left text-sm font-medium">
                              Datetime
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium">
                              User ID
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="px-4 py-3 text-sm">
                              2023-05-20 09:30
                            </td>
                            <td className="px-4 py-3 text-sm">system</td>
                            <td className="px-4 py-3 text-sm">Case created</td>
                          </tr>
                          <tr className="border-b">
                            <td className="px-4 py-3 text-sm">
                              2023-05-20 09:30
                            </td>
                            <td className="px-4 py-3 text-sm">system</td>
                            <td className="px-4 py-3 text-sm">
                              Assigned to john.doe
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="px-4 py-3 text-sm">
                              2023-05-20 09:35
                            </td>
                            <td className="px-4 py-3 text-sm">john.doe</td>
                            <td className="px-4 py-3 text-sm">
                              Status changed to WIP
                            </td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 text-sm">
                              2023-05-22 14:45
                            </td>
                            <td className="px-4 py-3 text-sm">jane.smith</td>
                            <td className="px-4 py-3 text-sm">Comment added</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-medium">Customer Details</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Customer Name
                    </Label>
                    <p className="font-medium">John Customer</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Phone Number
                    </Label>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {formatPhoneNumber("+91-98765-43210", !showPhoneNumber)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => setShowPhoneNumber(!showPhoneNumber)}
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
                    <p className="font-medium">CUST123456</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Account ID
                    </Label>
                    <p className="font-medium">ACCT987654</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Card Issue Date
                    </Label>
                    <p className="font-medium">2022-03-15</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Father's Name
                    </Label>
                    <p className="font-medium">Robert Customer</p>
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
            </Card>

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
                  <Link
                    to="/cases/1025"
                    className="block rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">Case - 1025</span>
                      <Badge variant="outline" className="bg-green-50">
                        Resolved
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Previous fraud investigation
                      </p>
                      <span className="text-xs text-muted-foreground">
                        2023-05-15
                      </span>
                    </div>
                  </Link>
                  <Link
                    to="/cases/1020"
                    className="block rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">Case - 1020</span>
                      <Badge variant="outline" className="bg-green-50">
                        Resolved
                      </Badge>
                    </div>
                    <div className="mt-1 flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Card replacement request
                      </p>
                      <span className="text-xs text-muted-foreground">
                        2023-05-10
                      </span>
                    </div>
                  </Link>
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
