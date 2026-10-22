'use client'

import * as React from 'react'
import { useAppStore } from '@/store/useAppStore'
import { glossary, getModule } from '@/data'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, BookMarked } from 'lucide-react'

const CATEGORY_COLORS: Record<string, string> = {
  'AI Fundamentals': 'border-blue-500/30 bg-blue-500/5 text-blue-700 dark:text-blue-300',
  'Machine Learning': 'border-violet-500/30 bg-violet-500/5 text-violet-700 dark:text-violet-300',
  'Deep Learning': 'border-fuchsia-500/30 bg-fuchsia-500/5 text-fuchsia-700 dark:text-fuchsia-300',
  'Generative AI': 'border-pink-500/30 bg-pink-500/5 text-pink-700 dark:text-pink-300',
  'LLM': 'border-cyan-500/30 bg-cyan-500/5 text-cyan-700 dark:text-cyan-300',
  'RAG': 'border-teal-500/30 bg-teal-500/5 text-teal-700 dark:text-teal-300',
  'Embeddings': 'border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300',
  'Agents': 'border-orange-500/30 bg-orange-500/5 text-orange-700 dark:text-orange-300',
  'Tools & MCP': 'border-rose-500/30 bg-rose-500/5 text-rose-700 dark:text-rose-300',
  'Multi-Agent': 'border-indigo-500/30 bg-indigo-500/5 text-indigo-700 dark:text-indigo-300',
  'Production': 'border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-300',
}

export function GlossaryView() {
  const navigate = useAppStore((s) => s.navigate)
  const [query, setQuery] = React.useState('')
  const [activeCategory, setActiveCategory] = React.useState<string>('All')

  const categories = ['All', ...Array.from(new Set(glossary.map((g) => g.category))).sort()]

  const filtered = React.useMemo(() => {
    return glossary.filter((g) => {
      const matchCategory = activeCategory === 'All' || g.category === activeCategory
      const q = query.toLowerCase()
      const matchQuery = !q ||
        g.term.toLowerCase().includes(q) ||
        g.short.toLowerCase().includes(q) ||
        g.detailed.toLowerCase().includes(q)
      return matchCategory && matchQuery
    })
  }, [query, activeCategory])

  // Group by first letter
  const grouped = React.useMemo(() => {
    const map = new Map<string, typeof glossary>()
    for (const entry of filtered) {
      const letter = entry.term[0].toUpperCase()
      if (!map.has(letter)) map.set(letter, [])
      map.get(letter)!.push(entry)
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [filtered])

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <BookMarked className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">AI Glossary</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {glossary.length} terms — from AGI to VAE. Searchable and filterable by category.
        </p>
      </div>

      {/* Search + filters */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search terms…"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                activeCategory === c
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:bg-muted'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grouped terms */}
      {grouped.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          No terms match your search.
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(([letter, entries]) => (
            <div key={letter}>
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 font-mono text-sm font-bold text-primary">
                  {letter}
                </span>
                <span className="text-xs text-muted-foreground">{entries.length} terms</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {entries.map((entry) => (
                  <Card key={entry.term} className="card-hover">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-semibold">{entry.term}</h3>
                        <Badge variant="outline" className={`shrink-0 text-[9px] ${CATEGORY_COLORS[entry.category] ?? ''}`}>
                          {entry.category}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{entry.short}</p>
                      <p className="mt-1.5 text-xs leading-5">{entry.detailed}</p>
                      {entry.relatedLesson && (
                        <button
                          onClick={() => navigate({ name: 'lesson', moduleId: entry.relatedLesson!.moduleId, lessonId: entry.relatedLesson!.lessonId })}
                          className="mt-2 text-[11px] text-primary hover:underline"
                        >
                          → Read full lesson
                        </button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
