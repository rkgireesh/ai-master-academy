'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Wrench, MousePointerClick } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Stage {
  id: string
  label: string
  detail: string
  example: string
}

const STAGES: Stage[] = [
  { id: '1', label: 'User asks a question', detail: 'The user sends a message that requires external information or computation.', example: '"What is the weather in Tokyo right now?"' },
  { id: '2', label: 'LLM receives prompt + tool schemas', detail: 'The application sends the user message + a JSON-schema description of available tools (functions).', example: 'tools: [{name: "get_weather", parameters: {city: string, unit: "C"|"F"}}]' },
  { id: '3', label: 'LLM decides to call a tool', detail: 'The LLM returns a structured response requesting a tool call. It does NOT execute the function itself.', example: '{tool: "get_weather", args: {city: "Tokyo", unit: "C"}}' },
  { id: '4', label: 'Application validates the call', detail: 'Your code validates: (a) the tool exists, (b) arguments match the schema, (c) the user is authorised to call it.', example: 'validate against JSON Schema; check permissions' },
  { id: '5', label: 'Application executes the tool', detail: 'Your application code (not the model) calls the real function — a REST API, a database query, a shell command, etc.', example: 'response = http.get("https://api.weather.com/...", params=...)' },
  { id: '6', label: 'Tool returns a result', detail: 'The function returns data. This is converted to a string (often JSON) and fed back to the LLM as a tool result message.', example: '{temp: 18, condition: "cloudy"}' },
  { id: '7', label: 'LLM incorporates the result', detail: 'The LLM receives the tool result as part of the conversation and generates the final answer for the user.', example: '"It is currently 18°C and cloudy in Tokyo."' },
]

export function ToolCallingFlow() {
  const [selected, setSelected] = React.useState('1')
  const current = STAGES.find((s) => s.id === selected)!

  return (
    <Card className="my-6 border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Tool-Calling Flow</CardTitle>
          <Badge variant="outline" className="ml-auto text-[10px]">
            <MousePointerClick className="mr-1 h-3 w-3" /> Click a stage
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          How an LLM application uses tools. Critically: <strong>the model never executes functions itself</strong> —
          your application code does.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {STAGES.map((s, i) => (
            <div key={s.id}>
              <button
                onClick={() => setSelected(s.id)}
                className={cn(
                  'flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-all hover:border-primary',
                  selected === s.id ? 'border-primary bg-primary/10 ring-2 ring-primary/30' : 'bg-card'
                )}
              >
                <span className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-mono',
                  selected === s.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}>
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{s.label}</div>
                </div>
              </button>
              {i < STAGES.length - 1 && <div className="ml-3 h-2 w-px bg-border" aria-hidden />}
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-lg border bg-muted/30 p-4">
          <h4 className="font-semibold">{current.label}</h4>
          <p className="mt-2 text-sm text-muted-foreground">{current.detail}</p>
          <pre className="mt-3 overflow-x-auto rounded border bg-background p-2 font-mono text-xs">
            {current.example}
          </pre>
        </div>

        <div className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/5 p-3 text-xs">
          <strong className="text-rose-700 dark:text-rose-400">Critical:</strong> The model produces a JSON
          request to call a tool. It does not have filesystem, network, or shell access. Your application
          is responsible for validating, authorising, and executing the call. Never trust model output
          blindly — always validate arguments before executing.
        </div>
      </CardContent>
    </Card>
  )
}
