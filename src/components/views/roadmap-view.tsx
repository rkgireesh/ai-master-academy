'use client'

import * as React from 'react'
import * as Icons from 'lucide-react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { modules, totalLessonCount } from '@/data'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AnimatedCounter } from '@/components/dashboard/animated-counter'
import { ScrollReveal, PulsingDot } from '@/components/roadmap/scroll-animations'
import { cn } from '@/lib/utils'
import {
  Map, ArrowRight, CheckCircle2, Circle, Award, Target,
  Sparkles, Zap, TrendingUp, Flame, Trophy,
} from 'lucide-react'

const STAGES = [
  { label: 'Beginner', desc: 'Start here with no prerequisites.', color: 'from-emerald-500 to-teal-500', accent: 'rgb(16, 185, 129)' },
  { label: 'AI Fundamentals', desc: 'Module 1 — what AI is, how it learns.', color: 'from-blue-500 to-violet-500', accent: 'rgb(99, 102, 241)' },
  { label: 'Generative AI', desc: 'Module 2 — text, image, audio generation.', color: 'from-violet-500 to-fuchsia-500', accent: 'rgb(217, 70, 239)' },
  { label: 'LLM Architecture', desc: 'Module 3 — transformers, attention, training.', color: 'from-blue-500 to-cyan-500', accent: 'rgb(6, 182, 212)' },
  { label: 'Embeddings & RAG', desc: 'Modules 4–5 — vectors and retrieval.', color: 'from-emerald-500 to-blue-500', accent: 'rgb(59, 130, 246)' },
  { label: 'AI Agents', desc: 'Modules 6–9 — autonomy, memory, planning.', color: 'from-orange-500 to-amber-500', accent: 'rgb(249, 115, 22)' },
  { label: 'Multi-Agent Systems', desc: 'Module 10 — orchestrating specialist agents.', color: 'from-indigo-500 to-purple-500', accent: 'rgb(168, 85, 247)' },
  { label: 'Production AI Engineering', desc: 'Modules 11–12 — frameworks and shipping.', color: 'from-red-500 to-orange-500', accent: 'rgb(239, 68, 68)' },
]

