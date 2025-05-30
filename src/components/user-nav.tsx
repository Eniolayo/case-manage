import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Settings,
  LogOut,
  HelpCircle,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export function UserNav() {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "New high-risk case assigned",
      description: "Case #1031 with score 850 has been assigned to you",
      time: "2 minutes ago",
      type: "assignment",
      read: false,
    },
    {
      id: "2",
      title: "Case #1028 escalated",
      description: "Case has been escalated due to suspicious activity",
      time: "15 minutes ago",
      type: "escalation",
      read: false,
    },
    {
      id: "3",
      title: "Customer contact successful",
      description: "Customer for Case #1025 has been reached",
      time: "1 hour ago",
      type: "update",
      read: true,
    },
    {
      id: "4",
      title: "Case #1020 resolved",
      description: "Case has been marked as resolved",
      time: "2 hours ago",
      type: "resolution",
      read: true,
    },
    {
      id: "5",
      title: "System maintenance scheduled",
      description: "Maintenance window: Tonight 11 PM - 2 AM",
      time: "3 hours ago",
      type: "system",
      read: true,
    },
  ]);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "assignment":
        return <User className="h-4 w-4 text-blue-500" />;
      case "escalation":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "resolution":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleLogout = () => {
    alert("Logout functionality would redirect to login page");
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId)
    );
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    switch (notification.type) {
      case "assignment":
        const caseMatch = notification.description.match(/Case #(\d+)/);
        if (caseMatch) {
          alert(`Would navigate to /cases/${caseMatch[1]}`);
        }
        break;
      case "escalation":
        const escalationMatch = notification.description.match(/Case #(\d+)/);
        if (escalationMatch) {
          alert(`Would navigate to /cases/${escalationMatch[1]}`);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative h-8 w-8 sm:h-10 sm:w-10">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -right-1 -top-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {unreadCount}
              </Badge>
            )}
            <span className="sr-only">Notifications</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 p-0" align="end" forceMount>
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h4 className="font-semibold">Notifications</h4>
            <Button variant="ghost" size="sm" className="text-xs" onClick={markAllAsRead}>
              Mark all read
            </Button>
          </div>
          <ScrollArea className="h-[400px]">
            <div className="space-y-1 p-2">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bell className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No notifications</p>
                  <p className="text-xs text-muted-foreground">You're all caught up!</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`group relative flex gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50 cursor-pointer ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium leading-none pr-2">{notification.title}</p>
                        <div className="flex items-center gap-1">
                          {!notification.read && <div className="h-2 w-2 rounded-full bg-blue-500" />}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNotification(notification.id)
                            }}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Delete notification</span>
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{notification.description}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {notification.time}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          <div className="border-t p-2">
            <Button
              variant="ghost"
              className="w-full text-sm"
              onClick={() => {
                alert("Would navigate to /notifications page")
              }}
            >
              View all notifications
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu> */}
      <section className="block md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src="/placeholder.svg?height=32&width=32"
                  alt="User"
                />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">John Doe</p>
                <p className="text-xs leading-none text-muted-foreground">
                  john.doe@example.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>
    </div>
  );
}
