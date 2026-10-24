'use client'

import * as React from 'react'
import * as Icons from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { getModule, getLesson, modules } from '@/data'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArticleContent } from '@/components/learn/article-content'
import { cn } from '@/lib/utils'
import {
  ArrowLeft, ArrowRight, Bookmark, BookmarkCheck, CheckCircle2, Circle,
  Clock, Award, ChevronRight, Lightbulb, AlertTriangle, AlertCircle, Info,
  BookOpen, HelpCircle, FileText, ListChecks, Target,
} from 'lucide-react'

export function LessonView({ moduleId, lessonId }: { moduleId: string; lessonId: string }) {
  const navigate = useAppStore((s) => s.navigate)
  const markLessonComplete = useAppStore((s) => s.markLessonComplete)
  const unmarkLessonComplete = useAppStore((s) => s.unmarkLessonComplete)
  const toggleBookmark = useAppStore((s) => s.toggleBookmark)
  const recordView = useAppStore((s) => s.recordView)

  // Subscribe to the underlying arrays so the component re-renders when
  // the user marks a lesson complete or toggles a bookmark. The helper
  // functions isCompleted/isBookmarked read state at call time but do
  // NOT trigger re-renders, so computing from the reactive arrays is
  // required for the UI to update on click.
  const completedLessons = useAppStore((s) => s.completedLessons)
  const bookmarks = useAppStore((s) => s.bookmarks)

  const data = getLesson(moduleId, lessonId)
  const moduleData = getModule(moduleId)

  // Record view once on mount / when lesson changes
  React.useEffect(() => {
    if (moduleId && lessonId) {
      recordView(moduleId, lessonId)
    }
  }, [moduleId, lessonId, recordView])

  if (!data || !moduleData) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p>Lesson not found.</p>
        <Button onClick={() => navigate({ name: 'modules' })} className="mt-4">Back to modules</Button>
      </div>
    )
  }

  const { lesson, module: m, prev, next, index } = data
  const lessonKey = `${moduleId}/${lessonId}`
  // Derive booleans from the reactive arrays so the UI updates on click
  const completed = completedLessons.includes(lessonKey)
  const bookmarked = bookmarks.includes(lessonKey)

  // Build TOC from headings in the lesson body
  const tocItems: { id: string; text: string; level: number }[] = []
  // Fixed sections always present
  tocItems.push({ id: 'definition', text: 'Definition', level: 2 })
  tocItems.push({ id: 'why', text: 'Why it exists', level: 2 })
  tocItems.push({ id: 'how', text: 'How it works', level: 2 })
  lesson.howItWorks.forEach((b) => {
    if (b.type === 'h') tocItems.push({ id: slug(b.text), text: b.text, level: 3 })
    if (b.type === 'h3') tocItems.push({ id: slug(b.text), text: b.text, level: 3 })
  })
  if (lesson.examples.length > 0) tocItems.push({ id: 'examples', text: 'Examples', level: 2 })
  if (lesson.advantages && lesson.advantages.length > 0) tocItems.push({ id: 'advantages', text: 'Advantages', level: 2 })
  if (lesson.disadvantages && lesson.disadvantages.length > 0) tocItems.push({ id: 'disadvantages', text: 'Disadvantages', level: 2 })
  if (lesson.commonMistakes && lesson.commonMistakes.length > 0) tocItems.push({ id: 'mistakes', text: 'Common Mistakes', level: 2 })
  if (lesson.limitations && lesson.limitations.length > 0) tocItems.push({ id: 'limitations', text: 'Limitations', level: 2 })
  if (lesson.relatedConcepts && lesson.relatedConcepts.length > 0) tocItems.push({ id: 'related', text: 'Related Concepts', level: 2 })
  if (lesson.faq && lesson.faq.length > 0) tocItems.push({ id: 'faq', text: 'FAQ', level: 2 })
  tocItems.push({ id: 'summary', text: 'Summary', level: 2 })

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <button onClick={() => navigate({ name: 'modules' })} className="hover:text-foreground">Modules</button>
        <ChevronRight className="h-3 w-3" />
        <button onClick={() => navigate({ name: 'module', moduleId })} className="hover:text-foreground">{m.shortTitle}</button>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground truncate">{lesson.title}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[220px_1fr_220px]">
        {/* LEFT SIDEBAR — lesson navigation */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-thin">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {m.shortTitle}
            </div>
            <ul className="space-y-0.5 text-sm">
              {m.lessons.map((l, i) => {
                const done = completedLessons.includes(`${moduleId}/${l.id}`)
                const active = l.id === lessonId
                return (
                  <li key={l.id}>
                    <button
                      onClick={() => navigate({ name: 'lesson', moduleId, lessonId: l.id })}
                      className={cn(
                        'flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-xs transition-colors',
                        active ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      {done ? (
                        <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-500" />
                      ) : (
                        <Circle className="h-3 w-3 shrink-0" />
                      )}
                      <span className="line-clamp-2">{l.title}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
            <Separator className="my-3" />
            <Button
              variant="outline" size="sm" className="w-full"
              onClick={() => navigate({ name: 'quiz', moduleId })}
            >
              <Award className="mr-1.5 h-3.5 w-3.5" /> Take Module Quiz
            </Button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <article className="min-w-0">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono">Lesson {index + 1} of {m.lessons.length}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {lesson.readingMinutes} min read</span>
            </div>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">{lesson.title}</h1>
            {lesson.subtitle && <p className="mt-1 text-base text-muted-foreground">{lesson.subtitle}</p>}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {lesson.tags.map((t) => <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>)}
              <Button
                variant="ghost" size="sm"
                onClick={() => toggleBookmark(moduleId, lessonId)}
                className="ml-auto"
              >
                {bookmarked ? (
                  <><BookmarkCheck className="mr-1 h-3.5 w-3.5 text-primary" /> Bookmarked</>
                ) : (
                  <><Bookmark className="mr-1 h-3.5 w-3.5" /> Bookmark</>
                )}
              </Button>
              <Button
                variant={completed ? 'default' : 'outline'} size="sm"
                onClick={() => completed ? unmarkLessonComplete(moduleId, lessonId) : markLessonComplete(moduleId, lessonId)}
              >
                {completed ? (
                  <><CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Completed</>
                ) : (
                  <><Circle className="mr-1 h-3.5 w-3.5" /> Mark complete</>
                )}
              </Button>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Definition */}
          <section id="definition" className="mb-6">
            <SectionHeader icon={FileText} title="Definition" />
            <p className="text-base leading-7">{lesson.definition}</p>
          </section>

          {/* Why it exists */}
          <section id="why" className="mb-6">
            <SectionHeader icon={Target} title="Why It Exists" />
            <p className="text-base leading-7 text-muted-foreground">{lesson.whyItExists}</p>
          </section>

          {/* How it works */}
          <section id="how" className="mb-6">
            <SectionHeader icon={BookOpen} title="How It Works" />
            <ArticleContent blocks={lesson.howItWorks} />
          </section>

          {/* Examples */}
          {lesson.examples.length > 0 && (
            <section id="examples" className="mb-6">
              <SectionHeader icon={Lightbulb} title="Examples" />
              <ArticleContent blocks={lesson.examples} />
            </section>
          )}

          {/* Advantages / Disadvantages side by side */}
          <div className="mb-6 grid gap-4 md:grid-cols-2">
            {lesson.advantages && lesson.advantages.length > 0 && (
              <section id="advantages">
                <SectionHeader icon={CheckCircle2} title="Advantages" color="text-emerald-500" />
                <ul className="space-y-1.5 text-sm">
                  {lesson.advantages.map((a, i) => (
                    <li key={i} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {lesson.disadvantages && lesson.disadvantages.length > 0 && (
              <section id="disadvantages">
                <SectionHeader icon={AlertTriangle} title="Disadvantages" color="text-amber-500" />
                <ul className="space-y-1.5 text-sm">
                  {lesson.disadvantages.map((a, i) => (
                    <li key={i} className="flex gap-2">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Common Mistakes */}
          {lesson.commonMistakes && lesson.commonMistakes.length > 0 && (
            <section id="mistakes" className="mb-6">
              <SectionHeader icon={AlertCircle} title="Common Mistakes" color="text-rose-500" />
              <ul className="space-y-1.5 text-sm">
                {lesson.commonMistakes.map((a, i) => (
                  <li key={i} className="flex gap-2">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Limitations */}
          {lesson.limitations && lesson.limitations.length > 0 && (
            <section id="limitations" className="mb-6">
              <SectionHeader icon={AlertTriangle} title="Limitations" />
              <ul className="space-y-1.5 text-sm">
                {lesson.limitations.map((a, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Related Concepts */}
          {lesson.relatedConcepts && lesson.relatedConcepts.length > 0 && (
            <section id="related" className="mb-6">
              <SectionHeader icon={ListChecks} title="Related Concepts" />
              <div className="flex flex-wrap gap-2">
                {lesson.relatedConcepts.map((c) => (
                  <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                ))}
              </div>
            </section>
          )}

          {/* FAQ */}
          {lesson.faq && lesson.faq.length > 0 && (
            <section id="faq" className="mb-6">
              <SectionHeader icon={HelpCircle} title="Frequently Asked Questions" />
              <div className="space-y-3">
                {lesson.faq.map((item, i) => (
                  <div key={i} className="rounded-lg border bg-card p-3">
                    <div className="flex items-start gap-2">
                      <HelpCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      <div>
                        <div className="text-sm font-medium">{item.q}</div>
                        <p className="mt-1 text-sm text-muted-foreground">{item.a}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Summary */}
          <section id="summary" className="mb-6">
            <SectionHeader icon={Info} title="Summary" />
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
              <p className="text-sm leading-7">{lesson.summary}</p>
            </div>
          </section>

          {/* Complete CTA */}
          {!completed && (
            <Card className="mb-6 border-primary/30">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <div className="text-sm font-medium">Finished reading?</div>
                  <div className="text-xs text-muted-foreground">Mark this lesson complete to track your progress.</div>
                </div>
                <Button onClick={() => markLessonComplete(moduleId, lessonId)}>
                  <CheckCircle2 className="mr-1.5 h-4 w-4" /> Mark complete
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Prev/Next nav */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            {prev ? (
              <Button variant="outline" onClick={() => navigate({ name: 'lesson', moduleId, lessonId: prev.id })}>
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> <span className="truncate">{prev.title}</span>
              </Button>
            ) : <div />}
            {next ? (
              <Button variant="outline" onClick={() => navigate({ name: 'lesson', moduleId, lessonId: next.id })}>
                <span className="truncate">{next.title}</span> <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button onClick={() => navigate({ name: 'quiz', moduleId })}>
                <Award className="mr-1.5 h-4 w-4" /> Take the quiz
              </Button>
            )}
          </div>
        </article>

        {/* RIGHT SIDEBAR — TOC */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-thin">
            <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              On this page
            </div>
            <ul className="space-y-0.5 text-xs">
              {tocItems.map((t) => (
                <li key={t.id}>
                  <a
                    href={`#${t.id}`}
                    className={cn(
                      'block rounded px-2 py-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                      t.level === 3 && 'pl-4'
                    )}
                  >
                    {t.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}

function SectionHeader({ icon: Icon, title, color }: { icon: React.ComponentType<{ className?: string }>; title: string; color?: string }) {
  return (
    <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
      <Icon className={cn('h-4 w-4', color ?? 'text-primary')} />
      {title}
    </h2>
  )
}

function slug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
