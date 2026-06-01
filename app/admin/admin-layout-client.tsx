"use client"

import { usePathname } from "next/navigation"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Separator } from "@/components/ui/separator"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { BottomTabBar } from "@/components/bottom-tab-bar"

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isSubpage = pathname !== "/admin"

  return (
    <>
      {/* Desktop: sidebar layout */}
      <div className="hidden md:block">
        <SidebarProvider>
          <AdminSidebar />
          <SidebarInset>
            <header className="flex h-14 items-center gap-2 border-b px-4">
              <SidebarTrigger />
              <Separator orientation="vertical" className="h-6" />
              <div className="flex-1" />
              <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOut className="h-4 w-4 mr-1" />
                Sair
              </Button>
            </header>
            <div className="p-4 md:p-6">{children}</div>
          </SidebarInset>
        </SidebarProvider>
      </div>

      {/* Mobile: header simples + conteúdo + tab bar */}
      <div className="md:hidden pb-16">
        <header className="sticky top-0 z-40 bg-white border-b">
          <div className="flex items-center h-14 px-4 gap-3">
            {isSubpage && (
              <Link href="/admin">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
            )}
            <Link href="/" className="flex-shrink-0">
              <Image src="/pib-logo-black.png" alt="PIB" width={80} height={28} className="h-6 w-auto" />
            </Link>
            <div className="flex-1" />
            <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <div className="p-4">{children}</div>
        <BottomTabBar />
      </div>
    </>
  )
}
