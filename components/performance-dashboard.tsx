"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SimpleBarChart, SimpleLineChart, SimplePieChart } from "@/components/ui/chart"

const TrendingUpIcon = () => (
  <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

const TrendingDownIcon = () => (
  <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
  </svg>
)

const BarChart3Icon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
)

const RefreshIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
)

const DownloadIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
)

const AlertTriangleIcon = () => (
  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
    />
  </svg>
)

const CheckCircleIcon = () => (
  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

interface KPIData {
  name: string
  value: number
  target: number
  trend: "up" | "down" | "stable"
  change: number
  unit: string
  status: "good" | "warning" | "critical"
}

export function PerformanceDashboard() {
  const [timeRange, setTimeRange] = useState("24h")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [kpiData, setKpiData] = useState<KPIData[]>([
    {
      name: "On-Time Performance",
      value: 94.2,
      target: 95.0,
      trend: "up",
      change: 2.1,
      unit: "%",
      status: "warning",
    },
    {
      name: "Section Throughput",
      value: 156,
      target: 150,
      trend: "up",
      change: 8.3,
      unit: "trains/hour",
      status: "good",
    },
    {
      name: "Average Delay",
      value: 2.3,
      target: 2.0,
      trend: "down",
      change: -0.8,
      unit: "minutes",
      status: "warning",
    },
    {
      name: "Passenger Satisfaction",
      value: 87.6,
      target: 90.0,
      trend: "up",
      change: 1.4,
      unit: "%",
      status: "warning",
    },
    {
      name: "Energy Efficiency",
      value: 92.1,
      target: 88.0,
      trend: "up",
      change: 3.2,
      unit: "%",
      status: "good",
    },
    {
      name: "System Availability",
      value: 99.7,
      target: 99.5,
      trend: "stable",
      change: 0.1,
      unit: "%",
      status: "good",
    },
  ])

  const [performanceData] = useState([
    { time: "00:00", throughput: 45, delays: 1.2, onTime: 96.5 },
    { time: "04:00", throughput: 32, delays: 0.8, onTime: 97.8 },
    { time: "08:00", throughput: 142, delays: 3.1, onTime: 92.3 },
    { time: "12:00", throughput: 156, delays: 2.8, onTime: 93.7 },
    { time: "16:00", throughput: 168, delays: 3.5, onTime: 91.2 },
    { time: "20:00", throughput: 134, delays: 2.1, onTime: 95.1 },
  ])

  const [trainTypeData] = useState([
    { name: "Express", value: 35, color: "#059669" },
    { name: "Local", value: 45, color: "#10b981" },
    { name: "Freight", value: 15, color: "#f97316" },
    { name: "Maintenance", value: 5, color: "#6b7280" },
  ])

  const [delayAnalysis] = useState([
    { category: "Signal Issues", count: 12, avgDelay: 8.5 },
    { category: "Weather", count: 8, avgDelay: 15.2 },
    { category: "Technical", count: 6, avgDelay: 22.1 },
    { category: "Passenger", count: 15, avgDelay: 3.8 },
    { category: "Track Work", count: 4, avgDelay: 45.6 },
  ])

  const getKPIStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-500"
      case "warning":
        return "text-yellow-500"
      case "critical":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUpIcon />
    if (trend === "down") return <TrendingDownIcon />
    return <div className="h-4 w-4 bg-gray-400 rounded-full" />
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update KPI data with new values
    setKpiData((prev) =>
      prev.map((kpi) => ({
        ...kpi,
        value: Math.max(0, kpi.value + (Math.random() - 0.5) * 2),
        change: (Math.random() - 0.5) * 4,
      })),
    )

    setIsRefreshing(false)
  }

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Metric,Value,Target,Status\n" +
      kpiData.map((kpi) => `${kpi.name},${kpi.value},${kpi.target},${kpi.status}`).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "performance_report.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setKpiData((prev) =>
        prev.map((kpi) => ({
          ...kpi,
          value: Math.max(0, kpi.value + (Math.random() - 0.5) * 0.5),
          change: (Math.random() - 0.5) * 2,
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3Icon />
                Performance Analytics & KPIs
              </CardTitle>
              <CardDescription>Real-time performance metrics and historical analysis</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshIcon />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <DownloadIcon />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiData.map((kpi) => (
          <Card key={kpi.name} className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.name}</CardTitle>
                {getTrendIcon(kpi.trend)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-bold ${getKPIStatusColor(kpi.status)}`}>{kpi.value.toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">{kpi.unit}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Target: {kpi.target.toFixed(1)}
                    {kpi.unit}
                  </span>
                  <span className={`flex items-center gap-1 ${kpi.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {kpi.change >= 0 ? "+" : ""}
                    {kpi.change.toFixed(1)}%
                  </span>
                </div>

                <Progress value={(kpi.value / kpi.target) * 100} className="h-2" />

                <div className="flex items-center gap-1">
                  {kpi.status === "good" && <CheckCircleIcon />}
                  {(kpi.status === "warning" || kpi.status === "critical") && <AlertTriangleIcon />}
                  <span className={`text-xs capitalize ${getKPIStatusColor(kpi.status)}`}>{kpi.status}</span>
                </div>
              </div>
            </CardContent>
            <div
              className={`absolute inset-0 bg-gradient-to-r opacity-5 ${
                kpi.status === "good" ? "from-green-500" : kpi.status === "warning" ? "from-yellow-500" : "from-red-500"
              } to-transparent`}
            />
          </Card>
        ))}
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
          <TabsTrigger value="analysis">Delay Analysis</TabsTrigger>
          <TabsTrigger value="capacity">Capacity Utilization</TabsTrigger>
          <TabsTrigger value="comparison">Historical Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Throughput Over Time</CardTitle>
                <CardDescription>Real-time throughput metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleBarChart data={performanceData} dataKey="throughput" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Train Type Distribution</CardTitle>
                <CardDescription>Current traffic composition</CardDescription>
              </CardHeader>
              <CardContent>
                <SimplePieChart data={trainTypeData} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>On-Time Performance Trend</CardTitle>
              <CardDescription>Performance patterns over time</CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleLineChart data={performanceData} dataKey="onTime" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Delay Categories</CardTitle>
                <CardDescription>Analysis of delay causes and impact</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleBarChart data={delayAnalysis} dataKey="count" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Delay by Category</CardTitle>
                <CardDescription>Impact severity analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {delayAnalysis.map((item) => (
                    <div key={item.category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.category}</span>
                        <span className="text-sm text-muted-foreground">{item.avgDelay.toFixed(1)} min avg</span>
                      </div>
                      <Progress value={(item.avgDelay / 50) * 100} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{item.count} incidents</span>
                        <span>{(item.count * item.avgDelay).toFixed(0)} total min</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Delay Impact Analysis</CardTitle>
              <CardDescription>Financial and operational impact of delays</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-500">₹2.4L</div>
                  <div className="text-sm text-muted-foreground">Daily Delay Cost</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-500">1,247</div>
                  <div className="text-sm text-muted-foreground">Affected Passengers</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-500">18.5</div>
                  <div className="text-sm text-muted-foreground">Avg Delay (min)</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-500">87%</div>
                  <div className="text-sm text-muted-foreground">Recovery Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capacity" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Section Capacity Utilization</CardTitle>
                <CardDescription>Current vs maximum capacity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { section: "Section A-B", current: 156, max: 180, utilization: 86.7 },
                    { section: "Section B-C", current: 142, max: 160, utilization: 88.8 },
                    { section: "Section C-D", current: 98, max: 140, utilization: 70.0 },
                    { section: "Junction A", current: 89, max: 100, utilization: 89.0 },
                  ].map((item) => (
                    <div key={item.section} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{item.section}</span>
                        <span className="text-sm text-muted-foreground">
                          {item.current}/{item.max} trains/hour
                        </span>
                      </div>
                      <Progress value={item.utilization} className="h-3" />
                      <div className="flex justify-between text-xs">
                        <span
                          className={`${item.utilization > 85 ? "text-red-500" : item.utilization > 70 ? "text-yellow-500" : "text-green-500"}`}
                        >
                          {item.utilization.toFixed(1)}% utilized
                        </span>
                        <span className="text-muted-foreground">{item.max - item.current} available</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Peak Hour Analysis</CardTitle>
                <CardDescription>Traffic patterns throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleLineChart data={performanceData} dataKey="throughput" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historical Performance Comparison</CardTitle>
              <CardDescription>Compare current performance with historical data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-lg font-medium mb-2">This Month</div>
                  <div className="text-3xl font-bold text-primary">94.2%</div>
                  <div className="text-sm text-muted-foreground">On-Time Performance</div>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <TrendingUpIcon />
                    <span className="text-green-500 text-sm">+2.1%</span>
                  </div>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <div className="text-lg font-medium mb-2">Last Month</div>
                  <div className="text-3xl font-bold text-muted-foreground">92.1%</div>
                  <div className="text-sm text-muted-foreground">On-Time Performance</div>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <TrendingDownIcon />
                    <span className="text-red-500 text-sm">-1.3%</span>
                  </div>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <div className="text-lg font-medium mb-2">Same Month Last Year</div>
                  <div className="text-3xl font-bold text-muted-foreground">89.8%</div>
                  <div className="text-sm text-muted-foreground">On-Time Performance</div>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <TrendingUpIcon />
                    <span className="text-green-500 text-sm">+4.4%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
