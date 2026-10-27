'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MemoryStick, Play, RotateCcw } from 'lucide-react'

/**
 * Shows how an agent's state evolves over a sequence of steps.
 * Demonstrates the distinction between:
 *   - model parameters (immutable weights)
 *   - conversation context (in-prompt message history)
 *   - external memory (DB-retrieved persistent state)
 */

interface State {
  step: number
  phase: 'plan' | 'act' | 'observe' | 'reflect' | 'done'
  context: string[]      // in-prompt messages (bounded by context window)
  workingMemory: string  // current sub-goal
  persistentMemory: { key: string; value: string }[] // stored across sessions
  message: string
}

const SEQUENCE: Omit<State, 'step'>[] = [
  { phase: 'plan', context: ['user: Find my last 3 orders and summarise them'], workingMemory: 'retrieve orders → summarise', persistentMemory: [], message: 'Planner decomposes the task. Working memory holds the current sub-goal.' },
  { phase: 'act', context: ['user: Find my last 3 orders and summarise them', 'assistant: calling get_user_orders(userId=u_42, limit=3)'], workingMemory: 'retrieve orders → summarise', persistentMemory: [], message: 'Agent decides to call the orders tool. Tool call is added to conversation context.' },
  { phase: 'observe', context: ['user: Find my last 3 orders and summarise them', 'assistant: calling get_user_orders(...)', 'tool_result: [#1023 $42, #1098 $15, #1145 $88]'], workingMemory: 'retrieve orders → summarise', persistentMemory: [], message: 'Tool returns 3 orders. Result is appended to context. Context now has 3 messages.' },
  { phase: 'reflect', context: ['user: Find my last 3 orders and summarise them', 'assistant: calling get_user_orders(...)', 'tool_result: [#1023 $42, #1098 $15, #1145 $88]', 'assistant: total = $145, avg = $48.30'], workingMemory: 'compute totals', persistentMemory: [{ key: 'user_summary_2025_03', value: 'last_3_orders_total=$145' }], message: 'Agent writes a summary to persistent memory so it doesn\'t need to re-retrieve next session.' },
  { phase: 'done', context: ['user: Find my last 3 orders and summarise them', 'assistant: calling get_user_orders(...)', 'tool_result: ...', 'assistant: total = $145, avg = $48.30', 'assistant: You placed 3 orders totalling $145.'], workingMemory: '', persistentMemory: [{ key: 'user_summary_2025_03', value: 'last_3_orders_total=$145' }], message: 'Final answer delivered to user. Stopping condition met.' },
]

export function AgentStateTrace() {
  const [step, setStep] = React.useState(0)
  const state: State = { step, ...SEQUENCE[step] }

  return (
    <Card className="my-6 border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <MemoryStick className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Agent State Trace</CardTitle>
          <Badge variant="outline" className="ml-auto text-[10px]">Educational</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Watch how an agent&apos;s state changes across steps. Notice the three distinct memory types:
          model parameters (immutable), conversation context (in-prompt, bounded), and external memory (persistent).
        </p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {/* Step indicator */}
        <div className="flex items-center gap-2">
          {SEQUENCE.map((s, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full ${i <= step ? 'bg-primary' : 'bg-muted'}`}
            />
          ))}
        </div>
        <div className="text-xs text-muted-foreground">
          Step {step + 1} / {SEQUENCE.length} — <span className="font-mono">{state.phase}</span>
        </div>

        {/* Three memory types side-by-side */}
        <div className="grid gap-3 md:grid-cols-3">
          {/* Model parameters */}
          <div className="rounded-lg border p-3">
            <div className="mb-2 text-[10px] uppercase tracking-wide text-muted-foreground">Model Parameters</div>
            <div className="text-xs text-muted-foreground">
              Frozen at inference time. 7B–70B weights. Same for every user. Cannot change without retraining or fine-tuning.
            </div>
            <div className="mt-2 rounded bg-muted/50 p-2 font-mono text-[10px]">
              weights: frozen<br/>bias: frozen<br/>norms: frozen
            </div>
          </div>

          {/* Conversation context */}
          <div className="rounded-lg border p-3">
            <div className="mb-2 text-[10px] uppercase tracking-wide text-muted-foreground">
              Conversation Context (in-prompt)
            </div>
            <div className="space-y-1">
              {state.context.map((m, i) => (
                <div key={i} className="rounded bg-muted/50 p-1.5 font-mono text-[10px]">
                  {m.length > 80 ? m.slice(0, 78) + '…' : m}
                </div>
              ))}
              {state.context.length === 0 && (
                <div className="text-[10px] text-muted-foreground">empty</div>
              )}
            </div>
            <div className="mt-2 text-[10px] text-muted-foreground">
              Bounded by context window. Lost when session ends.
            </div>
          </div>

          {/* External memory */}
          <div className="rounded-lg border p-3">
            <div className="mb-2 text-[10px] uppercase tracking-wide text-muted-foreground">External Memory (persistent)</div>
            <div className="space-y-1">
              {state.persistentMemory.length === 0 ? (
                <div className="text-[10px] text-muted-foreground">empty</div>
              ) : (
                state.persistentMemory.map((m, i) => (
                  <div key={i} className="rounded bg-emerald-500/10 p-1.5 font-mono text-[10px]">
                    {m.key} = {m.value}
                  </div>
                ))
              )}
            </div>
            <div className="mt-2 text-[10px] text-muted-foreground">
              Stored in DB. Retrieved via embedding search. Survives across sessions.
            </div>
          </div>
        </div>

        {/* Working memory + message */}
        <div className="rounded-lg border bg-muted/30 p-3">
          <div className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">Working Memory (current sub-goal)</div>
          <div className="font-mono text-xs">{state.workingMemory || '—'}</div>
          <p className="mt-3 text-xs">{state.message}</p>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <Button onClick={() => setStep((s) => Math.min(s + 1, SEQUENCE.length - 1))} size="sm" disabled={step >= SEQUENCE.length - 1}>
            <Play className="mr-1 h-3.5 w-3.5" /> Next step
          </Button>
          <Button onClick={() => setStep(0)} size="sm" variant="outline">
            <RotateCcw className="mr-1 h-3.5 w-3.5" /> Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
