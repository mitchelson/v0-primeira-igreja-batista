"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import useSWR from "swr"
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Home, Users, MessageSquare, UserCog, Calendar, ClipboardList, Plus } from "lucide-react"

const fetcher = (url: string) => fetch(url).then(r => r.json())

const fixedItems = [
  { title: "Dashboard", href: "/admin", icon: Home },
  { title: "Visitantes", href: "/admin/visitantes", icon: Users },
  { title: "Mensagens", href: "/admin/mensagens", icon: MessageSquare },
]

const adminOnlyItems = [
  { title: "Membros", href: "/admin/membros", icon: UserCog },
  { title: "Eventos", href: "/admin/eventos", icon: Calendar },
  { title: "Escalas", href: "/admin/escalas", icon: ClipboardList },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { data: ministerios } = useSWR("/api/ministerios", fetcher, { refreshInterval: 30000 })
  const role = session?.user?.role

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="font-bold text-lg">PIB Roraima</Link>
      </SidebarHeader>
      <SidebarContent>
        {/* Navegação principal */}
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {fixedItems.map((item) => (
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

        {/* Ministérios dinâmicos */}
        <SidebarGroup>
          <SidebarGroupLabel>Ministérios</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ministerios?.filter((m: any) => m.ativo).map((m: any) => (
                <SidebarMenuItem key={m.id}>
                  <SidebarMenuButton asChild isActive={pathname === `/admin/ministerios/${m.id}`}>
                    <Link href={`/admin/ministerios`}>
                      <span className="text-base leading-none">{m.icone || "⛪"}</span>
                      <span>{m.nome}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              {role === "admin" && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/admin/ministerios"}>
                    <Link href="/admin/ministerios">
                      <Plus className="h-4 w-4" />
                      <span>Gerenciar</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin only */}
        {role === "admin" && (
          <SidebarGroup>
            <SidebarGroupLabel>Administração</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminOnlyItems.map((item) => (
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
        )}
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
              <span className="text-xs text-muted-foreground capitalize">{session.user.role}</span>
            </div>
          </div>
        </SidebarFooter>
      )}
    </Sidebar>
  )
}
