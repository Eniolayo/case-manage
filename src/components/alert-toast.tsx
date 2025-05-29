"use client"

import { useEffect, useState } from "react"
import { X, AlertTriangle, Shield, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Alert {
  id: string
  title: string
  riskLevel: "High" | "Medium" | "Low"
  severity: "Critical" | "High" | "Medium" | "Low"
  amount: string
  status: "Active" | "Resolved" | "Under Review"
  timestamp: string
  description: string
  category: string
  isNew?: boolean
}

interface AlertToastProps {
  alert: Alert
  onClose: () => void
  onView: () => void
}

export function AlertToast({ alert, onClose, onView }: AlertToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for animation to complete
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  const getIcon = () => {
    switch (alert.severity) {
      case "Critical":
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case "High":
        return <Shield className="w-5 h-5 text-orange-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getBorderColor = () => {
    switch (alert.severity) {
      case "Critical":
        return "border-l-red-500"
      case "High":
        return "border-l-orange-500"
      default:
        return "border-l-blue-500"
    }
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 w-96 bg-white border-l-4 ${getBorderColor()} shadow-lg rounded-lg transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            {getIcon()}
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">New Fraud Alert</h4>
              <p className="text-sm text-gray-600 mt-1">{alert.title}</p>
              <p className="text-xs text-gray-500 mt-1">
                {alert.category} • {alert.amount}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsVisible(false)
              setTimeout(onClose, 300)
            }}
            className="h-6 w-6 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="mt-3 flex space-x-2">
          <Button size="sm" onClick={onView} className="text-xs">
            View Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsVisible(false)
              setTimeout(onClose, 300)
            }}
            className="text-xs"
          >
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  )
}
