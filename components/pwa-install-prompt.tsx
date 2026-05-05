"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Don't show if already installed (standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) return

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  if (!deferredPrompt || dismissed) return null

  const handleInstall = async () => {
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === "accepted") setDeferredPrompt(null)
  }

  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-blue-900">Instalar App</p>
        <p className="text-xs text-blue-700">Acesse mais rápido direto da sua tela inicial</p>
      </div>
      <Button size="sm" className="shrink-0 bg-blue-600 hover:bg-blue-700" onClick={handleInstall}>
        <Download className="h-4 w-4 mr-1" /> Instalar
      </Button>
      <button className="shrink-0 text-blue-400 hover:text-blue-600" onClick={() => setDismissed(true)}>
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
