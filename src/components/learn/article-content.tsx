'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { CodeBlock } from './code-block'
import { InteractiveComponent } from '@/components/interactive/registry'
import type { ContentBlock } from '@/data/types'
import { Info, Lightbulb, AlertTriangle, AlertCircle, Quote } from 'lucide-react'

interface ArticleContentProps {
  blocks: ContentBlock[]
  className?: string
}

export function ArticleContent({ blocks, className }: ArticleContentProps) {
  return (
    <div className={cn('prose-ai max-w-none', className)}>
      {blocks.map((block, i) => (
        <BlockRenderer key={i} block={block} />
      ))}
    </div>
  )
}

function BlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'p':
      return <p>{block.text}</p>
    case 'h':
      return <h2 id={slug(block.text)}>{block.text}</h2>
    case 'h3':
      return <h3 id={slug(block.text)}>{block.text}</h3>
    case 'ul':
      return (
        <ul>
          {block.items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      )
    case 'ol':
      return (
        <ol>
          {block.items.map((item, i) => <li key={i}>{item}</li>)}
        </ol>
      )
    case 'code':
      return <CodeBlock code={block.code} lang={block.lang} caption={block.caption} />
    case 'callout':
      return <Callout variant={block.variant} title={block.title} text={block.text} />
    case 'table':
      return (
        <figure className="my-4">
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  {block.headers.map((h, i) => <th key={i}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => <td key={j}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.caption && (
            <figcaption className="mt-1 text-xs text-muted-foreground">{block.caption}</figcaption>
          )}
        </figure>
      )
    case 'diagram':
      return <DiagramPlaceholder diagramId={block.diagramId} caption={block.caption} />
    case 'interactive':
      return (
        <div>
          <InteractiveComponent componentId={block.componentId} />
          {block.caption && (
            <p className="mt-1 text-xs text-muted-foreground">{block.caption}</p>
          )}
        </div>
      )
    case 'quote':
      return (
        <blockquote>
          <Quote className="mb-1 inline h-4 w-4 text-muted-foreground" /> {block.text}
          {block.cite && <cite className="block text-xs">— {block.cite}</cite>}
        </blockquote>
      )
    case 'example':
      return (
        <div className="my-4 rounded-lg border border-primary/30 bg-primary/5 p-3">
          {block.title && <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">{block.title}</div>}
          <p className="m-0 text-sm">{block.text}</p>
        </div>
      )
    default:
      return null
  }
}

function Callout({ variant, title, text }: { variant: 'info' | 'warning' | 'tip' | 'danger'; title?: string; text: string }) {
  const styles = {
    info:    { icon: Info,        cls: 'border-blue-500/30 bg-blue-500/5 text-blue-700 dark:text-blue-300' },
    warning: { icon: AlertTriangle, cls: 'border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-300' },
    tip:     { icon: Lightbulb,   cls: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300' },
    danger:  { icon: AlertCircle, cls: 'border-rose-500/30 bg-rose-500/5 text-rose-700 dark:text-rose-300' },
  }[variant]
  const Icon = styles.icon
  return (
    <div className={cn('my-4 flex gap-3 rounded-lg border p-3', styles.cls)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="flex-1 text-sm">
        {title && <div className="mb-0.5 font-semibold">{title}</div>}
        <div>{text}</div>
      </div>
    </div>
  )
}

function DiagramPlaceholder({ diagramId, caption }: { diagramId: string; caption?: string }) {
  // Simple inline diagrams rendered as styled boxes for known diagram ids.
  if (diagramId === 'neural-net-layers') {
    return (
      <figure className="my-4 rounded-lg border bg-muted/30 p-4">
        <div className="flex items-center justify-center gap-2 font-mono text-xs">
          <div className="rounded border bg-card p-2">Input<br/>x ∈ ℝ⁷⁸⁴</div>
          <span>→</span>
          <div className="rounded border bg-card p-2">Hidden 1<br/>W₁, b₁<br/>σ</div>
          <span>→</span>
          <div className="rounded border bg-card p-2">Hidden 2<br/>W₂, b₂<br/>σ</div>
          <span>→</span>
          <div className="rounded border bg-card p-2">Output<br/>W₃, b₃<br/>softmax</div>
        </div>
        {caption && <figcaption className="mt-2 text-center text-xs text-muted-foreground">{caption}</figcaption>}
      </figure>
    )
  }
  return (
    <figure className="my-4 rounded-lg border border-dashed bg-muted/30 p-4 text-center text-xs text-muted-foreground">
      [Diagram: {diagramId}]
      {caption && <figcaption className="mt-1">{caption}</figcaption>}
    </figure>
  )
}

function slug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
