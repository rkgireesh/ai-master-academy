'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bot, Play, RotateCcw, Pause } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Interactive Agent Simulator.
 * Lets the user pick a task and step through a simulated ReAct-style agent loop.
 * The trace is predefined and clearly labelled as an educational simulation.
 */

type TaskId = 'research-topic' | 'analyze-csv'

interface Step {
  phase: 'plan' | 'act' | 'observe' | 'reflect' | 'decide'
  agent: string
  message: string
  tool?: string
  toolInput?: string
  toolOutput?: string
}

const TRACES: Record<TaskId, { title: string; goal: string; steps: Step[] }> = {
  'research-topic': {
    title: 'Research a Topic (e.g. "Latest advances in RAG")',
    goal: 'Produce a 3-paragraph summary of recent RAG advances with citations.',
    steps: [
      { phase: 'plan', agent: 'Planner', message: 'Decompose: (1) search for recent RAG papers, (2) extract key advances, (3) write summary.' },
      { phase: 'act', agent: 'Agent', message: 'I will call the web search tool to find recent RAG articles.', tool: 'web_search', toolInput: 'recent advances in retrieval-augmented generation 2025' },
      { phase: 'observe', agent: 'Tool: web_search', message: 'Returned 5 results.', toolOutput: '["GraphRAG: ...", "Self-RAG: ...", "Hybrid retrieval ...", "Agentic RAG ...", "Reranking ..."]' },
      { phase: 'reflect', agent: 'Agent', message: 'I have 5 results. The first three look most relevant. I should fetch the full text of the top 2.' },
      { phase: 'act', agent: 'Agent', message: 'Calling fetch_page on the top result.', tool: 'fetch_page', toolInput: 'url: https://example.com/graphrag' },
      { phase: 'observe', agent: 'Tool: fetch_page', message: 'Retrieved 4,200 chars.', toolOutput: 'GraphRAG improves multi-hop QA by building a knowledge graph from the corpus...' },
      { phase: 'act', agent: 'Agent', message: 'Calling fetch_page on the second result.', tool: 'fetch_page', toolInput: 'url: https://example.com/self-rag' },
      { phase: 'observe', agent: 'Tool: fetch_page', message: 'Retrieved 3,100 chars.', toolOutput: 'Self-RAG trains the LLM to retrieve only when needed via reflection tokens...' },
      { phase: 'reflect', agent: 'Agent', message: 'I have enough context to write the summary. Stopping retrieval.' },
      { phase: 'act', agent: 'Writer', message: 'Drafting the summary grounded in retrieved passages.', tool: 'write_summary', toolInput: 'context: [passage1, passage2]' },
      { phase: 'observe', agent: 'Tool: write_summary', message: 'Generated 3 paragraphs.', toolOutput: 'Recent RAG advances include GraphRAG, which builds a knowledge graph... Self-RAG trains models...' },
      { phase: 'decide', agent: 'Agent', message: 'Task complete. Returning summary with citations.', },
    ],
  },
  'analyze-csv': {
    title: 'Analyze a CSV Dataset (e.g. sales.csv)',
    goal: 'Compute total revenue per region and identify the top region.',
    steps: [
      { phase: 'plan', agent: 'Planner', message: 'Decompose: (1) inspect the CSV, (2) compute revenue per region, (3) sort and report.' },
      { phase: 'act', agent: 'Agent', message: 'Calling csv_inspect to see the columns.', tool: 'csv_inspect', toolInput: 'path: sales.csv' },
      { phase: 'observe', agent: 'Tool: csv_inspect', message: 'Found 4 columns.', toolOutput: 'columns: [date, region, product, revenue]; rows: 1240' },
      { phase: 'act', agent: 'Agent', message: 'Calling pandas_groupby to sum revenue per region.', tool: 'pandas_groupby', toolInput: 'groupby: region, agg: sum(revenue)' },
      { phase: 'observe', agent: 'Tool: pandas_groupby', message: 'Returned 5 regions.', toolOutput: '{"North": 124000, "South": 98000, "East": 156000, "West": 142000, "Central": 87000}' },
      { phase: 'reflect', agent: 'Agent', message: 'East has the highest revenue at 156k. I should also compute the percentage share.' },
      { phase: 'act', agent: 'Agent', message: 'Calling compute_pct to calculate share.', tool: 'compute_pct', toolInput: 'values: {North:124000,...}' },
      { phase: 'observe', agent: 'Tool: compute_pct', message: 'Computed percentages.', toolOutput: '{"East": 26.4%, "West": 24.0%, "North": 21.0%, "South": 16.6%, "Central": 14.7%}' },
      { phase: 'decide', agent: 'Agent', message: 'Task complete. East region leads with 26.4% of total revenue.' },
    ],
  },
}

