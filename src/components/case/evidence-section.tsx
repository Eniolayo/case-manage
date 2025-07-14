import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExternalLink, Eye } from "lucide-react";
import { DataTable } from "@/components/data-table";
import type { Column } from "@/components/data-table";
import type { Evidence } from "@/lib/api-types";
import { formatDateTime } from "@/lib/date-utils";
import { useToast } from "@/hooks/use-toast";
import { MOCK_EVIDENCE_DATA, MOCK_EVIDENCE_CONFIG } from "@/lib/mock-data";

interface EvidenceSectionProps {
  caseId: number;
}

export function EvidenceSection({ caseId }: EvidenceSectionProps) {
  const { toast } = useToast();
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(
    null
  );

  // Utility function to construct external URLs for evidence
  const constructEvidenceExternalUrl = (
    evidence: Evidence
  ): { url: string | null; config: any } => {
    const config = MOCK_EVIDENCE_CONFIG.data.find(
      (c: any) =>
        c.source_system === evidence.source_system &&
        c.evidence_type === evidence.evidence_type
    );

    if (!config?.external_link_config?.url_template) {
      return { url: null, config: null };
    }

    const url = config.external_link_config.url_template.replace(
      "{evidence_id}",
      evidence.id
    );

    return { url, config: config.external_link_config };
  };

  // Evidence table columns with dynamic external links
  const evidenceColumns: Column<Evidence>[] = [
    {
      key: "created_at",
      title: "Created",
      sortable: true,
      render: (value) => formatDateTime(value),
    },
    {
      key: "evidence_type",
      title: "Evidence Type",
      sortable: true,
      render: (value) => {
        const typeLabels = {
          transaction: "Transaction",
          aml_screening: "AML Screening",
          kyc_document: "KYC Document",
          device_fingerprint: "Device Fingerprint",
          behavioral_analysis: "Behavioral Analysis",
          alert: "Alert",
        };
        return typeLabels[value as keyof typeof typeLabels] || value;
      },
    },
    {
      key: "source_system",
      title: "Source System",
      sortable: true,
      render: (value) => (
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          {value}
        </Badge>
      ),
    },
    {
      key: "risk_level",
      title: "Risk Level",
      sortable: true,
      render: (value) => (
        <Badge
          className={
            value === "Critical"
              ? "bg-red-100 text-red-800 hover:bg-red-100"
              : value === "High"
              ? "bg-orange-100 text-orange-800 hover:bg-orange-100"
              : value === "Medium"
              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
              : "bg-green-100 text-green-800 hover:bg-green-100"
          }
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "status",
      title: "Status",
      sortable: true,
      render: (value) => (
        <Badge
          variant="outline"
          className={
            value === "flagged"
              ? "bg-red-50 text-red-700"
              : value === "pending"
              ? "bg-yellow-50 text-yellow-700"
              : value === "reviewed"
              ? "bg-blue-50 text-blue-700"
              : "bg-green-50 text-green-700"
          }
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
    {
      key: "title",
      title: "Evidence Title",
      render: (value, row) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[250px]">
                <p className="font-medium text-sm truncate">{value}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {row.description}
                </p>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[300px]">
              <p className="font-medium">{value}</p>
              <p className="text-xs mt-1">{row.description}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
  ];

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between px-6 py-4">
          <CardTitle className="text-base font-medium">
            Evidence Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={evidenceColumns}
            data={MOCK_EVIDENCE_DATA}
            rowActions={[
              {
                label: "View Details",
                icon: Eye,
                onClick: (evidence: Evidence) => setSelectedEvidence(evidence),
              },
              {
                label: "Open External",
                icon: ExternalLink,
                onClick: (evidence: Evidence) => {
                  const { url: externalUrl, config } =
                    constructEvidenceExternalUrl(evidence);

                  if (externalUrl && config) {
                    toast({
                      title: "External Link Opened",
                      description: `Opening ${config.display_name}: ${externalUrl}`,
                      duration: 3000,
                    });
                  } else {
                    toast({
                      title: "External Link Not Available",
                      description:
                        "No external system configured for this evidence type",
                      duration: 2000,
                      variant: "destructive",
                    });
                  }
                },
              },
            ]}
            className="[&_tr]:cursor-pointer"
            striped
          />
        </CardContent>
      </Card>

      <Dialog
        open={!!selectedEvidence}
        onOpenChange={(open) => {
          if (!open) setSelectedEvidence(null);
        }}
      >
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Evidence Details
              {selectedEvidence && (
                <Badge
                  className={
                    selectedEvidence.risk_level === "Critical"
                      ? "bg-red-100 text-red-800"
                      : selectedEvidence.risk_level === "High"
                      ? "bg-orange-100 text-orange-800"
                      : selectedEvidence.risk_level === "Medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }
                >
                  {selectedEvidence.risk_level}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              Comprehensive evidence information from source system
            </DialogDescription>
          </DialogHeader>

          {selectedEvidence && (
            <div className="space-y-6 mt-4">
              {/* Header Information */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Evidence ID
                    </span>
                    <p className="font-mono text-sm mt-1 p-2 bg-white rounded border">
                      {selectedEvidence.id}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Type
                    </span>
                    <p className="font-medium mt-1">
                      {selectedEvidence.evidence_type
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Source System
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 mt-1"
                    >
                      {selectedEvidence.source_system}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Status
                    </span>
                    <Badge
                      variant="outline"
                      className={
                        selectedEvidence.status === "flagged"
                          ? "bg-red-50 text-red-700 mt-1"
                          : selectedEvidence.status === "pending"
                          ? "bg-yellow-50 text-yellow-700 mt-1"
                          : selectedEvidence.status === "reviewed"
                          ? "bg-blue-50 text-blue-700 mt-1"
                          : "bg-green-50 text-green-700 mt-1"
                      }
                    >
                      {selectedEvidence.status.charAt(0).toUpperCase() +
                        selectedEvidence.status.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Action
                    </span>
                    <Badge
                      className={
                        selectedEvidence.action === "DECLINE" ||
                        selectedEvidence.action === "BLOCK"
                          ? "bg-red-100 text-red-800 mt-1"
                          : selectedEvidence.action === "CHALLENGE" ||
                            selectedEvidence.action === "REVIEW"
                          ? "bg-orange-100 text-orange-800 mt-1"
                          : "bg-green-100 text-green-800 mt-1"
                      }
                    >
                      {selectedEvidence.action}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Created
                    </span>
                    <p className="text-sm mt-1">
                      {formatDateTime(selectedEvidence.created_at)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Title
                    </span>
                    <p className="font-medium text-gray-900 mt-1">
                      {selectedEvidence.title}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Description
                    </span>
                    <p className="text-gray-700 mt-1">
                      {selectedEvidence.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rules Flagged Section */}
              {selectedEvidence.rulesFlagged &&
                selectedEvidence.rulesFlagged.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      Rules Flagged ({selectedEvidence.rulesFlagged.length})
                    </h3>
                    <div className="space-y-3">
                      {selectedEvidence.rulesFlagged.map((rule, index) => (
                        <div
                          key={rule.id || index}
                          className="border border-red-200 rounded-lg p-4 bg-red-50"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-red-900">
                                {rule.title}
                              </h4>
                              {rule.description && (
                                <p className="text-red-700 text-sm mt-1">
                                  {rule.description}
                                </p>
                              )}
                              {rule.expression && (
                                <div className="mt-2">
                                  <span className="text-xs font-medium text-red-600 uppercase tracking-wide">
                                    Rule Expression
                                  </span>
                                  <code className="block text-xs font-mono bg-red-100 text-red-800 p-2 rounded mt-1 border">
                                    {rule.expression}
                                  </code>
                                </div>
                              )}
                            </div>
                            <Badge className="bg-red-100 text-red-800 ml-3">
                              Flagged
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Evaluation Summary Section */}
              {selectedEvidence.evaluationSummary &&
                selectedEvidence.evaluationSummary.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Evaluation Summary (
                      {selectedEvidence.evaluationSummary.length})
                    </h3>
                    <div className="space-y-3">
                      {selectedEvidence.evaluationSummary.map(
                        (evaluation, index) => (
                          <div
                            key={evaluation.id || index}
                            className={`border rounded-lg p-4 ${
                              evaluation.flagged
                                ? "border-orange-200 bg-orange-50"
                                : "border-green-200 bg-green-50"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4
                                    className={`font-semibold ${
                                      evaluation.flagged
                                        ? "text-orange-900"
                                        : "text-green-900"
                                    }`}
                                  >
                                    {evaluation.title}
                                  </h4>
                                  <Badge
                                    className={
                                      evaluation.isExecuted
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-800"
                                    }
                                  >
                                    {evaluation.isExecuted
                                      ? "Executed"
                                      : "Not Executed"}
                                  </Badge>
                                </div>
                                {evaluation.description && (
                                  <p
                                    className={`text-sm mt-1 ${
                                      evaluation.flagged
                                        ? "text-orange-700"
                                        : "text-green-700"
                                    }`}
                                  >
                                    {evaluation.description}
                                  </p>
                                )}
                                {evaluation.expression && (
                                  <div className="mt-2">
                                    <span
                                      className={`text-xs font-medium uppercase tracking-wide ${
                                        evaluation.flagged
                                          ? "text-orange-600"
                                          : "text-green-600"
                                      }`}
                                    >
                                      Rule Expression
                                    </span>
                                    <code
                                      className={`block text-xs font-mono p-2 rounded mt-1 border ${
                                        evaluation.flagged
                                          ? "bg-orange-100 text-orange-800"
                                          : "bg-green-100 text-green-800"
                                      }`}
                                    >
                                      {evaluation.expression}
                                    </code>
                                  </div>
                                )}
                              </div>
                              <Badge
                                className={
                                  evaluation.flagged
                                    ? "bg-orange-100 text-orange-800 ml-3"
                                    : "bg-green-100 text-green-800 ml-3"
                                }
                              >
                                {evaluation.flagged ? "Flagged" : "Passed"}
                              </Badge>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Payload Data Section */}
              {selectedEvidence.payload && selectedEvidence.payload.data && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                    Payload Data
                  </h3>
                  <div className="border rounded-lg bg-gray-50 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(selectedEvidence.payload.data).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="bg-white p-3 rounded border"
                          >
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                              {key
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                            </span>
                            <p className="font-mono text-sm mt-1 break-all">
                              {typeof value === "object"
                                ? JSON.stringify(value, null, 2)
                                : String(value)}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* External Link Section */}
              <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
                <div>
                  <h4 className="font-semibold text-blue-900">
                    External System Access
                  </h4>
                  <p className="text-blue-700 text-sm">
                    View this evidence in the original source system for
                    additional details and actions.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    const { url: externalUrl, config } =
                      constructEvidenceExternalUrl(selectedEvidence);
                    if (externalUrl && config) {
                      toast({
                        title: "External Link Opened",
                        description: `Opening ${config.display_name}: ${externalUrl}`,
                        duration: 3000,
                      });
                    } else {
                      toast({
                        title: "External Link Not Available",
                        description:
                          "No external system configured for this evidence type",
                        duration: 2000,
                        variant: "destructive",
                      });
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open in Source System
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedEvidence(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
