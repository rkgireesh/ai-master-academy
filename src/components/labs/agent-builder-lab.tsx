'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Bot, Play, RotateCcw, ChevronRight, Wrench, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Agent Builder Lab
 *
 * Users compose an agent:
 *   - Pick which tools to give it
 *   - Set a goal
 *   - Run the simulated agent step by step
 *
 * The agent uses a rule-based decision engine (clearly a simulation).
 * It plans, selects a tool, observes the result, and decides whether
 * to continue or stop. The trace is fully visible.
 */

interface Tool {
  id: string
  name: string
  description: string
  // Returns a simulated result given the current goal
  simulate: (goal: string, state: AgentState) => string
}

interface AgentState {
  facts: string[]
  stepsTaken: number
  goalAchieved: boolean
}

const TOOLS: Tool[] = [
  {
    id: 'search',
    name: 'web_search',
    description: 'Search the web for information',
    simulate: (goal) => {
      if (goal.toLowerCase().includes('weather')) return 'Tokyo: 18°C, cloudy. Forecast: light rain tomorrow.'
      if (goal.toLowerCase().includes('rag')) return 'Found: RAG combines retrieval with generation. Steps: chunk → embed → retrieve → generate.'
      if (goal.toLowerCase().includes('transformer')) return 'Found: Transformers use self-attention. Paper: "Attention Is All You Need" (2017).'
      return `Found 3 results about "${goal}". Top result: comprehensive article with key information.`
    },
  },
  {
    id: 'calculator',
    name: 'calculator',
    description: 'Evaluate a math expression',
    simulate: (goal) => {
      const nums = goal.match(/\d+/g)?.map(Number) ?? []
      if (nums.length >= 2) {
        const a = nums[0], b = nums[1]
        if (goal.toLowerCase().includes('add') || goal.toLowerCase().includes('sum') || goal.toLowerCase().includes('+'))
          return `${a} + ${b} = ${a + b}`
        if (goal.toLowerCase().includes('subtract') || goal.toLowerCase().includes('-'))
          return `${a} - ${b} = ${a - b}`
        if (goal.toLowerCase().includes('multiply') || goal.toLowerCase().includes('*') || goal.toLowerCase().includes('times'))
          return `${a} × ${b} = ${a * b}`
        return `${a} and ${b}: sum=${a + b}, product=${a * b}`
      }
      return 'No numbers found in goal to calculate.'
    },
  },
  {
    id: 'database',
    name: 'query_database',
    description: 'Query an internal database',
    simulate: (goal) => {
      if (goal.toLowerCase().includes('order')) return 'Found 3 orders: #1023 ($42), #1098 ($15), #1145 ($88). Total: $145.'
      if (goal.toLowerCase().includes('user') || goal.toLowerCase().includes('customer')) return 'Found user: id=42, name=Alice, joined=2023-04-15.'
      return 'Query returned 0 rows (no matching records).'
    },
  },
  {
    id: 'code',
    name: 'run_code',
    description: 'Execute a small code snippet',
    simulate: (goal) => {
      if (goal.toLowerCase().includes('csv') || goal.toLowerCase().includes('data')) return 'Code executed. Output: 1240 rows, 5 columns. Mean revenue: $48.30.'
      if (goal.toLowerCase().includes('sort')) return 'Code executed. Sorted array: [1, 2, 5, 8, 9].'
      return 'Code executed successfully. No output.'
    },
  },
  {
    id: 'weather',
    name: 'get_weather',
    description: 'Get weather for a location',
    simulate: (goal) => {
      if (goal.toLowerCase().includes('tokyo')) return 'Tokyo: 18°C, cloudy, 65% humidity, wind 12 km/h NW.'
      if (goal.toLowerCase().includes('london')) return 'London: 12°C, rain, 80% humidity, wind 18 km/h SW.'
      if (goal.toLowerCase().includes('new york')) return 'New York: 15°C, partly cloudy, 55% humidity, wind 8 km/h W.'
      return 'Weather: 20°C, clear, 50% humidity.'
    },
  },
  {
    id: 'summarize',
    name: 'summarize',
    description: 'Summarise collected information',
    simulate: (_goal, state) => {
      if (state.facts.length === 0) return 'No facts to summarise yet. Call other tools first.'
      return `Summary based on ${state.facts.length} fact(s): ${state.facts.join(' ')}`
    },
  },
]

interface TraceStep {
  phase: 'plan' | 'select-tool' | 'execute' | 'observe' | 'reflect' | 'decide'
  message: string
  tool?: string
  result?: string
}

const SAMPLE_GOALS = [
  'What is the weather in Tokyo right now?',
  'Find information about RAG and summarise it.',
  'Add 23 and 47, then tell me the result.',
  'Look up my last 3 orders and compute the total.',
]

