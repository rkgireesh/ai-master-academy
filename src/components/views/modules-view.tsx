'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { modules } from '@/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { ArrowRight, CheckCircle2, BookOpen, Award } from 'lucide-react'
import { StaggerGroup, StaggerItem, SectionHeading, getModuleSymbol } from '@/components/shared/animations'
import { AnimatedCounter } from '@/components/dashboard/animated-counter'

const LEVEL_COLORS: Record<string, string> = {
  Beginner: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300',
  Intermediate: 'border-blue-500/30 bg-blue-500/5 text-blue-700 dark:text-blue-300',
  Advanced: 'border-violet-500/30 bg-violet-500/5 text-violet-700 dark:text-violet-300',
  Expert: 'border-rose-500/30 bg-rose-500/5 text-rose-700 dark:text-rose-300',
}

const LEVEL_SYMBOLS: Record<string, string> = {
  Beginner: '🌱',
  Intermediate: '⚡',
  Advanced: '🚀',
  Expert: '🏆',
}

export function ModulesView() {
  const navigate = useAppStore((s) => s.navigate)
  const completedLessons = useAppStore((s) => s.completedLessons)
  const quizScores = useAppStore((s) => s.quizScores)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Animated header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-2xl shadow-lg"
          >
            📚
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">All Modules</h1>
            <p className="text-sm text-muted-foreground">
              <AnimatedCounter value={modules.length} /> modules covering AI from fundamentals to production multi-agent systems.
            </p>
          </div>
        </div>
      </motion.div>

      <StaggerGroup className="grid gap-4 lg:grid-cols-2" stagger={0.08}>
        {modules.map((m) => {
          const IconComp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[m.icon] ?? Icons.BookOpen
          const completed = m.lessons.filter((l) => completedLessons.includes(`${m.id}/${l.id}`)).length
          const pct = m.lessons.length > 0 ? (completed / m.lessons.length) * 100 : 0
          const quizScore = quizScores[m.quizId]
          const symbol = getModuleSymbol(m.id)
          return (
            <StaggerItem key={m.id}>
              <motion.div
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Card
                  onClick={() => navigate({ name: 'module', moduleId: m.id })}
                  className="card-hover cursor-pointer overflow-hidden h-full"
                >
                  <div className={cn('h-1 bg-gradient-to-r', m.color)} />
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <motion.div
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white', m.color)}
                      >
                        <IconComp className="h-5 w-5" />
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">Module {m.index}</span>
                          <Badge variant="outline" className={cn('text-[10px]', LEVEL_COLORS[m.level])}>
                            <span className="mr-0.5">{LEVEL_SYMBOLS[m.level]}</span>
                            {m.level}
                          </Badge>
                        </div>
                        <CardTitle className="mt-0.5 text-base">{m.title}</CardTitle>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{m.description}</p>
                      </div>
                      {/* Module symbol with float animation */}
                      <motion.span
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-2xl"
                      >
                        {symbol}
                      </motion.span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> {m.lessons.length} lessons</span>
                      <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> {completed} completed</span>
                      {quizScore !== undefined && (
                        <span className="flex items-center gap-1"><Award className="h-3 w-3" /> quiz: {quizScore}%</span>
                      )}
                    </div>
                    <div className="relative h-1.5 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className={cn('absolute inset-y-0 left-0 rounded-full bg-gradient-to-r', m.color)}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">{pct.toFixed(0)}% complete</span>
                      <motion.span
                        whileHover={{ x: 3 }}
                        className="flex items-center text-xs font-medium text-primary"
                      >
                        {pct === 0 ? '🌱 Start' : pct === 100 ? '✅ Review' : '⚡ Continue'} <ArrowRight className="ml-1 h-3 w-3" />
                      </motion.span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </StaggerItem>
          )
        })}
      </StaggerGroup>
    </div>
  )
}
