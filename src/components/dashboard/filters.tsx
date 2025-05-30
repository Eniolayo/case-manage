import { Button } from "@/components/ui/button";
import {
  Filter,
  ArrowUpDown,
  Calendar,
  TrendingUp,
  Minus,
  TrendingDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilterType } from "@/types/dashboard";
import { CasePriority } from "@/lib/api-types";

interface FiltersProps {
  primaryFilter: FilterType;
  onPrimaryFilterChange: (value: FilterType) => void;
  onPriorityChange: (priority: string) => void;
  onSortChange: (sortBy: string) => void;
  sortBy: "created" | "priority" | "status";
  sortOrder: "asc" | "desc";
}

export function Filters({
  primaryFilter,
  onPrimaryFilterChange,
  onPriorityChange,
  onSortChange,
  sortBy,
  sortOrder,
}: FiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
        <label className="text-sm font-medium">Filter by Type:</label>
        <div className="flex items-center gap-4">
          <Select value={primaryFilter} onValueChange={onPrimaryFilterChange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="DEBIT_CARD">Debit Card</SelectItem>
              <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
              <SelectItem value="WALLET">Wallet</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Date Range
              </DropdownMenuLabel>
              <DropdownMenuItem>
                <Calendar className="mr-2 h-4 w-4" />
                Last 7 days
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="mr-2 h-4 w-4" />
                Last 30 days (Default)
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Case Priority
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onPriorityChange("all")}>
                <TrendingUp className="mr-2 h-4 w-4" />
                All Priorities
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPriorityChange("High")}>
                <TrendingUp className="mr-2 h-4 w-4" />
                High
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPriorityChange("Medium")}>
                <Minus className="mr-2 h-4 w-4" />
                Medium
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPriorityChange("Low")}>
                <TrendingDown className="mr-2 h-4 w-4" />
                Low
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <ArrowUpDown className="h-4 w-4" />
              <span className="hidden sm:inline">Sort</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => onSortChange("created")}>
                <Calendar className="mr-2 h-4 w-4" />
                Created Date{" "}
                {sortBy === "created" && (sortOrder === "desc" ? "↓" : "↑")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange("priority")}>
                <TrendingUp className="mr-2 h-4 w-4" />
                Priority{" "}
                {sortBy === "priority" && (sortOrder === "desc" ? "↓" : "↑")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange("status")}>
                <Filter className="mr-2 h-4 w-4" />
                Status{" "}
                {sortBy === "status" && (sortOrder === "desc" ? "↓" : "↑")}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
