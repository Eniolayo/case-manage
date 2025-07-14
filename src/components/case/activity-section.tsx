import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table";
import type { Column } from "@/components/data-table";
import { useCaseComments, useCreateComment } from "@/hooks/use-api";
import type { Comment } from "@/lib/api-types";
import { formatDateTime } from "@/lib/date-utils";

// Comments table columns
const commentsColumns: Column<Comment>[] = [
  {
    key: "createdAt",
    title: "Datetime",
    sortable: true,
    render: (value) => formatDateTime(value),
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
    datetime: "05/20/2023 09:30:00 AM",
    userId: "system",
    action: "Case created",
  },
  {
    id: "2",
    datetime: "05/20/2023 09:30:00 AM",
    userId: "system",
    action: "Assigned to john.doe",
  },
  {
    id: "3",
    datetime: "05/20/2023 09:35:00 AM",
    userId: "john.doe",
    action: "Status changed to WIP",
  },
  {
    id: "4",
    datetime: "05/22/2023 02:45:00 PM",
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

interface ActivitySectionProps {
  caseId: number;
}

export function ActivitySection({ caseId }: ActivitySectionProps) {
  // Pagination state for comments
  const [commentsPage, setCommentsPage] = useState(1);
  const commentsPageSize = 10;

  // API hooks
  const { data: commentsData, isLoading: commentsLoading } = useCaseComments(
    caseId,
    { page: commentsPage, pageSize: commentsPageSize }
  );

  return (
    <>
      {/* Comments and Audit Tabs */}
      <Card className="mt-6">
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
            </div>
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
            </TabsContent>
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
    </>
  );
}
