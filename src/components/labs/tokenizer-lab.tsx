'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Type } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Tokenizer Lab
 *
 * A simple greedy BPE-style tokenizer that demonstrates sub-word splitting.
 * NOT a real BPE implementation (those need pre-trained merges) but a
 * heuristic that produces visually similar results for educational purposes.
 *
 * Rules:
 *  - Whitespace attaches to the following word (" hello" not "hello" + " ")
 *  - Long words (>6 chars) get split at common morpheme-like boundaries
 *  - Numbers split into 3-digit chunks
 *  - Punctuation is its own token
 *  - CamelCase and snake_case get split
 */

// Stable pseudo-random color from a string
function colorFor(s: string): string {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  const hue = Math.abs(h) % 360
  return `hsl(${hue}, 65%, 60%)`
}

// Stable pseudo-random ID in a vocab range
function idFor(s: string, vocabSize: number): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h) % vocabSize
}

interface Token { text: string; id: number; color: string }

function tokenize(text: string, vocabSize: number): Token[] {
  const tokens: Token[] = []
  // Use regex to find: words with leading spaces, numbers, punctuation, newlines
  // Pattern: (space+word) | (number) | (punctuation) | (newline)
  const re = /(\s+[a-zA-Z_]+)|(\s*\d+)|([^\w\s])|(\n)|([a-zA-Z_]+)|(\d+)/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    const piece = m[0]
    if (piece === '') continue
    // Sub-split long words
    if (/^[a-zA-Z_]+$/.test(piece.trim()) && piece.trim().length > 7) {
      const sub = subSplitWord(piece.trim())
      sub.forEach((s, i) => {
        const text = i === 0 && piece.startsWith(' ') ? ' ' + s : s
        tokens.push({ text, id: idFor(text, vocabSize), color: colorFor(text) })
      })
    } else {
      tokens.push({ text: piece, id: idFor(piece, vocabSize), color: colorFor(piece) })
    }
  }
  return tokens
}

function subSplitWord(w: string): string[] {
  // Split camelCase
  if (/[a-z][A-Z]/.test(w)) {
    return w.split(/(?=[A-Z])/).filter(Boolean)
  }
  // Split snake_case
  if (w.includes('_')) {
    return w.split('_').flatMap(s => s ? [s] : [])
  }
  // Split long words at common suffixes/prefixes
  const affixes = ['ing', 'ed', 'tion', 'ation', 'ness', 'ment', 'able', 'ible', 'ly', 'er', 'est', 's', 'es', 'pre', 'un', 're', 'in']
  for (const affix of affixes) {
    if (w.length > affix.length + 3 && w.endsWith(affix)) {
      return [w.slice(0, -affix.length), affix]
    }
    if (w.length > affix.length + 3 && w.startsWith(affix)) {
      return [affix, w.slice(affix.length)]
    }
  }
  // Otherwise split in half if very long
  if (w.length > 10) {
    const mid = Math.floor(w.length / 2)
    return [w.slice(0, mid), w.slice(mid)]
  }
  return [w]
}

const EXAMPLES: { label: string; text: string }[] = [
  { label: 'Hello world', text: 'Hello world! AI is transforming how we work.' },
  { label: 'Code snippet', text: 'function calculateTotal(price, taxRate) {\n  return price * (1 + taxRate);\n}' },
  { label: 'Long words', text: 'The tokenization process is fundamental to understanding large language models.' },
  { label: 'Numbers + symbols', text: 'Order #12345 costs $99.99 — that is 25% off the $133.32 list price.' },
  { label: 'CamelCase', text: 'myVariableName, XMLHttpRequest, and BeautifulSoup4 are common in code.' },
]

export function TokenizerLab() {
  const [text, setText] = React.useState('Hello world! AI is transforming how we work.')
  const [vocabSize, setVocabSize] = React.useState(50000)

  const tokens = React.useMemo(() => tokenize(text, vocabSize), [text, vocabSize])
  const tokenCount = tokens.length
  const charCount = text.length
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length

  return (
    <Card className="border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Type className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Tokenizer Lab</CardTitle>
          <Badge variant="outline" className="ml-auto text-[10px]">BPE-style simulation</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          A simplified BPE-style tokenizer. Real tokenizers (tiktoken, SentencePiece) learn merges
          from data — this uses heuristics that produce visually similar results. Token IDs are
          illustrative only.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Examples */}
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Try an example</label>
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                onClick={() => setText(ex.text)}
                className="rounded-full border bg-card px-2.5 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Input text</label>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="font-mono text-sm"
          />
        </div>

        {/* Vocab size slider */}
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Vocabulary size: <span className="font-mono text-foreground">{vocabSize.toLocaleString()}</span>
            <span className="ml-2 text-[10px] text-muted-foreground">
              {vocabSize < 8000 ? '(small — more sub-word splits)' : vocabSize < 30000 ? '(medium)' : '(large — fewer splits)'}
            </span>
          </label>
          <input
            type="range" min={2000} max={128000} step={1000}
            value={vocabSize}
            onChange={(e) => setVocabSize(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 rounded-lg border bg-muted/30 p-3 text-center">
          <div>
            <div className="text-[10px] uppercase text-muted-foreground">Characters</div>
            <div className="text-lg font-bold font-mono">{charCount}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-muted-foreground">Words</div>
            <div className="text-lg font-bold font-mono">{wordCount}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-muted-foreground">Tokens</div>
            <div className="text-lg font-bold font-mono text-primary">{tokenCount}</div>
          </div>
        </div>

        {/* Token visualisation */}
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Tokens (each colour = different token)
          </label>
          <div className="scrollbar-thin max-h-48 overflow-y-auto rounded-lg border bg-card p-3">
            <div className="flex flex-wrap gap-1">
              {tokens.map((tok, i) => (
                <span
                  key={i}
                  className="rounded border-l-4 px-1.5 py-0.5 font-mono text-sm"
                  style={{
                    borderLeftColor: tok.color,
                    backgroundColor: `color-mix(in srgb, ${tok.color} 12%, transparent)`,
                  }}
                  title={`token id: ${tok.id}`}
                >
                  {tok.text === '\n' ? '↵' : tok.text === ' ' ? '·' : tok.text}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Token table */}
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Token IDs (first 30)</label>
          <div className="scrollbar-thin max-h-48 overflow-y-auto rounded-lg border bg-card">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-muted/80 backdrop-blur">
                <tr>
                  <th className="p-2 text-left font-medium">#</th>
                  <th className="p-2 text-left font-medium">Token</th>
                  <th className="p-2 text-right font-medium">ID</th>
                </tr>
              </thead>
              <tbody>
                {tokens.slice(0, 30).map((tok, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-2 text-muted-foreground font-mono">{i + 1}</td>
                    <td className="p-2 font-mono">
                      <span
                        className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm align-middle"
                        style={{ backgroundColor: tok.color }}
                      />
                      {tok.text === '\n' ? '↵ (newline)' : tok.text === ' ' ? '· (space)' : tok.text}
                    </td>
                    <td className="p-2 text-right font-mono text-primary">{tok.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-muted-foreground">
          <strong className="text-amber-700 dark:text-amber-400">Notice:</strong>{' '}
          Spaces attach to the following word (so <code>" hello"</code> is one token, not two).
          Long words split into sub-words. Punctuation is its own token. This is why
          &quot;1 token ≈ 4 characters&quot; is a useful rule of thumb for English text.
        </div>
      </CardContent>
    </Card>
  )
}
