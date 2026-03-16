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
const STATIC_DATA = {
  teams: [
    {
      name: "Zechnas HQ",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  projects: [],
}

import { useAuth } from "@/hooks/useAuth"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { appUser } = useAuth();

  const activeUser = {
    name: appUser?.role || "Usuario",
    email: appUser?.email || "sin_correo@zechnas.com",
    avatar: "/avatars/shadcn.jpg",
  };

  // Dinámicamente calcular qué menús ve el usuario en base a su rol
  const getNavMain = () => {
    const role = appUser?.role || 'CLIENT';
    
    // Todos ven el dashboard
    const baseNav = [
      {
        title: "Principal",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: role === 'CLIENT' ? 'Mi Bóveda' : 'Dashboard',
            url: "/dashboard?view=dashboard",
          }
        ],
      }
    ];

    if (role === 'ADMIN') {
      baseNav.push({
        title: "Gestión Directiva",
        url: "#",
        icon: BookOpen,
        isActive: true,
        items: [
          { title: "Clientes", url: "/dashboard?view=clients" },
          { title: "Facturación (XML)", url: "/dashboard?view=billing" },
          { title: "Equipo", url: "/dashboard?view=team" },
        ],
      });
      baseNav.push({
        title: "Sistema",
        url: "#",
        icon: Settings2,
        isActive: true,
        items: [
          { title: "Configuración", url: "/dashboard?view=settings" },
        ],
      });
    } else if (role === 'EMPLOYEE') {
       baseNav.push({
        title: "Operativa",
        url: "#",
        icon: BookOpen,
        isActive: true,
        items: [
          { title: "Mi Cartera", url: "/dashboard?view=clients" },
        ],
      });
    }

    return baseNav;
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={STATIC_DATA.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={getNavMain()} />
        <NavProjects projects={STATIC_DATA.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={activeUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
