'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Grid3x3 } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Attention Heatmap Lab
 *
 * Visualise self-attention weights for a sentence. We use a deterministic
 * Q/K/V generator based on character n-grams so the patterns are
 * interpretable. The math (Q·Kᵀ / √d_k, then softmax) is real.
 */

function tokenize(text: string): string[] {
  // Simple word-level tokenization (keeps punctuation attached)
  return text.trim().split(/\s+/).filter(Boolean).slice(0, 12)
}

// Deterministic Q/K generator: each token gets a vector based on character n-grams
// This produces interpretable patterns where similar tokens attend to each other.
function tokenVector(token: string, dim: number, kind: 'q' | 'k'): number[] {
  const v = new Array(dim).fill(0)
  const lower = token.toLowerCase()
  // Hash each character + bigram into a vector slot
  for (let i = 0; i < lower.length; i++) {
    const c = lower.charCodeAt(i)
    v[c % dim] += kind === 'q' ? 1 : 0.7
    if (i < lower.length - 1) {
      const bigram = lower.charCodeAt(i) * 31 + lower.charCodeAt(i + 1)
      v[bigram % dim] += kind === 'k' ? 1 : 0.5
    }
  }
  // Position signal — earlier tokens have higher Q for "k" dimension
  // (this creates positional attention patterns like real transformers)
  return v
}

function softmax(arr: number[]): number[] {
  const max = Math.max(...arr)
  const exps = arr.map((x) => Math.exp(x - max))
  const sum = exps.reduce((a, b) => a + b, 0)
  return exps.map((e) => e / sum)
}

function attention(tokens: string[], temperature: number): number[][] {
  const dim = 16
  const sqrtDk = Math.sqrt(dim)
  const Qs = tokens.map((t) => tokenVector(t, dim, 'q'))
  const Ks = tokens.map((t) => tokenVector(t, dim, 'k'))
  // Score matrix
  const weights = tokens.map((_, i) => {
    const scores = tokens.map((_, j) => {
      let dot = 0
      for (let d = 0; d < dim; d++) dot += Qs[i][d] * Ks[j][d]
      return dot / sqrtDk / Math.max(0.05, temperature)
    })
    return softmax(scores)
  })
  return weights
}

function colorForWeight(w: number): string {
  // 0 = transparent, 1 = strong violet
  const alpha = w
  return `rgba(124, 92, 255, ${alpha})`
}

export function AttentionHeatmapLab() {
  const [text, setText] = React.useState('The cat sat on the mat')
  const [temperature, setTemperature] = React.useState(1)
  const [hoverCell, setHoverCell] = React.useState<{ i: number; j: number } | null>(null)

  const tokens = React.useMemo(() => tokenize(text), [text])
  const weights = React.useMemo(() => attention(tokens, temperature), [tokens, temperature])

  return (
    <Card className="border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Grid3x3 className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Self-Attention Heatmap</CardTitle>
          <Badge variant="outline" className="ml-auto text-[10px]">d_k = 16 · max 12 tokens</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Each row is a query token; each column is a key token. Cell colour = attention weight
          (softmax(Q·Kᵀ/√d_k/T)). Brighter = stronger attention. Hover for exact values.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Sentence</label>
          <Input value={text} onChange={(e) => setText(e.target.value)} maxLength={120} />
          <p className="mt-1 text-[10px] text-muted-foreground">
            {tokens.length} tokens (capped at 12 for visualisation)
          </p>
        </div>

        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Temperature: <span className="font-mono text-foreground">{temperature.toFixed(2)}</span>
            <span className="ml-2 text-[10px] text-muted-foreground">
              {temperature < 0.5 ? '(sharp — near-greedy)' : temperature < 1.2 ? '(balanced)' : '(flat — diffuse attention)'}
            </span>
          </label>
          <input
            type="range" min={0.1} max={3} step={0.05}
            value={temperature}
            onChange={(e) => setTemperature(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        {/* Heatmap */}
        <div className="scrollbar-thin overflow-x-auto rounded-lg border bg-card p-3">
          {tokens.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground">Type a sentence above.</div>
          ) : (
            <table className="border-collapse">
              <thead>
                <tr>
                  <th className="p-1"></th>
                  {tokens.map((t, j) => (
                    <th key={j} className="p-1 text-[10px] font-mono text-muted-foreground" style={{ maxWidth: 60 }}>
                      <div className="rotate-[-30deg] origin-bottom-left whitespace-nowrap text-left">
                        {t}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tokens.map((qt, i) => (
                  <tr key={i}>
                    <td className="p-1 text-right text-[10px] font-mono text-muted-foreground whitespace-nowrap" style={{ maxWidth: 80 }}>
                      {qt}
                    </td>
                    {tokens.map((kt, j) => {
                      const w = weights[i]?.[j] ?? 0
                      const isHover = hoverCell?.i === i && hoverCell?.j === j
                      return (
                        <td
                          key={j}
                          onMouseEnter={() => setHoverCell({ i, j })}
                          onMouseLeave={() => setHoverCell(null)}
                          className={cn(
                            'relative cursor-pointer border border-border/50 transition-transform',
                            isHover && 'scale-110 z-10'
                          )}
                          style={{
                            backgroundColor: colorForWeight(w),
                            width: 32,
                            height: 32,
                          }}
                          title={`${qt} → ${kt}: ${(w * 100).toFixed(1)}%`}
                        />
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Hover detail */}
        <div className="rounded-lg border bg-muted/30 p-3 text-sm">
          {hoverCell ? (
            <div>
              <span className="font-mono text-primary">{tokens[hoverCell.i]}</span>
              <span className="mx-2 text-muted-foreground">→ attends to →</span>
              <span className="font-mono text-primary">{tokens[hoverCell.j]}</span>
              <span className="ml-3 font-mono text-lg font-bold">
                {((weights[hoverCell.i]?.[hoverCell.j] ?? 0) * 100).toFixed(2)}%
              </span>
            </div>
          ) : (
            <div className="text-muted-foreground">
              Hover any cell in the heatmap to see the exact attention weight.
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>Weight:</span>
          <div className="h-3 w-32 rounded" style={{
            background: 'linear-gradient(to right, rgba(124,92,255,0), rgba(124,92,255,1))'
          }} />
          <span>0%</span>
          <span className="ml-auto">100%</span>
        </div>

        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-muted-foreground">
          <strong className="text-amber-700 dark:text-amber-400">Try this:</strong>{' '}
          Type a sentence with repeated words like <code>&quot;the cat chased the dog and the cat ran&quot;</code>.
          Notice how every <code>&quot;the&quot;</code> token attends strongly to other <code>&quot;the&quot;</code>s —
          that&apos;s character-level similarity in the Q/K vectors. Real LLMs learn richer patterns
          (syntax, coreference) but the mechanism is the same.
        </div>
      </CardContent>
    </Card>
  )
}
