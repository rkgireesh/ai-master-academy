'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Play, Pause, RotateCcw, Brain, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Neural Network Playground
 *
 * A real, from-scratch MLP implementation in TypeScript.
 * Trains on classic 2D datasets and visualises the decision boundary
 * updating live on a canvas.
 *
 * Architecture: input (2) -> hidden(s) -> output (1) with sigmoid output.
 * Backprop by hand. No external ML library.
 */

type Activation = 'relu' | 'tanh' | 'sigmoid'

interface Point { x: number; y: number; label: 0 | 1 }

// ---------- Dataset generators ----------
function xorData(n: number): Point[] {
  const pts: Point[] = []
  for (let i = 0; i < n; i++) {
    const x = (Math.random() - 0.5) * 2
    const y = (Math.random() - 0.5) * 2
    const label = (x * y > 0 ? 1 : 0) as 0 | 1
    pts.push({ x, y, label })
  }
  return pts
}

function circlesData(n: number): Point[] {
  const pts: Point[] = []
  for (let i = 0; i < n; i++) {
    const r = Math.random() < 0.5 ? 0.3 : 0.8
    const theta = Math.random() * Math.PI * 2
    const x = r * Math.cos(theta) + (Math.random() - 0.5) * 0.1
    const y = r * Math.sin(theta) + (Math.random() - 0.5) * 0.1
    pts.push({ x, y, label: r < 0.5 ? 0 : 1 })
  }
  return pts
}

function spiralData(n: number): Point[] {
  const pts: Point[] = []
  const half = Math.floor(n / 2)
  for (let i = 0; i < half; i++) {
    const r = (i / half) * 0.9
    const theta = r * 6 + 0
    pts.push({ x: r * Math.cos(theta), y: r * Math.sin(theta), label: 0 })
  }
  for (let i = 0; i < half; i++) {
    const r = (i / half) * 0.9
    const theta = r * 6 + Math.PI
    pts.push({ x: r * Math.cos(theta), y: r * Math.sin(theta), label: 1 })
  }
  return pts
}

function gaussianData(n: number): Point[] {
  const pts: Point[] = []
  for (let i = 0; i < n; i++) {
    const label = (Math.random() < 0.5 ? 0 : 1) as 0 | 1
    const cx = label === 0 ? -0.5 : 0.5
    const cy = label === 0 ? -0.5 : 0.5
    // Box-Muller for gaussian
    const u1 = Math.random(), u2 = Math.random()
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    const z2 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2)
    pts.push({ x: cx + z * 0.25, y: cy + z2 * 0.25, label })
  }
  return pts
}

const DATASETS: Record<string, (n: number) => Point[]> = {
  xor: xorData,
  circles: circlesData,
  spiral: spiralData,
  gaussian: gaussianData,
}

// ---------- Activation functions ----------
const activations: Record<Activation, { f: (x: number) => number; d: (x: number) => number }> = {
  relu:    { f: (x) => Math.max(0, x),                d: (x) => (x > 0 ? 1 : 0) },
  tanh:    { f: (x) => Math.tanh(x),                  d: (x) => 1 - Math.tanh(x) ** 2 },
  sigmoid: { f: (x) => 1 / (1 + Math.exp(-x)),        d: (x) => { const s = 1 / (1 + Math.exp(-x)); return s * (1 - s) } },
}

// ---------- MLP ----------
class MLP {
  sizes: number[]
  W: number[][][]   // W[layer][out][in]
  b: number[][]     // b[layer][out]
  act: Activation
  // Caches for backprop
  private z: number[][] = []
  private a: number[][] = []

  constructor(sizes: number[], act: Activation) {
    this.sizes = sizes
    this.act = act
    this.W = []
    this.b = []
    for (let l = 0; l < sizes.length - 1; l++) {
      const w: number[][] = []
      const b: number[] = []
      const scale = Math.sqrt(2 / sizes[l])
      for (let j = 0; j < sizes[l + 1]; j++) {
        const row: number[] = []
        for (let k = 0; k < sizes[l]; k++) row.push((Math.random() - 0.5) * 2 * scale)
        w.push(row)
        b.push(0)
      }
      this.W.push(w)
      this.b.push(b)
    }
  }

  forward(input: number[]): number {
    this.z = []
    this.a = [input]
    let cur = input
    for (let l = 0; l < this.W.length; l++) {
      const zl: number[] = []
      const al: number[] = []
      for (let j = 0; j < this.W[l].length; j++) {
        let s = this.b[l][j]
        for (let k = 0; k < cur.length; k++) s += this.W[l][j][k] * cur[k]
        zl.push(s)
        // Last layer uses sigmoid for binary classification; others use chosen activation
        const isFirstHidden = l === this.W.length - 1
        al.push(isFirstHidden ? activations.sigmoid.f(s) : activations[this.act].f(s))
      }
      this.z.push(zl)
      this.a.push(al)
      cur = al
    }
    return cur[0]
  }

