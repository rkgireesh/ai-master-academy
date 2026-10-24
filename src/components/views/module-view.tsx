'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { getModule } from '@/data'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import {
  ArrowLeft, ArrowRight, CheckCircle2, Circle, Clock, Award, BookOpen,
} from 'lucide-react'
import { StaggerGroup, StaggerItem, getModuleSymbol } from '@/components/shared/animations'

export function ModuleView({ moduleId }: { moduleId: string }) {
  const navigate = useAppStore((s) => s.navigate)
  const completedLessons = useAppStore((s) => s.completedLessons)
  const quizScores = useAppStore((s) => s.quizScores)

  const m = getModule(moduleId)
  if (!m) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p>Module not found.</p>
        <Button onClick={() => navigate({ name: 'modules' })} className="mt-4">Back to modules</Button>
      </div>
    )
  }

  const IconComp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[m.icon] ?? Icons.BookOpen
  const completed = m.lessons.filter((l) => completedLessons.includes(`${m.id}/${l.id}`)).length
  const pct = m.lessons.length > 0 ? (completed / m.lessons.length) * 100 : 0
  const quizScore = quizScores[m.quizId]
  const symbol = getModuleSymbol(m.id)
  const nextLesson = m.lessons.find((l) => !completedLessons.includes(`${m.id}/${l.id}`)) ?? m.lessons[0]

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <motion.nav
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        <button onClick={() => navigate({ name: 'modules' })} className="hover:text-foreground">Modules</button>
        <span>/</span>
        <span className="text-foreground">{m.shortTitle}</span>
      </motion.nav>

      {/* Header with animated entrance */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={cn('relative overflow-hidden rounded-xl border bg-gradient-to-br p-6 text-white', m.color)}
      >
        {/* Floating decorative symbol */}
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-6 top-6 text-6xl opacity-20"
        >
          {symbol}
        </motion.div>

        <div className="relative flex items-start gap-4">
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur"
          >
            <IconComp className="h-6 w-6" />
          </motion.div>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs text-white/80">
              <span className="font-mono">Module {m.index}</span>
              <span>·</span>
              <span>{m.level}</span>
              <span>·</span>
              <span>{m.lessons.length} lessons</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">{m.title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/90">{m.description}</p>
          </div>
        </div>
      </motion.div>

      {/* Progress + actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress: {completed}/{m.lessons.length} lessons</span>
                  <span className="font-medium">{pct.toFixed(0)}%</span>
                </div>
                <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className={cn('absolute inset-y-0 left-0 rounded-full bg-gradient-to-r', m.color)}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button onClick={() => navigate({ name: 'lesson', moduleId: m.id, lessonId: nextLesson.id })}>
                    {pct === 0 ? '🌱 Start' : '⚡ Continue'} <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button variant="outline" onClick={() => navigate({ name: 'quiz', moduleId: m.id })}>
                    <Award className="mr-1.5 h-4 w-4" /> Quiz {quizScore !== undefined ? `(${quizScore}%)` : ''}
                  </Button>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Lesson list with stagger */}
      <div className="mt-6">
        <motion.h2
          initial={{ opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground"
        >
          <BookOpen className="h-4 w-4" /> Lessons
        </motion.h2>
        <StaggerGroup className="space-y-1.5" stagger={0.04}>
          {m.lessons.map((l, i) => {
            const isDone = completedLessons.includes(`${m.id}/${l.id}`)
            return (
              <StaggerItem key={l.id} y={10}>
                <motion.button
                  whileHover={{ x: 4, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => navigate({ name: 'lesson', moduleId: m.id, lessonId: l.id })}
                  className="flex w-full items-center gap-3 rounded-lg border bg-card p-3 text-left transition-colors hover:border-primary hover:bg-muted/30"
                >
                  <div className="shrink-0">
                    {isDone ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      </motion.div>
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-muted-foreground">{i + 1}</span>
                      <span className="text-sm font-medium truncate">{l.title}</span>
                      {isDone && <span className="text-[10px]">✅</span>}
                    </div>
                    {l.subtitle && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{l.subtitle}</p>
                    )}
                    <div className="mt-1 flex items-center gap-2">
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-2.5 w-2.5" /> {l.readingMinutes} min
                      </span>
                      {l.tags.slice(0, 2).map((t) => (
                        <Badge key={t} variant="outline" className="text-[9px]">{t}</Badge>
                      ))}
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                </motion.button>
              </StaggerItem>
            )
          })}
        </StaggerGroup>
      </div>

      {/* Footer nav */}
      <div className="mt-8 flex justify-between">
        <Button variant="ghost" size="sm" onClick={() => navigate({ name: 'modules' })}>
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> All modules
        </Button>
        {m.index < 12 && (
          <Button
            variant="ghost" size="sm"
            onClick={() => {
              const nextMod = `m${m.index + 1}`
              navigate({ name: 'module', moduleId: nextMod })
            }}
          >
            Next module <ArrowRight className="ml-1.5 h-3.5 w-3.5" /> {getModuleSymbol(`m${m.index + 1}`)}
          </Button>
        )}
      </div>
    </div>
  )
}
