'use client'

import * as React from 'react'
import { useAppStore } from '@/store/useAppStore'
import { modules, getModule, getLesson, totalLessonCount } from '@/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  BookOpen, Bookmark, Award, Clock, Sparkles, CheckCircle2,
  Circle, ArrowRight, RotateCcw, TrendingUp, Target,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function DashboardView() {
  const navigate = useAppStore((s) => s.navigate)
  const completedLessons = useAppStore((s) => s.completedLessons)
  const bookmarks = useAppStore((s) => s.bookmarks)
  const quizScores = useAppStore((s) => s.quizScores)
  const recentlyViewed = useAppStore((s) => s.recentlyViewed)
  const resetProgress = useAppStore((s) => s.resetProgress)

  const totalLessons = totalLessonCount()
  const overallProgress = totalLessons > 0 ? (completedLessons.length / totalLessons) * 100 : 0

  // Per-module progress
  const moduleProgress = modules.map((m) => {
    const completed = m.lessons.filter((l) => completedLessons.includes(`${m.id}/${l.id}`)).length
    return {
      module: m,
      completed,
      total: m.lessons.length,
      pct: m.lessons.length > 0 ? (completed / m.lessons.length) * 100 : 0,
    }
  })

  // Recommended next: first uncompleted lesson of the first module with progress < 100%
  const recommended = moduleProgress.find((mp) => mp.completed < mp.total)
  const recommendedLesson = recommended
    ? recommended.module.lessons.find((l) => !completedLessons.includes(`${recommended.module.id}/${l.id}`))
    : undefined

  // Recently viewed lessons (resolve to lesson objects)
  const recent = recentlyViewed
    .map((k) => {
      const [moduleId, lessonId] = k.split('/')
      const data = getLesson(moduleId, lessonId)
      return data ? { moduleId, lessonId, title: data.lesson.title, moduleTitle: data.module.shortTitle } : null
    })
    .filter(Boolean) as { moduleId: string; lessonId: string; title: string; moduleTitle: string }[]

  // Bookmarks resolved
  const bookmarkedLessons = bookmarks
    .map((k) => {
      const [moduleId, lessonId] = k.split('/')
      const data = getLesson(moduleId, lessonId)
      return data ? { moduleId, lessonId, title: data.lesson.title, moduleTitle: data.module.shortTitle } : null
    })
    .filter(Boolean) as { moduleId: string; lessonId: string; title: string; moduleTitle: string }[]

  const completedQuizzes = Object.entries(quizScores)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Learning Dashboard</h1>
          <p className="text-sm text-muted-foreground">Track your progress, pick up where you left off.</p>
        </div>
        {completedLessons.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => {
            if (confirm('Reset all progress? This cannot be undone.')) resetProgress()
          }}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset progress
          </Button>
        )}
      </div>

      {/* Top stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={BookOpen}
          label="Total Modules"
          value={modules.length}
          sub={`${totalLessons} lessons`}
          color="from-blue-500 to-violet-500"
        />
        <StatCard
          icon={CheckCircle2}
          label="Lessons Completed"
          value={completedLessons.length}
          sub={`${overallProgress.toFixed(0)}% of total`}
          color="from-emerald-500 to-teal-500"
        />
        <StatCard
          icon={Bookmark}
          label="Bookmarks"
          value={bookmarks.length}
          sub="saved lessons"
          color="from-amber-500 to-orange-500"
        />
        <StatCard
          icon={Award}
          label="Quizzes Passed"
          value={completedQuizzes.filter(([, s]) => s >= 60).length}
          sub={`${completedQuizzes.length} attempted`}
          color="from-rose-500 to-pink-500"
        />
      </div>

      {/* Overall progress */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4 text-primary" /> Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={overallProgress} className="h-3" />
          <div className="mt-1.5 text-xs text-muted-foreground">
            {completedLessons.length} of {totalLessons} lessons completed ({overallProgress.toFixed(1)}%)
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Per-module progress (left, wide) */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Module Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {moduleProgress.map((mp) => (
                <button
                  key={mp.module.id}
                  onClick={() => navigate({ name: 'module', moduleId: mp.module.id })}
                  className="block w-full text-left"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">M{mp.module.index}</span>
                      <span className="text-sm font-medium">{mp.module.shortTitle}</span>
                      <Badge variant="outline" className="text-[10px]">{mp.module.level}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{mp.completed}/{mp.total}</span>
                  </div>
                  <Progress value={mp.pct} className="h-1.5" />
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recommended next (right) */}
        <div className="space-y-6">
          {recommendedLesson && recommended && (
            <Card className="border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4 text-primary" /> Recommended Next
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">{recommended.module.shortTitle}</div>
                <div className="text-sm font-semibold">{recommendedLesson.title}</div>
                <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">{recommendedLesson.definition}</p>
                <Button
                  size="sm"
                  className="mt-3"
                  onClick={() => navigate({ name: 'lesson', moduleId: recommended.module.id, lessonId: recommendedLesson.id })}
                >
                  Continue <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Recently viewed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4" /> Recently Viewed
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recent.length === 0 ? (
                <p className="text-xs text-muted-foreground">No lessons viewed yet. Start exploring!</p>
              ) : (
                <ul className="space-y-1.5">
                  {recent.slice(0, 6).map((r) => (
                    <li key={`${r.moduleId}/${r.lessonId}`}>
                      <button
                        onClick={() => navigate({ name: 'lesson', moduleId: r.moduleId, lessonId: r.lessonId })}
                        className="block w-full text-left text-xs hover:text-primary"
                      >
                        <span className="text-muted-foreground">M{modules.find((m) => m.id === r.moduleId)?.index}</span>{' '}
                        {r.title}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Bookmarks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bookmark className="h-4 w-4" /> Saved Articles ({bookmarkedLessons.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bookmarkedLessons.length === 0 ? (
              <p className="text-xs text-muted-foreground">No bookmarks yet. Click the bookmark icon on any lesson to save it.</p>
            ) : (
              <ul className="space-y-1.5">
                {bookmarkedLessons.map((b) => (
                  <li key={`${b.moduleId}/${b.lessonId}`}>
                    <button
                      onClick={() => navigate({ name: 'lesson', moduleId: b.moduleId, lessonId: b.lessonId })}
                      className="block w-full text-left text-xs hover:text-primary"
                    >
                      <span className="text-muted-foreground">[{b.moduleTitle}]</span> {b.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Quiz scores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Award className="h-4 w-4" /> Quiz Scores
            </CardTitle>
          </CardHeader>
          <CardContent>
            {completedQuizzes.length === 0 ? (
              <p className="text-xs text-muted-foreground">No quizzes attempted yet. Finish a module to take its quiz.</p>
            ) : (
              <ul className="space-y-1.5">
                {completedQuizzes.map(([quizId, score]) => {
                  const m = modules.find((x) => x.quizId === quizId)
                  return (
                    <li key={quizId} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{m?.shortTitle ?? quizId}</span>
                      <Badge variant={score >= 80 ? 'default' : score >= 60 ? 'secondary' : 'outline'} className="font-mono">
                        {score}%
                      </Badge>
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ComponentType<{ className?: string }>
  label: string; value: number; sub: string; color: string
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">{label}</div>
            <div className="mt-1 text-2xl font-bold">{value}</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">{sub}</div>
          </div>
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white', color)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
