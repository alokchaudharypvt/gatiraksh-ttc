"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
    color?: string
  }
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }
  return context
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig
  children: React.ReactNode
}) {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div data-chart={chartId} className={cn("flex aspect-video justify-center text-xs", className)} {...props}>
        {children}
      </div>
    </ChartContext.Provider>
  )
}

// Simple Bar Chart Component
export function SimpleBarChart({
  data,
  dataKey,
  className,
}: {
  data: any[]
  dataKey: string
  className?: string
}) {
  const maxValue = Math.max(...data.map((item) => item[dataKey]))

  return (
    <div className={cn("flex items-end justify-between h-48 gap-2", className)}>
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center gap-2 flex-1">
          <div
            className="bg-emerald-500 rounded-t w-full transition-all duration-300 hover:bg-emerald-600"
            style={{ height: `${(item[dataKey] / maxValue) * 100}%` }}
          />
          <span className="text-xs text-muted-foreground">{item.name || item.time}</span>
        </div>
      ))}
    </div>
  )
}

// Simple Line Chart Component
export function SimpleLineChart({
  data,
  dataKey,
  className,
}: {
  data: any[]
  dataKey: string
  className?: string
}) {
  const maxValue = Math.max(...data.map((item) => item[dataKey]))
  const minValue = Math.min(...data.map((item) => item[dataKey]))
  const range = maxValue - minValue

  return (
    <div className={cn("relative h-48", className)}>
      <svg className="w-full h-full" viewBox="0 0 400 200">
        <polyline
          fill="none"
          stroke="#059669"
          strokeWidth="2"
          points={data
            .map((item, index) => {
              const x = (index / (data.length - 1)) * 380 + 10
              const y = 190 - ((item[dataKey] - minValue) / range) * 180
              return `${x},${y}`
            })
            .join(" ")}
        />
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * 380 + 10
          const y = 190 - ((item[dataKey] - minValue) / range) * 180
          return <circle key={index} cx={x} cy={y} r="3" fill="#059669" className="hover:r-4 transition-all" />
        })}
      </svg>
      <div className="flex justify-between mt-2">
        {data.map((item, index) => (
          <span key={index} className="text-xs text-muted-foreground">
            {item.name || item.time}
          </span>
        ))}
      </div>
    </div>
  )
}

// Simple Pie Chart Component
export function SimplePieChart({
  data,
  className,
}: {
  data: Array<{ name: string; value: number; color: string }>
  className?: string
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = 0

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {data.map((item, index) => {
            const percentage = item.value / total
            const angle = percentage * 360
            const startAngle = currentAngle
            currentAngle += angle

            const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180)
            const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180)
            const x2 = 50 + 40 * Math.cos(((startAngle + angle) * Math.PI) / 180)
            const y2 = 50 + 40 * Math.sin(((startAngle + angle) * Math.PI) / 180)

            const largeArcFlag = angle > 180 ? 1 : 0

            return (
              <path
                key={index}
                d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                fill={item.color}
                className="hover:opacity-80 transition-opacity"
              />
            )
          })}
        </svg>
      </div>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-sm">
              {item.name}: {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { ChartContainer, useChart }
