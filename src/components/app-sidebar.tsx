"use client"

import * as React from "react"
import {
  BookOpen,
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Navigation Data
const data = {
  user: {
    name: "Admin User",
    email: "admin@zechnas.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Zechnas HQ",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Principal",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/dashboard?view=dashboard",
        }
      ],
    },
    {
      title: "Gestión",
      url: "#",
      icon: BookOpen,
      isActive: true,
      items: [
        {
          title: "Clientes",
          url: "/dashboard?view=clients",
        },
        {
          title: "Facturación (XML)",
          url: "/dashboard?view=billing",
        },
        {
          title: "Equipo",
          url: "/dashboard?view=team",
        },
      ],
    },
    {
      title: "Sistema",
      url: "#",
      icon: Settings2,
      isActive: true,
      items: [
        {
          title: "Configuración",
          url: "/dashboard?view=settings",
        },
      ],
    },
  ],
  projects: [],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
