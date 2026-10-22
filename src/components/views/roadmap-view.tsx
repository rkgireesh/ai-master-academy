'use client'

import * as React from 'react'
import * as Icons from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { modules, totalLessonCount } from '@/data'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import {
  Map, ArrowRight, ArrowDown, CheckCircle2, Circle, Award, Target,
} from 'lucide-react'

const STAGES = [
  { label: 'Beginner', desc: 'Start here with no prerequisites.', color: 'from-emerald-500 to-teal-500' },
  { label: 'AI Fundamentals', desc: 'Module 1 — what AI is, how it learns.', color: 'from-blue-500 to-violet-500' },
  { label: 'Generative AI', desc: 'Module 2 — text, image, audio generation.', color: 'from-violet-500 to-fuchsia-500' },
  { label: 'LLM Architecture', desc: 'Module 3 — transformers, attention, training.', color: 'from-blue-500 to-cyan-500' },
  { label: 'Embeddings & RAG', desc: 'Modules 4–5 — vectors and retrieval.', color: 'from-emerald-500 to-blue-500' },
  { label: 'AI Agents', desc: 'Modules 6–9 — autonomy, memory, planning.', color: 'from-orange-500 to-amber-500' },
  { label: 'Multi-Agent Systems', desc: 'Module 10 — orchestrating specialist agents.', color: 'from-indigo-500 to-purple-500' },
  { label: 'Production AI Engineering', desc: 'Modules 11–12 — frameworks and shipping.', color: 'from-red-500 to-orange-500' },
]

export function RoadmapView() {
  const navigate = useAppStore((s) => s.navigate)
  const completedLessons = useAppStore((s) => s.completedLessons)
  const totalLessons = totalLessonCount()
  const overallPct = totalLessons > 0 ? (completedLessons.length / totalLessons) * 100 : 0

  // Map stages to module ids where applicable
  const stageModules: Record<number, string[]> = {
    1: ['m1'],
    2: ['m2'],
    3: ['m3'],
    4: ['m4', 'm5'],
    5: ['m6', 'm7', 'm8', 'm9'],
    6: ['m10'],
    7: ['m11', 'm12'],
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Map className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Learning Roadmap</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A linear path from absolute beginner to advanced AI engineer.
        </p>
        <div className="mx-auto mt-4 max-w-md">
          <Progress value={overallPct} className="h-2" />
          <div className="mt-1 text-xs text-muted-foreground">{overallPct.toFixed(1)}% complete · {completedLessons.length}/{totalLessons} lessons</div>
        </div>
      </div>

      {/* Vertical timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-border sm:left-1/2" aria-hidden />

        <div className="space-y-6">
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

            return (
              <div key={i} className={cn('relative flex items-start gap-4', i % 2 === 1 ? 'sm:flex-row-reverse' : '')}>
                {/* Dot */}
                <div className={cn(
                  'z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-background sm:absolute sm:left-1/2 sm:-translate-x-1/2',
                  stageDone ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-primary bg-background text-primary'
                )}>
                  {stageDone ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-xs font-mono">{i + 1}</span>}
                </div>

                {/* Card */}
                <Card className={cn('flex-1 card-hover', i % 2 === 1 ? 'sm:ml-12' : 'sm:mr-12')}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className={cn('inline-flex rounded-md bg-gradient-to-r px-2 py-0.5 text-[10px] font-mono font-semibold text-white', stage.color)}>
                        Stage {i + 1}
                      </div>
                      {stageLessonsTotal > 0 && (
                        <Badge variant="outline" className="text-[10px]">{stageLessonsDone}/{stageLessonsTotal}</Badge>
                      )}
                    </div>
                    <h3 className="mt-2 text-sm font-bold">{stage.label}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">{stage.desc}</p>

                    {stageLessonsTotal > 0 && (
                      <>
                        <Progress value={stagePct} className="mt-2 h-1" />
                        <div className="mt-2 flex flex-wrap gap-1">
                          {moduleIds!.map((mid) => {
                            const m = modules.find((x) => x.id === mid)!
                            return (
                              <button
                                key={mid}
                                onClick={() => navigate({ name: 'module', moduleId: mid })}
                                className="rounded border bg-card px-2 py-0.5 text-[10px] hover:border-primary hover:text-primary"
                              >
                                M{m.index} · {m.shortTitle}
                              </button>
                            )
                          })}
                        </div>
                      </>
                    )}

                    {!isLast && moduleIds && moduleIds.length > 0 && (
                      <Button
                        size="sm" variant="ghost"
                        className="mt-2 -ml-2 text-xs"
                        onClick={() => navigate({ name: 'module', moduleId: moduleIds[0] })}
                      >
                        {stagePct === 0 ? 'Start here' : 'Continue'} <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </div>

      {/* Final CTA */}
      <Card className="mt-8 border-primary/30">
        <CardContent className="bg-gradient-to-br from-primary/10 via-background to-background p-6 text-center">
          <Target className="mx-auto h-8 w-8 text-primary" />
          <h2 className="mt-2 text-lg font-bold">Complete the journey</h2>
          <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
            Finish all 12 modules, pass every quiz, and complete at least one project from each difficulty tier
            to call yourself a production-ready AI engineer.
          </p>
          <Button className="mt-3" size="sm" onClick={() => navigate({ name: 'projects' })}>
            Browse projects <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
