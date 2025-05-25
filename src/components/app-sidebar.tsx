"use client"

import {
  BarChart3,
  Calendar,
  FileText,
  FolderOpen,
  Home,
  MessageSquare,
  Users,
  CheckSquare,
  Clock,
  Target,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { UserNav } from "@/components/user-nav"
import { TeamSwitcher } from "@/components/team-switcher"

const navigation = [
  {
    title: "Overview",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: Home },
      { title: "Projects", url: "/projects", icon: FolderOpen },
      { title: "Tasks", url: "/tasks", icon: CheckSquare },
      { title: "Calendar", url: "/calendar", icon: Calendar },
    ],
  },
  {
    title: "Collaboration",
    items: [
      { title: "Team", url: "/team", icon: Users },
      { title: "Messages", url: "/messages", icon: MessageSquare },
      { title: "Files", url: "/files", icon: FileText },
    ],
  },
  {
    title: "Analytics",
    items: [
      { title: "Reports", url: "/reports", icon: BarChart3 },
      { title: "Time Tracking", url: "/time", icon: Clock },
      { title: "Goals", url: "/goals", icon: Target },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent>
        {navigation.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <UserNav />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
