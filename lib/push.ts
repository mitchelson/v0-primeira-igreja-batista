import webpush from "web-push"
import { sql } from "@/lib/neon"

let configured = false
function ensureConfigured() {
  if (configured) return
  const pub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const priv = process.env.VAPID_PRIVATE_KEY
  if (!pub || !priv) return
  webpush.setVapidDetails("mailto:" + (process.env.VAPID_EMAIL || "admin@example.com"), pub, priv)
  configured = true
}

export async function sendPushToUser(userId: string, payload: { title: string; body: string; url?: string }) {
  ensureConfigured()
  if (!configured) return 0

  const subs = await sql`SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE user_id = ${userId}`

  const results = await Promise.allSettled(
    subs.map((sub: any) =>
      webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify(payload)
      ).catch(async (err) => {
        if (err.statusCode === 410 || err.statusCode === 404) {
          await sql`DELETE FROM push_subscriptions WHERE endpoint = ${sub.endpoint}`
        }
        throw err
      })
    )
  )

  return results.filter((r) => r.status === "fulfilled").length
}
