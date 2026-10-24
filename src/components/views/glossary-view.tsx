'use client'

import * as React from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { glossary } from '@/data'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { AnimatedCounter } from '@/components/dashboard/animated-counter'
import { Search, BookMarked, ArrowRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

// ---- Category symbols + colors + gradients ----
interface CategoryStyle {
  symbol: string
  color: string       // text color
  border: string      // border + bg tint
  gradient: string    // gradient for chips
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  'AI Fundamentals':  { symbol: '🤖', color: 'text-blue-700 dark:text-blue-300',     border: 'border-blue-500/30 bg-blue-500/5',     gradient: 'from-blue-500 to-violet-500' },
  'Machine Learning': { symbol: '📈', color: 'text-violet-700 dark:text-violet-300', border: 'border-violet-500/30 bg-violet-500/5', gradient: 'from-violet-500 to-purple-500' },
  'Deep Learning':    { symbol: '🧠', color: 'text-fuchsia-700 dark:text-fuchsia-300',border: 'border-fuchsia-500/30 bg-fuchsia-500/5',gradient: 'from-fuchsia-500 to-pink-500' },
  'Generative AI':    { symbol: '✨', color: 'text-pink-700 dark:text-pink-300',     border: 'border-pink-500/30 bg-pink-500/5',     gradient: 'from-pink-500 to-rose-500' },
  'LLM':              { symbol: '💬', color: 'text-cyan-700 dark:text-cyan-300',     border: 'border-cyan-500/30 bg-cyan-500/5',     gradient: 'from-cyan-500 to-blue-500' },
  'RAG':              { symbol: '🔍', color: 'text-teal-700 dark:text-teal-300',     border: 'border-teal-500/30 bg-teal-500/5',     gradient: 'from-teal-500 to-cyan-500' },
  'Embeddings':       { symbol: '📐', color: 'text-emerald-700 dark:text-emerald-300',border: 'border-emerald-500/30 bg-emerald-500/5',gradient: 'from-emerald-500 to-teal-500' },
  'Agents':           { symbol: '🤝', color: 'text-orange-700 dark:text-orange-300', border: 'border-orange-500/30 bg-orange-500/5', gradient: 'from-orange-500 to-amber-500' },
  'Tools & MCP':      { symbol: '🔧', color: 'text-rose-700 dark:text-rose-300',     border: 'border-rose-500/30 bg-rose-500/5',     gradient: 'from-rose-500 to-red-500' },
  'Multi-Agent':      { symbol: '🕸️', color: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-500/30 bg-indigo-500/5', gradient: 'from-indigo-500 to-purple-500' },
  'Production':       { symbol: '🚀', color: 'text-amber-700 dark:text-amber-300',   border: 'border-amber-500/30 bg-amber-500/5',   gradient: 'from-amber-500 to-orange-500' },
}

function getStyle(category: string): CategoryStyle {
  return CATEGORY_STYLES[category] ?? { symbol: '📌', color: '', border: '', gradient: 'from-primary to-primary/60' }
}

// ---- Per-term symbol lookup (based on common AI terms) ----
const TERM_SYMBOLS: Record<string, string> = {
  // Fundamentals
  'AGI': '🧠', 'ANI': '⚙️', 'Activation Function': '⚡', 'Agent': '🤝', 'Agentic AI': '🤖',
  'ANNS': '🗺️', 'Attention': '👁️', 'Autoregressive': '🔄', 'Backpropagation': '↩️',
  'Batch Size': '📦', 'BPE': '✂️', 'Chunking': '🧩', 'Context Window': '🪟', 'Cosine Similarity': '📐',
  'Cross-Entropy': '🎯', 'Diffusion Model': '🌊', 'Embedding': '🔢', 'Episodic Memory': '📼',
  'Fine-Tuning': '🔧', 'Foundation Model': '🏛️', 'Function Calling': '📞', 'GAN': '🎭',
  'Gradient Descent': '📉', 'Hallucination': ' Mirage', 'HNSW': '🕸️', 'Inference': '⚡',
  'KV Cache': '💾', 'LoRA': '🎯', 'LLM': '💬', 'Loss Function': '📏', 'MCP': '🔌',
  'Multi-Head Attention': '🐙', 'Multimodal': '🌈', 'Next-Token Prediction': '🔮',
  'Overfitting': '🎭', 'Positional Encoding': '📍', 'Pretraining': '📚', 'Quantization': '🗜️',
  'QLoRA': '🗜️', 'RAG': '🔍', 'ReAct': '💭', 'ReLU': '⚡', 'RLHF': '🎓', 'Reranking': '🏆',
  'Sampling': '🎲', 'Self-Attention': '👁️', 'Semantic Search': '🔎', 'Softmax': '📊',
  'Stop Sequence': '🛑', 'Temperature': '🌡️', 'Token': '🔤', 'Tokenization': '✂️',
  'Tool Calling': '🔧', 'Transformer': '🤖', 'Underfitting': '📉', 'VAE': '🎨',
  'Vector Database': '🗄️', 'Zero-Shot': '0️⃣', 'Few-Shot': '1️⃣',
}

function getTermSymbol(term: string): string {
  return TERM_SYMBOLS[term] ?? '📌'
}

// Rotating hero symbols for the header
const HERO_SYMBOLS = ['🤖', '🧠', '✨', '💬', '🔍', '🔧', '🚀', '📐']

export function GlossaryView() {
  const navigate = useAppStore((s) => s.navigate)
  const [query, setQuery] = React.useState('')
  const [activeCategory, setActiveCategory] = React.useState<string>('All')
  const [heroSymbolIdx, setHeroSymbolIdx] = React.useState(0)

  // Rotate hero symbol every 2 seconds
  React.useEffect(() => {
    const t = setInterval(() => {
      setHeroSymbolIdx((i) => (i + 1) % HERO_SYMBOLS.length)
    }, 2000)
    return () => clearInterval(t)
  }, [])

  const categories = ['All', ...Array.from(new Set(glossary.map((g) => g.category))).sort()]

  const filtered = React.useMemo(() => {
    return glossary.filter((g) => {
      const matchCategory = activeCategory === 'All' || g.category === activeCategory
      const q = query.toLowerCase()
      const matchQuery = !q ||
        g.term.toLowerCase().includes(q) ||
        g.short.toLowerCase().includes(q) ||
        g.detailed.toLowerCase().includes(q)
      return matchCategory && matchQuery
    })
  }, [query, activeCategory])

  // Group by first letter
  const grouped = React.useMemo(() => {
    const map = new Map<string, typeof glossary>()
    for (const entry of filtered) {
      const letter = entry.term[0].toUpperCase()
      if (!map.has(letter)) map.set(letter, [])
      map.get(letter)!.push(entry)
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [filtered])

  // Count per category for the filter chips
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {}
    for (const g of glossary) {
      counts[g.category] = (counts[g.category] ?? 0) + 1
    }
    return counts
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Animated hero header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 text-center"
      >
        <div className="flex items-center justify-center gap-3">
          {/* Rotating hero symbol */}
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 shadow-lg">
            <AnimatePresence mode="wait">
              <motion.span
                key={heroSymbolIdx}
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0, rotate: 180 }}
                transition={{ duration: 0.4 }}
                className="text-2xl"
              >
                {HERO_SYMBOLS[heroSymbolIdx]}
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold tracking-tight">AI Glossary</h1>
            <p className="text-sm text-muted-foreground">
              <AnimatedCounter value={glossary.length} /> terms ·{' '}
              <AnimatedCounter value={categories.length - 1} /> categories · from AGI to VAE
            </p>
          </div>
        </div>
      </motion.div>

      {/* Search bar with animated focus */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-4"
      >
        <motion.div
          whileFocus={{ scale: 1.01 }}
          className="relative"
        >
          <motion.div
            animate={{
              rotate: query ? 360 : 0,
            }}
            transition={{ duration: 0.5 }}
            className="absolute left-3 top-1/2 -translate-y-1/2"
          >
            <Search className="h-4 w-4 text-muted-foreground" />
          </motion.div>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search terms… (e.g. attention, RAG, transformer)"
            className="h-11 pl-10 text-base"
          />
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Clear search"
            >
              ✕
            </motion.button>
          )}
        </motion.div>
      </motion.div>

      {/* Category filter chips with symbols */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-6 flex flex-wrap gap-1.5"
      >
        {categories.map((c, i) => {
          const isActive = activeCategory === c
          const style = c === 'All' ? null : getStyle(c)
          const count = c === 'All' ? glossary.length : (categoryCounts[c] ?? 0)
          return (
            <motion.button
              key={c}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.03, type: 'spring', stiffness: 200 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(c)}
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-all',
                isActive
                  ? 'border-primary bg-primary text-primary-foreground shadow-md'
                  : 'bg-card text-muted-foreground hover:bg-muted'
              )}
            >
              {style && <span className="text-sm">{style.symbol}</span>}
              <span>{c}</span>
              <span className={cn(
                'rounded-full px-1.5 py-0.5 text-[9px] font-mono',
                isActive ? 'bg-primary-foreground/20' : 'bg-muted'
              )}>
                {count}
              </span>
            </motion.button>
          )
        })}
      </motion.div>

      {/* Results count */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${query}-${activeCategory}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mb-4 text-xs text-muted-foreground"
        >
          {filtered.length > 0 ? (
            <>Showing <span className="font-semibold text-foreground">{filtered.length}</span> {filtered.length === 1 ? 'term' : 'terms'}</>
          ) : (
            'No matching terms'
          )}
        </motion.div>
      </AnimatePresence>

      {/* Grouped terms with animations */}
      <AnimatePresence mode="wait">
        {grouped.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-lg border border-dashed p-12 text-center"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mx-auto mb-2 text-4xl"
            >
              🔍
            </motion.div>
            <p className="text-sm text-muted-foreground">No terms match your search.</p>
            <button
              onClick={() => { setQuery(''); setActiveCategory('All') }}
              className="mt-2 text-xs text-primary hover:underline"
            >
              Clear filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {grouped.map(([letter, entries], groupIdx) => (
              <LetterGroup
                key={letter}
                letter={letter}
                entries={entries}
                groupIdx={groupIdx}
                navigate={navigate}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-10 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background p-5 text-center"
      >
        <Sparkles className="mx-auto h-6 w-6 text-primary" />
        <h2 className="mt-2 text-base font-bold">Want to learn more?</h2>
        <p className="mx-auto mt-1 max-w-md text-xs text-muted-foreground">
          Each glossary term links to a full lesson. Click &quot;Read full lesson&quot; to dive deeper.
        </p>
      </motion.div>
    </div>
  )
}

// ---- Letter group with animated header ----
function LetterGroup({
  letter, entries, groupIdx, navigate,
}: {
  letter: string
  entries: typeof glossary
  groupIdx: number
  navigate: ReturnType<typeof useAppStore.getState>['navigate']
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <div ref={ref}>
      {/* Letter header with animated badge */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-3 flex items-center gap-3"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={inView ? { scale: 1, rotate: 0 } : {}}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          whileHover={{ scale: 1.15, rotate: 10 }}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-500 font-mono text-lg font-bold text-white shadow-md"
        >
          {letter}
        </motion.div>
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">
          <AnimatedCounter value={entries.length} /> {entries.length === 1 ? 'term' : 'terms'}
        </span>
      </motion.div>

      {/* Cards grid with stagger entrance */}
      <div className="grid gap-2 sm:grid-cols-2">
        {entries.map((entry, i) => (
          <GlossaryCard
            key={entry.term}
            entry={entry}
            index={i}
            groupIdx={groupIdx}
            inView={inView}
            navigate={navigate}
          />
        ))}
      </div>
    </div>
  )
}

// ---- Individual glossary card ----
function GlossaryCard({
  entry, index, inView, navigate,
}: {
  entry: typeof glossary[number]
  index: number
  groupIdx: number
  inView: boolean
  navigate: ReturnType<typeof useAppStore.getState>['navigate']
}) {
  const style = getStyle(entry.category)
  const symbol = getTermSymbol(entry.term)
  const [hovered, setHovered] = React.useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.4,
        delay: 0.05 + index * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -4, scale: 1.02 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <Card className={cn(
        'relative h-full overflow-hidden transition-shadow',
        hovered && 'shadow-lg ring-1 ring-primary/20'
      )}>
        {/* Gradient strip on left, grows on hover */}
        <motion.div
          className={cn('absolute inset-y-0 left-0 w-1 bg-gradient-to-b', style.gradient)}
          animate={{ width: hovered ? 4 : 3 }}
          transition={{ duration: 0.2 }}
        />

        <CardContent className="p-3 pl-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              {/* Term symbol with hover pulse */}
              <motion.div
                animate={hovered ? { scale: [1, 1.2, 1], rotate: [0, 10, 0] } : { scale: 1, rotate: 0 }}
                transition={{ duration: 0.5 }}
                className="text-lg leading-none"
              >
                {symbol}
              </motion.div>
              <div>
                <h3 className="text-sm font-semibold leading-tight">{entry.term}</h3>
              </div>
            </div>
            {/* Category badge with symbol */}
            <Badge variant="outline" className={cn('shrink-0 text-[9px]', style.border, style.color)}>
              <span className="mr-0.5">{style.symbol}</span>
              {entry.category}
            </Badge>
          </div>

          <p className="mt-1.5 text-xs text-muted-foreground">{entry.short}</p>
          <p className="mt-1.5 text-xs leading-5">{entry.detailed}</p>

          {entry.relatedLesson && (
            <motion.button
              onClick={() => navigate({ name: 'lesson', moduleId: entry.relatedLesson!.moduleId, lessonId: entry.relatedLesson!.lessonId })}
              whileHover={{ x: 2 }}
              className="mt-2 flex items-center gap-1 text-[11px] text-primary hover:underline"
            >
              Read full lesson <ArrowRight className="h-2.5 w-2.5" />
            </motion.button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
