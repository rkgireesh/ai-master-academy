'use client'

import * as React from 'react'
import { useAppStore } from '@/store/useAppStore'
import { projects } from '@/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArticleContent } from '@/components/learn/article-content'
import {
  ArrowLeft, Clock, FolderKanban, Code2, ListChecks, Shield, Wrench,
  Play, AlertTriangle, Lightbulb, Target, Package,
} from 'lucide-react'

export function ProjectDetailView({ projectId }: { projectId: string }) {
  const navigate = useAppStore((s) => s.navigate)
  const p = projects.find((x) => x.id === projectId)

  if (!p) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p>Project not found.</p>
        <Button onClick={() => navigate({ name: 'projects' })} className="mt-4">Back to projects</Button>
      </div>
    )
  }

  const projectIndex = projects.findIndex((x) => x.id === projectId) + 1

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
        <button onClick={() => navigate({ name: 'projects' })} className="hover:text-foreground">Projects</button>
        <span>/</span>
        <span className="text-foreground truncate">{p.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-mono">Project {projectIndex} of {projects.length}</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> ~{p.estimatedHours} hours</span>
          <span>·</span>
          <Badge variant="outline" className="text-[10px]">{p.difficulty}</Badge>
        </div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">{p.title}</h1>
        <p className="mt-1 text-base text-muted-foreground">{p.tagline}</p>
      </div>

      {/* Problem */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base"><Target className="h-4 w-4 text-primary" /> Problem Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{p.problem}</p>
        </CardContent>
      </Card>

      {/* Two-col grid: prereqs + stack */}
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base"><ListChecks className="h-4 w-4 text-primary" /> Prerequisites</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5 text-sm">
              {p.prerequisites.map((pre, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                  <span>{pre}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base"><Package className="h-4 w-4 text-primary" /> Tech Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {p.techStack.map((t) => (
                <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Architecture */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base"><FolderKanban className="h-4 w-4 text-primary" /> Architecture</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{p.architecture}</p>
          {p.projectStructure && (
            <pre className="mt-3 overflow-x-auto rounded border bg-muted/30 p-3 font-mono text-xs">{p.projectStructure}</pre>
          )}
        </CardContent>
      </Card>

      {/* Implementation */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base"><Code2 className="h-4 w-4 text-primary" /> Implementation</CardTitle>
        </CardHeader>
        <CardContent>
          <ArticleContent blocks={p.implementation} />
        </CardContent>
      </Card>

      {/* Run instructions */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base"><Play className="h-4 w-4 text-primary" /> How to Run</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 text-sm">
            {p.runInstructions.map((step, i) => (
              <li key={i} className="flex gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-mono text-primary">{i + 1}</span>
                <pre className="flex-1 overflow-x-auto rounded bg-muted/30 p-2 font-mono text-xs">{step}</pre>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Expected output */}
      <Card className="mb-6 border-emerald-500/30 bg-emerald-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base text-emerald-700 dark:text-emerald-400"><Play className="h-4 w-4" /> Expected Output</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{p.expectedOutput}</p>
        </CardContent>
      </Card>

      {/* Troubleshooting + Security */}
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base"><AlertTriangle className="h-4 w-4 text-amber-500" /> Troubleshooting</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5 text-xs">
              {p.troubleshooting.map((t, i) => (
                <li key={i} className="flex gap-2">
                  <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base"><Shield className="h-4 w-4 text-rose-500" /> Security</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5 text-xs">
              {p.security.map((t, i) => (
                <li key={i} className="flex gap-2">
                  <Shield className="mt-0.5 h-3 w-3 shrink-0 text-rose-500" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Extensions */}
      <Card className="mb-8 border-primary/30">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base"><Lightbulb className="h-4 w-4 text-primary" /> Possible Extensions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1.5 text-sm">
            {p.extensions.map((t, i) => (
              <li key={i} className="flex gap-2">
                <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Footer nav */}
      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => navigate({ name: 'projects' })}>
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> All projects
        </Button>
        {projectIndex < projects.length && (
          <Button
            variant="ghost"
            onClick={() => navigate({ name: 'project', projectId: projects[projectIndex].id })}
          >
            Next project <ArrowLeft className="ml-1.5 h-3.5 w-3.5 rotate-180" />
          </Button>
        )}
      </div>
    </div>
  )
}
