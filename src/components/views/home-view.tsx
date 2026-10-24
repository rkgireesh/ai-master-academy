'use client'

import * as React from 'react'
import { useAppStore } from '@/store/useAppStore'
import { modules, projects, totalLessonCount } from '@/data'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import * as Icons from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  ArrowRight, Sparkles, Brain, Network, Database, Bot, Boxes,
  Cpu, Layers, Zap, BookOpen, Target, TrendingUp,
} from 'lucide-react'

const HIERARCHY = {
  name: 'Artificial Intelligence',
  icon: Brain,
  desc: 'The broad goal of building systems that perform tasks requiring human intelligence.',
  children: [
    {
      name: 'Machine Learning',
      icon: TrendingUp,
      desc: 'Learning from data instead of hand-written rules.',
      children: [
        { name: 'Deep Learning', icon: Layers, desc: 'Multi-layer neural networks trained end-to-end.' },
        { name: 'Transformers', icon: Cpu, desc: 'Self-attention-based architecture powering modern LLMs.' },
        { name: 'Computer Vision', icon: Boxes, desc: 'Vision models for images and video.' },
        { name: 'Modern Language Models', icon: BookOpen, desc: 'Large neural models trained on text.' },
      ],
    },
    {
      name: 'Generative AI',
      icon: Sparkles,
      desc: 'Models that produce new content — text, images, audio, video, code.',
      children: [
        { name: 'Text Generation', icon: BookOpen, desc: 'LLMs that generate fluent text.' },
        { name: 'Image Generation', icon: Boxes, desc: 'Diffusion models, GANs, VAEs.' },
        { name: 'Audio and Video Generation', icon: Zap, desc: 'Speech synthesis, music, video.' },
        { name: 'Multimodal Models', icon: Network, desc: 'Process text + image + audio together.' },
      ],
    },
    {
      name: 'AI Applications',
      icon: Bot,
      desc: 'Systems built on top of generative models.',
      children: [
        { name: 'LLM Applications', icon: BookOpen, desc: 'Chatbots, assistants, copilots.' },
        { name: 'RAG Systems', icon: Database, desc: 'Grounding answers in private data.' },
        { name: 'Tool-Using Agents', icon: Cpu, desc: 'Agents that call functions and APIs.' },
        { name: 'Agentic Workflows', icon: Network, desc: 'Multi-step autonomous task execution.' },
        { name: 'Multi-Agent Systems', icon: Network, desc: 'Specialised agents collaborating.' },
      ],
    },
  ],
}

