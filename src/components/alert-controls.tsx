import { Button } from "@/components/ui/button";
import { AlertToast } from "@/components/alert-toast";

interface AlertControlsProps {
  showAlert: boolean;
  onShowAlert: () => void;
  onCloseAlert: () => void;
  onViewAlert: () => void;
}

export function AlertControls({
  showAlert,
  onShowAlert,
  onCloseAlert,
  onViewAlert,
}: AlertControlsProps) {
  return (
    <>
      <div className="flex justify-center p-4">
        <Button
          onClick={onShowAlert}
          variant="outline"
          className="flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          Simulate Alert Toast
        </Button>
      </div>

      {showAlert && (
        <AlertToast
          alert={{
            id: "alert-1",
            title: "Suspicious transaction detected on card ending with 0789",
            riskLevel: "High" as const,
            severity: "High" as const,
            amount: "$1,299.00",
            status: "Active" as const,
            timestamp: new Date().toISOString(),
            description: "Multiple transactions from unusual location",
            category: "Transaction Fraud",
            isNew: true,
          }}
          onClose={onCloseAlert}
          onView={onViewAlert}
        />
      )}
    </>
  );
}
