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

    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg) return
      reg.pushManager.getSubscription().then((sub) => {
        if (sub) setSubscribed(true)
      })
    })
  }, [])

  if (!supported || subscribed) return null

  const swReady = (): Promise<ServiceWorkerRegistration> =>
    Promise.race([
      navigator.serviceWorker.ready,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("sw-timeout")), 8000)
      ),
    ])

  const subscribe = async () => {
    setLoading(true)
    try {
      const permission = await Notification.requestPermission()
      if (permission !== "granted") {
        toast({ title: "Permissão negada", description: "Ative as notificações nas configurações do dispositivo.", variant: "destructive" })
        return
      }

      const reg = await swReady()
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
      const description = e?.message === "sw-timeout"
        ? "Recarregue a página e tente novamente."
        : "Tente novamente ou verifique as permissões."
      toast({ title: "Erro ao ativar notificações", description, variant: "destructive" })
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
