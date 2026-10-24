'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MessageSquareCode, Sparkles, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Prompt Engineering Sandbox
 *
 * Lets users try zero-shot, few-shot, and chain-of-thought prompting on
 * a simulated model. The "model" uses rule-based responses that demonstrate
 * the principle: prompt structure has a huge effect on output.
 *
 * The simulation is clearly labelled. Real LLMs would produce variable
 * outputs, but the patterns shown here match real-world behaviour.
 */

type Strategy = 'zero-shot' | 'few-shot' | 'cot' | 'role'
type Task = 'sentiment' | 'classify' | 'math' | 'summarize'

const TASKS: { id: Task; label: string; defaultInput: string }[] = [
  { id: 'sentiment', label: 'Sentiment', defaultInput: 'The battery life is amazing but the screen is terrible.' },
  { id: 'classify', label: 'Classify', defaultInput: 'Email: "Your package has shipped and will arrive Tuesday."' },
  { id: 'math', label: 'Math', defaultInput: 'A shop sells pencils at $3 each. If you buy 7 pencils with a $20 bill, how much change?' },
  { id: 'summarize', label: 'Summarize', defaultInput: 'Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar. The process occurs in the chloroplasts, which contain a green pigment called chlorophyll.' },
]

const STRATEGY_INFO: Record<Strategy, { label: string; description: string }> = {
  'zero-shot': { label: 'Zero-shot', description: 'Just ask the question — no examples.' },
  'few-shot':  { label: 'Few-shot',  description: 'Provide 1-3 examples in the prompt.' },
  'cot':       { label: 'Chain-of-thought', description: 'Add "Let\'s think step by step".' },
  'role':      { label: 'Role + constraints', description: 'Assign a persona + format rules.' },
}

function buildPrompt(task: Task, strategy: Strategy, input: string): string {
  const examples: Record<Task, string[]> = {
    sentiment: ['"Great product!" → POSITIVE', '"Worst experience ever." → NEGATIVE'],
    classify: ['"Invoice for services rendered." → BILLING', '"Welcome to the team!" → ONBOARDING'],
    math: ['What is 2+2? → 4', 'What is 10-3? → 7'],
    summarize: ['"Long article about cats." → "Cats are popular pets."'],
  }
  const roles: Record<Task, string> = {
    sentiment: 'You are a sentiment analysis expert. Output exactly one word: POSITIVE, NEGATIVE, or MIXED.',
    classify: 'You are an email classifier. Output exactly one category: BILLING, SUPPORT, MARKETING, SHIPPING, or OTHER.',
    math: 'You are a careful math tutor. Show your work, then state the final answer on a new line as "Answer: X".',
    summarize: 'You are a summarization assistant. Output exactly 1 sentence under 20 words.',
  }

  let p = ''
  if (strategy === 'role') p += roles[task] + '\n\n'
  if (strategy === 'few-shot') {
    p += 'Examples:\n' + examples[task].map(e => '  ' + e).join('\n') + '\n\n'
  }
  if (strategy === 'cot') p += 'Let\'s think step by step.\n\n'
  p += 'Input: ' + input + '\n'
  p += strategy === 'cot' || strategy === 'role' ? '\nReasoning:' : '\nOutput:'
  return p
}

