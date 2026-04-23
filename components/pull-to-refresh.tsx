"use client"

import { useRouter } from "next/navigation"
import { useCallback, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

const THRESHOLD = 80

export function PullToRefresh({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [pullY, setPullY] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const startY = useRef(0)
  const pulling = useRef(false)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (window.scrollY === 0 && !refreshing) {
      startY.current = e.touches[0].clientY
      pulling.current = true
    }
  }, [refreshing])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!pulling.current) return
    const delta = Math.max(0, e.touches[0].clientY - startY.current)
    setPullY(Math.min(delta * 0.5, THRESHOLD * 1.5))
  }, [])

  const onTouchEnd = useCallback(() => {
    if (!pulling.current) return
    pulling.current = false
    if (pullY >= THRESHOLD) {
      setRefreshing(true)
      setPullY(THRESHOLD * 0.5)
      router.refresh()
      setTimeout(() => {
        setRefreshing(false)
        setPullY(0)
      }, 1000)
    } else {
      setPullY(0)
    }
  }, [pullY, router])

  return (
    <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <div
        className="flex items-center justify-center overflow-hidden transition-[height] duration-200"
        style={{ height: pullY }}
      >
        <Loader2 className={`h-5 w-5 text-muted-foreground ${refreshing || pullY >= THRESHOLD ? "animate-spin" : ""}`}
          style={{ opacity: Math.min(pullY / THRESHOLD, 1) }}
        />
      </div>
      {children}
    </div>
  )
}
