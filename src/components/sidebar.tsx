import type React from "react";

import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  User,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, createContext, useContext, useMemo } from "react";
import { BureauLogo } from "./BureauLogo";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useCases } from "@/hooks/use-api";
import { CaseStatus } from "@/lib/api-types";

const SidebarContext = createContext<{
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}>({
  isCollapsed: false,
  setIsCollapsed: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

// Hook to get current user from localStorage
const useCurrentUser = () => {
  const [user] = useState(() => {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  });
  return user;
};

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useLocalStorage(
    "sidebar-collapsed",
    false
  );

  return (
    <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isCollapsed, setIsCollapsed } = useSidebar();

  // Get current user
  const currentUser = useCurrentUser();
  const currentUserId = currentUser?.id;

  // Fetch case counts for dynamic badges
  const { data: myCasesData } = useCases(
    currentUserId ? { assignedTo: parseInt(currentUserId) } : undefined
  );
  // const { data: highRiskCasesData } = useCases({ priority: "High" });
  const { data: highRiskCasesData } = useCases({
    page: 1,
    pageSize: 10,
    status: "ALL" as CaseStatus,
    priority: "High", // Always filter for high priority cases
    sortBy: "createdAt", // Sort by creation date by default
    sortOrder: "desc", // Show newest first
  });
  // Calculate case counts
  const myCasesCount = myCasesData?.pagination.totalItems || 0;
  const highRiskCasesCount = highRiskCasesData?.pagination.totalItems || 0;

  // Dynamic navigation array
  const navigation = useMemo(
    () => [
      {
        name: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
      },
      {
        name: "My Cases",
        href: "/my-cases",
        icon: FileText,
        badge: myCasesCount > 0 ? myCasesCount.toString() : undefined,
      },
      {
        name: "High Risk",
        href: "/high-risk",
        icon: AlertTriangle,
        badge:
          highRiskCasesCount > 0 ? highRiskCasesCount.toString() : undefined,
      },
      {
        name: "All Cases",
        href: "/cases",
        icon: FileText,
      },
    ],
    [myCasesCount, highRiskCasesCount]
  );

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center  px-3 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex h-20 items-center justify-center">
            <BureauLogo />
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 pt-6 pb-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const navigationItem = (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors group relative",
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white",
                isCollapsed ? "md:justify-center" : "md:justify-between"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {(!isCollapsed || isMobile) && <span>{item.name}</span>}
              </div>
              {item.badge && (!isCollapsed || isMobile) && (
                <Badge
                  variant="secondary"
                  className="bg-gray-700 text-gray-200"
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          );

          // Wrap with tooltip when collapsed and not mobile
          if (isCollapsed && !isMobile) {
            return (
              <Tooltip key={item.name} delayDuration={300}>
                <TooltipTrigger asChild>{navigationItem}</TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-gray-800 text-white border-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <span>{item.name}</span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className="bg-gray-700 text-gray-200"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          }

          return navigationItem;
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-gray-700 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center justify-center w-8 h-8 bg-gray-700 rounded-full flex-shrink-0">
            <User className="h-4 w-4" />
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                John Doe
              </p>
              <p className="text-xs text-gray-400 truncate">Supervisor</p>
            </div>
          )}
        </div>
        <div className="space-y-1">
          {isCollapsed && !isMobile ? (
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:bg-gray-800 hover:text-white w-8 h-8 p-0"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="bg-gray-800 text-white border-gray-700"
              >
                Sign out
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:bg-gray-800 hover:text-white w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              {(!isCollapsed || isMobile) && (
                <span className="ml-2">Sign out</span>
              )}
            </Button>
          )}
        </div>
      </div>
    </>
  );

  return (
    <TooltipProvider>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:flex fixed inset-y-0 overflow-x-hidden flex-col left-0 h-dvh overflow-y-auto z-50 bg-gray-900 text-white transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarContent />

        {/* Collapse Toggle */}
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-3 top-14 h-6 w-6 rounded-full bg-gray-800 text-white border border-gray-600"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronRight className="h-3 w-3" />
              ) : (
                <ChevronLeft className="h-3 w-3" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            className="bg-gray-800 text-white border-gray-700"
          >
            {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-50"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64 p-0 bg-gray-900 text-white border-gray-700"
        >
          <div className="flex h-full flex-col">
            <SidebarContent isMobile={true} />
          </div>
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
}