  trainBatch(data: Point[], lr: number): number {
    let totalLoss = 0
    // Accumulate gradients
    const gW = this.W.map(layer => layer.map(row => row.map(() => 0)))
    const gB = this.b.map(layer => layer.map(() => 0))

    for (const p of data) {
      const out = this.forward([p.x, p.y])
      const target = p.label
      // Binary cross-entropy loss
      const eps = 1e-7
      totalLoss += -(target * Math.log(out + eps) + (1 - target) * Math.log(1 - out + eps))
      // dL/dout = out - target (for sigmoid + BCE)
      let delta: number[] = [out - target]
      // Backprop through layers
      for (let l = this.W.length - 1; l >= 0; l--) {
        const aPrev = this.a[l]
        for (let j = 0; j < this.W[l].length; j++) {
          gB[l][j] += delta[j]
          for (let k = 0; k < aPrev.length; k++) {
            gW[l][j][k] += delta[j] * aPrev[k]
          }
        }
        // Compute delta for previous layer (if any)
        if (l > 0) {
          const newDelta: number[] = new Array(aPrev.length).fill(0)
          for (let k = 0; k < aPrev.length; k++) {
            let s = 0
            for (let j = 0; j < this.W[l].length; j++) s += this.W[l][j][k] * delta[j]
            const zPrev = this.z[l - 1][k]
            // The previous layer's activation derivative
            // l-1 is the layer index in z[] (z[l-1] = pre-activation of layer l-1)
            // a[l] uses activation from layer l-1's output (which is at z[l-1])
            const isOutputOfHidden = (l - 1) === this.W.length - 2
            const actDeriv = isOutputOfHidden
              ? activations.sigmoid.d(zPrev)
              : activations[this.act].d(zPrev)
            newDelta[k] = s * actDeriv
          }
          delta = newDelta
        }
      }
    }
    // Apply averaged gradients
    const n = data.length
    for (let l = 0; l < this.W.length; l++) {
      for (let j = 0; j < this.W[l].length; j++) {
        this.b[l][j] -= lr * gB[l][j] / n
        for (let k = 0; k < this.W[l][j].length; k++) {
          this.W[l][j][k] -= lr * gW[l][j][k] / n
        }
      }
    }
    return totalLoss / n
  }
}

