import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { LinkIcon, Eye, EyeOff, ExternalLink } from "lucide-react";
import {
  useCustomer,
  useSourceConfig,
  useCustomerSourceData,
} from "@/hooks/use-api";
import type { LinkedCase } from "@/lib/api-types";
import { formatDateTime } from "@/lib/date-utils";
import { useToast } from "@/hooks/use-toast";

interface CaseSidebarProps {
  customerId: number;
  linkedCases?: LinkedCase[];
}

export function CaseSidebar({ customerId, linkedCases }: CaseSidebarProps) {
  const params = useParams();
  const { toast } = useToast();
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);

  // API hooks
  const { data: customerData, isLoading: customerLoading } =
    useCustomer(customerId);
  const { data: sourceConfig, isLoading: sourceConfigLoading } =
    useSourceConfig("frm", !!customerData);
  const { data: customerSourceData, isLoading: sourceDataLoading } =
    useCustomerSourceData(customerId, true);

  const formatPhoneNumber = (phone: string, masked: boolean) => {
    if (masked) {
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

  const getFieldValue = (field: any, data: any) => {
    if (!data) return null;

    switch (field.field) {
      case "customer_id":
        return data.customer_id || customerData?.id?.toString();
      case "customer_name":
        return data.customer_name || customerData?.name;
      case "phone_number":
        return data.phone_number || customerData?.phoneNumber;
      case "account_id":
        return data.account_id || customerData?.accountId?.toString();
      case "card_issue_date":
        return data.card_issue_date;
      case "card_status":
        return data.card_status;
      case "card_type":
        return data.card_type;
      default:
        return data[field.field];
    }
  };

  const renderFieldValue = (field: any, value: any) => {
    if (!value && value !== 0) {
      return "Loading...";
    }

    switch (field.component_type) {
      case "badge":
        let badgeClass = "bg-gray-100 text-gray-800 hover:bg-gray-100";
        if (field.field === "card_status") {
          switch (value.toLowerCase()) {
            case "active":
              badgeClass = "bg-green-100 text-green-800 hover:bg-green-100";
              break;
            case "blocked":
            case "suspended":
              badgeClass = "bg-red-100 text-red-800 hover:bg-red-100";
              break;
            default:
              badgeClass = "bg-gray-100 text-gray-800 hover:bg-gray-100";
          }
        } else if (
          field.field === "customer_name" ||
          field.field === "account_id"
        ) {
          badgeClass = "bg-blue-100 text-blue-800 hover:bg-blue-100";
        }
        return <Badge className={badgeClass}>{value}</Badge>;
      case "text":
      default:
        if (field.field === "phone_number") {
          return (
            <div className="flex items-center gap-2">
              <span className="font-medium">
                {formatPhoneNumber(value, !showPhoneNumber)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0"
                onClick={() => setShowPhoneNumber(!showPhoneNumber)}
              >
                {showPhoneNumber ? (
                  <EyeOff className="h-3 w-3" />
                ) : (
                  <Eye className="h-3 w-3" />
                )}
              </Button>
            </div>
          );
        }
        return <span className="font-medium">{value}</span>;
    }
  };

  const sourceConfigData = sourceConfig?.data?.[0];

  return (
    <div className="space-y-6">
      {/* Customer Details */}
      <Card>
        <CardContent className="p-6">
          <h3 className="mb-4 text-lg font-medium">Customer Details</h3>

          {/* Source Configuration Metadata */}
          {sourceConfigData && (
            <div className="mb-4 pb-4 border-b">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground">
                    Source System :
                  </Label>
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700"
                  >
                    {sourceConfigData.source_system.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-muted-foreground">
                    Entity Type :
                  </Label>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {sourceConfigData.entity_type}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Customer Properties */}
          <div className="space-y-3">
            {sourceConfigData?.ui_config && customerSourceData ? (
              sourceConfigData.ui_config.map((field, index) => {
                const value = getFieldValue(field, customerSourceData);
                return (
                  <div key={index} className="flex items-center gap-2">
                    <Label className="text-xs text-muted-foreground">
                      {field.display_text} :
                    </Label>
                    {renderFieldValue(field, value)}
                  </div>
                );
              })
            ) : (
              // Fallback to basic customer data if source config is not available
              <>
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
                  <Label className="text-xs text-muted-foreground">Email</Label>
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
              </>
            )}

            {/* Customer Portal Link */}
            {customerData && sourceConfigData?.external_link_config && (
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center gap-2"
                  onClick={() => {
                    const portalUrl =
                      sourceConfigData.external_link_config?.customer_portal_url?.replace(
                        "{customer_id}",
                        customerData.id.toString()
                      );
                    const config = sourceConfigData.external_link_config;
                    if (portalUrl && config) {
                      toast({
                        title: "Customer Portal Opened",
                        description: `Opening ${config.display_name}: ${portalUrl}`,
                        duration: 3000,
                      });
                    }
                  }}
                  disabled={sourceConfigLoading}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>
                    {sourceConfigData.external_link_config.display_name ||
                      "View in Customer Portal"}
                  </span>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Linked Cases */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between px-6 py-4">
          <CardTitle className="text-base font-medium">Linked Cases</CardTitle>
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
            {linkedCases?.length ? (
              linkedCases.map((linkedCase: LinkedCase) => (
                <Link
                  key={linkedCase.id}
                  to={`/cases/${linkedCase.id}`}
                  className="block rounded-lg border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex justify-between">
                    <span className="font-medium">Case - {linkedCase.id}</span>
                    <Badge variant="outline" className="bg-green-50">
                      Linked
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Related fraud investigation
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(linkedCase.linkedAt)}
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

      {/* Quick Actions */}
      <Card>
        <CardHeader className="px-6 py-4">
          <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
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
  );
}
