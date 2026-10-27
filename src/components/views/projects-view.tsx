'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { projects } from '@/data'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { ProjectPipeline, PROJECT_PIPELINES, PROJECT_IMAGES } from '@/components/projects/project-pipeline'
import { FolderKanban, Search, Clock, ArrowRight, Zap, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300',
  Intermediate: 'border-blue-500/30 bg-blue-500/5 text-blue-700 dark:text-blue-300',
  Advanced: 'border-violet-500/30 bg-violet-500/5 text-violet-700 dark:text-violet-300',
  Expert: 'border-rose-500/30 bg-rose-500/5 text-rose-700 dark:text-rose-300',
}

const DIFFICULTY_GRADIENTS: Record<string, string> = {
  Beginner: 'from-emerald-500 to-teal-500',
  Intermediate: 'from-blue-500 to-cyan-500',
  Advanced: 'from-violet-500 to-fuchsia-500',
  Expert: 'from-rose-500 to-orange-500',
}

export function ProjectsView() {
  const navigate = useAppStore((s) => s.navigate)
  const [query, setQuery] = React.useState('')
  const [activeCat, setActiveCat] = React.useState<string>('All')
  const [hoveredId, setHoveredId] = React.useState<string | null>(null)

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
      {/* Hero header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 shadow-lg"
        >
          <FolderKanban className="h-7 w-7 text-white" />
        </motion.div>
        <h1 className="text-3xl font-bold tracking-tight">Projects Library</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {projects.length} hands-on projects — from beginner chatbots to a production AI application.
          Each project shows its AI pipeline so you can see exactly how data flows.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6 space-y-3"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, tech, or problem…"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <Filter className="mr-1 h-3 w-3 text-muted-foreground" />
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              className={cn(
                'rounded-full border px-2.5 py-1 text-xs transition-all',
                activeCat === c
                  ? 'border-primary bg-primary text-primary-foreground shadow-md'
                  : 'bg-card text-muted-foreground hover:bg-muted hover:scale-105'
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Project grid with images + pipeline diagrams */}
      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((p, i) => {
          const image = PROJECT_IMAGES[p.id]
          const pipeline = PROJECT_PIPELINES[p.id] ?? []
          const isHovered = hoveredId === p.id

          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              onHoverStart={() => setHoveredId(p.id)}
              onHoverEnd={() => setHoveredId(null)}
              onClick={() => navigate({ name: 'project', projectId: p.id })}
            >
              <Card
                className={cn(
                  'group cursor-pointer overflow-hidden transition-all',
                  isHovered && 'shadow-xl ring-2 ring-primary/30'
                )}
              >
                {/* Image header with gradient overlay */}
                <div className="relative h-32 overflow-hidden">
                  <motion.img
                    src={image}
                    alt={p.title}
                    className="h-full w-full object-cover"
                    animate={{ scale: isHovered ? 1.08 : 1 }}
                    transition={{ duration: 0.4 }}
                    onError={(e) => {
                      // Hide image on error, show gradient fallback
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  {/* Gradient overlay */}
                  <div className={cn(
                    'absolute inset-0 bg-gradient-to-t opacity-80',
                    DIFFICULTY_GRADIENTS[p.difficulty]
                  )} />
                  {/* Difficulty badge */}
                  <div className="absolute right-2 top-2">
                    <Badge variant="outline" className={cn('border-white/40 bg-black/30 text-white backdrop-blur', DIFFICULTY_COLORS[p.difficulty])}>
                      {p.difficulty}
                    </Badge>
                  </div>
                  {/* Project number */}
                  <div className="absolute left-3 top-2 font-mono text-[10px] text-white/80">
                    Project {i + 1} / {projects.length}
                  </div>
                  {/* Title at bottom of image */}
                  <div className="absolute bottom-2 left-3 right-3">
                    <h3 className="text-lg font-bold text-white drop-shadow-lg">{p.title}</h3>
                  </div>
                </div>

                <CardContent className="p-4">
                  {/* Tagline */}
                  <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">{p.tagline}</p>

                  {/* Animated pipeline diagram */}
                  {pipeline.length > 0 && (
                    <div className="mb-3 rounded-lg border bg-muted/20 p-2">
                      <div className="mb-1 flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                        <Zap className="h-2.5 w-2.5" /> AI Pipeline
                      </div>
                      <ProjectPipeline nodes={pipeline} className="py-1" />
                    </div>
                  )}

                  {/* Tech stack */}
                  <div className="mb-3 flex flex-wrap gap-1">
                    {p.techStack.slice(0, 4).map((t) => (
                      <Badge key={t} variant="outline" className="text-[9px]">{t}</Badge>
                    ))}
                    {p.techStack.length > 4 && (
                      <Badge variant="outline" className="text-[9px]">+{p.techStack.length - 4}</Badge>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-2.5 w-2.5" /> ~{p.estimatedHours}h
                    </span>
                    <motion.span
                      className="flex items-center gap-1 text-primary"
                      animate={{ x: isHovered ? 4 : 0 }}
                    >
                      View project <ArrowRight className="h-3 w-3" />
                    </motion.span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
          No projects match your search.
        </div>
      )}
    </div>
  )
}
