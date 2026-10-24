'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  Pie, PieChart, PolarAngleAxis, RadialBar, RadialBarChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const CARD_DELAY = 0.1

interface ChartCardProps {
  title: string
  subtitle?: string
  className?: string
  delay?: number
  children: React.ReactNode
  action?: React.ReactNode
}

export function ChartCard({ title, subtitle, className, delay = CARD_DELAY, children, action }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn('h-full', className)}
    >
      <Card className="h-full">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-sm font-semibold">{title}</CardTitle>
            {subtitle && <p className="mt-0.5 text-[11px] text-muted-foreground">{subtitle}</p>}
          </div>
          {action}
        </CardHeader>
        <CardContent className="pt-2">{children}</CardContent>
      </Card>
    </motion.div>
  )
}

// Shared tooltip styling
const TOOLTIP_STYLE = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  fontSize: '12px',
  color: 'hsl(var(--foreground))',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
}

// ---------- Module Progress Bar Chart ----------
interface ModuleBarChartProps {
  data: { name: string; completed: number; total: number; pct: number }[]
  delay?: number
}

export function ModuleProgressChart({ data, delay = 0.2 }: ModuleBarChartProps) {
  return (
    <ChartCard
      title="Module Progress"
      subtitle="Completed lessons per module"
      delay={delay}
      action={<div className="text-[10px] text-muted-foreground">{data.length} modules</div>}
    >
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(124, 92, 255)" stopOpacity={0.95} />
              <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity={0.75} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.4} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            tickLine={false}
            axisLine={false}
            interval={0}
            angle={-25}
            textAnchor="end"
            height={50}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            tickLine={false}
            axisLine={false}
            width={32}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
            formatter={(v: number, _n, p) => [`${v} / ${p?.payload?.total ?? '?'}`, 'Completed']}
          />
          <Bar
            dataKey="completed"
            radius={[4, 4, 0, 0]}
            fill="url(#barGradient)"
            animationDuration={1200}
            animationEasing="ease-out"
          >
            {data.map((entry, i) => (
              <Cell
                key={`cell-${i}`}
                fill={entry.pct === 100 ? 'rgb(16, 185, 129)' : entry.pct > 0 ? 'url(#barGradient)' : 'hsl(var(--muted))'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

// ---------- Lesson Status Donut Chart ----------
interface DonutDataItem { name: string; value: number; color: string }

export function LessonStatusDonut({ data, delay = 0.3 }: { data: DonutDataItem[]; delay?: number }) {
  const total = data.reduce((acc, d) => acc + d.value, 0)

  return (
    <ChartCard
      title="Lesson Status"
      subtitle="Distribution across all modules"
      delay={delay}
      action={<div className="text-[10px] text-muted-foreground">{total} lessons</div>}
    >
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={3}
            cornerRadius={4}
            animationDuration={1400}
            animationBegin={300}
            stroke="none"
          >
            {data.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(v: number, n) => [`${v} lessons`, n as string]}
          />
          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
            formatter={(value) => <span className="text-muted-foreground">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

// ---------- Activity Area Chart (cumulative lessons over time) ----------
interface ActivityAreaChartProps {
  data: { label: string; value: number }[]
  delay?: number
}

export function ActivityAreaChart({ data, delay = 0.4 }: ActivityAreaChartProps) {
  return (
    <ChartCard
      title="Learning Activity"
      subtitle="Cumulative lessons completed over time"
      delay={delay}
      className="lg:col-span-2"
    >
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 10, right: 12, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(124, 92, 255)" stopOpacity={0.5} />
              <stop offset="100%" stopColor="rgb(124, 92, 255)" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgb(59, 130, 246)" />
              <stop offset="100%" stopColor="rgb(217, 70, 239)" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.4} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            tickLine={false}
            axisLine={false}
            width={32}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(v: number) => [`${v} lessons`, 'Completed']}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="url(#lineGradient)"
            strokeWidth={2.5}
            fill="url(#areaGradient)"
            animationDuration={1500}
            animationEasing="ease-out"
            dot={{ r: 3, fill: 'rgb(124, 92, 255)', strokeWidth: 0 }}
            activeDot={{ r: 5, fill: 'rgb(217, 70, 239)', strokeWidth: 2, stroke: 'white' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}

// ---------- Overall Progress Radial Gauge ----------
export function OverallProgressGauge({ pct, delay = 0.5 }: { pct: number; delay?: number }) {
  // Clamp pct to [0, 100] to avoid degenerate angle ranges
  const safePct = Math.max(0, Math.min(100, pct))
  const data = [{ name: 'progress', value: safePct, fill: 'rgb(124, 92, 255)' }]

  return (
    <ChartCard
      title="Overall Progress"
      subtitle="Across all 12 modules"
      delay={delay}
    >
      <div className="relative">
        <ResponsiveContainer width="100%" height={200}>
          <RadialBarChart
            data={data}
            // Full 360° circle — never degenerate.
            // RadialBar fills proportionally: value=100 → full circle, value=50 → half.
            startAngle={90}
            endAngle={-270}
            innerRadius={68}
            outerRadius={95}
            cx="50%"
            cy="50%"
          >
            {/* tick={false} hides ticks visually. The non-degenerate 360°
                angle range (startAngle=90, endAngle=-270) prevents the
                duplicate "tick-90" key error that occurred when pct=0
                made startAngle === endAngle. */}
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <RadialBar
              background={{ fill: 'hsl(var(--muted))' }}
              dataKey="value"
              cornerRadius={10}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.4, type: 'spring' }}
            className="text-3xl font-bold tracking-tight"
          >
            {pct.toFixed(0)}%
          </motion.span>
          <span className="text-[10px] uppercase text-muted-foreground">complete</span>
        </div>
      </div>
    </ChartCard>
  )
}

// ---------- Quiz Scores Line Chart ----------
interface QuizLineChartProps {
  data: { name: string; score: number | null }[]
  delay?: number
}

export function QuizScoreLineChart({ data, delay = 0.55 }: QuizLineChartProps) {
  return (
    <ChartCard
      title="Quiz Performance"
      subtitle="Best score per module (where attempted)"
      delay={delay}
    >
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 10, right: 12, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} opacity={0.4} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            tickLine={false}
            axisLine={false}
            width={32}
            tickFormatter={(v) => `${v}%`}
            allowDataOverflow={false}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(v: number) => [`${v}%`, 'Score']}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="rgb(217, 70, 239)"
            strokeWidth={2.5}
            dot={{ r: 4, fill: 'rgb(217, 70, 239)', strokeWidth: 2, stroke: 'white' }}
            activeDot={{ r: 6 }}
            animationDuration={1400}
            animationEasing="ease-out"
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
