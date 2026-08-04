"use client"

import { cn } from "@/lib/utils"

export type RoleBadgeItem = {
  role_name: string
  role_display_name?: string | null
  context_type?: string | null
  context_name?: string | null
  context_id?: string | null
}

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  supervisor: "Supervisor",
  lider: "Líder",
  membro: "Membro",
  congregado: "Congregado",
  visitante: "Visitante",
  visitor: "Visitante",
  professor_ebd: "Professor EBD",
  aluno_ebd: "Aluno EBD",
}

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-red-100 text-red-700",
  supervisor: "bg-purple-100 text-purple-700",
  lider: "bg-blue-100 text-blue-700",
  membro: "bg-gray-100 text-gray-700",
  congregado: "bg-teal-100 text-teal-700",
  visitante: "bg-amber-100 text-amber-800",
  visitor: "bg-amber-100 text-amber-800",
  professor_ebd: "bg-indigo-100 text-indigo-700",
  aluno_ebd: "bg-sky-100 text-sky-700",
}

export function roleLabel(roleName: string, displayName?: string | null): string {
  return displayName || ROLE_LABELS[roleName] || roleName
}

export function roleColor(roleName: string): string {
  return ROLE_COLORS[roleName] || "bg-gray-100 text-gray-700"
}

export function formatRoleBadge(role: RoleBadgeItem): string {
  const label = roleLabel(role.role_name, role.role_display_name)
  if (role.context_type && role.context_type !== "global" && role.context_name) {
    return `${label} · ${role.context_name}`
  }
  return label
}

export function RoleBadges({
  roles,
  legacyRole,
  className,
  size = "sm",
}: {
  roles?: RoleBadgeItem[] | null
  legacyRole?: string | null
  className?: string
  size?: "xs" | "sm"
}) {
  const items: RoleBadgeItem[] =
    roles && roles.length > 0
      ? roles
      : legacyRole
        ? [{ role_name: legacyRole === "visitor" ? "visitante" : legacyRole }]
        : []

  if (items.length === 0) return null

  const textSize = size === "xs" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-0.5"

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {items.map((role, i) => (
        <span
          key={`${role.role_name}-${role.context_id || "global"}-${i}`}
          className={cn("rounded font-medium", textSize, roleColor(role.role_name))}
        >
          {formatRoleBadge(role)}
        </span>
      ))}
    </div>
  )
}
