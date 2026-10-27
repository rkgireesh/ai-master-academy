'use client'

import * as React from 'react'
import * as Icons from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { labs } from '@/data/labs'
import { getModule } from '@/data'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FlaskConical, Search, Clock, ArrowRight, Target } from 'lucide-react'
import { cn } from '@/lib/utils'

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300',
  Intermediate: 'border-blue-500/30 bg-blue-500/5 text-blue-700 dark:text-blue-300',
  Advanced: 'border-violet-500/30 bg-violet-500/5 text-violet-700 dark:text-violet-300',
}

const CATEGORY_COLORS: Record<string, string> = {
  Fundamentals: 'from-blue-500 to-violet-500',
  LLM: 'from-cyan-500 to-blue-500',
  RAG: 'from-teal-500 to-cyan-500',
  Agents: 'from-orange-500 to-amber-500',
  Generative: 'from-fuchsia-500 to-pink-500',
}

export function LabsView() {
  const navigate = useAppStore((s) => s.navigate)
  const [query, setQuery] = React.useState('')
  const [activeCategory, setActiveCategory] = React.useState<string>('All')

  const categories = ['All', ...Array.from(new Set(labs.map((l) => l.category)))]

  const filtered = React.useMemo(() => {
    return labs.filter((l) => {
      const matchCat = activeCategory === 'All' || l.category === activeCategory
      const q = query.toLowerCase()
      const matchQ = !q ||
        l.title.toLowerCase().includes(q) ||
        l.tagline.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q)
      return matchCat && matchQ
    })
  }, [query, activeCategory])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <FlaskConical className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Practical Labs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Hands-on experiments that run right in your browser. No setup, no API keys — just click and learn.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search labs…"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={cn(
                'rounded-full border px-2.5 py-1 text-xs transition-colors',
                activeCategory === c
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:bg-muted'
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Lab grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((lab) => {
          const IconComp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[lab.icon] ?? Icons.FlaskConical
          const relatedModule = getModule(lab.relatedModuleId) ?? null
          return (
            <Card
              key={lab.id}
              onClick={() => navigate({ name: 'lab', labId: lab.id })}
              className="card-hover cursor-pointer overflow-hidden"
            >
              <div className={cn('h-1.5 bg-gradient-to-r', CATEGORY_COLORS[lab.category] ?? 'from-primary to-primary/60')} />
              <CardContent className="p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br text-white', CATEGORY_COLORS[lab.category] ?? 'from-primary to-primary/60')}>
                    <IconComp className="h-4 w-4" />
                  </div>
                  <Badge variant="outline" className={`text-[10px] ${DIFFICULTY_COLORS[lab.difficulty]}`}>
                    {lab.difficulty}
                  </Badge>
                </div>
                <h3 className="text-sm font-semibold">{lab.title}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{lab.tagline}</p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" /> {lab.estimatedMinutes} min
                  </span>
                  <span className="flex items-center gap-1 text-primary">
                    Open lab <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
          No labs match your search.
        </div>
      )}

      {/* CTA */}
      <Card className="mt-8 border-primary/30">
        <CardContent className="bg-gradient-to-br from-primary/10 via-background to-background p-6 text-center">
          <Target className="mx-auto h-8 w-8 text-primary" />
          <h2 className="mt-2 text-lg font-bold">Want more hands-on practice?</h2>
          <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
            Each lab is paired with a lesson from the curriculum and a project from the library.
            Read the lesson → run the lab → build the project for maximum retention.
          </p>
          <div className="mt-3 flex justify-center gap-2">
            <Button size="sm" variant="outline" onClick={() => navigate({ name: 'modules' })}>
              Browse modules
            </Button>
            <Button size="sm" onClick={() => navigate({ name: 'projects' })}>
              Browse projects
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

