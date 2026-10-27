'use client'

import * as React from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

/**
 * Shared scroll-animation primitives + symbols used across
 * Home, Modules, Module detail, and Lesson views.
 */

// ---------- ScrollReveal: fade + slide in when scrolled into view ----------
export function ScrollReveal({
  children,
  delay = 0,
  y = 30,
  x = 0,
  className,
  once = true,
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  x?: number
  className?: string
  once?: boolean
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, x }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ---------- Stagger container + item ----------
export function StaggerGroup({
  children,
  className,
  stagger = 0.08,
  once = true,
}: {
  children: React.ReactNode
  className?: string
  stagger?: number
  once?: boolean
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
  y = 24,
}: {
  children: React.ReactNode
  className?: string
  y?: number
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y, scale: 0.97 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ---------- Parallax wrapper ----------
export function Parallax({
  children,
  className,
  speed = 0.3,
}: {
  children: React.ReactNode
  className?: string
  speed?: number
}) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [speed * 100, -speed * 100])
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

// ---------- Animated gradient text ----------
export function GradientText({
  children,
  className,
  from = 'rgb(124, 92, 255)',
  to = 'rgb(217, 70, 239)',
}: {
  children: React.ReactNode
  className?: string
  from?: string
  to?: string
}) {
  return (
    <motion.span
      className={cn('inline-block bg-clip-text text-transparent', className)}
      style={{
        backgroundImage: `linear-gradient(135deg, ${from}, ${to})`,
        backgroundSize: '200% 200%',
      }}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {children}
    </motion.span>
  )
}

// ---------- Floating animation ----------
export function Floating({
  children,
  className,
  duration = 4,
  amplitude = 8,
}: {
  children: React.ReactNode
  className?: string
  duration?: number
  amplitude?: number
}) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -amplitude, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}

// ---------- Pulsing glow ----------
export function PulsingGlow({
  children,
  color = 'rgb(124, 92, 255)',
  className,
}: {
  children: React.ReactNode
  color?: string
  className?: string
}) {
  return (
    <div className={cn('relative', className)}>
      <motion.div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{ backgroundColor: color }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}

// ---------- Module symbols map ----------
export const MODULE_SYMBOLS: Record<string, string> = {
  m1: '🧠',
  m2: '✨',
  m3: '💬',
  m4: '📐',
  m5: '🔍',
  m6: '🤖',
  m7: '👥',
  m8: '🔧',
  m9: '💾',
  m10: '🕸️',
  m11: '📚',
  m12: '🚀',
}

export function getModuleSymbol(moduleId: string): string {
  return MODULE_SYMBOLS[moduleId] ?? '📖'
}

// ---------- Section heading with animated underline ----------
export function SectionHeading({
  title,
  subtitle,
  symbol,
  className,
  align = 'left',
}: {
  title: string
  subtitle?: string
  symbol?: string
  className?: string
  align?: 'left' | 'center'
}) {
  return (
    <ScrollReveal className={cn(align === 'center' && 'text-center', className)}>
      <div className={cn('flex items-center gap-2', align === 'center' && 'justify-center')}>
        {symbol && (
          <motion.span
            initial={{ scale: 0, rotate: -90 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-2xl"
          >
            {symbol}
          </motion.span>
        )}
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      </div>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className={cn('mt-1 text-sm text-muted-foreground', align === 'center' && 'mx-auto max-w-2xl')}
        >
          {subtitle}
        </motion.p>
      )}
      <motion.div
        className={cn('mt-3 h-0.5 rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-fuchsia-500', align === 'center' && 'mx-auto')}
        initial={{ width: 0, opacity: 0 }}
        whileInView={{ width: align === 'center' ? 120 : 80, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />
    </ScrollReveal>
  )
}