export function HomeView() {
  const navigate = useAppStore((s) => s.navigate)
  const completedLessons = useAppStore((s) => s.completedLessons)
  const totalLessons = totalLessonCount()
  const overallProgress = totalLessons > 0 ? (completedLessons.length / totalLessons) * 100 : 0

  const featuredPaths = [
    { title: 'AI Foundations', moduleId: 'm1', desc: 'Start here. Core ML/DL concepts every AI engineer needs.', icon: Brain, color: 'from-blue-500 to-violet-500' },
    { title: 'LLM Architecture', moduleId: 'm3', desc: 'The most detailed module — transformers, attention, training, inference.', icon: Cpu, color: 'from-blue-500 to-cyan-500' },
    { title: 'RAG Systems', moduleId: 'm5', desc: 'Ground LLMs in your private data with retrieval-augmented generation.', icon: Database, color: 'from-cyan-500 to-blue-500' },
    { title: 'AI Agents', moduleId: 'm6', desc: 'From chatbots to autonomous tool-using agents.', icon: Bot, color: 'from-orange-500 to-amber-500' },
  ]

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b">
        <div className="bg-grid absolute inset-0 opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-4 border-primary/30 bg-primary/5 text-primary">
              <Sparkles className="mr-1.5 h-3 w-3" /> 12 modules · {totalLessons} lessons · 6 labs · 12 projects
            </Badge>
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Master the Technology Behind <span className="text-gradient">Modern AI</span>
            </h1>
            <p className="mt-5 text-pretty text-base text-muted-foreground sm:text-lg">
              Explore AI, understand how LLMs think, discover Generative AI, and learn to build
              intelligent agents from the ground up. From absolute beginner to advanced professional.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" onClick={() => navigate({ name: 'module', moduleId: 'm1' })}>
                Start Learning <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate({ name: 'modules' })}>
                <BookOpen className="mr-1.5 h-4 w-4" /> Explore AI Concepts
              </Button>
            </div>
          </div>

          {/* Progress strip */}
          <div className="mx-auto mt-12 max-w-3xl">
            <Card>
              <CardContent className="flex flex-col items-center gap-4 p-4 sm:flex-row sm:gap-6">
                <div className="text-center sm:text-left">
                  <div className="text-2xl font-bold">{completedLessons.length} / {totalLessons}</div>
                  <div className="text-xs text-muted-foreground">lessons completed</div>
                </div>
                <div className="flex-1">
                  <Progress value={overallProgress} className="h-2" />
                  <div className="mt-1 text-xs text-muted-foreground">{overallProgress.toFixed(1)}% overall progress</div>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate({ name: 'dashboard' })}>
                  View Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FEATURED LEARNING PATHS */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Featured Learning Paths</h2>
            <p className="mt-1 text-sm text-muted-foreground">Curated sequences to take you from zero to building real systems.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate({ name: 'modules' })}>
            All modules <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredPaths.map((p) => {
            const Icon = p.icon
            return (
              <Card
                key={p.title}
                onClick={() => navigate({ name: 'module', moduleId: p.moduleId })}
                className="card-hover cursor-pointer overflow-hidden"
              >
                <div className={cn('h-1.5 bg-gradient-to-r', p.color)} />
                <CardHeader className="pb-2">
                  <div className={cn('mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br text-white', p.color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-base">{p.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* AI HIERARCHY DIAGRAM */}
      <section className="border-y bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight">How AI, LLMs, Generative AI, and Agents Connect</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              These are conceptual relationships, not a strict hierarchy. Real systems blend categories.
            </p>
          </div>

          <div className="mx-auto max-w-5xl space-y-4">
            {/* Root */}
            <HierarchyNode node={HIERARCHY} depth={0} />
          </div>
        </div>
      </section>

      {/* POPULAR TUTORIALS */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Popular Tutorials</h2>
            <p className="mt-1 text-sm text-muted-foreground">Hand-picked lessons across modules.</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { m: 'm1', l: 'what-is-ai', label: 'What is AI?' },
            { m: 'm3', l: 'transformer-architecture', label: 'Transformer Architecture' },
            { m: 'm3', l: 'self-attention', label: 'Self-Attention' },
            { m: 'm5', l: 'what-is-rag', label: 'What is RAG?' },
            { m: 'm6', l: 'what-is-an-agent', label: 'What is an AI Agent?' },
            { m: 'm10', l: 'supervisor-agent-architecture', label: 'Supervisor-Agent Architecture' },
          ].map(({ m, l, label }) => {
            const mod = modules.find((x) => x.id === m)!
            const lesson = mod.lessons.find((x) => x.id === l)!
            return (
              <Card
                key={l}
                onClick={() => navigate({ name: 'lesson', moduleId: m, lessonId: l })}
                className="card-hover cursor-pointer"
              >
                <CardContent className="p-4">
                  <div className="mb-1 flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">M{mod.index}</Badge>
                    <span className="text-[11px] text-muted-foreground">{mod.shortTitle}</span>
                  </div>
                  <h3 className="text-sm font-semibold">{label}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{lesson.definition}</p>
                  <div className="mt-2 text-[11px] text-muted-foreground">{lesson.readingMinutes} min read</div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* INTERACTIVE CONCEPT CARDS */}
      <section className="border-y bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Interactive Concept Cards</h2>
            <p className="mt-1 text-sm text-muted-foreground">Learn by doing — clickable diagrams and live demos.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'LLM Architecture Explorer', desc: 'Trace how text flows through a transformer, token by token.', icon: Cpu, route: { name: 'lesson', moduleId: 'm3', lessonId: 'transformer-architecture' } as const },
              { title: 'Attention Calculator', desc: 'Edit Q and K vectors, watch softmax attention weights update live.', icon: Network, route: { name: 'lesson', moduleId: 'm3', lessonId: 'self-attention' } as const },
              { title: 'Token Prediction Simulator', desc: 'Step through next-token prediction with temperature and top-k.', icon: Sparkles, route: { name: 'lesson', moduleId: 'm3', lessonId: 'next-token-prediction' } as const },
              { title: 'RAG Pipeline Diagram', desc: 'Click through 10 stages of a retrieval-augmented generation system.', icon: Database, route: { name: 'lesson', moduleId: 'm5', lessonId: 'what-is-rag' } as const },
              { title: 'Agent Loop Simulator', desc: 'Step through a ReAct-style agent as it plans, acts, observes, reflects.', icon: Bot, route: { name: 'lesson', moduleId: 'm6', lessonId: 'agent-execution-loops' } as const },
              { title: 'Multi-Agent System', desc: 'Explore a supervisor-worker architecture with specialist agents.', icon: Network, route: { name: 'lesson', moduleId: 'm10', lessonId: 'supervisor-agent-architecture' } as const },
            ].map((c) => {
              const Icon = c.icon
              return (
                <Card
                  key={c.title}
                  onClick={() => navigate(c.route)}
                  className="card-hover cursor-pointer"
                >
                  <CardContent className="p-4">
                    <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-semibold">{c.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{c.desc}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* FEATURED LABS */}
      <section className="border-y bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Hands-on Labs</h2>
              <p className="mt-1 text-sm text-muted-foreground">Run real experiments in your browser — no setup, no API keys.</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate({ name: 'labs' })}>
              All labs <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { id: 'neural-network-playground', title: 'Neural Network Playground', desc: 'Train a real MLP in-browser and watch the decision boundary evolve.', color: 'from-blue-500 to-violet-500' },
              { id: 'tokenizer-lab', title: 'Tokenizer Lab', desc: 'See how text becomes tokens with BPE-style splitting and IDs.', color: 'from-cyan-500 to-blue-500' },
              { id: 'attention-heatmap', title: 'Self-Attention Heatmap', desc: 'Type a sentence and inspect which tokens attend to which.', color: 'from-violet-500 to-fuchsia-500' },
              { id: 'prompt-sandbox', title: 'Prompt Engineering Sandbox', desc: 'Try zero-shot, few-shot, and chain-of-thought side by side.', color: 'from-fuchsia-500 to-pink-500' },
              { id: 'rag-sandbox', title: 'RAG Sandbox', desc: 'Paste a doc, ask a question, watch the full RAG pipeline run.', color: 'from-teal-500 to-cyan-500' },
              { id: 'agent-builder', title: 'Agent Builder Lab', desc: 'Compose tools, set a goal, step through the agent loop.', color: 'from-orange-500 to-amber-500' },
            ].map((l) => (
              <Card
                key={l.id}
                onClick={() => navigate({ name: 'lab', labId: l.id })}
                className="card-hover cursor-pointer overflow-hidden"
              >
                <div className={cn('h-1.5 bg-gradient-to-r', l.color)} />
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold">{l.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{l.desc}</p>
                  <div className="mt-2 text-[11px] text-primary">Open lab →</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ROADMAP PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Beginner → Advanced Roadmap</h2>
          <p className="mt-1 text-sm text-muted-foreground">A linear path through the academy. Click any stage to jump in.</p>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-stretch">
          {modules.map((m, i) => (
            <React.Fragment key={m.id}>
              <Card
                onClick={() => navigate({ name: 'module', moduleId: m.id })}
                className="card-hover min-w-[140px] flex-1 cursor-pointer"
              >
                <CardContent className="p-3 text-center">
                  <div className="text-[10px] font-mono text-muted-foreground">Stage {i + 1}</div>
                  <div className="mt-1 text-xs font-semibold leading-tight">{m.shortTitle}</div>
                  <Badge variant="outline" className="mt-1 text-[10px]">{m.level}</Badge>
                </CardContent>
              </Card>
              {i < modules.length - 1 && (
                <div className="hidden items-center md:flex">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Featured Practical Projects</h2>
              <p className="mt-1 text-sm text-muted-foreground">Build real systems — from chatbots to production AI apps.</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate({ name: 'projects' })}>
              All projects <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 6).map((p) => (
              <Card
                key={p.id}
                onClick={() => navigate({ name: 'project', projectId: p.id })}
                className="card-hover cursor-pointer"
              >
                <CardContent className="p-4">
                  <div className="mb-1 flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">{p.difficulty}</Badge>
                    <span className="text-[11px] text-muted-foreground">~{p.estimatedHours}h</span>
                  </div>
                  <h3 className="text-sm font-semibold">{p.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.tagline}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <Card className="overflow-hidden border-primary/30">
          <CardContent className="bg-gradient-to-br from-primary/10 via-background to-background p-8 text-center">
            <Target className="mx-auto h-8 w-8 text-primary" />
            <h2 className="mt-3 text-2xl font-bold tracking-tight">Ready to start?</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              No registration required. Your progress is saved locally in your browser. Pick any module and begin.
            </p>
            <Button className="mt-4" size="lg" onClick={() => navigate({ name: 'module', moduleId: 'm1' })}>
              Begin Module 1 <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

interface HNode {
  name: string
  icon: React.ComponentType<{ className?: string }>
  desc: string
  children?: HNode[]
}

function HierarchyNode({ node, depth }: { node: HNode; depth: number }) {
  const Icon = node.icon
  return (
    <div className={cn('rounded-lg border bg-card p-3', depth === 0 && 'border-primary/40 bg-primary/5')}>
      <div className="flex items-center gap-2">
        <div className={cn(
          'flex h-7 w-7 items-center justify-center rounded-md',
          depth === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
        )}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div>
          <div className="text-sm font-semibold">{node.name}</div>
          <div className="text-[11px] text-muted-foreground">{node.desc}</div>
        </div>
      </div>
      {node.children && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {node.children.map((c) => <HierarchyNode key={c.name} node={c} depth={depth + 1} />)}
        </div>
      )}
    </div>
  )
}
