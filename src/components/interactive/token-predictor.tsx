'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Play, RotateCcw, ChevronRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Simplified educational simulation of next-token prediction.
 * Clearly labelled as a simulation — no real LLM is used.
 *
 * Walks the user through:
 *   - Tokenization of an input prompt (illustrative BPE-style ids)
 *   - Fake logits over a tiny vocabulary
 *   - Softmax with adjustable temperature
 *   - Top-k filtering
 *   - Sampling a next token
 */

const VOCAB = [
  { id: 12, text: 'AI' },
  { id: 41, text: ' is' },
  { id: 87, text: ' useful' },
  { id: 92, text: ' powerful' },
  { id: 33, text: ' everywhere' },
  { id: 58, text: ' amazing' },
  { id: 71, text: ' complex' },
  { id: 19, text: ' the' },
  { id: 64, text: ' future' },
  { id: 8,  text: ' of' },
  { id: 50, text: ' work' },
]

const BASE_LOGITS: Record<string, number> = {
  ' useful': 4.2,
  ' powerful': 3.8,
  ' amazing': 2.9,
  ' everywhere': 2.4,
  ' complex': 1.9,
  ' the': 1.2,
  ' future': 0.9,
  ' of': 0.6,
  ' work': 0.4,
  ' is': 0.2,
}

function softmax(logits: number[], temperature: number): number[] {
  const t = Math.max(0.05, temperature)
  const max = Math.max(...logits)
  const exps = logits.map((l) => Math.exp((l - max) / t))
  const sum = exps.reduce((a, b) => a + b, 0)
  return exps.map((e) => e / sum)
}

export function TokenPredictor() {
  const [prompt, setPrompt] = React.useState('AI is')
  const [temperature, setTemperature] = React.useState(0.8)
  const [topK, setTopK] = React.useState(3)
  const [generated, setGenerated] = React.useState<string[]>([])
  const [lastProbs, setLastProbs] = React.useState<{ token: string; prob: number }[]>([])
  const [seed, setSeed] = React.useState(0)

  // Fake tokenization: split prompt into space-separated tokens, map to illustrative ids
  const tokenIds = React.useMemo(() => {
    const words = prompt.trim().split(/\s+/).filter(Boolean)
    return words.map((w) => {
      const v = VOCAB.find((x) => x.text.toLowerCase() === w.toLowerCase())
      return v ? v.id : Math.abs(hashString(w)) % 100
    })
  }, [prompt])

  // Fake logits depend on the last word of the prompt
  const logits = React.useMemo(() => {
    const lastWord = prompt.trim().split(/\s+/).pop()?.toLowerCase() ?? ''
    const bias = lastWord === 'ai' ? 0.5 : 0
    return VOCAB.map((v) => (BASE_LOGITS[v.text] ?? 0) + bias + (Math.sin(seed + v.id) * 0.3))
  }, [prompt, seed])

  const probs = React.useMemo(() => softmax(logits, temperature), [logits, temperature])

  const topKIndices = React.useMemo(() => {
    const indexed = probs.map((p, i) => ({ i, p }))
    indexed.sort((a, b) => b.p - a.p)
    return indexed.slice(0, topK).map((x) => x.i)
  }, [probs, topK])

  const topKProbs = React.useMemo(() => {
    return topKIndices.map((i) => ({ token: VOCAB[i].text, prob: probs[i] }))
  }, [topKIndices, probs])

  const step = () => {
    // Renormalise over top-k
    const filtered = topKIndices.map((i) => ({ i, p: probs[i] }))
    const sum = filtered.reduce((a, b) => a + b.p, 0)
    const renorm = filtered.map((x) => ({ ...x, p: x.p / sum }))
    const r = Math.random()
    let acc = 0
    let chosen = renorm[0]
    for (const x of renorm) {
      acc += x.p
      if (r <= acc) {
        chosen = x
        break
      }
    }
    const token = VOCAB[chosen.i].text
    setGenerated((g) => [...g, token])
    setLastProbs(renorm.map((x) => ({ token: VOCAB[x.i].text, prob: x.p })))
    setSeed((s) => s + 1)
    setPrompt((p) => p + token)
  }

  const reset = () => {
    setPrompt('AI is')
    setGenerated([])
    setLastProbs([])
    setSeed(0)
  }

  return (
    <Card className="my-6 border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Next-Token Prediction Simulator</CardTitle>
          <Badge variant="outline" className="ml-auto text-[10px]">Educational Simulation</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          This is a simplified simulation. No real LLM is used. Logits are illustrative only.
        </p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {/* Prompt + tokenization */}
        <div>
          <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Prompt
          </label>
          <Input value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {prompt.trim().split(/\s+/).filter(Boolean).map((w, i) => (
              <span
                key={i}
                className="rounded border bg-muted px-2 py-1 font-mono text-xs"
                title={`illustrative token id: ${tokenIds[i]}`}
              >
                {w} <span className="text-muted-foreground">[{tokenIds[i]}]</span>
              </span>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Temperature: <span className="font-mono text-foreground">{temperature.toFixed(2)}</span>
            </label>
            <input
              type="range" min={0.05} max={2} step={0.05}
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Lower = safer/more deterministic. Higher = more random.
            </p>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Top-k: <span className="font-mono text-foreground">{topK}</span>
            </label>
            <input
              type="range" min={1} max={10} step={1}
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">
              Only sample from the top-k most likely tokens.
            </p>
          </div>
        </div>

        {/* Top-k probability bars */}
        <div>
          <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Top-{topK} next-token probabilities (after softmax + top-k filter)
          </div>
          <div className="space-y-1.5">
            {topKProbs.map(({ token, prob }) => (
              <div key={token} className="flex items-center gap-2">
                <span className="w-20 font-mono text-xs">{token}</span>
                <div className="relative h-5 flex-1 overflow-hidden rounded bg-muted">
                  <div
                    className="h-full bg-primary/70 transition-all"
                    style={{ width: `${Math.max(2, prob * 100)}%` }}
                  />
                </div>
                <span className="w-14 text-right font-mono text-xs text-muted-foreground">
                  {(prob * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Generated text */}
        <div className="rounded-lg border bg-muted/30 p-3">
          <div className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Generated so far
          </div>
          <p className="font-mono text-sm">
            {prompt}
            <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-primary align-middle" />
          </p>
          {lastProbs.length > 0 && (
            <p className="mt-2 text-[11px] text-muted-foreground">
              Last pick probabilities: {lastProbs.map((p) => `${p.token}=${(p.prob * 100).toFixed(0)}%`).join(', ')}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={step} size="sm">
            <Play className="mr-1 h-3.5 w-3.5" /> Generate next token
          </Button>
          <Button onClick={reset} size="sm" variant="outline">
            <RotateCcw className="mr-1 h-3.5 w-3.5" /> Reset
          </Button>
        </div>

        <ol className="space-y-1 text-xs text-muted-foreground">
          <li>1. Prompt is split into tokens (shown above with illustrative IDs).</li>
          <li>2. A Transformer would output a logit per vocabulary token — here we use illustrative logits.</li>
          <li>3. Softmax + temperature converts logits to probabilities.</li>
          <li>4. Top-k keeps only the k most likely tokens; we renormalise.</li>
          <li>5. We sample one token weighted by probability, append it, and repeat.</li>
        </ol>
      </CardContent>
    </Card>
  )
}

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0
  }
  return h
}
