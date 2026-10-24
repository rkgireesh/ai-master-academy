'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Database, Search, Sparkles, FileText, Scissors } from 'lucide-react'

/**
 * RAG Sandbox
 *
 * A full RAG pipeline running in the browser:
 *   1. Paste a document
 *   2. Chunk it (with adjustable size + overlap)
 *   3. Generate simple heuristic embeddings
 *   4. Embed the query
 *   5. Retrieve top-k chunks by cosine similarity
 *   6. Show the assembled prompt
 *   7. Generate a template-based answer with citations
 *
 * Clearly labelled as educational simulation — real RAG uses trained
 * embedding models and an LLM for generation.
 */

interface Chunk { id: number; text: string; embedding: number[] }

// Heuristic 6-dimensional "embedding"
// axes: [AI, code, data, business, science, people]
function embed(text: string): number[] {
  const lower = text.toLowerCase()
  const keywords: Record<string, number[]> = {
    ai: [1,0,0,0,0,0], ml: [1,0,0,0,0,0], model: [0.9,0,0.2,0,0,0], neural: [1,0,0,0,0,0], llm: [1,0.2,0,0,0,0],
    transformer: [1,0.2,0,0,0,0], attention: [1,0,0,0,0,0], training: [0.8,0,0.3,0,0,0],
    code: [0,1,0,0,0,0], python: [0,1,0,0,0,0], function: [0,1,0,0,0,0], api: [0.2,1,0,0.3,0,0],
    database: [0,0.5,1,0,0,0], query: [0,0.5,1,0,0,0], sql: [0,0.8,1,0,0,0], vector: [0.7,0,1,0,0,0],
    data: [0,0,1,0,0,0], dataset: [0,0,1,0,0,0], embedding: [0.7,0,1,0,0,0], retrieval: [0.5,0,1,0,0,0],
    business: [0,0,0,1,0,0], customer: [0,0,0.3,1,0,0], market: [0,0,0,1,0,0], revenue: [0,0,0,1,0,0],
    science: [0,0,0,0,1,0], research: [0.5,0,0,0,1,0], experiment: [0,0,0,0,1,0], study: [0,0,0,0,1,0],
    people: [0,0,0,0,0,1], user: [0,0,0.2,0.3,0,1], team: [0,0,0,0.3,0,1], human: [0.2,0,0,0,0,1],
  }
  const v = [0, 0, 0, 0, 0, 0]
  for (const k in keywords) {
    if (lower.includes(k)) {
      const w = keywords[k]
      for (let i = 0; i < 6; i++) v[i] += w[i]
    }
  }
  // Normalise
  const mag = Math.sqrt(v.reduce((a, b) => a + b * b, 0))
  return mag > 0 ? v.map(x => x / mag) : v
}

function cosine(a: number[], b: number[]): number {
  let dot = 0, na = 0, nb = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-9)
}

// Chunk by sentences, group into chunks of ~chunkSize words with overlap
function chunkText(text: string, chunkSize: number, overlap: number): string[] {
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean)
  const chunks: string[] = []
  let i = 0
  while (i < sentences.length) {
    let words = 0
    const end: number[] = []
    while (i < sentences.length && words < chunkSize) {
      end.push(i)
      words += sentences[i].split(/\s+/).length
      i++
    }
    chunks.push(end.map(idx => sentences[idx]).join(' '))
    // Backtrack for overlap
    if (i < sentences.length) {
      i = Math.max(i - overlap, i)
    }
  }
  return chunks.filter(c => c.trim().length > 0)
}

const SAMPLE_DOC = `Transformers are a neural network architecture introduced in 2017.
They rely entirely on self-attention, with no recurrence or convolution.
The transformer model uses queries, keys, and values to compute attention weights.
Each token attends to all other tokens in the input sequence.
Multi-head attention runs several attention operations in parallel.
The transformer architecture powers modern large language models like GPT and BERT.
Training a transformer requires large datasets and significant compute.
The model learns by predicting the next token in a sequence.
Pretraining is followed by fine-tuning on specific tasks.
Fine-tuning adjusts a small subset of weights to specialise the model.
LoRA is a parameter-efficient fine-tuning technique.
It learns low-rank weight deltas instead of updating all parameters.
Quantization reduces model precision from fp16 to int8 or int4.
This makes inference faster and cheaper on consumer hardware.
KV caching speeds up autoregressive generation by storing attention keys and values.`

interface RetrievedChunk { chunk: Chunk; score: number; rank: number }

