"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { LiveTrainMap } from "@/components/live-train-map"
import { AIOptimizationEngine } from "@/components/ai-optimization-engine"
import { PerformanceDashboard } from "@/components/performance-dashboard"
import { ScenarioAnalysis } from "@/components/scenario-analysis"
import { ScheduleManagement } from "@/components/schedule-management"
import { AlertsNotifications } from "@/components/alerts-notifications"

const IndianRailwayLogo = () => (
  <svg className="h-10 w-10" fill="none" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="railGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#374151" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
    </defs>
    {/* Outer circle with Indian Railway colors */}
    <circle cx="50" cy="50" r="45" fill="url(#railGradient)" stroke="#1f2937" strokeWidth="2" />
    {/* Train body */}
    <rect x="25" y="42" width="50" height="16" rx="8" fill="#ffffff" />
    {/* Train wheels */}
    <circle cx="35" cy="65" r="6" fill="#1f2937" />
    <circle cx="65" cy="65" r="6" fill="#1f2937" />
    {/* Train chimney/signal */}
    <rect x="47" y="30" width="6" height="12" rx="3" fill="#ffffff" />
    {/* IR text */}
    <text x="50" y="80" textAnchor="middle" fontSize="12" fill="#ffffff" fontWeight="bold" fontFamily="sans-serif">
      IR
    </text>
  </svg>
)

const TrainIcon = () => (
  <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C8 2 5 5 5 9v6c0 3.5 2.5 6 6 6h2c3.5 0 6-2.5 6-6V9c0-4-3-7-7-7zm0 2c3 0 5 2 5 5v6c0 2.5-1.5 4-4 4h-2c-2.5 0-4-1.5-4-4V9c0-3 2-5 5-5z" />
  </svg>
)

const ActivityIcon = () => (
  <svg className="h-4 w-4 text-secondary" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
)

const ClockIcon = () => (
  <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
)

