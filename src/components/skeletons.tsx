import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CaseListSkeleton() {
  return (
    <div className="space-y-4">
      {Array(5)
        .fill(null)
        .map((_, index) => (
          <Card key={index} className="w-full">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="w-full flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-16 rounded-md" />
                    <Skeleton className="h-5 w-40 rounded-md" />
                  </div>
                  <Skeleton className="h-6 w-20 rounded-md" />
                </div>

                <div className="w-full mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Skeleton className="h-4 w-20 mb-1 rounded-md" />
                    <Skeleton className="h-5 w-36 rounded-md" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-16 mb-1 rounded-md" />
                    <Skeleton className="h-5 w-28 rounded-md" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-20 mb-1 rounded-md" />
                    <Skeleton className="h-5 w-24 rounded-md" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-24 mb-1 rounded-md" />
                    <Skeleton className="h-5 w-32 rounded-md" />
                  </div>
                </div>

                <div className="w-full flex justify-between mt-2">
                  <Skeleton className="h-5 w-36 rounded-md" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}

export function CaseDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <div className="flex gap-3">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>

      {/* Case information grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-full" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-full" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-36" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs skeleton */}
      <div className="mt-8">
        <div className="border-b flex gap-4 mb-4">
          {Array(4)
            .fill(null)
            .map((_, i) => (
              <Skeleton key={i} className="h-10 w-32" />
            ))}
        </div>

        <div className="space-y-4 mt-4">
          {Array(3)
            .fill(null)
            .map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div>
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="mt-4">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}

export function CaseSummarySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array(5)
        .fill(null)
        .map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <Skeleton className="h-9 w-16" />
                <div className="flex items-center space-x-1">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}

export function AlertDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="h-7 w-72 mb-3" />
        <div className="flex gap-3">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>

      {/* Anomalies */}
      <div>
        <Skeleton className="h-6 w-32 mb-3" />
        <div className="space-y-3">
          {Array(3)
            .fill(null)
            .map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-64" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <Skeleton className="h-4 w-full mt-2" />
                  <Skeleton className="h-4 w-5/6 mt-1" />
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Payload */}
      <div>
        <Skeleton className="h-6 w-24 mb-3" />
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array(12)
                .fill(null)
                .map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function CommentListSkeleton() {
  return (
    <div className="space-y-4">
      {Array(3)
        .fill(null)
        .map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="flex justify-between mb-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
    </div>
  );
}

export function CustomerDetailSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-48" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div className="space-y-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-40" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-52" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-36" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>

        <div>
          <Skeleton className="h-5 w-36 mb-3" />
          <div className="border rounded-md p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-5 w-40" />
              </div>
              <div>
                <Skeleton className="h-4 w-36 mb-1" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-1 auto-rows-auto md:grid-cols-3 lg:grid-cols-5">
      {Array(5)
        .fill(null)
        .map((_, i) => (
          <Card
            key={i}
            className="cursor-pointer transition-colors hover:bg-muted/50"
          >
            <CardContent className="p-4">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-20" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-8 w-12" />
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-6 w-12 rounded-full" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}

export function FiltersSkeleton() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-48" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
}

export function AnalyticsOverviewSkeleton() {
  return (
    <div className="mt-8">
      <Skeleton className="h-6 w-48 mb-4" />
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-5">
        {/* Cases Trend Chart Skeleton */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <Skeleton className="h-5 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>

        {/* Case Distribution Chart Skeleton */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-5 w-36" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function DashboardCaseListSkeleton() {
  return (
    <div className="mt-8">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
      <CaseListSkeleton />
      <div className="mt-4 flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}

export function ErrorDisplay({
  error,
  onRetry,
}: {
  error: Error;
  onRetry?: () => void;
}) {
  return (
    <div className="text-center py-8">
      <p className="text-red-500 mb-4">
        Error: {error?.message || "Something went wrong"}
      </p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  );
}
