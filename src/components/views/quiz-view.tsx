'use client'

import * as React from 'react'
import { useAppStore } from '@/store/useAppStore'
import { getModule, quizzes } from '@/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import {
  Award, CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy,
} from 'lucide-react'

export function QuizView({ moduleId }: { moduleId: string }) {
  const navigate = useAppStore((s) => s.navigate)
  const recordQuizScore = useAppStore((s) => s.recordQuizScore)
  const existingScore = useAppStore((s) => s.quizScores)

  const m = getModule(moduleId)
  const quiz = quizzes[m?.quizId ?? '']

  const [answers, setAnswers] = React.useState<Record<string, number>>({})
  const [submitted, setSubmitted] = React.useState(false)

  if (!m || !quiz) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p>Quiz not found.</p>
        <Button onClick={() => navigate({ name: 'modules' })} className="mt-4">Back to modules</Button>
      </div>
    )
  }

  const score = quiz.questions.reduce((acc, q) => acc + (answers[q.id] === q.correctIndex ? 1 : 0), 0)
  const pct = Math.round((score / quiz.questions.length) * 100)

  const handleSubmit = () => {
    setSubmitted(true)
    recordQuizScore(moduleId, pct)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleReset = () => {
    setAnswers({})
    setSubmitted(false)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Award className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{quiz.title}</h1>
        <p className="text-sm text-muted-foreground">{m.title} · {quiz.questions.length} questions</p>
        {existingScore[m.quizId] !== undefined && !submitted && (
          <Badge variant="outline" className="mt-2">Best previous score: {existingScore[m.quizId]}%</Badge>
        )}
      </div>

      {submitted && (
        <Card className={cn(
          'mb-6 border-2',
          pct >= 80 ? 'border-emerald-500/40 bg-emerald-500/5' :
          pct >= 60 ? 'border-amber-500/40 bg-amber-500/5' :
          'border-rose-500/40 bg-rose-500/5'
        )}>
          <CardContent className="p-6 text-center">
            <Trophy className={cn(
              'mx-auto h-10 w-10',
              pct >= 80 ? 'text-emerald-500' : pct >= 60 ? 'text-amber-500' : 'text-rose-500'
            )} />
            <div className="mt-2 text-3xl font-bold">{pct}%</div>
            <div className="text-sm text-muted-foreground">
              {score} of {quiz.questions.length} correct
              {pct >= 80 ? ' — excellent!' : pct >= 60 ? ' — good work, keep going.' : ' — review the module and try again.'}
            </div>
            <Progress value={pct} className="mt-3 h-2" />
          </CardContent>
        </Card>
      )}

      {/* Questions */}
      <div className="space-y-4">
        {quiz.questions.map((q, i) => {
          const userAnswer = answers[q.id]
          const isCorrect = submitted && userAnswer === q.correctIndex
          const isWrong = submitted && userAnswer !== undefined && userAnswer !== q.correctIndex
          return (
            <Card key={q.id} className={cn(
              submitted && isCorrect && 'border-emerald-500/40',
              submitted && isWrong && 'border-rose-500/40',
            )}>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-mono">
                    {i + 1}
                  </span>
                  <CardTitle className="text-sm font-medium leading-snug">{q.question}</CardTitle>
                  {submitted && (isCorrect ? (
                    <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-emerald-500" />
                  ) : isWrong ? (
                    <XCircle className="ml-auto h-4 w-4 shrink-0 text-rose-500" />
                  ) : null)}
                </div>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={userAnswer !== undefined ? String(userAnswer) : ''}
                  onValueChange={(v) => !submitted && setAnswers((a) => ({ ...a, [q.id]: Number(v) }))}
                >
                  <div className="space-y-2">
                    {q.options.map((opt, j) => {
                      const isUserPick = userAnswer === j
                      const isCorrectOption = submitted && j === q.correctIndex
                      const isWrongPick = submitted && isUserPick && j !== q.correctIndex
                      return (
                        <div
                          key={j}
                          className={cn(
                            'flex items-center gap-2 rounded-md border p-2.5 text-sm transition-colors',
                            isCorrectOption && 'border-emerald-500/40 bg-emerald-500/5',
                            isWrongPick && 'border-rose-500/40 bg-rose-500/5',
                            !submitted && isUserPick && 'border-primary bg-primary/5',
                            !submitted && !isUserPick && 'hover:bg-muted/40',
                          )}
                        >
                          <RadioGroupItem value={String(j)} id={`${q.id}-${j}`} disabled={submitted} />
                          <Label htmlFor={`${q.id}-${j}`} className="flex-1 cursor-pointer text-xs font-normal">
                            {opt}
                          </Label>
                          {isCorrectOption && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                          {isWrongPick && <XCircle className="h-3.5 w-3.5 text-rose-500" />}
                        </div>
                      )
                    })}
                  </div>
                </RadioGroup>
                {submitted && (
                  <div className="mt-3 rounded-md border bg-muted/30 p-2.5 text-xs">
                    <span className="font-semibold text-foreground">Explanation: </span>
                    <span className="text-muted-foreground">{q.explanation}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-between">
        <Button variant="ghost" onClick={() => navigate({ name: 'module', moduleId })}>
          ← Back to module
        </Button>
        {!submitted ? (
          <Button onClick={handleSubmit} disabled={Object.keys(answers).length < quiz.questions.length}>
            Submit answers
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Retry
            </Button>
            <Button onClick={() => navigate({ name: 'dashboard' })}>
              View dashboard <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
