'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BrainCircuit, ChevronRight, MousePointerClick } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Stage {
  id: string
  label: string
  short: string
  detail: string
  example?: string
}

const STAGES: Stage[] = [
  {
    id: 'input',
    label: 'User Input',
    short: 'Raw text from the user',
    detail: 'A string of text typed by the user — for example a question, an instruction, or a partial sentence to complete.',
    example: 'Input: "AI is useful"',
  },
  {
    id: 'tokenizer',
    label: 'Tokenizer',
    short: 'Splits text into tokens',
    detail: 'The tokenizer (commonly BPE or SentencePiece) splits the input string into sub-word tokens. Each token maps to an integer ID drawn from the model\'s vocabulary.',
    example: '"AI is useful" → ["AI", " is", " useful"]',
  },
  {
    id: 'token-ids',
    label: 'Token IDs',
    short: 'Integer look-up keys',
    detail: 'Tokens are converted to integer IDs by looking them up in the vocabulary. These IDs are the only thing the model sees — text is gone from here on.',
    example: '["AI"," is"," useful"] → [12, 41, 87]',
  },
  {
    id: 'embedding',
    label: 'Embedding Layer',
    short: 'IDs → dense vectors',
    detail: 'Each token ID is used to look up a learned row in the embedding matrix. The result is a sequence of dense vectors, one per token, encoding token identity.',
    example: '[12, 41, 87] → [[0.21, …, -0.04], …]',
  },
  {
    id: 'positional',
    label: 'Positional Encoding',
    short: 'Adds order information',
    detail: 'Self-attention is permutation-invariant, so we add positional information (sinusoidal, learned, or RoPE) so the model can distinguish "dog bites man" from "man bites dog".',
    example: 'embedding + pos_encoding[t]',
  },
  {
    id: 'transformer-blocks',
    label: 'Transformer Blocks',
    short: 'Stacked layers',
    detail: 'The token sequence passes through N stacked transformer blocks (typically 12–96). Each block refines the representation by mixing information across positions via self-attention and applying a feed-forward network.',
    example: 'For Llama-3 8B: 32 blocks',
  },
  {
    id: 'self-attention',
    label: 'Self-Attention',
    short: 'Each token looks at all others',
    detail: 'For each token, compute Query, Key, and Value vectors. Attention weights = softmax(Q·Kᵀ / √d_k). The output is a weighted sum of values. This is how tokens "look at" each other.',
    example: 'attention(Q,K,V) = softmax(QKᵀ/√d_k) V',
  },
  {
    id: 'ffn',
    label: 'Feed-Forward Layers',
    short: 'Per-position MLP',
    detail: 'A small MLP applied independently to each position. Typically uses SwiGLU or GELU. This is where most of the model\'s parameters live.',
    example: 'FFN(x) = (SwiGLU(xW1) ⊗ xW3) W2',
  },
  {
    id: 'logits',
    label: 'Output Logits',
    short: 'Unnormalised scores per token',
    detail: 'A final linear layer (often called the LM head) projects the last token\'s hidden state to a vector of size = vocabulary size. Each entry is a raw score (logit) for that token being the next token.',
    example: 'hidden[-1] @ W_head → [vocab_size]',
  },
  {
    id: 'softmax',
    label: 'Probability Distribution',
    short: 'Logits → probabilities',
    detail: 'Softmax converts logits into a probability distribution over the vocabulary. Temperature scales the logits before softmax — low temperature = sharp, high = flat.',
    example: 'p = softmax(logits / T)',
  },
  {
    id: 'selection',
    label: 'Next-Token Selection',
    short: 'Sampling or greedy',
    detail: 'Pick the next token either greedily (argmax), or by sampling (top-k, top-p, temperature). The chosen token is appended to the input and the loop repeats.',
    example: 'next_token = sample(p) or argmax(p)',
  },
  {
    id: 'generated',
    label: 'Generated Text',
    short: 'Decode tokens back to text',
    detail: 'The new token ID is decoded back to text using the inverse vocabulary mapping. The full sequence is shown to the user, and the model loops to produce the next token.',
    example: 'ID 92 → " powerful" → "AI is useful powerful"',
  },
]

export function LLMArchitectureExplorer() {
  const [selected, setSelected] = React.useState<string>('input')
  const current = STAGES.find((s) => s.id === selected)!

  return (
    <Card className="my-6 border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Interactive LLM Architecture Explorer</CardTitle>
          <Badge variant="outline" className="ml-auto text-[10px]">
            <MousePointerClick className="mr-1 h-3 w-3" /> Click a stage
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Trace how a prompt flows through a Transformer-based LLM, from raw text to a generated token.
        </p>
      </CardHeader>
      <CardContent>
        {/* Pipeline diagram */}
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {STAGES.map((s, i) => (
            <React.Fragment key={s.id}>
              <button
                onClick={() => setSelected(s.id)}
                className={cn(
                  'rounded-lg border p-2.5 text-left transition-all hover:border-primary',
                  selected === s.id
                    ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                    : 'bg-card'
                )}
              >
                <div className="text-[10px] font-mono text-muted-foreground">{i + 1}</div>
                <div className="text-xs font-medium leading-tight">{s.label}</div>
                <div className="mt-0.5 line-clamp-2 text-[10px] text-muted-foreground">{s.short}</div>
              </button>
              {i < STAGES.length - 1 && i % 6 === 5 && (
                <div className="col-span-full" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Detail panel */}
        <div className="mt-4 rounded-lg border bg-muted/30 p-4">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-mono text-primary">
              Stage {STAGES.findIndex((s) => s.id === selected) + 1} / {STAGES.length}
            </span>
            <h4 className="font-semibold">{current.label}</h4>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{current.detail}</p>
          {current.example && (
            <pre className="mt-3 overflow-x-auto rounded border bg-background p-2 font-mono text-xs">
              {current.example}
            </pre>
          )}
        </div>

        {/* Walkthrough: AI is useful */}
        <div className="mt-4">
          <h5 className="mb-2 text-sm font-semibold">Walkthrough: processing &quot;AI is useful&quot;</h5>
          <div className="flex flex-wrap items-center gap-1 text-xs">
            {[
              { t: '"AI is useful"', k: 'Input' },
              { t: '["AI"," is"," useful"]', k: 'Tokens' },
              { t: '[12, 41, 87]', k: 'IDs' },
              { t: '[[…768-dim…], …]', k: 'Embed' },
              { t: '+ RoPE[…]', k: 'Position' },
              { t: '32 blocks', k: 'Stack' },
              { t: 'softmax(QKᵀ/√d)V', k: 'Attention' },
              { t: 'SwiGLU(x)', k: 'FFN' },
              { t: '[…vocab…]', k: 'Logits' },
              { t: 'p = softmax', k: 'Probs' },
              { t: 'argmax or sample', k: 'Pick' },
              { t: '" powerful"', k: 'Output' },
            ].map((s, i) => (
              <React.Fragment key={s.k}>
                <span className="rounded border bg-card px-2 py-1 font-mono">
                  <span className="text-primary">{s.k}:</span> {s.t}
                </span>
                {i < 11 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
              </React.Fragment>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Token IDs 12, 41, 87 are illustrative only — actual IDs depend on the tokenizer.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