export function AgentBuilderLab() {
  const [selectedToolIds, setSelectedToolIds] = React.useState<string[]>(['search', 'summarize'])
  const [goal, setGoal] = React.useState(SAMPLE_GOALS[0])
  const [trace, setTrace] = React.useState<TraceStep[]>([])
  const [running, setRunning] = React.useState(false)
  const [stateRef, setStateRef] = React.useState<AgentState>({ facts: [], stepsTaken: 0, goalAchieved: false })

  const toggleTool = (id: string) => {
    setSelectedToolIds((prev) =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    )
  }

  const selectedTools = TOOLS.filter(t => selectedToolIds.includes(t.id))

  // Run the agent simulation
  const run = () => {
    setTrace([])
    setRunning(true)
    const state: AgentState = { facts: [], stepsTaken: 0, goalAchieved: false }
    setStateRef({ ...state })
    const steps: TraceStep[] = []

    // Step 1: Plan
    steps.push({
      phase: 'plan',
      message: `Goal: "${goal}". I have ${selectedTools.length} tools available. I'll use them to gather information and produce an answer.`,
    })
    setTrace([...steps])

    // Determine which tools to call based on the goal
    const goalLower = goal.toLowerCase()
    const toolsToCall: { tool: Tool; reason: string }[] = []

    if (goalLower.includes('weather')) {
      const w = selectedTools.find(t => t.id === 'weather') ?? selectedTools.find(t => t.id === 'search')
      if (w) toolsToCall.push({ tool: w, reason: 'Goal mentions weather — need to look it up.' })
    }
    if (/\d+.*(add|sum|subtract|multiply|times|\+|-|\*)/.test(goalLower) || (goalLower.includes('calculate') && /\d/.test(goal))) {
      const c = selectedTools.find(t => t.id === 'calculator')
      if (c) toolsToCall.push({ tool: c, reason: 'Goal involves math — use the calculator.' })
    }
    if (goalLower.includes('order')) {
      const d = selectedTools.find(t => t.id === 'database')
      if (d) toolsToCall.push({ tool: d, reason: 'Goal mentions orders — query the database.' })
    }
    if (goalLower.includes('csv') || goalLower.includes('data')) {
      const cd = selectedTools.find(t => t.id === 'code')
      if (cd) toolsToCall.push({ tool: cd, reason: 'Goal involves data analysis — run code.' })
    }
    if (goalLower.includes('find') || goalLower.includes('search') || goalLower.includes('information') || goalLower.includes('rag') || goalLower.includes('transformer')) {
      const s = selectedTools.find(t => t.id === 'search')
      if (s && !toolsToCall.find(tc => tc.tool.id === 'search')) {
        toolsToCall.push({ tool: s, reason: 'Goal needs information — search the web.' })
      }
    }
    // Always end with summarise if available
    if (selectedTools.find(t => t.id === 'summarize')) {
      toolsToCall.push({ tool: TOOLS.find(t => t.id === 'summarize')!, reason: 'Synthesise the gathered information into a final answer.' })
    }

    if (toolsToCall.length === 0) {
      steps.push({
        phase: 'decide',
        message: 'I do not have the right tools for this goal. Stopping.',
      })
      setTrace([...steps])
      setRunning(false)
      return
    }

    // Execute each tool with delays for visualisation
    let delay = 600
    toolsToCall.forEach((tc, idx) => {
      setTimeout(() => {
        steps.push({
          phase: 'select-tool',
          message: tc.reason,
          tool: tc.tool.name,
        })
        setTrace([...steps])

        setTimeout(() => {
          steps.push({
            phase: 'execute',
            message: `Calling ${tc.tool.name}(...)`,
            tool: tc.tool.name,
          })
          setTrace([...steps])

          setTimeout(() => {
            const result = tc.tool.simulate(goal, state)
            state.facts.push(result.split('.')[0] + '.')
            state.stepsTaken++
            setStateRef({ ...state })
            steps.push({
              phase: 'observe',
              message: `Tool returned:`,
              tool: tc.tool.name,
              result,
            })
            setTrace([...steps])

            setTimeout(() => {
              steps.push({
                phase: 'reflect',
                message: idx < toolsToCall.length - 1
                  ? `I have new information. Continuing to next step.`
                  : `I have gathered enough information to answer the goal.`,
              })
              setTrace([...steps])

              if (idx === toolsToCall.length - 1) {
                setTimeout(() => {
                  state.goalAchieved = true
                  setStateRef({ ...state })
                  steps.push({
                    phase: 'decide',
                    message: `Goal achieved. Stopping. Final answer: ${state.facts.slice(-1)[0]}`,
                  })
                  setTrace([...steps])
                  setRunning(false)
                }, 400)
              }
            }, 400)
          }, 500)
        }, 400)
      }, delay)
      delay += 1700
    })
  }

  const reset = () => {
    setTrace([])
    setRunning(false)
    setStateRef({ facts: [], stepsTaken: 0, goalAchieved: false })
  }

  const PHASE_STYLES = {
    plan:        'bg-blue-500/15 text-blue-700 dark:text-blue-300',
    'select-tool': 'bg-violet-500/15 text-violet-700 dark:text-violet-300',
    execute:     'bg-amber-500/15 text-amber-700 dark:text-amber-300',
    observe:     'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
    reflect:     'bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300',
    decide:      'bg-rose-500/15 text-rose-700 dark:text-rose-300',
  }

  return (
    <Card className="border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Agent Builder Lab</CardTitle>
          <Badge variant="outline" className="ml-auto text-[10px]">Educational simulation</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Pick tools for your agent, set a goal, and watch it plan → select tools → execute → observe → reflect → decide.
          The decision engine is rule-based for traceability. A real LLM agent may choose different actions.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tool selection */}
        <div>
          <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Available tools (click to give the agent access)
          </label>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {TOOLS.map((t) => {
              const selected = selectedToolIds.includes(t.id)
              return (
                <button
                  key={t.id}
                  onClick={() => toggleTool(t.id)}
                  disabled={running}
                  className={cn(
                    'rounded-lg border p-2 text-left transition-all',
                    selected ? 'border-primary bg-primary/10' : 'hover:bg-muted'
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <Wrench className={cn('h-3 w-3', selected ? 'text-primary' : 'text-muted-foreground')} />
                    <span className="font-mono text-xs font-medium">{t.name}</span>
                    {selected && <Check className="ml-auto h-3 w-3 text-primary" />}
                  </div>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">{t.description}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Goal input */}
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Goal</label>
          <Input value={goal} onChange={(e) => setGoal(e.target.value)} disabled={running} />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {SAMPLE_GOALS.map((g) => (
              <button
                key={g}
                onClick={() => setGoal(g)}
                disabled={running}
                className="rounded-full border bg-card px-2.5 py-0.5 text-[10px] text-muted-foreground hover:border-primary hover:text-primary"
              >
                {g.length > 40 ? g.slice(0, 40) + '…' : g}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={run} disabled={running || selectedTools.length === 0} className="flex-1">
            <Play className="mr-1.5 h-4 w-4" /> {running ? 'Running…' : 'Run agent'}
          </Button>
          <Button onClick={reset} variant="outline" disabled={running}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Agent state */}
        {(trace.length > 0 || stateRef.facts.length > 0) && (
          <div className="grid grid-cols-3 gap-2 rounded-lg border bg-muted/30 p-3 text-center">
            <div>
              <div className="text-[10px] uppercase text-muted-foreground">Steps</div>
              <div className="text-lg font-bold font-mono">{stateRef.stepsTaken}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-muted-foreground">Facts gathered</div>
              <div className="text-lg font-bold font-mono">{stateRef.facts.length}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-muted-foreground">Goal</div>
              <div className="text-lg font-bold font-mono">
                {stateRef.goalAchieved ? <span className="text-emerald-500">✓ done</span> : <span className="text-amber-500">…</span>}
              </div>
            </div>
          </div>
        )}

        {/* Trace */}
        {trace.length > 0 && (
          <div>
            <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Execution trace</label>
            <div className="scrollbar-thin max-h-96 space-y-2 overflow-y-auto">
              {trace.map((s, i) => (
                <div key={i} className="rounded-lg border bg-card p-2.5 animate-fade-in-up">
                  <div className="mb-1 flex items-center gap-2">
                    <span className={cn('rounded px-1.5 py-0.5 text-[9px] font-mono font-semibold uppercase', PHASE_STYLES[s.phase])}>
                      {s.phase}
                    </span>
                    {s.tool && <span className="font-mono text-[10px] text-muted-foreground">{s.tool}</span>}
                    <span className="ml-auto text-[9px] text-muted-foreground">step {i + 1}</span>
                  </div>
                  <p className="text-xs">{s.message}</p>
                  {s.result && (
                    <pre className="mt-1.5 overflow-x-auto rounded border bg-emerald-500/5 p-1.5 font-mono text-[11px]">
                      {s.result}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-muted-foreground">
          <strong className="text-amber-700 dark:text-amber-400">Try this:</strong>{' '}
          Give the agent only <code>calculator</code> and <code>summarize</code>, then set the goal
          &quot;What is the weather in Tokyo?&quot;. The agent will plan, fail to find a relevant tool,
          and stop. Now add <code>weather</code> to the toolkit and re-run. This shows why tool
          selection is critical in agent design.
        </div>
      </CardContent>
    </Card>
  )
}
