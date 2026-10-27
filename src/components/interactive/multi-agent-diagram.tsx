'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Network, MousePointerClick } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Agent {
  id: string
  name: string
  role: string
  responsibilities: string[]
  output: string
}

const SUPERVISOR: Agent = {
  id: 'supervisor',
  name: 'Supervisor',
  role: 'Orchestrates the workflow',
  responsibilities: [
    'Receives the user task and decomposes it into subtasks',
    'Routes subtasks to the right specialist agents',
    'Aggregates results and handles failures',
    'Decides when the task is complete',
  ],
  output: 'A delegation plan + final aggregated result',
}

const WORKERS: Agent[] = [
  {
    id: 'research',
    name: 'Research Agent',
    role: 'Gathers information',
    responsibilities: [
      'Uses web search and document retrieval tools',
      'Identifies the most relevant sources',
      'Returns structured notes with citations',
    ],
    output: 'Structured research notes with source URLs',
  },
  {
    id: 'analysis',
    name: 'Analysis Agent',
    role: 'Synthesises and reasons',
    responsibilities: [
      'Takes research notes and extracts key findings',
      'Cross-references multiple sources',
      'Identifies contradictions and consensus',
    ],
    output: 'A list of key findings with confidence scores',
  },
  {
    id: 'writing',
    name: 'Writing Agent',
    role: 'Produces the deliverable',
    responsibilities: [
      'Takes the analysed findings',
      'Drafts a coherent report/article/response',
      'Ensures citations are correctly placed',
    ],
    output: 'A polished written deliverable',
  },
  {
    id: 'verification',
    name: 'Verification Agent',
    role: 'Quality gate',
    responsibilities: [
      'Checks the draft against original findings',
      'Flags unsupported claims (potential hallucinations)',
      'Returns either "approved" or "revise with notes"',
    ],
    output: 'Approval verdict + revision notes (if any)',
  },
]

export function MultiAgentDiagram() {
  const [selected, setSelected] = React.useState<string>('supervisor')
  const all = [SUPERVISOR, ...WORKERS]
  const current = all.find((a) => a.id === selected)!

  return (
    <Card className="my-6 border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Multi-Agent System Diagram</CardTitle>
          <Badge variant="outline" className="ml-auto text-[10px]">
            <MousePointerClick className="mr-1 h-3 w-3" /> Click an agent
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          A supervisor-worker architecture: the supervisor routes work to specialist agents,
          then aggregates their outputs into a final result.
        </p>
      </CardHeader>
      <CardContent>
        {/* Diagram */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => setSelected('supervisor')}
            className={cn(
              'w-full max-w-md rounded-lg border-2 p-4 text-center transition-all hover:border-primary',
              selected === 'supervisor'
                ? 'border-primary bg-primary/10 ring-4 ring-primary/20'
                : 'border-primary/40 bg-primary/5'
            )}
          >
            <div className="text-base font-semibold">Supervisor</div>
            <div className="text-xs text-muted-foreground">Routes tasks, aggregates results</div>
          </button>

          {/* Vertical connector */}
          <div className="h-4 w-px bg-border" aria-hidden />

          {/* Worker row */}
          <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
            {WORKERS.map((w) => (
              <React.Fragment key={w.id}>
                <button
                  onClick={() => setSelected(w.id)}
                  className={cn(
                    'rounded-lg border p-3 text-center transition-all hover:border-primary',
                    selected === w.id
                      ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                      : 'bg-card'
                  )}
                >
                  <div className="text-sm font-medium">{w.name}</div>
                  <div className="mt-0.5 text-[10px] text-muted-foreground">{w.role}</div>
                </button>
              </React.Fragment>
            ))}
          </div>

          {/* Connectors to final */}
          <div className="h-4 w-px bg-border" aria-hidden />

          <div className="w-full max-w-md rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-3 text-center">
            <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Final Result</div>
            <div className="text-[10px] text-muted-foreground">Delivered to the user with citations</div>
          </div>
        </div>

        {/* Detail */}
        <div className="mt-4 rounded-lg border bg-muted/30 p-4">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold">{current.name}</h4>
            <Badge variant="outline" className="text-[10px]">{current.role}</Badge>
          </div>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            {current.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
          <div className="mt-3 rounded border bg-background p-2 text-xs">
            <span className="text-muted-foreground">Output: </span>{current.output}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
