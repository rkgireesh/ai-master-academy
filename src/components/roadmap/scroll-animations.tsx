'use client'

import * as React from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRef } from 'react'

/**
 * Animated SVG path that "draws" itself as the user scrolls.
 * Used as the connecting line between roadmap stages.
 */
export function ScrollDrawingPath({
  height,
  color = 'rgb(124, 92, 255)',
  width = 3,
  className,
}: {
  height: number
  color?: string
  width?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 80%', 'end 20%'],
  })
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <div ref={ref} className={className} style={{ height, width: width + 2 }}>
      <svg
        width={width + 2}
        height={height}
        className="absolute left-1/2 -translate-x-1/2"
      >
        <line
          x1={width / 2 + 1}
          y1={0}
          x2={width / 2 + 1}
          y2={height}
          stroke="hsl(var(--muted))"
          strokeWidth={width}
          strokeLinecap="round"
        />
        <motion.line
          x1={width / 2 + 1}
          y1={0}
          x2={width / 2 + 1}
          y2={height}
          stroke={color}
          strokeWidth={width}
          strokeLinecap="round"
          style={{ pathLength }}
          initial={{ pathLength: 0 }}
        />
      </svg>
    </div>
  )
}

/**
 * A pulsing glow dot — used to mark the "current" stage on the roadmap.
 */
export function PulsingDot({
  color = 'rgb(124, 92, 255)',
  size = 12,
}: {
  color?: string
  size?: number
}) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color }}
        animate={{
          scale: [1, 1.8, 1],
          opacity: [0.6, 0, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <div
        className="relative rounded-full"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          boxShadow: `0 0 ${size}px ${color}`,
        }}
      />
    </div>
  )
}

/**
 * Wrapper that reveals children with a stagger when scrolled into view.
 */
export function ScrollReveal({
  children,
  delay = 0,
  y = 30,
  className,
}: {
  children: React.ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
