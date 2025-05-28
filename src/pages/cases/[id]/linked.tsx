import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Filter, LinkIcon, X, User } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/page-header";

export default function LinkedCasesPage() {
  const { id } = useParams();

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
                    <Input id="case-id" placeholder="Enter Case ID" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="link-reason">Reason for Linking</Label>
                    <Textarea
                      id="link-reason"
                      placeholder="Explain why these cases are related..."
                      rows={3}
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
              <TabsTrigger value="active">Active Links (2)</TabsTrigger>
              <TabsTrigger value="history">Link History</TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Case - 1025</CardTitle>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
                          Resolved
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Created:
                        </span>
                        <span className="text-sm">2023-05-15</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Entity:
                        </span>
                        <span className="text-sm">1234 56XX XXXX 0789</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Linked by:
                        </span>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span className="text-sm">john.doe</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Linked on:
                        </span>
                        <span className="text-sm">2023-05-21</span>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground">
                          Previous fraud investigation for the same customer
                          account.
                        </p>
                      </div>
                      <div className="pt-2">
                        <Link to="/cases/1025">
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

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Case - 1020</CardTitle>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
                          Resolved
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Created:
                        </span>
                        <span className="text-sm">2023-05-10</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Entity:
                        </span>
                        <span className="text-sm">1234 56XX XXXX 0789</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Linked by:
                        </span>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span className="text-sm">jane.smith</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Linked on:
                        </span>
                        <span className="text-sm">2023-05-20</span>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground">
                          Card replacement request following suspicious
                          activity.
                        </p>
                      </div>
                      <div className="pt-2">
                        <Link to="/cases/1020">
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
              </div>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardContent className="p-0">
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
                      <tr className="border-b">
                        <td className="px-4 py-3 text-sm">2023-05-21</td>
                        <td className="px-4 py-3 text-sm">Linked</td>
                        <td className="px-4 py-3 text-sm">Case - 1025</td>
                        <td className="px-4 py-3 text-sm">john.doe</td>
                        <td className="px-4 py-3 text-sm">
                          Related fraud investigation
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-3 text-sm">2023-05-20</td>
                        <td className="px-4 py-3 text-sm">Linked</td>
                        <td className="px-4 py-3 text-sm">Case - 1020</td>
                        <td className="px-4 py-3 text-sm">jane.smith</td>
                        <td className="px-4 py-3 text-sm">
                          Card replacement history
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm">2023-05-19</td>
                        <td className="px-4 py-3 text-sm">Unlinked</td>
                        <td className="px-4 py-3 text-sm">Case - 1015</td>
                        <td className="px-4 py-3 text-sm">jane.smith</td>
                        <td className="px-4 py-3 text-sm">
                          Not relevant to current investigation
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
