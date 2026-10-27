'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Thermometer } from 'lucide-react'

const TOKENS = [
  { t: 'apple', logit: 4.0 },
  { t: 'fruit', logit: 3.2 },
  { t: 'tree', logit: 2.4 },
  { t: 'pie', logit: 1.6 },
  { t: 'orchard', logit: 1.0 },
  { t: 'mac', logit: 0.4 },
  { t: 'cider', logit: -0.3 },
  { t: 'seed', logit: -1.0 },
]

function softmax(logits: number[], t: number) {
  const tt = Math.max(0.05, t)
  const max = Math.max(...logits)
  const exps = logits.map((l) => Math.exp((l - max) / tt))
  const sum = exps.reduce((a, b) => a + b, 0)
  return exps.map((e) => e / sum)
}

export function TemperatureSampling() {
  const [temp, setTemp] = React.useState(1.0)
  const probs = React.useMemo(() => softmax(TOKENS.map((x) => x.logit), temp), [temp])

  return (
    <Card className="my-6 border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Temperature & Sampling Visualizer</CardTitle>
          <Badge variant="outline" className="ml-auto text-[10px]">Educational</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Watch how temperature reshapes the probability distribution. Low temperature → sharp (greedy).
          High temperature → flat (creative). Logits shown are illustrative.
        </p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Temperature: <span className="font-mono text-foreground">{temp.toFixed(2)}</span>
            <span className="ml-2 text-[11px] text-muted-foreground">
              {temp < 0.3 ? '(near-greedy)' : temp < 0.8 ? '(focused)' : temp < 1.3 ? '(balanced)' : '(creative/random)'}
            </span>
          </label>
          <input
            type="range" min={0.05} max={2} step={0.05}
            value={temp}
            onChange={(e) => setTemp(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        <div className="space-y-1.5">
          {TOKENS.map((tok, i) => (
            <div key={tok.t} className="flex items-center gap-2">
              <span className="w-16 font-mono text-xs">{tok.t}</span>
              <span className="w-12 text-right font-mono text-[10px] text-muted-foreground">logit {tok.logit.toFixed(1)}</span>
              <div className="relative h-5 flex-1 overflow-hidden rounded bg-muted">
                <div
                  className="h-full bg-primary/70 transition-all"
                  style={{ width: `${Math.max(1, probs[i] * 100)}%` }}
                />
              </div>
              <span className="w-14 text-right font-mono text-xs">{(probs[i] * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>

        <div className="grid gap-2 text-[11px] text-muted-foreground sm:grid-cols-2">
          <div className="rounded border p-2">
            <strong className="text-foreground">T → 0:</strong> argmax — always picks the top token.
            Output is deterministic. Good for coding, math, factual QA.
          </div>
          <div className="rounded border p-2">
            <strong className="text-foreground">T = 1:</strong> original distribution. Balanced.
          </div>
          <div className="rounded border p-2">
            <strong className="text-foreground">T &gt; 1:</strong> flattens — low-probability tokens get picked more.
            More creative, more prone to errors.
          </div>
          <div className="rounded border p-2">
            <strong className="text-foreground">Top-k / Top-p:</strong> additional filters that truncate
            the distribution before sampling. Combine with temperature for fine control.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
