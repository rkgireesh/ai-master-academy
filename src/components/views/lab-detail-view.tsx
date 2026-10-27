'use client'

import * as React from 'react'
import * as Icons from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { getLab } from '@/data/labs'
import { getModule } from '@/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LabRenderer } from '@/components/labs/registry'
import {
  ArrowLeft, ArrowRight, Clock, Target, BookOpen, ChevronRight, Lightbulb, ListChecks,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function LabDetailView({ labId }: { labId: string }) {
  const navigate = useAppStore((s) => s.navigate)
  const lab = getLab(labId)

  if (!lab) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p>Lab not found.</p>
        <Button onClick={() => navigate({ name: 'labs' })} className="mt-4">Back to labs</Button>
      </div>
    )
  }

  const IconComp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[lab.icon] ?? Icons.FlaskConical
  const relatedModule = getModule(lab.relatedModuleId)

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
        <button onClick={() => navigate({ name: 'labs' })} className="hover:text-foreground">Labs</button>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground truncate">{lab.title}</span>
      </nav>

      {/* Header */}
      <div className={cn('mb-6 rounded-xl border bg-gradient-to-br p-6 text-white', lab.color)}>
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
            <IconComp className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 text-xs text-white/80">
              <span className="font-mono">{lab.category}</span>
              <span>·</span>
              <Badge variant="outline" className="border-white/30 text-white">{lab.difficulty}</Badge>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {lab.estimatedMinutes} min</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">{lab.title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/90">{lab.tagline}</p>
          </div>
        </div>
      </div>

      {/* Description + learning goals */}
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base"><Target className="h-4 w-4 text-primary" /> What you&apos;ll do</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{lab.description}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base"><ListChecks className="h-4 w-4 text-primary" /> Learning goals</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5 text-sm">
              {lab.learningGoals.map((g, i) => (
                <li key={i} className="flex gap-2">
                  <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* The lab itself */}
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Lab</h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        <LabRenderer labId={labId} />
      </div>

      {/* Related module link */}
      {relatedModule && (
        <Card className="mb-6 border-primary/30 bg-primary/5">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">Related lesson module</div>
                <div className="text-sm font-medium">{relatedModule.title}</div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ name: 'module', moduleId: relatedModule.id })}
            >
              Open module <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Footer nav */}
      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => navigate({ name: 'labs' })}>
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> All labs
        </Button>
      </div>
    </div>
  )
}
