"use client"

import { useState } from "react"
import useSWR from "swr"
import { Bell } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const fetcher = (url: string) => fetch(url).then(r => r.json())

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return "agora"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  return `${days}d`
}

export function NotificationsButton() {
  const { data, mutate } = useSWR("/api/notifications", fetcher, { refreshInterval: 30000 })
  const [open, setOpen] = useState(false)

  const markAllRead = async () => {
    await fetch("/api/notifications", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    })
    mutate()
  }

  const unread = data?.unread || 0

  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (o && unread > 0) markAllRead() }}>
      <PopoverTrigger asChild>
        <button className="relative p-1">
          <Bell className="h-5 w-5 text-gray-600" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 max-h-[400px] overflow-y-auto">
        <div className="p-3 border-b">
          <h3 className="font-semibold text-sm">Notificações</h3>
        </div>
        {data?.notifications?.length === 0 ? (
          <p className="p-4 text-sm text-gray-400 text-center">Nenhuma notificação</p>
        ) : (
          <div className="divide-y">
            {data?.notifications?.map((n: any) => (
              <div key={n.id} className={`px-3 py-2.5 ${!n.lida ? "bg-blue-50" : ""}`}>
                <p className="text-sm font-medium">{n.titulo}</p>
                {n.mensagem && <p className="text-xs text-gray-500 mt-0.5">{n.mensagem}</p>}
                <p className="text-[10px] text-gray-400 mt-1">{timeAgo(n.criado_em)}</p>
              </div>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
