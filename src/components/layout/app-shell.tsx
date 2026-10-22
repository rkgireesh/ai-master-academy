'use client'

import * as React from 'react'
import { Navbar } from './navbar'
import { Footer } from './footer'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
