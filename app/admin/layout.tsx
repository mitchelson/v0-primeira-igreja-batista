import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AdminLayoutClient } from "./admin-layout-client"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect("/login")

  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
