'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Sparkles } from 'lucide-react'

/**
 * Educational semantic-search simulation.
 * We precompute tiny 4-dimensional "embeddings" for a small document set.
 * The user's query is mapped to a vector via a deterministic hash-based heuristic,
 * and cosine similarity ranks the documents.
 *
 * The component CLEARLY LABELS this as a simulation — real embeddings come from
 * trained models and are hundreds of dimensions.
 */

interface Doc {
  id: string
  text: string
  // hand-crafted 4-dim "embedding" along axes: [AI, ethics, code, hardware]
  vec: number[]
}

const DOCS: Doc[] = [
  { id: 'd1', text: 'A neural network is a stack of differentiable layers trained by gradient descent.', vec: [0.9, 0.1, 0.3, 0.2] },
  { id: 'd2', text: 'GPUs parallelise matrix multiplications, making deep learning tractable.', vec: [0.7, 0.0, 0.1, 0.95] },
  { id: 'd3', text: 'Bias in training data can lead to unfair model outputs; audit regularly.', vec: [0.5, 0.95, 0.0, 0.0] },
  { id: 'd4', text: 'A transformer uses self-attention to mix information across token positions.', vec: [0.85, 0.05, 0.2, 0.1] },
  { id: 'd5', text: 'In Python, you can call a function with keyword arguments for clarity.', vec: [0.05, 0.0, 0.95, 0.05] },
  { id: 'd6', text: 'LoRA fine-tunes a model by learning low-rank weight deltas — cheap and effective.', vec: [0.8, 0.0, 0.6, 0.4] },
  { id: 'd7', text: 'RAG retrieves relevant documents from a vector database before LLM generation.', vec: [0.7, 0.0, 0.4, 0.1] },
  { id: 'd8', text: 'Quantization reduces model weights from fp16 to int8 or int4 to save memory.', vec: [0.6, 0.0, 0.3, 0.85] },
]

const AXIS_LABELS = ['AI/ML', 'ethics/safety', 'code/programming', 'hardware/compute']

function cosine(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-9)
}

// Naive keyword-based "embedding" — purely educational
function embedQuery(q: string): number[] {
  const lower = q.toLowerCase()
  const keywords: Record<string, number> = {
    ai: 1, ml: 1, neural: 1, model: 0.8, llm: 0.9, transformer: 0.95, attention: 0.9,
    embedding: 0.7, rag: 0.7, retrieval: 0.7, lora: 0.8, fine: 0.6, tune: 0.6, training: 0.7,
    gradient: 0.6, descent: 0.6, deep: 0.7, learning: 0.8,
    bias: 0.9, fairness: 0.9, ethics: 0.95, unfair: 0.9, audit: 0.7,
    python: 0.95, code: 0.9, function: 0.8, programming: 0.95, script: 0.8, api: 0.6,
    gpu: 0.95, tpu: 0.95, hardware: 0.9, memory: 0.7, compute: 0.85, quantization: 0.85, quantize: 0.85,
    document: 0.5, database: 0.7, vector: 0.85,
  }
  const v = [0, 0, 0, 0] // [AI, ethics, code, hardware]
  for (const k in keywords) {
    if (lower.includes(k)) {
      const w = keywords[k]
      if (['bias', 'fairness', 'ethics', 'unfair', 'audit'].includes(k)) v[1] += w
      else if (['python', 'code', 'function', 'programming', 'script', 'api'].includes(k)) v[2] += w
      else if (['gpu', 'tpu', 'hardware', 'memory', 'compute', 'quantization', 'quantize'].includes(k)) v[3] += w
      else v[0] += w
    }
  }
  // normalise so empty query doesn't blow up
  const mag = Math.sqrt(v.reduce((a, b) => a + b * b, 0))
  return mag > 0 ? v.map((x) => x / mag) : v
}

export function SemanticSearchDemo() {
  const [query, setQuery] = React.useState('how do transformers work?')
  const [submitted, setSubmitted] = React.useState('how do transformers work?')

  const qvec = React.useMemo(() => embedQuery(submitted), [submitted])
  const results = React.useMemo(() => {
    return DOCS.map((d) => ({ doc: d, score: cosine(qvec, d.vec) }))
      .sort((a, b) => b.score - a.score)
  }, [qvec])

  return (
    <Card className="my-6 border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Semantic Search Demo</CardTitle>
          <Badge variant="outline" className="ml-auto text-[10px]">Educational Simulation</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          This uses a tiny 4-dimensional hand-crafted embedding (axes: AI, ethics, code, hardware) —
          not a real embedding model. Real embeddings are 384–3072 dimensions and learned from data.
        </p>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <form
          onSubmit={(e) => { e.preventDefault(); setSubmitted(query) }}
          className="flex gap-2"
        >
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask: how does LoRA work, what is GPU, etc."
          />
          <Button type="submit" size="sm"><Search className="h-4 w-4" /></Button>
        </form>

        {/* Query embedding */}
        <div className="rounded-lg border bg-muted/30 p-3">
          <div className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">Query embedding (simulated)</div>
          <div className="flex flex-wrap gap-2 text-xs">
            {AXIS_LABELS.map((label, i) => (
              <span key={label} className="rounded border bg-background px-2 py-1 font-mono">
                {label}: {qvec[i].toFixed(2)}
              </span>
            ))}
          </div>
        </div>

        {/* Ranked results */}
        <div className="space-y-1.5">
          <div className="mb-2 text-[10px] uppercase tracking-wide text-muted-foreground">Ranked documents (cosine similarity)</div>
          {results.map(({ doc, score }, i) => (
            <div
              key={doc.id}
              className="grid grid-cols-[24px_1fr_60px] items-center gap-2 rounded border p-2"
              style={{ opacity: 0.4 + (score * 0.6) }}
            >
              <span className="text-center text-xs font-mono text-muted-foreground">{i + 1}</span>
              <span className="text-xs">{doc.text}</span>
              <span className="text-right font-mono text-xs text-primary">{score.toFixed(3)}</span>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-muted-foreground">
          Notice how a query about &quot;transformers&quot; ranks the AI/ML documents highest
          even though the words don&apos;t perfectly match — that&apos;s semantic search.
        </p>
      </CardContent>
    </Card>
  )
}