const PHASE_STYLES: Record<Step['phase'], { color: string; label: string }> = {
  plan:    { color: 'bg-blue-500/15 text-blue-700 dark:text-blue-300',     label: 'PLAN' },
  act:     { color: 'bg-violet-500/15 text-violet-700 dark:text-violet-300', label: 'ACT' },
  observe: { color: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300', label: 'OBSERVE' },
  reflect: { color: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',  label: 'REFLECT' },
  decide:  { color: 'bg-rose-500/15 text-rose-700 dark:text-rose-300',     label: 'DECIDE' },
}

export function AgentSimulator() {
  const [task, setTask] = React.useState<TaskId>('research-topic')
  const [stepIdx, setStepIdx] = React.useState(0)
  const [playing, setPlaying] = React.useState(false)

  const trace = TRACES[task]

  React.useEffect(() => {
    if (!playing) return
    if (stepIdx >= trace.steps.length) {
      setPlaying(false)
      return
    }
    const t = setTimeout(() => setStepIdx((i) => i + 1), 1400)
    return () => clearTimeout(t)
  }, [playing, stepIdx, trace])

  const switchTask = (t: TaskId) => {
    setTask(t)
    setStepIdx(0)
    setPlaying(false)
  }

  const reset = () => { setStepIdx(0); setPlaying(false) }

  return (
    <Card className="my-6 border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">AI Agent Loop Simulator</CardTitle>
          <Badge variant="outline" className="ml-auto text-[10px]">Educational Simulation</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          A predefined trace showing how an LLM agent plans, acts (calls tools), observes results,
          reflects, and decides whether to continue. A real LLM agent may choose different actions.
        </p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {/* Task picker */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(TRACES) as TaskId[]).map((t) => (
            <Button
              key={t}
              size="sm"
              variant={task === t ? 'default' : 'outline'}
              onClick={() => switchTask(t)}
            >
              {TRACES[t].title.split('(')[0].trim()}
            </Button>
          ))}
        </div>
        <div className="rounded-lg border bg-muted/30 p-3">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Goal</div>
          <div className="mt-1 text-sm">{trace.goal}</div>
        </div>

        {/* Trace */}
        <div className="space-y-2">
          {trace.steps.slice(0, stepIdx).map((s, i) => {
            const ps = PHASE_STYLES[s.phase]
            return (
              <div key={i} className="rounded-lg border bg-card p-3 animate-fade-in-up">
                <div className="mb-1 flex items-center gap-2">
                  <span className={cn('rounded px-1.5 py-0.5 text-[10px] font-mono font-semibold', ps.color)}>
                    {ps.label}
                  </span>
                  <span className="text-xs font-semibold">{s.agent}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground">step {i + 1}</span>
                </div>
                <p className="text-xs">{s.message}</p>
                {s.toolInput && (
                  <pre className="mt-2 overflow-x-auto rounded border bg-muted/50 p-2 font-mono text-[11px]">
                    <span className="text-muted-foreground">input: </span>{s.toolInput}
                  </pre>
                )}
                {s.toolOutput && (
                  <pre className="mt-1 overflow-x-auto rounded border bg-emerald-500/5 p-2 font-mono text-[11px]">
                    <span className="text-muted-foreground">output: </span>{s.toolOutput}
                  </pre>
                )}
              </div>
            )
          })}
          {stepIdx === 0 && (
            <div className="rounded-lg border border-dashed p-6 text-center text-xs text-muted-foreground">
              Press &quot;Start&quot; to begin the simulation.
            </div>
          )}
          {stepIdx >= trace.steps.length && (
            <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-3 text-xs">
              <strong>Task complete.</strong> The agent stopped because the goal was achieved (a stopping condition was met).
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <Button onClick={() => setPlaying((p) => !p)} size="sm" disabled={stepIdx >= trace.steps.length}>
            {playing ? <><Pause className="mr-1 h-3.5 w-3.5" /> Pause</> : <><Play className="mr-1 h-3.5 w-3.5" /> Start</>}
          </Button>
          <Button onClick={() => setStepIdx((i) => Math.min(i + 1, trace.steps.length))} size="sm" variant="outline" disabled={stepIdx >= trace.steps.length}>
            Step →
          </Button>
          <Button onClick={reset} size="sm" variant="outline">
            <RotateCcw className="mr-1 h-3.5 w-3.5" /> Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
