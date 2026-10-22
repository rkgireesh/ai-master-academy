'use client'

import * as React from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  code: string
  lang?: string
  caption?: string
  className?: string
}

export function CodeBlock({ code, lang = 'python', caption, className }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* ignore */
    }
  }

  return (
    <figure className={cn('my-4 overflow-hidden rounded-lg border bg-muted/30', className)}>
      <div className="flex items-center justify-between border-b bg-muted/50 px-3 py-1.5">
        <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
          {lang}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="scrollbar-thin overflow-x-auto p-4 text-sm leading-6">
        <code className="font-mono">{code}</code>
      </pre>
      {caption && (
        <figcaption className="border-t bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
