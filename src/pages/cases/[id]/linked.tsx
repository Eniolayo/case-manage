import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Filter, LinkIcon, X, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCase } from "@/hooks/use-api";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/page-header";
import type { LinkedCase } from "@/lib/api-types";

export default function LinkedCasesPage() {
  const { id } = useParams();
  const caseId = id ? parseInt(id, 10) : 0;

  const [searchQuery, setSearchQuery] = useState("");
  const [linkCaseId, setLinkCaseId] = useState("");
  const [linkReason, setLinkReason] = useState("");

  // Get the case details including linked cases
  const { data: caseData, isLoading } = useCase(caseId);

  return (
    <div className="flex min-h-screen flex-col">
      <PageHeader title="Linked Cases" />
      <main className="flex-1">
        <div className="px-4 py-6">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/cases/${id}`}>Case {id}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Linked Cases</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <h1 className="text-2xl font-bold">Linked Cases for Case - {id}</h1>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-1">
                  <LinkIcon className="h-4 w-4" />
                  <span>Link New Case</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Link Case</DialogTitle>
                  <DialogDescription>
                    Link another case to this case for reference and
                    investigation.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="case-id">Case ID</Label>
                    <Input
                      id="case-id"
                      placeholder="Enter Case ID"
                      value={linkCaseId}
                      onChange={(e) => setLinkCaseId(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="link-reason">Reason for Linking</Label>
                    <Textarea
                      id="link-reason"
                      placeholder="Explain why these cases are related..."
                      rows={3}
                      value={linkReason}
                      onChange={(e) => setLinkReason(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Link Case</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search linked cases..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="active">
            <TabsList className="mb-4">
              <TabsTrigger value="active">
                Active Links ({caseData?.linkedCases?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="history">Link History</TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                  Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardHeader className="pb-2">
                          <div className="h-6 w-24 bg-muted rounded"></div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {Array(5)
                              .fill(0)
                              .map((_, j) => (
                                <div
                                  key={j}
                                  className="h-4 bg-muted rounded w-full"
                                ></div>
                              ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                ) : caseData?.linkedCases && caseData.linkedCases.length > 0 ? (
                  caseData.linkedCases.map((linkedCase: LinkedCase) => {
                    // Get the linked case details
                    const { data: linkedCaseDetails } = useCase(linkedCase.id);

                    if (!linkedCaseDetails) return null;

                    const linkedDate = new Date(linkedCase.linkedAt);
                    const createdDate = new Date(linkedCaseDetails.createdAt);

                    return (
                      <Card key={linkedCase.id}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">
                              Case - {linkedCase.id}
                            </CardTitle>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Unlink</span>
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Status:
                              </span>
                              <Badge variant="outline" className="bg-green-50">
                                {linkedCaseDetails.status}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Created:
                              </span>
                              <span className="text-sm">
                                {createdDate.toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Entity:
                              </span>
                              <span className="text-sm">
                                {linkedCaseDetails.entityId}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Linked by:
                              </span>
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span className="text-sm">
                                  {linkedCaseDetails.assignedTo
                                    ? `User ${linkedCaseDetails.assignedTo}`
                                    : "Unassigned"}
                                </span>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Linked on:
                              </span>
                              <span className="text-sm">
                                {linkedDate.toLocaleDateString()}
                              </span>
                            </div>
                            <div className="mt-2">
                              <p className="text-sm text-muted-foreground">
                                Related fraud investigation
                              </p>
                            </div>
                            <div className="pt-2">
                              <Link to={`/cases/${linkedCase.id}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                >
                                  View Case
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <div className="text-center py-12 col-span-3">
                    <h3 className="text-lg font-semibold mb-2">
                      No linked cases found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Start by linking a case using the "Link New Case" button
                      above.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="px-4 py-3 text-left text-sm font-medium">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium">
                            Action
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium">
                            Case ID
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium">
                            User
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium">
                            Reason
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {caseData?.linkedCases?.map(
                          (linkedCase: LinkedCase) => {
                            const linkedDate = new Date(linkedCase.linkedAt);
                            const { data: linkedCaseDetails } = useCase(
                              linkedCase.id
                            );

                            if (!linkedCaseDetails) return null;

                            return (
                              <tr key={linkedCase.id} className="border-b">
                                <td className="px-4 py-3 text-sm">
                                  {linkedDate.toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 text-sm">Linked</td>
                                <td className="px-4 py-3 text-sm">
                                  Case - {linkedCase.id}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  {linkedCaseDetails.assignedTo
                                    ? `User ${linkedCaseDetails.assignedTo}`
                                    : "Unassigned"}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  Related fraud investigation
                                </td>
                              </tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
