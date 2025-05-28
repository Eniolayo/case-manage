import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { UserNav } from "@/components/user-nav";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  additionalActions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  icon: Icon,
  additionalActions,
  className,
}: PageHeaderProps) {
  const [searchValue, setSearchValue] = React.useState("");
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };
  return (
    <header className={cn("border-b bg-white", className)}>
      <div className="flex h-16 items-center justify-between pl-14 pr-4 md:px-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <h1 className="text-lg sm:text-xl font-bold flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5" />}
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative hidden lg:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={"Search..."}
              className="w-48 xl:w-64 pl-8"
              value={searchValue}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          {additionalActions}
          <UserNav />
          <Link to={"/cases/new"}>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create New Case</span>
              <span className="sm:hidden">New</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
