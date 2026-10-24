'use client'

import * as React from 'react'
import Link from 'next/link'
import { useAppStore, type Route } from '@/store/useAppStore'
import { cn } from '@/lib/utils'
import {
  Brain, LayoutDashboard, BookOpen, Map, FolderKanban, Search,
  Menu, X, GraduationCap, BookMarked, FlaskConical,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader,
} from '@/components/ui/sheet'
import { ThemeToggle } from './theme-toggle'

const NAV_ITEMS: { label: string; route: Route; icon: React.ComponentType<{ className?: string }> }[] = [
  { label: 'Home', route: { name: 'home' }, icon: Brain },
  { label: 'Dashboard', route: { name: 'dashboard' }, icon: LayoutDashboard },
  { label: 'Modules', route: { name: 'modules' }, icon: BookOpen },
  { label: 'Labs', route: { name: 'labs' }, icon: FlaskConical },
  { label: 'Roadmap', route: { name: 'roadmap' }, icon: Map },
  { label: 'Projects', route: { name: 'projects' }, icon: FolderKanban },
  { label: 'Glossary', route: { name: 'glossary' }, icon: BookMarked },
]

export function Navbar() {
  const route = useAppStore((s) => s.route)
  const navigate = useAppStore((s) => s.navigate)
  const [searchOpen, setSearchOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const isActive = (r: Route): boolean => {
    if (r.name === 'modules' && (route.name === 'modules' || route.name === 'module' || route.name === 'lesson' || route.name === 'quiz')) return true
    if (r.name === 'labs' && (route.name === 'labs' || route.name === 'lab')) return true
    return r.name === route.name
  }

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    navigate({ name: 'search', query: query.trim() })
    setSearchOpen(false)
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4 sm:px-6">
        {/* Logo */}
        <button
          onClick={() => navigate({ name: 'home' })}
          className="flex items-center gap-2 font-semibold"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 text-white">
            <GraduationCap className="h-4 w-4" />
          </div>
          <span className="hidden text-sm sm:inline">AI Mastery Academy</span>
        </button>

        {/* Desktop nav */}
        <nav className="ml-4 hidden items-center gap-0.5 md:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.route)}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                isActive(item.route)
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Search + actions */}
        <div className="ml-auto flex items-center gap-1.5">
          <form onSubmit={submitSearch} className="hidden lg:block">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search lessons, terms…"
                className="h-8 w-56 pl-8 text-sm"
              />
            </div>
          </form>

          <Button
            variant="ghost" size="icon"
            onClick={() => setSearchOpen((s) => !s)}
            className="lg:hidden"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Button>

          <ThemeToggle />

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 text-white">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  AI Mastery Academy
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-1">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => { navigate(item.route); setMobileOpen(false) }}
                    className={cn(
                      'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive(item.route)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </button>
                ))}
              </div>
              <form onSubmit={submitSearch} className="mt-4 px-3">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search lessons…"
                    className="h-9 pl-8 text-sm"
                  />
                </div>
              </form>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Inline search (mobile/tablet) */}
      {searchOpen && (
        <div className="border-t bg-background p-3 lg:hidden">
          <form onSubmit={submitSearch}>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search lessons, terms…"
                className="h-9 pl-8 text-sm"
                autoFocus
              />
            </div>
          </form>
        </div>
      )}
    </header>
  )
}
