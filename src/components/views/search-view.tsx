'use client'

import * as React from 'react'
import { useAppStore } from '@/store/useAppStore'
import { modules, glossary, projects, getAllLessons } from '@/data'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, BookOpen, BookMarked, FolderKanban, ArrowRight } from 'lucide-react'

interface SearchResult {
  type: 'lesson' | 'glossary' | 'project'
  title: string
  subtitle: string
  match: string
  route: () => void
}

export function SearchView({ query }: { query: string }) {
  const navigate = useAppStore((s) => s.navigate)
  const [q, setQ] = React.useState(query)

  React.useEffect(() => { setQ(query) }, [query])

  const results = React.useMemo(() => {
    if (!q.trim()) return []
    const lower = q.toLowerCase()
    const out: SearchResult[] = []

    // Lessons
    for (const lesson of getAllLessons()) {
      const haystack = [
        lesson.title, lesson.subtitle, lesson.definition, lesson.summary,
        ...lesson.tags,
      ].join(' ').toLowerCase()
      if (haystack.includes(lower)) {
        const match = lesson.definition.toLowerCase().includes(lower) ? lesson.definition
          : lesson.summary.toLowerCase().includes(lower) ? lesson.summary
          : lesson.subtitle
        out.push({
          type: 'lesson',
          title: lesson.title,
          subtitle: `Module ${lesson.moduleIndex} · ${lesson.moduleTitle}`,
          match,
          route: () => navigate({ name: 'lesson', moduleId: lesson.moduleId, lessonId: lesson.lessonId }),
        })
      }
    }

    // Glossary
    for (const g of glossary) {
      const haystack = [g.term, g.short, g.detailed].join(' ').toLowerCase()
      if (haystack.includes(lower)) {
        out.push({
          type: 'glossary',
          title: g.term,
          subtitle: `Glossary · ${g.category}`,
          match: g.short,
          route: () => navigate({ name: 'glossary' }),
        })
      }
    }

    // Projects
    for (const p of projects) {
      const haystack = [p.title, p.tagline, p.problem, ...p.techStack].join(' ').toLowerCase()
      if (haystack.includes(lower)) {
        out.push({
          type: 'project',
          title: p.title,
          subtitle: `Project · ${p.difficulty}`,
          match: p.tagline,
          route: () => navigate({ name: 'project', projectId: p.id }),
        })
      }
    }

    return out
  }, [q, navigate])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate({ name: 'search', query: q.trim() })
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Search</h1>
        <p className="text-sm text-muted-foreground">Search across all lessons, glossary terms, and projects.</p>
      </div>

      <form onSubmit={submit} className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search…"
            className="pl-9 h-10"
            autoFocus
          />
        </div>
      </form>

      {q.trim() === '' ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
          Type a search term above to find lessons, glossary terms, and projects.
        </div>
      ) : results.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
          No results for &quot;{q}&quot;.
        </div>
      ) : (
        <>
          <div className="mb-3 text-xs text-muted-foreground">{results.length} results for &quot;{q}&quot;</div>
          <div className="space-y-2">
            {results.map((r, i) => {
              const Icon = r.type === 'lesson' ? BookOpen : r.type === 'glossary' ? BookMarked : FolderKanban
              return (
                <Card
                  key={i}
                  onClick={r.route}
                  className="card-hover cursor-pointer"
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <Badge variant="outline" className="text-[9px] capitalize">{r.type}</Badge>
                      <span className="text-[10px] text-muted-foreground">{r.subtitle}</span>
                      <ArrowRight className="ml-auto h-3 w-3 text-muted-foreground" />
                    </div>
                    <h3 className="mt-1 text-sm font-semibold">{r.title}</h3>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{r.match}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