// Simulated model response — clearly rule-based to demonstrate principles
function simulate(task: Task, strategy: Strategy, input: string): string {
  const lower = input.toLowerCase()

  if (task === 'sentiment') {
    const positive = ['amazing', 'great', 'love', 'good', 'excellent', 'best', 'wonderful']
    const negative = ['terrible', 'bad', 'worst', 'hate', 'awful', 'horrible', 'poor']
    const hasPos = positive.some(w => lower.includes(w))
    const hasNeg = negative.some(w => lower.includes(w))
    const verdict = hasPos && hasNeg ? 'MIXED' : hasPos ? 'POSITIVE' : hasNeg ? 'NEGATIVE' : 'NEUTRAL'
    if (strategy === 'cot') {
      return `The input mentions positive cues (${positive.filter(w => lower.includes(w)).join(', ') || 'none'}) and negative cues (${negative.filter(w => lower.includes(w)).join(', ') || 'none'}).\nSince both are present, the sentiment is mixed.\nAnswer: ${verdict}`
    }
    if (strategy === 'zero-shot') return verdict
    if (strategy === 'few-shot') return verdict + ' (matched example pattern)'
    if (strategy === 'role') return verdict
    return verdict
  }

  if (task === 'classify') {
    let cat = 'OTHER'
    if (/ship|deliver|track|arrive|package|order/.test(lower)) cat = 'SHIPPING'
    else if (/invoice|bill|payment|charge|receipt/.test(lower)) cat = 'BILLING'
    else if (/help|issue|problem|broken|fix/.test(lower)) cat = 'SUPPORT'
    else if (/deal|offer|sale|subscribe|discount/.test(lower)) cat = 'MARKETING'
    if (strategy === 'cot') {
      return `The email mentions shipping-related keywords.\nIt is informational about an order status.\nAnswer: ${cat}`
    }
    return cat
  }

  if (task === 'math') {
    // Extract numbers and try to compute
    const nums = input.match(/\d+/g)?.map(Number) ?? []
    if (nums.length >= 2) {
      const a = nums[0], b = nums[1]
      let result: number | null = null
      let work = ''
      if (lower.includes('change') || lower.includes('subtract')) {
        result = b - a * (nums[2] ?? 1)
        work = `Each pencil costs $${a}. ${nums[2] ?? 1} pencils = $${a * (nums[2] ?? 1)}. Paid $${b}. Change = $${b} - $${a * (nums[2] ?? 1)} = $${result}.`
      } else if (lower.includes('*') || lower.includes('times') || lower.includes('multiply')) {
        result = a * b
        work = `${a} × ${b} = ${result}`
      } else {
        result = a + b
        work = `${a} + ${b} = ${result}`
      }
      if (strategy === 'cot') return work + '\nAnswer: ' + result
      if (strategy === 'zero-shot') return String(result)  // often wrong without reasoning!
      if (strategy === 'few-shot') return String(result)
      if (strategy === 'role') return work + '\nAnswer: ' + result
      return String(result)
    }
    return 'Could not parse numbers'
  }

  if (task === 'summarize') {
    const sentences = input.split(/(?<=[.!?])\s+/).filter(Boolean)
    const firstSentence = sentences[0] ?? input
    const words = firstSentence.split(/\s+/).slice(0, 15).join(' ')
    if (strategy === 'cot') {
      return `The input has ${sentences.length} sentences.\nThe first sentence captures the core idea.\nKey concept: ${words}.\nSummary: ${words}.`
    }
    if (strategy === 'role') return words + '.'
    return words  // zero-shot and few-shot often ramble without constraints
  }

  return ''
}

export function PromptSandbox() {
  const [task, setTask] = React.useState<Task>('sentiment')
  const [strategy, setStrategy] = React.useState<Strategy>('zero-shot')
  const [input, setInput] = React.useState(TASKS[0].defaultInput)
  const [output, setOutput] = React.useState<string | null>(null)
  const [prompt, setPrompt] = React.useState<string>('')

  const run = () => {
    const p = buildPrompt(task, strategy, input)
    setPrompt(p)
    setOutput(simulate(task, strategy, input))
  }

  const reset = () => {
    setOutput(null)
    setPrompt('')
  }

  const switchTask = (t: Task) => {
    setTask(t)
    setInput(TASKS.find(x => x.id === t)!.defaultInput)
    setOutput(null)
    setPrompt('')
  }

  return (
    <Card className="border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <MessageSquareCode className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Prompt Engineering Sandbox</CardTitle>
          <Badge variant="outline" className="ml-auto text-[10px]">Educational simulation</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          See how the same input produces different outputs depending on the prompting strategy.
          The model is rule-based (clearly a simulation) but the principles are real.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Task picker */}
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Task</label>
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
            {TASKS.map((t) => (
              <button
                key={t.id}
                onClick={() => switchTask(t.id)}
                className={cn(
                  'rounded border px-2 py-1.5 text-xs transition-colors',
                  task === t.id ? 'border-primary bg-primary/10 text-primary' : 'hover:bg-muted'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Strategy picker */}
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Prompting strategy</label>
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
            {(Object.keys(STRATEGY_INFO) as Strategy[]).map((s) => (
              <button
                key={s}
                onClick={() => setStrategy(s)}
                className={cn(
                  'rounded border px-2 py-1.5 text-xs transition-colors',
                  strategy === s ? 'border-primary bg-primary/10 text-primary' : 'hover:bg-muted'
                )}
              >
                {STRATEGY_INFO[s].label}
              </button>
            ))}
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">{STRATEGY_INFO[strategy].description}</p>
        </div>

        {/* Input */}
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Input</label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            className="text-sm"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={run} className="flex-1">
            <Sparkles className="mr-1.5 h-4 w-4" /> Run prompt
          </Button>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Constructed prompt */}
        {prompt && (
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Prompt sent to model</label>
            <pre className="scrollbar-thin overflow-x-auto rounded-lg border bg-muted/30 p-3 text-xs font-mono whitespace-pre-wrap">{prompt}</pre>
          </div>
        )}

        {/* Output */}
        {output !== null && (
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Model output</label>
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
              <pre className="whitespace-pre-wrap font-mono text-sm">{output}</pre>
            </div>
          </div>
        )}

        {/* Comparison hint */}
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-muted-foreground">
          <strong className="text-amber-700 dark:text-amber-400">Try this:</strong>{' '}
          Run the <strong>Math</strong> task with <strong>zero-shot</strong>, then with <strong>chain-of-thought</strong>.
          Notice how CoT forces the model to show reasoning — and on real LLMs, this often makes the
          difference between a wrong and right answer on multi-step problems.
        </div>
      </CardContent>
    </Card>
  )
}
