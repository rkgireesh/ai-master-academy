'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { AnimatedCounter } from './animated-counter'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface KpiCardProps {
  label: string
  value: number
  suffix?: string
  decimals?: number
  format?: (n: number) => string
  icon: LucideIcon
  color: string // gradient classes like "from-blue-500 to-violet-500"
  trend?: number // percentage change, +/-
  trendLabel?: string
  delay?: number
}

export function KpiCard({
  label,
  value,
  suffix,
  decimals = 0,
  format,
  icon: Icon,
  color,
  trend,
  trendLabel,
  delay = 0,
}: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card className="relative overflow-hidden border-border/60">
        <div className={cn('absolute inset-x-0 top-0 h-1 bg-gradient-to-r', color)} />
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {label}
              </div>
              <div className="mt-1.5 flex items-baseline gap-1">
                <AnimatedCounter
                  value={value}
                  decimals={decimals}
                  format={format}
                  className="text-2xl font-bold tracking-tight"
                />
                {suffix && (
                  <span className="text-sm font-medium text-muted-foreground">{suffix}</span>
                )}
              </div>
              {(trend !== undefined && trend !== 0 || trendLabel) && (
                <div className="mt-1.5 flex items-center gap-1 text-[11px]">
                  {trend !== undefined && trend !== 0 && (
                    <span
                      className={cn(
                        'flex items-center gap-0.5 rounded px-1 py-0.5 font-mono font-medium',
                        trend >= 0
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
                      )}
                    >
                      {trend >= 0 ? (
                        <TrendingUp className="h-2.5 w-2.5" />
                      ) : (
                        <TrendingDown className="h-2.5 w-2.5" />
                      )}
                      {Math.abs(trend).toFixed(1)}%
                    </span>
                  )}
                  {trendLabel && <span className="text-muted-foreground">{trendLabel}</span>}
                </div>
              )}
            </div>
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: delay + 0.2, type: 'spring', stiffness: 200 }}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg',
                color
              )}
            >
              <Icon className="h-5 w-5" />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