export function NeuralNetworkPlayground() {
  const [dataset, setDataset] = React.useState<keyof typeof DATASETS>('circles')
  const [hiddenLayers, setHiddenLayers] = React.useState(2)
  const [hiddenSize, setHiddenSize] = React.useState(8)
  const [activation, setActivation] = React.useState<Activation>('tanh')
  const [lr, setLr] = React.useState(0.1)
  const [playing, setPlaying] = React.useState(false)
  const [epoch, setEpoch] = React.useState(0)
  const [loss, setLoss] = React.useState(0)
  const [accuracy, setAccuracy] = React.useState(0)

  const dataRef = React.useRef<Point[]>([])
  const mlpRef = React.useRef<MLP | null>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const rafRef = React.useRef<number | undefined>(undefined)

  // Draw decision boundary by sampling grid (declared early so rebuild can use it)
  const drawDecisionBoundary = React.useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !mlpRef.current) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const w = canvas.width, h = canvas.height
    const res = 30 // grid resolution
    const cellW = w / res, cellH = h / res

    ctx.clearRect(0, 0, w, h)
    for (let i = 0; i < res; i++) {
      for (let j = 0; j < res; j++) {
        // Map grid to [-1, 1]
        const x = (i / (res - 1)) * 2 - 1
        const y = (j / (res - 1)) * 2 - 1
        const p = mlpRef.current.forward([x, y])
        // Color: 0 = blue, 1 = orange
        const r = Math.round(255 * p)
        const g = Math.round(150 * (1 - Math.abs(p - 0.5) * 2) + 80)
        const b = Math.round(255 * (1 - p))
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.35)`
        ctx.fillRect(i * cellW, j * cellH, cellW + 1, cellH + 1)
      }
    }
  }, [])

  const drawPoints = React.useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const w = canvas.width, h = canvas.height

    for (const p of dataRef.current) {
      const px = ((p.x + 1) / 2) * w
      const py = ((p.y + 1) / 2) * h
      ctx.beginPath()
      ctx.arc(px, py, 4, 0, Math.PI * 2)
      ctx.fillStyle = p.label === 1 ? 'rgba(249, 115, 22, 0.95)' : 'rgba(59, 130, 246, 0.95)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.6)'
      ctx.lineWidth = 1
      ctx.stroke()
    }
  }, [])

  // Rebuild network when config changes
  const rebuild = React.useCallback(() => {
    const sizes = [2, ...Array(hiddenLayers).fill(hiddenSize), 1]
    mlpRef.current = new MLP(sizes, activation)
    setEpoch(0)
    setLoss(0)
    setAccuracy(0)
    drawDecisionBoundary()
    drawPoints()
  }, [hiddenLayers, hiddenSize, activation, drawDecisionBoundary, drawPoints])

  // Regenerate dataset
  const regenerate = React.useCallback(() => {
    dataRef.current = DATASETS[dataset](200)
    rebuild()
  }, [dataset, rebuild])

  React.useEffect(() => {
    regenerate()
  }, [])

  // Rebuild on architecture change
  React.useEffect(() => {
    rebuild()
  }, [hiddenLayers, hiddenSize, activation])

  // Training step
  const trainStep = React.useCallback(() => {
    if (!mlpRef.current || dataRef.current.length === 0) return
    const l = mlpRef.current.trainBatch(dataRef.current, lr)
    setLoss(l)
    setEpoch((e) => e + 1)
    // Compute accuracy
    let correct = 0
    for (const p of dataRef.current) {
      const out = mlpRef.current!.forward([p.x, p.y])
      if ((out > 0.5 ? 1 : 0) === p.label) correct++
    }
    setAccuracy((correct / dataRef.current.length) * 100)
    drawDecisionBoundary()
    drawPoints()
  }, [lr, drawDecisionBoundary, drawPoints])

  // Animation loop
  React.useEffect(() => {
    if (!playing) return
    let last = performance.now()
    const tick = (now: number) => {
      if (now - last > 50) { // ~20 steps/sec
        // Do a few steps per frame for speed
        for (let i = 0; i < 3; i++) trainStep()
        last = now
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [playing, trainStep])

  const reset = () => {
    setPlaying(false)
    rebuild()
  }

  return (
    <Card className="border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Neural Network Playground</CardTitle>
          <Badge variant="outline" className="ml-auto text-[10px]">Real MLP training in-browser</Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Train a real multi-layer perceptron from scratch. Watch the decision boundary evolve live.
          No external ML library — pure TypeScript backprop.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          {/* Canvas */}
          <div className="space-y-2">
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className="w-full rounded-lg border bg-card"
              style={{ aspectRatio: '1 / 1' }}
            />
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Class 0
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-500" /> Class 1
              </span>
              <span className="ml-auto text-muted-foreground">Background = model's decision boundary</span>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Dataset</label>
              <div className="grid grid-cols-2 gap-1">
                {(Object.keys(DATASETS) as (keyof typeof DATASETS)[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => { setDataset(d); }}
                    className={cn(
                      'rounded border px-2 py-1 text-xs capitalize transition-colors',
                      dataset === d ? 'border-primary bg-primary/10 text-primary' : 'hover:bg-muted'
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <Button size="sm" variant="outline" className="mt-2 w-full" onClick={regenerate}>
                <RotateCcw className="mr-1 h-3 w-3" /> Regenerate data
              </Button>
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Hidden layers: {hiddenLayers}
              </label>
              <input type="range" min={1} max={4} step={1} value={hiddenLayers}
                onChange={(e) => setHiddenLayers(Number(e.target.value))}
                className="w-full accent-primary" />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Neurons per layer: {hiddenSize}
              </label>
              <input type="range" min={2} max={16} step={1} value={hiddenSize}
                onChange={(e) => setHiddenSize(Number(e.target.value))}
                className="w-full accent-primary" />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Learning rate: {lr.toFixed(3)}
              </label>
              <input type="range" min={0.001} max={0.5} step={0.001} value={lr}
                onChange={(e) => setLr(Number(e.target.value))}
                className="w-full accent-primary" />
            </div>

            <div>
              <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Activation</label>
              <div className="grid grid-cols-3 gap-1">
                {(['relu', 'tanh', 'sigmoid'] as Activation[]).map((a) => (
                  <button
                    key={a}
                    onClick={() => setActivation(a)}
                    className={cn(
                      'rounded border px-2 py-1 text-xs transition-colors',
                      activation === a ? 'border-primary bg-primary/10 text-primary' : 'hover:bg-muted'
                    )}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats + actions */}
        <div className="grid grid-cols-3 gap-3 rounded-lg border bg-muted/30 p-3 text-center">
          <div>
            <div className="text-[10px] uppercase text-muted-foreground">Epoch</div>
            <div className="text-lg font-bold font-mono">{epoch}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-muted-foreground">Loss</div>
            <div className="text-lg font-bold font-mono">{loss.toFixed(4)}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-muted-foreground">Accuracy</div>
            <div className="text-lg font-bold font-mono">{accuracy.toFixed(1)}%</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setPlaying(p => !p)} className="flex-1">
            {playing ? <><Pause className="mr-1.5 h-4 w-4" /> Pause</> : <><Play className="mr-1.5 h-4 w-4" /> Train</>}
          </Button>
          <Button onClick={trainStep} variant="outline">
            <Zap className="mr-1 h-4 w-4" /> Step
          </Button>
          <Button onClick={reset} variant="outline">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-muted-foreground">
          <strong className="text-amber-700 dark:text-amber-400">Try this:</strong>{' '}
          Switch to <code>spiral</code> dataset with 1 hidden layer of 4 neurons.
          The model will get stuck around 50% accuracy. Now increase to 3 layers of 12 neurons —
          watch it finally separate the spirals. That is the power of depth.
        </div>
      </CardContent>
    </Card>
  )
}