export function RAGSandbox() {
  const [doc, setDoc] = React.useState(SAMPLE_DOC)
  const [chunkSize, setChunkSize] = React.useState(40)
  const [overlap, setOverlap] = React.useState(1)
  const [query, setQuery] = React.useState('How does LoRA fine-tuning work?')
  const [topK, setTopK] = React.useState(3)

  const [stage, setStage] = React.useState<'idle' | 'chunked' | 'embedded' | 'retrieved' | 'answered'>('idle')
  const [chunks, setChunks] = React.useState<Chunk[]>([])
  const [retrieved, setRetrieved] = React.useState<RetrievedChunk[]>([])
  const [answer, setAnswer] = React.useState<string>('')
  const [assembledPrompt, setAssembledPrompt] = React.useState<string>('')

  const runRAG = () => {
    // Stage 1: Chunk
    const chunkTexts = chunkText(doc, chunkSize, overlap)
    const chunkObjs: Chunk[] = chunkTexts.map((text, i) => ({
      id: i, text, embedding: embed(text),
    }))
    setChunks(chunkObjs)
    setStage('chunked')

    // Stage 2: Embed query (already done in chunkObjs)
    setTimeout(() => setStage('embedded'), 100)

    // Stage 3: Retrieve
    const qvec = embed(query)
    const scored = chunkObjs
      .map(c => ({ chunk: c, score: cosine(qvec, c.embedding), rank: 0 }))
      .sort((a, b) => b.score - a.score)
    scored.forEach((r, i) => r.rank = i + 1)
    const top = scored.slice(0, topK)
    setRetrieved(top)
    setTimeout(() => setStage('retrieved'), 200)

    // Stage 4: Assemble prompt
    const context = top.map((r, i) => `[${i + 1}] ${r.chunk.text}`).join('\n\n')
    const prompt = `Use the following context to answer the question. Cite sources with [1], [2], etc.

Context:
${context}

Question: ${query}

Answer:`
    setAssembledPrompt(prompt)

    // Stage 5: Generate (template-based simulation)
    // Extract sentences from top chunks that share keywords with the query
    const queryWords = query.toLowerCase().split(/\W+/).filter(w => w.length > 3)
    const relevantSentences: { text: string; chunkIdx: number }[] = []
    top.forEach((r, i) => {
      const sentences = r.chunk.text.split(/(?<=[.!?])\s+/)
      for (const s of sentences) {
        const sLower = s.toLowerCase()
        if (queryWords.some(w => sLower.includes(w))) {
          relevantSentences.push({ text: s, chunkIdx: i + 1 })
        }
      }
    })

    let generated: string
    if (relevantSentences.length > 0) {
      generated = relevantSentences.slice(0, 3)
        .map(r => `${r.text} [${r.chunkIdx}]`)
        .join(' ')
    } else if (top.length > 0) {
      generated = `Based on the retrieved context: ${top[0].chunk.text.split(/(?<=[.!?])\s+/)[0]} [1]`
    } else {
      generated = 'I could not find relevant information in the provided document.'
    }
    setAnswer(generated)
    setTimeout(() => setStage('answered'), 300)
  }

  const reset = () => {
    setStage('idle')
    setChunks([])
    setRetrieved([])
    setAnswer('')
    setAssembledPrompt('')
  }

  return (
    <Card className="border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">RAG Sandbox</CardTitle>
          <Badge variant="outline" className="ml-auto text-[10px]">Full pipeline · educational simulation</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Paste a document, ask a question, and watch every stage of the RAG pipeline execute.
          Embeddings use a 6-dimensional heuristic (not a real model). Generation is template-based.
          Real RAG uses trained embedding models + an LLM.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Document input */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Source document</label>
            <button onClick={() => setDoc(SAMPLE_DOC)} className="text-[10px] text-primary hover:underline">Load sample</button>
          </div>
          <Textarea
            value={doc}
            onChange={(e) => setDoc(e.target.value)}
            rows={5}
            className="text-sm"
          />
        </div>

        {/* Chunk controls */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Chunk size: <span className="font-mono text-foreground">{chunkSize} words</span>
            </label>
            <input type="range" min={15} max={120} step={5} value={chunkSize}
              onChange={(e) => setChunkSize(Number(e.target.value))}
              className="w-full accent-primary" />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Overlap: <span className="font-mono text-foreground">{overlap} sentences</span>
            </label>
            <input type="range" min={0} max={3} step={1} value={overlap}
              onChange={(e) => setOverlap(Number(e.target.value))}
              className="w-full accent-primary" />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Top-k: <span className="font-mono text-foreground">{topK}</span>
            </label>
            <input type="range" min={1} max={6} step={1} value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="w-full accent-primary" />
          </div>
        </div>

        {/* Query input */}
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Question</label>
          <Input value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        <div className="flex gap-2">
          <Button onClick={runRAG} className="flex-1">
            <Search className="mr-1.5 h-4 w-4" /> Run RAG pipeline
          </Button>
          <Button onClick={reset} variant="outline">Reset</Button>
        </div>

        {/* Pipeline stages */}
        {stage !== 'idle' && (
          <div className="space-y-4">
            {/* Stage 1: Chunks */}
            <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-3 transition-all">
              <div className="mb-2 flex items-center gap-2">
                <Scissors className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-semibold">Stage 1: Chunking</span>
                <Badge variant="outline" className="text-[10px]">{chunks.length} chunks</Badge>
              </div>
              <div className="scrollbar-thin max-h-32 space-y-1 overflow-y-auto">
                {chunks.map((c, i) => (
                  <div key={i} className="rounded border bg-card p-2 text-xs">
                    <span className="mr-2 font-mono text-[10px] text-muted-foreground">#{i + 1}</span>
                    {c.text.length > 120 ? c.text.slice(0, 120) + '…' : c.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Stage 2: Embeddings */}
            {['embedded', 'retrieved', 'answered'].includes(stage) && (
              <div className="rounded-lg border border-blue-500/40 bg-blue-500/5 p-3 transition-all">
                <div className="mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-semibold">Stage 2: Embeddings (6-dim heuristic)</span>
                </div>
                <div className="scrollbar-thin max-h-32 space-y-1 overflow-y-auto">
                  {chunks.slice(0, 5).map((c, i) => (
                    <div key={i} className="rounded border bg-card p-2 text-xs font-mono">
                      <span className="mr-2 text-[10px] text-muted-foreground">#{i + 1}</span>
                      [{c.embedding.map(v => v.toFixed(2)).join(', ')}]
                    </div>
                  ))}
                  {chunks.length > 5 && <div className="text-[10px] text-muted-foreground">+ {chunks.length - 5} more</div>}
                </div>
              </div>
            )}

            {/* Stage 3: Retrieval */}
            {['retrieved', 'answered'].includes(stage) && (
              <div className="rounded-lg border border-violet-500/40 bg-violet-500/5 p-3 transition-all">
                <div className="mb-2 flex items-center gap-2">
                  <Search className="h-4 w-4 text-violet-500" />
                  <span className="text-sm font-semibold">Stage 3: Retrieval (cosine similarity)</span>
                </div>
                <div className="space-y-1">
                  {retrieved.map((r, i) => (
                    <div key={i} className="rounded border bg-card p-2 text-xs">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-mono text-[10px] text-muted-foreground">rank {r.rank}</span>
                        <Badge variant="outline" className="text-[10px] font-mono">score: {r.score.toFixed(3)}</Badge>
                      </div>
                      {r.chunk.text.length > 160 ? r.chunk.text.slice(0, 160) + '…' : r.chunk.text}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stage 4: Assembled prompt */}
            {stage === 'answered' && (
              <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-3 transition-all">
                <div className="mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-semibold">Stage 4: Assembled prompt → LLM</span>
                </div>
                <pre className="scrollbar-thin max-h-48 overflow-y-auto rounded bg-card p-2 text-[11px] font-mono whitespace-pre-wrap">{assembledPrompt}</pre>
              </div>
            )}

            {/* Stage 5: Answer */}
            {stage === 'answered' && (
              <div className="rounded-lg border border-primary/40 bg-primary/5 p-3 transition-all">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">Stage 5: Generated answer (with citations)</span>
                </div>
                <p className="text-sm leading-6">{answer}</p>
              </div>
            )}
          </div>
        )}

        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-muted-foreground">
          <strong className="text-amber-700 dark:text-amber-400">Try this:</strong>{' '}
          Ask &quot;How does attention work?&quot; then ask &quot;What is quantization?&quot;.
          Notice how different questions retrieve different chunks even though the document is the same.
          Now change chunk size to 15 words and re-run — small chunks retrieve more precisely but
          lose context. That is the chunk-size trade-off in production RAG.
        </div>
      </CardContent>
    </Card>
  )
}
