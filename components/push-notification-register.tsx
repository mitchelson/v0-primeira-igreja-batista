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

  if (!supported) return null

  const toggle = async () => {
    setLoading(true)
    try {
      const reg = await navigator.serviceWorker.ready
      if (subscribed) {
        const sub = await reg.pushManager.getSubscription()
        if (sub) {
          await fetch("/api/push/subscribe", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ endpoint: sub.endpoint }),
          })
          await sub.unsubscribe()
        }
        setSubscribed(false)
      } else {
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
      }
    } catch (e) {
      console.error("Push toggle error:", e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant={subscribed ? "outline" : "default"} size="sm" onClick={toggle} disabled={loading}>
      {subscribed ? <BellOff className="mr-2 h-4 w-4" /> : <Bell className="mr-2 h-4 w-4" />}
      {subscribed ? "Desativar notificações" : "Ativar notificações"}
    </Button>
  )
}
