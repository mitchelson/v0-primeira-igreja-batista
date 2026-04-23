"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, Users, MessageSquare, Music, UserCog, Calendar, ClipboardList } from "lucide-react"

const adminItems = [
  { title: "Dashboard", href: "/admin", icon: Home },
  { title: "Visitantes", href: "/admin/visitantes", icon: Users },
  { title: "Mensagens", href: "/admin/mensagens", icon: MessageSquare },
  { title: "Ministérios", href: "/admin/ministerios", icon: Music },
  { title: "Membros", href: "/admin/membros", icon: UserCog },
  { title: "Eventos", href: "/admin/eventos", icon: Calendar },
  { title: "Escalas", href: "/admin/escalas", icon: ClipboardList },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="font-bold text-lg">PIB Roraima</Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administração</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {session?.user && (
        <SidebarFooter className="p-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={session.user.image ?? undefined} />
              <AvatarFallback>{session.user.name?.[0] ?? "U"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-sm leading-tight">
              <span className="font-medium truncate">{session.user.name}</span>
              <span className="text-xs text-muted-foreground">{session.user.role}</span>
            </div>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  )
}
