import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { LinkIcon, Eye, EyeOff, ExternalLink } from "lucide-react";
import { useCustomer, useSourceConfig } from "@/hooks/use-api";
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
    useSourceConfig(
      "FRM", // Primary source system for customer data
      !!customerData // Only fetch when customer data is available
    );

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

  const constructCustomerPortalUrl = (customerId: string): string | null => {
    if (!sourceConfig?.data?.[0]?.external_link_config?.customer_portal_url) {
      return null;
    }
    return sourceConfig.data[0].external_link_config.customer_portal_url.replace(
      "{customer_id}",
      customerId
    );
  };

  return (
    <div className="space-y-6">
      {/* Customer Details */}
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
              <p className="font-medium">{customerData?.id || "Loading..."}</p>
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
              <p className="font-medium">{customerData?.dob || "Loading..."}</p>
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

            {/* Customer Portal Link */}
            {customerData && sourceConfig?.data?.[0]?.external_link_config && (
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center gap-2"
                  onClick={() => {
                    const portalUrl = constructCustomerPortalUrl(
                      customerData.id.toString()
                    );
                    const config = sourceConfig.data[0].external_link_config;
                    if (portalUrl && config) {
                      toast({
                        title: "Customer Portal Opened",
                        description: `Opening ${config.display_name}: ${portalUrl}`,
                        duration: 3000,
                      });
                      // For demo purposes, show toast instead of navigating
                      // When real APIs are ready, uncomment below:
                      // if (config.open_in_new_tab) {
                      //   window.open(portalUrl, "_blank", "noopener,noreferrer");
                      // } else {
                      //   window.location.href = portalUrl;
                      // }
                    }
                  }}
                  disabled={sourceConfigLoading}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>
                    {sourceConfig.data[0].external_link_config.display_name ||
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
