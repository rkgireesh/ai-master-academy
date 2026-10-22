'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Database, MousePointerClick } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Stage {
  id: string
  label: string
  detail: string
  example?: string
}

const STAGES: Stage[] = [
  { id: 'ingest', label: '1. Document Ingestion', detail: 'PDFs, web pages, wikis, databases are loaded into the pipeline. Source diversity matters.', example: 'Upload employee_handbook.pdf' },
  { id: 'parse', label: '2. Parsing & Cleaning', detail: 'Extract plain text. Strip headers/footers, fix encoding, drop boilerplate. Quality here determines everything downstream.', example: 'pdfplumber → raw text' },
  { id: 'chunk', label: '3. Chunking', detail: 'Split into chunks (200–800 tokens) with overlap. Chunk size trades retrieval precision for context completeness.', example: 'Recursive splitter, 512 tokens, 64 overlap' },
  { id: 'embed', label: '4. Embedding Generation', detail: 'Each chunk is passed through an embedding model (e.g. text-embedding-3-small, bge-large) to produce a dense vector.', example: 'chunk → 1536-dim vector' },
  { id: 'index', label: '5. Vector Indexing', detail: 'Vectors + metadata are stored in a vector DB (Pinecone, Qdrant, pgvector). An HNSW or IVF index enables fast ANN search.', example: 'Qdrant upsert(collection, points)' },
  { id: 'retrieve', label: '6. Retrieval', detail: 'User query is embedded with the same model. Top-k nearest chunks are fetched by cosine similarity.', example: 'search(query_vec, top_k=5)' },
  { id: 'rerank', label: '7. Reranking', detail: 'A cross-encoder (e.g. Cohere Rerank, bge-reranker) scores query-chunk relevance more accurately. Reorder top-k → top-N.', example: 'rerank(query, candidates) → top_3' },
  { id: 'assemble', label: '8. Context Assembly', detail: 'Compose a prompt: system instructions + retrieved chunks (with citations) + the user\'s question.', example: '"Context: {chunks}\n\nQuestion: {q}\nAnswer:"' },
  { id: 'generate', label: '9. LLM Generation', detail: 'The LLM generates an answer grounded in the retrieved context. Prompt explicitly tells it to cite sources.', example: 'LLM(prompt) → answer' },
  { id: 'cite', label: '10. Citations & Delivery', detail: 'Map generated claims back to source chunks. Return answer + citations to the user.', example: '"Answer: ... [1][2]"' },
]

export function RAGDiagram() {
  const [selected, setSelected] = React.useState('ingest')
  const current = STAGES.find((s) => s.id === selected)!

  return (
    <Card className="my-6 border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Interactive RAG Pipeline</CardTitle>
          <Badge variant="outline" className="ml-auto text-[10px]">
            <MousePointerClick className="mr-1 h-3 w-3" /> Click a stage
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          A Retrieval-Augmented Generation system passes user questions through these stages.
          Click each stage to read its role.
        </p>
      </CardHeader>
      <CardContent>
        {/* Vertical pipeline */}
        <div className="space-y-1">
          {STAGES.map((s, i) => (
            <div key={s.id}>
              <button
                onClick={() => setSelected(s.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition-all hover:border-primary',
                  selected === s.id ? 'border-primary bg-primary/10 ring-2 ring-primary/30' : 'bg-card'
                )}
              >
                <span className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-mono',
                  selected === s.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}>
                  {i + 1}
                </span>
                <span className="flex-1 text-sm font-medium">{s.label.replace(/^\d+\. /, '')}</span>
                <span className="hidden text-xs text-muted-foreground sm:block">{s.detail.split('.')[0]}.</span>
              </button>
              {i < STAGES.length - 1 && (
                <div className="ml-3.5 h-2 w-px bg-border" aria-hidden />
              )}
            </div>
          ))}
        </div>

        {/* Detail */}
        <div className="mt-4 rounded-lg border bg-muted/30 p-4">
          <h4 className="font-semibold">{current.label}</h4>
          <p className="mt-2 text-sm text-muted-foreground">{current.detail}</p>
          {current.example && (
            <pre className="mt-3 overflow-x-auto rounded border bg-background p-2 font-mono text-xs">
              {current.example}
            </pre>
          )}
        </div>

        <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs">
          <strong className="text-amber-700 dark:text-amber-500">Why it matters:</strong>{' '}
          RAG grounds LLM answers in your private data, reducing hallucinations and enabling citations
          — without fine-tuning the model.
        </div>
      </CardContent>
    </Card>
  )
}