const AlertTriangleIcon = () => (
  <svg className="h-4 w-4 text-destructive" fill="currentColor" viewBox="0 0 24 24">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const CheckCircleIcon = () => (
  <svg className="h-4 w-4 text-chart-3" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22,4 12,14.01 9,11.01 1 18" />
  </svg>
)

const TrendingUpIcon = () => (
  <svg className="h-4 w-4 text-secondary" fill="currentColor" viewBox="0 0 24 24">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)

const MapPinIcon = () => (
  <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const ZapIcon = () => (
  <svg className="h-4 w-4 text-secondary" fill="currentColor" viewBox="0 0 24 24">
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
  </svg>
)

const BarChart3Icon = () => (
  <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
)

const BellIcon = () => (
  <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9a9 9 0 0 1 18 0z" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const RouteIcon = () => (
  <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
    <circle cx="6" cy="19" r="3" />
    <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
  </svg>
)

export default function RailwayControlSystem() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [realTimeData, setRealTimeData] = useState({
    activeTrains: 47,
    onTimePerformance: 94.2,
    sectionThroughput: 156,
    avgDelay: 2.3,
    criticalAlerts: 3,
    systemStatus: "optimal",
    currentSection: "New Delhi - Mumbai Central",
    weatherCondition: "Clear",
    trackUtilization: 78.5,
    fuelEfficiency: 92.1,
    passengerLoad: 85.3,
    freightTrains: 12,
    passengerTrains: 35,
  })
  const [isOptimizing, setIsOptimizing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData((prev) => ({
        ...prev,
        activeTrains: Math.max(30, Math.min(60, prev.activeTrains + Math.floor(Math.random() * 3) - 1)),
        onTimePerformance: Math.max(85, Math.min(99, prev.onTimePerformance + (Math.random() - 0.5) * 2)),
        sectionThroughput: Math.max(120, Math.min(200, prev.sectionThroughput + Math.floor(Math.random() * 10) - 5)),
        avgDelay: Math.max(0, Math.min(10, prev.avgDelay + (Math.random() - 0.5) * 0.5)),
        trackUtilization: Math.max(60, Math.min(95, prev.trackUtilization + (Math.random() - 0.5) * 3)),
        fuelEfficiency: Math.max(85, Math.min(98, prev.fuelEfficiency + (Math.random() - 0.5) * 1)),
        passengerLoad: Math.max(70, Math.min(100, prev.passengerLoad + (Math.random() - 0.5) * 2)),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const runQuickOptimization = async () => {
    setIsOptimizing(true)
    console.log("[v0] Running AI optimization for Indian Railway section")

    try {
      const response = await fetch("/api/ai/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          algorithm: "hybrid",
          target: "throughput",
          timeHorizon: "1h",
          currentData: realTimeData,
          section: realTimeData.currentSection,
          railwayZone: "Northern Railway",
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        toast({
          title: "AI Optimization Complete",
          description: `Achieved ${data.result.improvement.toFixed(1)}% improvement in ${realTimeData.currentSection} section`,
        })

        setRealTimeData((prev) => ({
          ...prev,
          onTimePerformance: Math.min(99, prev.onTimePerformance + data.result.improvement * 0.3),
          sectionThroughput: Math.floor(prev.sectionThroughput + data.result.throughputGain * 1.5),
          avgDelay: Math.max(0, prev.avgDelay - data.result.delayReduction * 0.1),
          trackUtilization: Math.min(95, prev.trackUtilization + data.result.improvement * 0.2),
        }))
      } else {
        throw new Error(data.error || "Optimization failed")
      }
    } catch (error) {
      console.error("[v0] Quick optimization error:", error)
      toast({
        title: "Optimization Failed",
        description: "Unable to complete optimization. Please check system connectivity.",
        variant: "destructive",
      })
    } finally {
      setIsOptimizing(false)
    }
  }

  const createEmergencyScenario = () => {
    setActiveTab("scenarios")
    toast({
      title: "Emergency Protocol Activated",
      description: "Switched to scenario analysis for emergency response planning",
    })
  }

  const generateReport = async () => {
    console.log("[v0] Generating Indian Railway performance report")

    try {
      const response = await fetch(
        "/api/performance/analytics?timeRange=24h&section=" + encodeURIComponent(realTimeData.currentSection),
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Performance Report Generated",
          description: `24-hour analysis for ${realTimeData.currentSection} section completed`,
        })
      }
    } catch (error) {
      console.error("[v0] Report generation error:", error)
      toast({
        title: "Report Generation Failed",
        description: "Unable to generate report. Please check system connectivity.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <IndianRailwayLogo />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Indian Railway Traffic Control</h1>
                  <p className="text-sm text-muted-foreground">
                    AI-Powered Section Management System • {realTimeData.currentSection}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge
                variant={realTimeData.systemStatus === "optimal" ? "default" : "destructive"}
                className="bg-chart-3/10 text-green-700 dark:text-green-400 border-chart-3/20"
              >
                <div className="w-2 h-2 bg-chart-3 rounded-full mr-2 animate-pulse" />
                {realTimeData.systemStatus.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="bg-chart-4/10 text-amber-700 dark:text-amber-400 border-chart-4/20">
                {realTimeData.weatherCondition}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 lg:w-fit bg-muted">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3Icon />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="visualization" className="flex items-center gap-2">
              <MapPinIcon />
              Live Map
            </TabsTrigger>
            <TabsTrigger value="ai-engine" className="flex items-center gap-2">
              <ZapIcon />
              AI Engine
            </TabsTrigger>
            <TabsTrigger value="scenarios" className="flex items-center gap-2">
              <RouteIcon />
              Scenarios
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <TrendingUpIcon />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <ClockIcon />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <BellIcon />
              Alerts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Critical Alerts */}
            {realTimeData.criticalAlerts > 0 && (
              <Alert className="border-destructive/20 bg-destructive/5">
                <AlertTriangleIcon />
                <AlertTitle className="text-destructive">Critical Alerts Active</AlertTitle>
                <AlertDescription className="text-destructive/80">
                  {realTimeData.criticalAlerts} critical issues require immediate attention in{" "}
                  {realTimeData.currentSection} section.
                  <Button
                    variant="link"
                    className="p-0 h-auto ml-2 text-destructive hover:text-destructive/80 font-medium"
                    onClick={() => setActiveTab("alerts")}
                  >
                    View Details →
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-chart-1/20 bg-gradient-to-br from-chart-1/5 to-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Active Trains</CardTitle>
                  <TrainIcon />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-chart-1">{realTimeData.activeTrains}</div>
                  <p className="text-xs text-muted-foreground">
                    Passenger: {realTimeData.passengerTrains} • Freight: {realTimeData.freightTrains}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-chart-3/20 bg-gradient-to-br from-chart-3/5 to-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">On-Time Performance</CardTitle>
                  <CheckCircleIcon />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-chart-3">{realTimeData.onTimePerformance.toFixed(1)}%</div>
                  <Progress value={realTimeData.onTimePerformance} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">Target: 95% • IR Standard</p>
                </CardContent>
              </Card>

              <Card className="border-secondary/20 bg-gradient-to-br from-secondary/5 to-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Section Throughput</CardTitle>
                  <ActivityIcon />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-secondary">{realTimeData.sectionThroughput}</div>
                  <p className="text-xs text-muted-foreground">
                    trains/hour • Utilization: {realTimeData.trackUtilization.toFixed(1)}%
                  </p>
                </CardContent>
              </Card>

              <Card className="border-chart-4/20 bg-gradient-to-br from-chart-4/5 to-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-card-foreground">Average Delay</CardTitle>
                  <ClockIcon />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                    {realTimeData.avgDelay.toFixed(1)}m
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Passenger Load: {realTimeData.passengerLoad.toFixed(1)}%
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Railway Operations Control</CardTitle>
                <CardDescription>
                  Critical operations and emergency protocols for {realTimeData.currentSection}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    className="h-20 flex-col gap-2 bg-secondary hover:bg-secondary/90"
                    onClick={runQuickOptimization}
                    disabled={isOptimizing}
                  >
                    {isOptimizing ? (
                      <>
                        <ZapIcon />
                        <span className="animate-pulse">Optimizing...</span>
                      </>
                    ) : (
                      <>
                        <ZapIcon />
                        <span>AI Optimization</span>
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 border-chart-3/20 hover:bg-chart-3/5 bg-transparent"
                    onClick={() => setActiveTab("scenarios")}
                  >
                    <RouteIcon />
                    <span>Route Planning</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 border-destructive/20 hover:bg-destructive/5 bg-transparent"
                    onClick={() => setActiveTab("alerts")}
                  >
                    <AlertTriangleIcon />
                    <span>Emergency Protocol</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col gap-2 border-chart-1/20 hover:bg-chart-1/5 bg-transparent"
                    onClick={() => setActiveTab("performance")}
                  >
                    <TrendingUpIcon />
                    <span>Performance Report</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Network Status - Northern Railway Zone</CardTitle>
                <CardDescription>Real-time status of major Indian Railway corridors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-chart-3/5 rounded-lg border border-chart-3/20">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">Delhi - Mumbai</span>
                      <Badge className="bg-chart-3/10 text-green-700 dark:text-green-400 border-chart-3/20">
                        Normal
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Rajdhani Express on schedule</p>
                  </div>
                  <div className="p-4 bg-chart-4/5 rounded-lg border border-chart-4/20">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">Delhi - Kolkata</span>
                      <Badge className="bg-chart-4/10 text-amber-700 dark:text-amber-400 border-chart-4/20">
                        Delayed
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">15 min delay due to fog</p>
                  </div>
                  <div className="p-4 bg-chart-1/5 rounded-lg border border-chart-1/20">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">Delhi - Chennai</span>
                      <Badge className="bg-chart-1/10 text-blue-700 dark:text-blue-400 border-chart-1/20">
                        Optimal
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Grand Trunk Express running efficiently</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other Tab Contents */}
          <TabsContent value="visualization">
            <LiveTrainMap />
          </TabsContent>

          <TabsContent value="ai-engine">
            <AIOptimizationEngine />
          </TabsContent>

          <TabsContent value="scenarios">
            <ScenarioAnalysis />
          </TabsContent>

          <TabsContent value="performance">
            <PerformanceDashboard />
          </TabsContent>

          <TabsContent value="schedule">
            <ScheduleManagement />
          </TabsContent>

          <TabsContent value="alerts">
            <AlertsNotifications />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t bg-card/80 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <IndianRailwayLogo />
              <span>Developed by</span>
              <Badge variant="outline" className="font-mono bg-secondary/10 text-secondary border-secondary/20">
                Team CipherX
              </Badge>
              <span className="text-xs">• Indian Railway AI Solutions</span>
            </div>
            <div className="text-xs text-muted-foreground">
              AI-Powered Railway Traffic Control System v2.0 • Built for Indian Railways
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
