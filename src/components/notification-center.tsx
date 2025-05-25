"use client"

import { useState } from "react"
import { Bell, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const notifications = [
  {
    id: "1",
    title: "Task assigned",
    message: "You have been assigned to 'User Authentication Flow'",
    time: "2 minutes ago",
    read: false,
    type: "task_assigned",
  },
  {
    id: "2",
    title: "Project updated",
    message: "Website Redesign project status changed to 'In Progress'",
    time: "1 hour ago",
    read: false,
    type: "project_updated",
  },
  {
    id: "3",
    title: "Deadline approaching",
    message: "API Integration milestone due in 2 days",
    time: "3 hours ago",
    read: true,
    type: "deadline_approaching",
  },
]

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          <Button variant="ghost" size="sm">
            <Check className="h-4 w-4 mr-1" />
            Mark all read
          </Button>
        </div>
        <ScrollArea className="h-96">
          <div className="space-y-1">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0 ${
                  !notification.read ? "bg-muted/30" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium">{notification.title}</p>
                      {!notification.read && <div className="h-2 w-2 bg-blue-600 rounded-full" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
