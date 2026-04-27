"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ChevronDown, X } from "lucide-react"

interface Option {
  value: string
  label: string
  sublabel?: string
}

interface SearchableSelectProps {
  options: Option[]
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
}

export function SearchableSelect({ options, value, onValueChange, placeholder = "Selecione" }: SearchableSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  const filtered = options.filter(o => {
    if (!search) return true
    const terms = search.toLowerCase().split(" ").filter(Boolean)
    const label = o.label.toLowerCase()
    return terms.every(t => label.includes(t))
  })

  const selected = options.find(o => o.value === value)

  if (!open) {
    return (
      <Button variant="outline" className="w-full justify-between font-normal h-10" onClick={() => setOpen(true)}>
        <span className="truncate">{selected?.label || placeholder}</span>
        <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-background sm:relative sm:inset-auto sm:bg-transparent">
      <div className="flex flex-col h-full sm:h-auto sm:border sm:rounded-lg sm:shadow-lg sm:max-h-[300px]">
        {/* Header with search */}
        <div className="flex items-center gap-2 p-3 border-b shrink-0">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <Input ref={inputRef} value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome..." className="border-0 p-0 h-auto focus-visible:ring-0 shadow-none" />
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => { setOpen(false); setSearch("") }}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        {/* Options list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum resultado</p>
          )}
          {filtered.map(o => (
            <button key={o.value} className={`w-full text-left px-4 py-3 text-sm border-b last:border-0 transition-colors
              ${o.value === value ? "bg-primary/10 font-medium" : "hover:bg-muted/50"}`}
              onClick={() => { onValueChange(o.value); setOpen(false); setSearch("") }}>
              <span>{o.label}</span>
              {o.sublabel && <span className="text-xs text-muted-foreground ml-2">{o.sublabel}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
