"use client"

import { Music, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface RepertoireItem {
  id: string
  nome: string
  tonalidade?: string
  link?: string
  observacoes?: string
}

export function RepertoireList({ items }: { items: RepertoireItem[] }) {
  if (!items.length) return <p className="text-[13px] text-gray-400 text-center py-4">Nenhuma música no repertório.</p>

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl border border-gray-200">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gray-100 shrink-0">
            <Music className="h-4 w-4 text-gray-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-sm text-gray-900 truncate">{item.nome}</p>
              {item.tonalidade && (
                <Badge className="bg-blue-50 text-blue-700 border-0 text-[10px] rounded-full px-2 py-0">
                  {item.tonalidade}
                </Badge>
              )}
            </div>
            {item.observacoes && <p className="text-xs text-gray-400 mt-0.5">{item.observacoes}</p>}
          </div>
          {item.link && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center justify-center h-8 w-8 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-4 w-4 text-gray-500" />
            </a>
          )}
        </div>
      ))}
    </div>
  )
}
