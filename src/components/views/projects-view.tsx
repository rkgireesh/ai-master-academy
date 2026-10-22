'use client'

import * as React from 'react'
import { useAppStore } from '@/store/useAppStore'
import { projects } from '@/data'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { FolderKanban, Search, Clock, ArrowRight } from 'lucide-react'

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300',
  Intermediate: 'border-blue-500/30 bg-blue-500/5 text-blue-700 dark:text-blue-300',
  Advanced: 'border-violet-500/30 bg-violet-500/5 text-violet-700 dark:text-violet-300',
  Expert: 'border-rose-500/30 bg-rose-500/5 text-rose-700 dark:text-rose-300',
}

export function ProjectsView() {
  const navigate = useAppStore((s) => s.navigate)
  const [query, setQuery] = React.useState('')
  const [activeCat, setActiveCat] = React.useState<string>('All')

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.difficulty)))]

  const filtered = React.useMemo(() => {
    return projects.filter((p) => {
      const matchCat = activeCat === 'All' || p.difficulty === activeCat
      const q = query.toLowerCase()
      const matchQ = !q ||
        p.title.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.problem.toLowerCase().includes(q) ||
        p.techStack.some((t) => t.toLowerCase().includes(q))
      return matchCat && matchQ
    })
  }, [query, activeCat])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <FolderKanban className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Projects Library</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {projects.length} hands-on projects — from beginner chatbots to a production AI application.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, tech, or problem…"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                activeCat === c
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:bg-muted'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Project grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p, i) => (
          <Card
            key={p.id}
            onClick={() => navigate({ name: 'project', projectId: p.id })}
            className="card-hover cursor-pointer"
          >
            <CardContent className="p-4">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-mono text-[10px] text-muted-foreground">Project {i + 1}</span>
                <Badge variant="outline" className={`text-[10px] ${DIFFICULTY_COLORS[p.difficulty]}`}>
                  {p.difficulty}
                </Badge>
              </div>
              <h3 className="text-sm font-semibold">{p.title}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.tagline}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {p.techStack.slice(0, 3).map((t) => (
                  <Badge key={t} variant="outline" className="text-[9px]">{t}</Badge>
                ))}
                {p.techStack.length > 3 && (
                  <Badge variant="outline" className="text-[9px]">+{p.techStack.length - 3}</Badge>
                )}
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" /> ~{p.estimatedHours}h</span>
                <span className="flex items-center gap-1 text-primary">View <ArrowRight className="h-3 w-3" /></span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
