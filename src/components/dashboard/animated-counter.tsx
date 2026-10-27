'use client'

import * as React from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useRef } from 'react'

interface AnimatedCounterProps {
  value: number
  duration?: number
  decimals?: number
  format?: (n: number) => string
  className?: string
}

/**
 * Animated number counter that ticks up from 0 to `value`
 * when the element scrolls into view.
 */
export function AnimatedCounter({
  value,
  duration = 1.2,
  decimals = 0,
  format,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { duration: duration * 1000, bounce: 0 })

  useEffect(() => {
    if (inView) {
      motionValue.set(value)
    }
  }, [inView, value, motionValue])

  useEffect(() => {
    return spring.on('change', (v) => {
      if (ref.current) {
        const formatted = format ? format(v) : v.toFixed(decimals)
        ref.current.textContent = formatted
      }
    })
  }, [spring, format, decimals])

  return (
    <span ref={ref} className={className}>
      0
    </span>
  )
}