export function RoadmapView() {
  const navigate = useAppStore((s) => s.navigate)
  const completedLessons = useAppStore((s) => s.completedLessons)
  const totalLessons = totalLessonCount()
  const overallPct = totalLessons > 0 ? (completedLessons.length / totalLessons) * 100 : 0

  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  // Map stages to module ids
  const stageModules: Record<number, string[]> = {
    1: ['m1'],
    2: ['m2'],
    3: ['m3'],
    4: ['m4', 'm5'],
    5: ['m6', 'm7', 'm8', 'm9'],
    6: ['m10'],
    7: ['m11', 'm12'],
  }

  // Find current stage (first stage with < 100% completion)
  const currentStageIdx = React.useMemo(() => {
    for (let i = 1; i < STAGES.length; i++) {
      const mods = stageModules[i]
      if (!mods) continue
      const allDone = mods.every((mid) => {
        const m = modules.find((x) => x.id === mid)
        if (!m) return true
        return m.lessons.every((l) => completedLessons.includes(`${mid}/${l.id}`))
      })
      if (!allDone) return i
    }
    return STAGES.length - 1
  }, [completedLessons])

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Hero header */}
      <ScrollReveal>
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-500 shadow-lg"
          >
            <Map className="h-7 w-7 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight">Learning Roadmap</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A linear path from absolute beginner to advanced AI engineer.
          </p>

          {/* Overall progress bar with animated fill */}
          <div className="mx-auto mt-6 max-w-md">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Overall progress</span>
              <span className="font-mono font-semibold">
                <AnimatedCounter value={overallPct} decimals={1} />%
              </span>
            </div>
            <div className="relative h-2.5 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500"
                initial={{ width: 0 }}
                animate={{ width: `${overallPct}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-white/30"
                animate={{ x: ['0%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                style={{ width: '30%' }}
              />
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              <AnimatedCounter value={completedLessons.length} /> / {totalLessons} lessons completed
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Stats row */}
      <ScrollReveal delay={0.1}>
        <div className="mb-8 grid grid-cols-3 gap-3">
          <StatPill icon={CheckCircle2} label="Completed" value={completedLessons.length} color="text-emerald-500" />
          <StatPill icon={TrendingUp} label="Progress" value={`${overallPct.toFixed(0)}%`} color="text-blue-500" />
          <StatPill icon={Flame} label="Current Stage" value={currentStageIdx + 1} color="text-orange-500" />
        </div>
      </ScrollReveal>

      {/* Vertical timeline with scroll-driven line */}
      <div ref={containerRef} className="relative">
        {/* Background line (full height, muted) */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-muted sm:left-1/2 sm:-translate-x-1/2" />

        {/* Animated progress line that fills as you scroll */}
        <motion.div
          className="absolute left-6 top-0 w-0.5 bg-gradient-to-b from-blue-500 via-violet-500 to-fuchsia-500 sm:left-1/2 sm:-translate-x-1/2"
          style={{ height: lineHeight }}
        />

        <div className="space-y-8">
          {STAGES.map((stage, i) => {
            const isLast = i === STAGES.length - 1
            const moduleIds = stageModules[i]
            const stageLessonsDone = moduleIds
              ? moduleIds.reduce((acc, mid) => {
                  const m = modules.find((x) => x.id === mid)
                  return acc + (m ? m.lessons.filter((l) => completedLessons.includes(`${mid}/${l.id}`)).length : 0)
                }, 0)
              : 0
            const stageLessonsTotal = moduleIds
              ? moduleIds.reduce((acc, mid) => {
                  const m = modules.find((x) => x.id === mid)
                  return acc + (m ? m.lessons.length : 0)
                }, 0)
              : 0
            const stagePct = stageLessonsTotal > 0 ? (stageLessonsDone / stageLessonsTotal) * 100 : 0
            const stageDone = stageLessonsTotal > 0 && stageLessonsDone === stageLessonsTotal
            const isCurrent = i === currentStageIdx && !stageDone
            const isPast = i < currentStageIdx

            return (
              <ScrollReveal key={i} delay={i * 0.05} y={40}>
                <div className={cn('relative flex items-start gap-4', i % 2 === 1 ? 'sm:flex-row-reverse' : '')}>
                  {/* Node */}
                  <div className="relative z-10 shrink-0 sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                      className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-full border-2 bg-background shadow-md',
                        stageDone
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : isCurrent
                          ? 'border-primary bg-background'
                          : 'border-muted bg-background'
                      )}
                    >
                      {stageDone ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : isCurrent ? (
                        <PulsingDot color={stage.accent} size={10} />
                      ) : (
                        <span className="text-sm font-mono font-bold text-muted-foreground">{i + 1}</span>
                      )}
                    </motion.div>
                    {/* Glow ring for current stage */}
                    {isCurrent && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary"
                        animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </div>

                  {/* Card */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className={cn(
                      'flex-1 cursor-pointer',
                      i % 2 === 1 ? 'sm:ml-12' : 'sm:mr-12',
                      isCurrent && 'ring-2 ring-primary/40'
                    )}
                    onClick={() => {
                      if (moduleIds && moduleIds.length > 0) {
                        navigate({ name: 'module', moduleId: moduleIds[0] })
                      }
                    }}
                  >
                    <Card className={cn(
                      'overflow-hidden transition-shadow',
                      isCurrent && 'shadow-lg shadow-primary/10',
                      stageDone && 'border-emerald-500/30'
                    )}>
                      <div className={cn('h-1 bg-gradient-to-r', stage.color)} />
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                'inline-flex rounded-md bg-gradient-to-r px-2 py-0.5 text-[10px] font-mono font-semibold text-white',
                                stage.color
                              )}>
                                Stage {i + 1}
                              </span>
                              {stageDone && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="flex items-center gap-1 rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400"
                                >
                                  <CheckCircle2 className="h-2.5 w-2.5" /> Done
                                </motion.span>
                              )}
                              {isCurrent && (
                                <motion.span
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: [0.5, 1, 0.5] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className="flex items-center gap-1 rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary"
                                >
                                  <Sparkles className="h-2.5 w-2.5" /> You are here
                                </motion.span>
                              )}
                            </div>
                            <h3 className="mt-2 text-base font-bold">{stage.label}</h3>
                            <p className="mt-0.5 text-xs text-muted-foreground">{stage.desc}</p>
                          </div>
                          {isPast && (
                            <Trophy className="h-5 w-5 shrink-0 text-amber-500" />
                          )}
                        </div>

                        {/* Stage progress bar with animated fill */}
                        {stageLessonsTotal > 0 && (
                          <div className="mt-3">
                            <div className="mb-1 flex items-center justify-between text-[10px] text-muted-foreground">
                              <span>{stageLessonsDone} / {stageLessonsTotal} lessons</span>
                              <span className="font-mono">{stagePct.toFixed(0)}%</span>
                            </div>
                            <div className="relative h-1.5 overflow-hidden rounded-full bg-muted">
                              <motion.div
                                className={cn('absolute inset-y-0 left-0 rounded-full bg-gradient-to-r', stage.color)}
                                initial={{ width: 0 }}
                                whileInView={{ width: `${stagePct}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Module chips */}
                        {moduleIds && moduleIds.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {moduleIds.map((mid) => {
                              const m = modules.find((x) => x.id === mid)!
                              const mDone = m.lessons.filter((l) => completedLessons.includes(`${mid}/${l.id}`)).length
                              const mTotal = m.lessons.length
                              const mComplete = mDone === mTotal
                              return (
                                <motion.button
                                  key={mid}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    navigate({ name: 'module', moduleId: mid })
                                  }}
                                  className={cn(
                                    'flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] transition-colors',
                                    mComplete
                                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                      : 'border-border bg-card hover:border-primary hover:text-primary'
                                  )}
                                >
                                  {mComplete && <CheckCircle2 className="h-2.5 w-2.5" />}
                                  M{m.index} · {m.shortTitle}
                                </motion.button>
                              )
                            })}
                          </div>
                        )}

                        {/* CTA */}
                        {!isLast && moduleIds && moduleIds.length > 0 && (
                          <div className="mt-3">
                            <Button
                              size="sm"
                              variant={isCurrent ? 'default' : 'ghost'}
                              className="text-xs"
                              onClick={(e) => {
                                e.stopPropagation()
                                navigate({ name: 'module', moduleId: moduleIds[0] })
                              }}
                            >
                              {stagePct === 0 ? 'Start here' : isCurrent ? 'Continue' : 'Review'}
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>

      {/* Final CTA */}
      <ScrollReveal delay={0.2}>
        <Card className="mt-10 overflow-hidden border-primary/30">
          <CardContent className="relative bg-gradient-to-br from-primary/10 via-background to-background p-8 text-center">
            {/* Animated background glow */}
            <motion.div
              className="absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg"
            >
              <Trophy className="h-7 w-7 text-white" />
            </motion.div>
            <h2 className="relative mt-3 text-xl font-bold">Complete the journey</h2>
            <p className="relative mx-auto mt-1 max-w-md text-xs text-muted-foreground">
              Finish all 12 modules, pass every quiz, and complete at least one project from each difficulty tier
              to call yourself a production-ready AI engineer.
            </p>
            <div className="relative mt-4 flex justify-center gap-2">
              <Button size="sm" onClick={() => navigate({ name: 'projects' })}>
                <Zap className="mr-1 h-3.5 w-3.5" /> Browse projects
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigate({ name: 'labs' })}>
                <Sparkles className="mr-1 h-3.5 w-3.5" /> Try a lab
              </Button>
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>
    </div>
  )
}

function StatPill({
  icon: Icon, label, value, color,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number | string
  color: string
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-2 p-3">
        <Icon className={cn('h-4 w-4', color)} />
        <div>
          <div className="text-[10px] uppercase text-muted-foreground">{label}</div>
          <div className="text-sm font-bold">
            {typeof value === 'number' ? <AnimatedCounter value={value} /> : value}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
