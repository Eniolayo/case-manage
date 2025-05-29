"use client";

import type React from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { HelpCircle, AlertCircle, ArrowLeft } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { VoiceRecorder } from "@/components/voice-recorder";
import { PageHeader } from "@/components/page-header";

export default function NewCasePage() {
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceNote, setVoiceNote] = useState<Blob | null>(null);
  const [voiceNoteDuration, setVoiceNoteDuration] = useState(0);
  const [voiceNoteTranscription, setVoiceNoteTranscription] = useState("");

  const validateForm = (formData: FormData): boolean => {
    const errors: Record<string, string> = {};

    // Required fields validation
    const requiredFields = [
      "entity-id",
      "customer-id",
      "customer-name",
      "phone",
      "account-id",
    ];
    requiredFields.forEach((field) => {
      if (!formData.get(field) || formData.get(field) === "") {
        errors[field] = "This field is required";
      }
    });

    // Card number format validation
    const entityId = formData.get("entity-id") as string;
    if (
      entityId &&
      !entityId.match(/^\d{4}(\s\d{4}){3}$|^\d{4}(\s\d{2}XX\s\d{4}){1}\s\d{4}$/)
    ) {
      errors["entity-id"] = "Invalid card format. Use XXXX XXXX XXXX XXXX";
    }

    // Phone number validation
    const phone = formData.get("phone") as string;
    if (phone && !phone.match(/^\+\d{2}[\s-]?\d{5}[\s-]?\d{5}$/)) {
      errors["phone"] = "Invalid phone format. Use +91 XXXXX XXXXX";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleVoiceRecording = (
    audioBlob: Blob,
    duration: number,
    transcription?: string
  ) => {
    setVoiceNote(audioBlob);
    setVoiceNoteDuration(duration);
    if (transcription) {
      setVoiceNoteTranscription(transcription);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    if (validateForm(formData)) {
      // Simulate API calls
      const caseData = {
        entityId: formData.get("entity-id"),
        customerId: formData.get("customer-id"),
        customerName: formData.get("customer-name"),
        phone: formData.get("phone"),
        accountId: formData.get("account-id"),
        assignee: formData.get("assignee"),
        priority: formData.get("priority"),
        cardType: formData.get("card-type"),
        fathersName: formData.get("fathers-name"),
        cardStatus: formData.get("card-status"),
        comment: formData.get("comment"),
        voiceNoteTranscription: voiceNoteTranscription,
      };

      // Simulate case creation API call
      console.log("Creating case with data:", caseData);

      // Simulate voice note upload if exists
      if (voiceNote) {
        console.log("Uploading voice note:", {
          blob: voiceNote,
          duration: voiceNoteDuration,
          size: voiceNote.size,
          type: voiceNote.type,
        });
        // In real implementation, you would upload the voice note separately
        // const voiceFormData = new FormData()
        // voiceFormData.append('voiceNote', voiceNote)
        // voiceFormData.append('caseId', newCaseId)
        // await uploadVoiceNote(voiceFormData)
      }

      setTimeout(() => {
        setIsSubmitting(false);
        navigate("/cases/1031"); // Redirect to the newly created case
      }, 1000);
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader
        title="Create New Case"
        additionalActions={
          <Button variant="outline" onClick={() => navigate("/cases")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cases
          </Button>
        }
      />
      <main className="flex-1">
        <div className=" px-4 py-6">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Create New Case</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="mb-6 text-2xl font-bold">Create New Case</h1>

          <Tabs defaultValue="manual">
            <TabsList className="mb-6">
              <TabsTrigger value="manual">Manual Case</TabsTrigger>
              <TabsTrigger value="alert">From Alert Management</TabsTrigger>
            </TabsList>

            <TabsContent value="manual">
              <Card>
                <CardHeader>
                  <CardTitle>Manual Case Creation</CardTitle>
                  <CardDescription>
                    Create a new case by filling in the required information.
                    Fields marked with * are mandatory.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1">
                          <Label htmlFor="entity-id">
                            Entity ID (Card Number) *
                          </Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 p-0"
                                >
                                  <HelpCircle className="h-3 w-3" />
                                  <span className="sr-only">
                                    Card number format help
                                  </span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs text-xs">
                                  Enter the 16-digit card number in the format
                                  XXXX XXXX XXXX XXXX. For security, middle
                                  digits can be masked as XX.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Input
                          id="entity-id"
                          name="entity-id"
                          placeholder="XXXX XXXX XXXX XXXX"
                          required
                          aria-invalid={!!formErrors["entity-id"]}
                          aria-describedby={
                            formErrors["entity-id"]
                              ? "entity-id-error"
                              : undefined
                          }
                        />
                        {formErrors["entity-id"] && (
                          <p
                            id="entity-id-error"
                            className="text-xs text-destructive"
                          >
                            {formErrors["entity-id"]}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customer-id">Customer ID *</Label>
                        <Input
                          id="customer-id"
                          name="customer-id"
                          placeholder="Customer ID"
                          required
                          aria-invalid={!!formErrors["customer-id"]}
                          aria-describedby={
                            formErrors["customer-id"]
                              ? "customer-id-error"
                              : undefined
                          }
                        />
                        {formErrors["customer-id"] && (
                          <p
                            id="customer-id-error"
                            className="text-xs text-destructive"
                          >
                            {formErrors["customer-id"]}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customer-name">Customer Name *</Label>
                        <Input
                          id="customer-name"
                          name="customer-name"
                          placeholder="Full Name"
                          required
                          aria-invalid={!!formErrors["customer-name"]}
                          aria-describedby={
                            formErrors["customer-name"]
                              ? "customer-name-error"
                              : undefined
                          }
                        />
                        {formErrors["customer-name"] && (
                          <p
                            id="customer-name-error"
                            className="text-xs text-destructive"
                          >
                            {formErrors["customer-name"]}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="+91 XXXXX XXXXX"
                          required
                          aria-invalid={!!formErrors["phone"]}
                          aria-describedby={
                            formErrors["phone"] ? "phone-error" : undefined
                          }
                        />
                        {formErrors["phone"] && (
                          <p
                            id="phone-error"
                            className="text-xs text-destructive"
                          >
                            {formErrors["phone"]}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="account-id">Account ID *</Label>
                        <Input
                          id="account-id"
                          name="account-id"
                          placeholder="Account ID"
                          required
                          aria-invalid={!!formErrors["account-id"]}
                          aria-describedby={
                            formErrors["account-id"]
                              ? "account-id-error"
                              : undefined
                          }
                        />
                        {formErrors["account-id"] && (
                          <p
                            id="account-id-error"
                            className="text-xs text-destructive"
                          >
                            {formErrors["account-id"]}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assignee">Assignee</Label>
                        <Select name="assignee">
                          <SelectTrigger>
                            <SelectValue placeholder="Select Assignee" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="current">
                              Current User
                            </SelectItem>
                            <SelectItem value="general">
                              General Queue
                            </SelectItem>
                            <SelectItem value="priority">
                              Priority Queue
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>{" "}
                      <div className="space-y-2">
                        <div className="flex items-center gap-1">
                          <Label htmlFor="priority">Case Priority</Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-4 w-4 p-0"
                                >
                                  <HelpCircle className="h-3 w-3" />
                                  <span className="sr-only">
                                    Case priority help
                                  </span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-xs text-xs">
                                  Case priority indicates the urgency level.
                                  High priority cases require immediate
                                  attention.
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <Select defaultValue="medium" name="priority">
                          <SelectTrigger id="priority">
                            <SelectValue placeholder="Select Priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card-type">Card Type</Label>
                        <Select defaultValue="debit" name="card-type">
                          <SelectTrigger>
                            <SelectValue placeholder="Select Card Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="debit">Debit Card</SelectItem>
                            <SelectItem value="credit">Credit Card</SelectItem>
                            <SelectItem value="wallet">Wallet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fathers-name">Father's Name</Label>
                        <Input
                          id="fathers-name"
                          name="fathers-name"
                          placeholder="Father's Name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="comment">Initial Comment</Label>
                      <Textarea
                        id="comment"
                        name="comment"
                        placeholder="Enter initial case notes..."
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Voice Note (Optional)</Label>{" "}
                      <VoiceRecorder
                        onRecordingComplete={handleVoiceRecording}
                        showTranscription={true}
                      />
                      {voiceNote && (
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Voice note recorded ({Math.round(voiceNoteDuration)}
                            s, {Math.round(voiceNote.size / 1024)}KB)
                          </p>
                          {voiceNoteTranscription && (
                            <div>
                              <Label className="text-xs text-muted-foreground">
                                Transcription
                              </Label>
                              <p className="text-sm mt-1 p-3 bg-muted/30 rounded">
                                {voiceNoteTranscription}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Creating a case will notify the assigned analyst and
                        generate a unique case ID. Voice notes and comments will
                        be saved separately.
                      </AlertDescription>
                    </Alert>

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/")}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Case"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alert">
              <Card>
                <CardHeader>
                  <CardTitle>Create Case from Alert</CardTitle>
                  <CardDescription>
                    Import case details from an existing alert in the Alert
                    Management system.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="alert-id">Alert ID *</Label>
                      <div className="flex gap-2">
                        <Input
                          id="alert-id"
                          name="alert-id"
                          placeholder="Enter Alert ID"
                          className="flex-1"
                          required
                        />
                        <Button type="button" variant="outline">
                          Search
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-lg border p-6">
                      <div className="flex flex-col items-center justify-center gap-2 text-center">
                        <AlertCircle className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          Enter an Alert ID and click Search to load alert
                          details
                        </p>
                        <p className="text-xs text-muted-foreground">
                          All relevant information from the alert will be
                          automatically populated in the case
                        </p>
                      </div>
                    </div>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Creating a case from an alert will maintain a reference
                        to the original alert for tracking purposes.
                      </AlertDescription>
                    </Alert>

                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/")}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled>
                        Create Case
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
