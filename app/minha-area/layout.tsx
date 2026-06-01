"use client"

import { BottomTabBar } from "@/components/bottom-tab-bar"

export default function MinhaAreaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-16 md:pb-0">
      {children}
      <BottomTabBar />
    </div>
  )
}
