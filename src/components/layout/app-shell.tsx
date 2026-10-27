'use client'

import * as React from 'react'
import { Navbar } from './navbar'
import { Footer } from './footer'
import { useAppStore } from '@/store/useAppStore'
import { GraduationCap } from 'lucide-react'

/**
 * AppShell handles the SSR hydration boundary.
 *
 * Problem: Zustand's persist middleware reads localStorage on the client.
 * If we let it auto-hydrate, the client's first render (hydration) would
 * use localStorage data while the server rendered with empty defaults —
 * causing React hydration errors.
 *
 * Solution: skipHydration: true in the store + manual rehydrate() here.
 * Before rehydration completes (_hasHydrated === false), we render a
 * minimal loading screen that is IDENTICAL on server and client, so
 * there is zero hydration mismatch. After rehydrate, real content shows.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const hasHydrated = useAppStore((s) => s._hasHydrated)

  React.useEffect(() => {
    if (!hasHydrated) {
      // Manually trigger rehydration from localStorage.
      // With sync storage (localStorage), this completes synchronously
      // and the onRehydrateStorage callback sets _hasHydrated = true.
      // We also set it here as a fallback for edge cases.
      useAppStore.persist.rehydrate()
      useAppStore.setState({ _hasHydrated: true })
    }
  }, [hasHydrated])

  if (!hasHydrated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-white">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div className="text-sm text-muted-foreground">Loading AI Mastery Academy…</div>
          <div className="mt-1 h-1 w-32 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
