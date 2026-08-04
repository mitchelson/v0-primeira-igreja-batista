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
    <div className="fixed bottom-20 left-4 right-4 z-40 mx-auto max-w-lg rounded-xl border bg-background p-3 shadow-sm md:bottom-4 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold">Instalar app</p>
        <p className="text-xs text-muted-foreground">Acesso rápido na tela inicial</p>
      </div>
      <Button size="sm" className="shrink-0" onClick={handleInstall}>
        <Download className="h-4 w-4 mr-1" /> Instalar
      </Button>
      <button
        type="button"
        className="shrink-0 text-muted-foreground hover:text-foreground"
        onClick={() => setDismissed(true)}
        aria-label="Dispensar"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
