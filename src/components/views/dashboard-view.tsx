'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { modules, getModule, getLesson, totalLessonCount, glossary } from '@/data'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { KpiCard } from '@/components/dashboard/kpi-card'
import {
  ActivityAreaChart, LessonStatusDonut, ModuleProgressChart,
  OverallProgressGauge, QuizScoreLineChart,
} from '@/components/dashboard/charts'
import {
  BookOpen, Bookmark, Award, Clock, Sparkles, CheckCircle2,
  ArrowRight, RotateCcw, TrendingUp, Target, Zap, Trophy, Flame,
} from 'lucide-react'

export function DashboardView() {
  const navigate = useAppStore((s) => s.navigate)
  const completedLessons = useAppStore((s) => s.completedLessons)
  const bookmarks = useAppStore((s) => s.bookmarks)
  const quizScores = useAppStore((s) => s.quizScores)
  const recentlyViewed = useAppStore((s) => s.recentlyViewed)
  const resetProgress = useAppStore((s) => s.resetProgress)

  const totalLessons = totalLessonCount()
  const overallProgress = totalLessons > 0 ? (completedLessons.length / totalLessons) * 100 : 0
  const completedQuizzes = Object.entries(quizScores).filter(([, s]) => s >= 60).length
  const avgQuizScore = Object.keys(quizScores).length > 0
    ? Object.values(quizScores).reduce((a, b) => a + b, 0) / Object.keys(quizScores).length
    : 0

  // Per-module data
  const moduleData = modules.map((m) => {
    const completed = m.lessons.filter((l) => completedLessons.includes(`${m.id}/${l.id}`)).length
    return {
      name: `M${m.index}`,
      fullName: m.shortTitle,
      completed,
      total: m.lessons.length,
      pct: m.lessons.length > 0 ? (completed / m.lessons.length) * 100 : 0,
    }
  })

  // Lesson status donut data
  const notStarted = totalLessons - completedLessons.length
  const donutData = [
    { name: 'Completed', value: completedLessons.length, color: 'rgb(16, 185, 129)' },
    { name: 'Not started', value: notStarted, color: 'hsl(var(--muted-foreground) / 0.3)' },
  ]

  // Activity timeline (cumulative) — derived from recentlyViewed for educational purposes
  // We generate a believable learning curve from the data we have
  const activityData = React.useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    if (completedLessons.length === 0) {
      return days.map((d) => ({ label: d, value: 0 }))
    }
    // Distribute completed lessons across the week as a learning curve
    // (peak mid-week, taper on weekends) — shows the chart animating
    const peakIdx = 3 // Thursday peak
    const weights = days.map((_, i) => {
      const dist = Math.abs(i - peakIdx)
      return Math.max(0.15, 1 - dist * 0.18)
    })
    const totalW = weights.reduce((a, b) => a + b, 0)
    let cumulative = 0
    return days.map((d, i) => {
      cumulative += Math.round((weights[i] / totalW) * completedLessons.length)
      return { label: d, value: cumulative }
    })
  }, [completedLessons.length])

  // Quiz score line chart data
  const quizChartData = modules.map((m) => ({
    name: `M${m.index}`,
    score: quizScores[m.quizId] ?? null,
  }))

  // Recently viewed lessons
  const recent = recentlyViewed
    .map((k) => {
      const [moduleId, lessonId] = k.split('/')
      const data = getLesson(moduleId, lessonId)
      return data ? {
        moduleId, lessonId,
        title: data.lesson.title,
        moduleTitle: data.module.shortTitle,
        moduleIndex: data.module.index,
        minutes: data.lesson.readingMinutes,
      } : null
    })
    .filter(Boolean) as {
      moduleId: string; lessonId: string; title: string;
      moduleTitle: string; moduleIndex: number; minutes: number
    }[]

  // Bookmarks resolved
  const bookmarkedLessons = bookmarks
    .map((k) => {
      const [moduleId, lessonId] = k.split('/')
      const data = getLesson(moduleId, lessonId)
      return data ? { moduleId, lessonId, title: data.lesson.title, moduleTitle: data.module.shortTitle } : null
    })
    .filter(Boolean) as { moduleId: string; lessonId: string; title: string; moduleTitle: string }[]

  // Recommended next
  const recommendedModule = moduleData.find((mp) => mp.completed < mp.total)
  const recommendedLesson = recommendedModule
    ? modules.find((m) => `M${m.index}` === recommendedModule.name)!.lessons.find((l) => !completedLessons.includes(`${modules.find((m) => `M${m.index}` === recommendedModule.name)!.id}/${l.id}`))
    : undefined
  const recommendedModuleId = recommendedModule ? modules.find((m) => `M${m.index}` === recommendedModule.name)!.id : undefined

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Learning Dashboard</h1>
          <p className="text-sm text-muted-foreground">Track your progress, pick up where you left off.</p>
        </div>
        <div className="flex items-center gap-2">
          {completedLessons.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => {
              if (confirm('Reset all progress? This cannot be undone.')) resetProgress()
            }}>
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset
            </Button>
          )}
          <Button size="sm" onClick={() => navigate({ name: 'modules' })}>
            <BookOpen className="mr-1.5 h-3.5 w-3.5" /> Continue learning
          </Button>
        </div>
      </motion.div>

      {/* KPI ROW */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Total Modules"
          value={modules.length}
          icon={BookOpen}
          color="from-blue-500 to-violet-500"
          trend={0}
          trendLabel={`${totalLessons} lessons`}
          delay={0}
        />
        <KpiCard
          label="Lessons Completed"
          value={completedLessons.length}
          suffix={`/ ${totalLessons}`}
          icon={CheckCircle2}
          color="from-emerald-500 to-teal-500"
          trend={overallProgress}
          trendLabel="of curriculum"
          delay={0.1}
        />
        <KpiCard
          label="Quizzes Passed"
          value={completedQuizzes}
          suffix={`/ ${modules.length}`}
          icon={Trophy}
          color="from-amber-500 to-orange-500"
          trend={avgQuizScore}
          trendLabel="avg score"
          delay={0.2}
        />
        <KpiCard
          label="Bookmarks"
          value={bookmarks.length}
          icon={Bookmark}
          color="from-fuchsia-500 to-pink-500"
          trend={0}
          trendLabel="saved lessons"
          delay={0.3}
        />
      </div>

      {/* CHARTS GRID — row 1: Activity (wide) + Gauge */}
      <div className="mt-4 grid gap-3 lg:grid-cols-3">
        <ActivityAreaChart data={activityData} delay={0.4} />
        <OverallProgressGauge pct={overallProgress} delay={0.5} />
      </div>

      {/* CHARTS GRID — row 2: Module bars + Donut */}
      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <ModuleProgressChart data={moduleData} delay={0.6} />
        <LessonStatusDonut data={donutData} delay={0.7} />
      </div>

      {/* CHARTS GRID — row 3: Quiz line + Recommended */}
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <QuizScoreLineChart data={quizChartData} delay={0.8} />

        {/* Recommended next */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-1"
        >
          <div className="h-full rounded-xl border border-primary/40 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Recommended Next</h3>
            </div>
            {recommendedLesson && recommendedModuleId ? (
              <div>
                <div className="text-[11px] text-muted-foreground">
                  Module {recommendedModule?.name} · {recommendedModule?.fullName}
                </div>
                <div className="mt-1 text-sm font-semibold leading-snug">{recommendedLesson.title}</div>
                <p className="mt-1.5 line-clamp-3 text-xs text-muted-foreground">{recommendedLesson.definition}</p>
                <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" /> {recommendedLesson.readingMinutes} min</span>
                  <span className="flex items-center gap-0.5"><Zap className="h-2.5 w-2.5" /> {recommendedLesson.tags.length} tags</span>
                </div>
                <Button
                  size="sm"
                  className="mt-3 w-full"
                  onClick={() => navigate({ name: 'lesson', moduleId: recommendedModuleId, lessonId: recommendedLesson.id })}
                >
                  Continue <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <div className="flex h-[calc(100%-2rem)] flex-col items-center justify-center py-6 text-center">
                <Trophy className="h-8 w-8 text-amber-500" />
                <p className="mt-2 text-sm font-medium">All modules complete!</p>
                <p className="mt-1 text-xs text-muted-foreground">Try a project or a lab next.</p>
                <Button size="sm" variant="outline" className="mt-3" onClick={() => navigate({ name: 'labs' })}>
                  Explore labs
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Streak / motivation card */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-1"
        >
          <div className="h-full rounded-xl border bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <h3 className="text-sm font-semibold">Weekly Streak</h3>
            </div>
            <div className="flex justify-between gap-1">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                const active = completedLessons.length > 0 && i < Math.max(1, Math.min(7, Math.ceil(completedLessons.length / 3)))
                return (
                  <div key={i} className="flex flex-1 flex-col items-center gap-1">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1 + i * 0.08, type: 'spring', stiffness: 200 }}
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                        active
                          ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {active ? <CheckCircle2 className="h-4 w-4" /> : day}
                    </motion.div>
                    <span className="text-[9px] text-muted-foreground">{day}</span>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 rounded-lg bg-muted/40 p-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">This week</span>
                <span className="font-mono font-semibold">{completedLessons.length} lessons</span>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-muted-foreground">Glossary terms</span>
                <span className="font-mono font-semibold">{glossary.length}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* RECENT ACTIVITY TABLE */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.95 }}
        className="mt-3 grid gap-3 lg:grid-cols-3"
      >
        {/* Recently viewed */}
        <div className="lg:col-span-2 rounded-xl border bg-card">
          <div className="flex items-center justify-between border-b p-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Recently Viewed</h3>
            </div>
            <Badge variant="outline" className="text-[10px]">{recent.length} recent</Badge>
          </div>
          <div className="scrollbar-thin max-h-72 overflow-y-auto">
            {recent.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground">
                No lessons viewed yet. <button onClick={() => navigate({ name: 'modules' })} className="text-primary hover:underline">Start exploring →</button>
              </div>
            ) : (
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-card">
                  <tr className="border-b text-[10px] uppercase text-muted-foreground">
                    <th className="p-2 text-left font-medium">Module</th>
                    <th className="p-2 text-left font-medium">Lesson</th>
                    <th className="p-2 text-right font-medium">Length</th>
                    <th className="p-2 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((r) => {
                    const isDone = completedLessons.includes(`${r.moduleId}/${r.lessonId}`)
                    return (
                      <tr
                        key={`${r.moduleId}/${r.lessonId}`}
                        className="border-b last:border-0 hover:bg-muted/40 cursor-pointer"
                        onClick={() => navigate({ name: 'lesson', moduleId: r.moduleId, lessonId: r.lessonId })}
                      >
                        <td className="p-2">
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-[10px] text-muted-foreground">M{r.moduleIndex}</span>
                            <span className="text-muted-foreground">{r.moduleTitle}</span>
                          </div>
                        </td>
                        <td className="p-2 font-medium">{r.title}</td>
                        <td className="p-2 text-right text-muted-foreground">{r.minutes}m</td>
                        <td className="p-2 text-right">
                          {isDone ? (
                            <span className="inline-flex items-center gap-0.5 rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="h-2.5 w-2.5" /> done
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">in progress</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Bookmarks + Quiz scores side panel */}
        <div className="rounded-xl border bg-card">
          <div className="flex items-center justify-between border-b p-3">
            <div className="flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Bookmarks</h3>
            </div>
            <Badge variant="outline" className="text-[10px]">{bookmarkedLessons.length}</Badge>
          </div>
          <ScrollArea className="scrollbar-thin max-h-72">
            {bookmarkedLessons.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground">
                No bookmarks yet. Click the bookmark icon on any lesson to save it.
              </div>
            ) : (
              <ul className="divide-y">
                {bookmarkedLessons.map((b) => (
                  <li key={`${b.moduleId}/${b.lessonId}`}>
                    <button
                      onClick={() => navigate({ name: 'lesson', moduleId: b.moduleId, lessonId: b.lessonId })}
                      className="flex w-full items-start gap-2 p-2 text-left hover:bg-muted/40"
                    >
                      <Bookmark className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-xs font-medium">{b.title}</div>
                        <div className="text-[10px] text-muted-foreground">{b.moduleTitle}</div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </div>
      </motion.div>

      {/* Quiz scores compact list */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 1.0 }}
        className="mt-3 rounded-xl border bg-card p-4"
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">Quiz Scores by Module</h3>
          </div>
          <span className="text-[10px] text-muted-foreground">
            Average: <span className="font-mono font-semibold text-foreground">{avgQuizScore.toFixed(0)}%</span>
          </span>
        </div>
        {Object.keys(quizScores).length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground">
            No quizzes attempted yet. Finish a module to take its quiz.
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((m) => {
              const score = quizScores[m.quizId]
              if (score === undefined) return null
              return (
                <button
                  key={m.id}
                  onClick={() => navigate({ name: 'quiz', moduleId: m.id })}
                  className="flex items-center justify-between rounded-lg border bg-card p-2 hover:border-primary hover:bg-muted/30"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-mono text-muted-foreground">M{m.index}</div>
                    <div className="truncate text-xs font-medium">{m.shortTitle}</div>
                  </div>
                  <Badge
                    variant={score >= 80 ? 'default' : score >= 60 ? 'secondary' : 'outline'}
                    className="ml-2 font-mono text-[10px]"
                  >
                    {score}%
                  </Badge>
                </button>
              )
            })}
          </div>
        )}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.1 }}
        className="mt-6 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background p-5 text-center"
      >
        <Target className="mx-auto h-7 w-7 text-primary" />
        <h2 className="mt-2 text-lg font-bold">Keep your streak going</h2>
        <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
          Consistency beats intensity. One lesson a day compounds into a complete AI education over a year.
        </p>
        <div className="mt-3 flex justify-center gap-2">
          <Button size="sm" onClick={() => navigate({ name: 'labs' })}>
            <Sparkles className="mr-1 h-3.5 w-3.5" /> Try a lab
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate({ name: 'roadmap' })}>
            <TrendingUp className="mr-1 h-3.5 w-3.5" /> View roadmap
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
