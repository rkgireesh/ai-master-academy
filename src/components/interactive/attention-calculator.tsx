'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calculator } from 'lucide-react'

/**
 * Educational attention calculator.
 * Users see 3 tokens with editable Q and K vectors (2-dim for visualisation).
 * The component computes Q·K, scales by sqrt(d_k), applies softmax,
 * and shows the attention weights as a heatmap + bar chart.
 */

const TOKENS = ['cat', 'sat', 'mat']

const DEFAULT_QK = [
  // q, k per token (2-dim for simplicity)
  { q: [1.0, 0.5], k: [0.8, 0.3] },
  { q: [0.2, 1.0], k: [0.4, 0.9] },
  { q: [0.7, 0.7], k: [0.6, 0.6] },
]

export function AttentionCalculator() {
  const [qk, setQk] = React.useState(DEFAULT_QK.map((x) => ({ ...x, q: [...x.q], k: [...x.k] })))

  const dK = 2
  const sqrtDk = Math.sqrt(dK)

  // scores[i][j] = q_i · k_j / sqrt(d_k)
  const scores = React.useMemo(() => {
    return qk.map((qi) =>
      qk.map((kj) => {
        const dot = qi.q[0] * kj.k[0] + qi.q[1] * kj.k[1]
        return dot / sqrtDk
      })
    )
  }, [qk, sqrtDk])

  // softmax along j (keys) for each i (query)
  const weights = React.useMemo(() => {
    return scores.map((row) => {
      const max = Math.max(...row)
      const exps = row.map((s) => Math.exp(s - max))
      const sum = exps.reduce((a, b) => a + b, 0)
      return exps.map((e) => e / sum)
    })
  }, [scores])

  const update = (tokenIdx: number, type: 'q' | 'k', dim: number, value: number) => {
    setQk((prev) =>
      prev.map((p, i) =>
        i === tokenIdx ? { ...p, [type]: p[type].map((v, j) => (j === dim ? value : v)) } as typeof p : p
      )
    )
  }

  return (
    <Card className="my-6 border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Self-Attention Calculator</CardTitle>
          <Badge variant="outline" className="ml-auto text-[10px]">3 tokens, d_k=2</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Edit the Query (Q) and Key (K) vectors for each token. Watch the attention weights update.
          Weights = softmax(Q·Kᵀ / √d_k).
        </p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        {/* Inputs */}
        <div className="grid gap-3 sm:grid-cols-3">
          {TOKENS.map((tok, i) => (
            <div key={tok} className="rounded-lg border p-3">
              <div className="mb-2 font-mono text-xs font-semibold">{tok}</div>
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] uppercase tracking-wide text-muted-foreground">Query Q</label>
                  <div className="flex gap-1">
                    {[0, 1].map((d) => (
                      <input
                        key={d}
                        type="number" step="0.1"
                        value={qk[i].q[d]}
                        onChange={(e) => update(i, 'q', d, Number(e.target.value))}
                        className="w-full rounded border bg-background px-2 py-1 font-mono text-xs"
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wide text-muted-foreground">Key K</label>
                  <div className="flex gap-1">
                    {[0, 1].map((d) => (
                      <input
                        key={d}
                        type="number" step="0.1"
                        value={qk[i].k[d]}
                        onChange={(e) => update(i, 'k', d, Number(e.target.value))}
                        className="w-full rounded border bg-background px-2 py-1 font-mono text-xs"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Score matrix */}
        <div>
          <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Scaled dot-product scores Q·Kᵀ / √d_k
          </h5>
          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs">
              <thead>
                <tr>
                  <th className="p-2 text-left text-muted-foreground">query \ key</th>
                  {TOKENS.map((t) => (
                    <th key={t} className="p-2 font-mono">{t}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TOKENS.map((t, i) => (
                  <tr key={t}>
                    <td className="p-2 text-left font-mono">{t}</td>
                    {scores[i].map((s, j) => (
                      <td key={j} className="p-2 font-mono">{s.toFixed(3)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Attention weights heatmap + bars */}
        <div>
          <h5 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Attention weights (row = softmax over keys for that query)
          </h5>
          <div className="space-y-2">
            {TOKENS.map((t, i) => (
              <div key={t} className="grid grid-cols-[60px_1fr] items-center gap-2">
                <span className="font-mono text-xs">{t} →</span>
                <div className="flex gap-1">
                  {weights[i].map((w, j) => (
                    <div key={j} className="flex-1">
                      <div className="relative h-7 overflow-hidden rounded bg-muted">
                        <div
                          className="h-full bg-primary/70 transition-all"
                          style={{ width: `${Math.max(2, w * 100)}%` }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center font-mono text-[10px]">
                          {(w * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="mt-0.5 text-center text-[10px] text-muted-foreground">
                        → {TOKENS[j]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground">
          Real LLMs use d_k = 64–128 per head, with many heads in parallel (multi-head attention).
          Each head attends to different relationships.
        </p>
      </CardContent>
    </Card>
  )
}
