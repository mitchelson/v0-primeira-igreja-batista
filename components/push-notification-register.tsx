"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Bell, BellOff } from "lucide-react"

export function PushNotificationRegister() {
  const [supported, setSupported] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return
    setSupported(true)
    navigator.serviceWorker.ready.then((reg) =>
      reg.pushManager.getSubscription().then((sub) => setSubscribed(!!sub))
    )
  }, [])

  if (!supported || subscribed) return null

  const subscribe = async () => {
    setLoading(true)
    try {
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
    } catch (e) {
      console.error("Push subscribe error:", e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button size="sm" onClick={subscribe} disabled={loading}>
      <Bell className="mr-2 h-4 w-4" />
      Ativar notificações
    </Button>
  )
}
