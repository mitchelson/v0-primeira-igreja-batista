"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Bell, Check } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function PushNotificationRegister() {
  const [supported, setSupported] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) return
    setSupported(true)

    // Check existing subscription
    navigator.serviceWorker.ready.then((reg) =>
      reg.pushManager.getSubscription().then((sub) => {
        if (sub) setSubscribed(true)
      })
    )
  }, [])

  if (!supported || subscribed) return null

  const subscribe = async () => {
    setLoading(true)
    try {
      // Request notification permission first (required on iOS)
      const permission = await Notification.requestPermission()
      if (permission !== "granted") {
        toast({ title: "Permissão negada", description: "Ative as notificações nas configurações do dispositivo.", variant: "destructive" })
        return
      }

      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      })
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      })
      setSubscribed(true)
      toast({ title: "Notificações ativadas ✅" })
    } catch (e: any) {
      console.error("Push subscribe error:", e)
      toast({ title: "Erro ao ativar", description: "Tente novamente ou verifique as permissões.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button size="sm" onClick={subscribe} disabled={loading}>
      <Bell className="mr-2 h-4 w-4" />
      {loading ? "Ativando..." : "Ativar notificações"}
    </Button>
  )
}
