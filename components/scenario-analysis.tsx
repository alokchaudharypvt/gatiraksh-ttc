"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ConflictResolutionModal } from "@/components/conflict-resolution-modal"

const RouteIcon = () => (
  <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
    <circle cx="6" cy="19" r="3" />
    <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
  </svg>
)

const PlayIcon = () => (
  <svg className="h-4 w-4 text-secondary" fill="currentColor" viewBox="0 0 24 24">
    <polygon points="5,3 19,12 5,21" />
  </svg>
)

const RotateCcwIcon = () => (
  <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
    <polyline points="1,4 1,10 7,10" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </svg>
)

const ClockIcon = () => (
  <svg className="h-4 w-4 text-chart-4" fill="currentColor" viewBox="0 0 24 24">
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
    <polyline points="22,4 12,14.01 9,11.01" />
  </svg>
)

const ZapIcon = () => (
  <svg className="h-4 w-4 text-secondary" fill="currentColor" viewBox="0 0 24 24">
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
  </svg>
)

const CopyIcon = () => (
  <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

const DownloadIcon = () => (
  <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7,10 12,15 17,10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const ShieldIcon = () => (
  <svg className="h-4 w-4 text-chart-3" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const TargetIcon = () => (
  <svg className="h-4 w-4 text-destructive" fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

interface Conflict {
  id: string
  type: "collision_risk" | "signal_conflict" | "resource_conflict" | "schedule_conflict"
  severity: "critical" | "high" | "medium" | "low"
  trains: string[]
  location: string
  estimatedTime: string
  description: string
  status: "detected" | "resolving" | "resolved"
  resolutionStrategy?: string
  confidence: number
  resolvedAt?: string
}

interface Scenario {
  id: string
  name: string
  description: string
  type: "delay" | "breakdown" | "weather" | "maintenance" | "emergency" | "custom"
  status: "draft" | "running" | "completed" | "failed"
  parameters: {
    duration: number
    severity: "low" | "medium" | "high"
    affectedTrains: string[]
    location: string
  }
  results?: {
    throughputImpact: number
    delayIncrease: number
    alternativeRoutes: number
    recoveryTime: number
    confidence: number
    conflictsDetected: number
    conflictsResolved: number
  }
  createdAt: string
}

export function ScenarioAnalysis() {
  const [scenarios, setScenarios] = useState<Scenario[]>([
    {
      id: "SCN001",
      name: "Signal Failure at Junction A",
      description: "Simulate signal system failure at main junction affecting express and local trains",
      type: "breakdown",
      status: "completed",
      parameters: {
        duration: 45,
        severity: "high",
        affectedTrains: ["EXP001", "LOC045", "LOC046"],
        location: "Junction A",
      },
      results: {
        throughputImpact: -35.2,
        delayIncrease: 18.7,
        alternativeRoutes: 2,
        recoveryTime: 67,
        confidence: 92.4,
        conflictsDetected: 8,
        conflictsResolved: 7,
      },
      createdAt: "2024-01-15T10:30:00Z",
    },
    {
      id: "SCN002",
      name: "Heavy Rain Weather Impact",
      description: "Analyze impact of heavy rainfall on train speeds and scheduling",
      type: "weather",
      status: "completed",
      parameters: {
        duration: 120,
        severity: "medium",
        affectedTrains: ["ALL"],
        location: "Section A-B",
      },
      results: {
        throughputImpact: -22.1,
        delayIncrease: 12.3,
        alternativeRoutes: 0,
        recoveryTime: 45,
        confidence: 87.9,
        conflictsDetected: 3,
        conflictsResolved: 3,
      },
      createdAt: "2024-01-15T09:15:00Z",
    },
  ])

  const [conflicts, setConflicts] = useState<Conflict[]>([
    {
      id: "CONF001",
      type: "collision_risk",
      severity: "critical",
      trains: ["12951", "12615"],
      location: "Junction Delhi-Ghaziabad",
      estimatedTime: "14:25",
      description: "Two express trains approaching same track segment with insufficient separation",
      status: "detected",
      confidence: 94.2,
    },
    {
      id: "CONF002",
      type: "signal_conflict",
      severity: "high",
      trains: ["64501"],
      location: "Signal Box 7A",
      estimatedTime: "14:30",
      description: "Signal system showing conflicting aspects for local train approach",
      status: "resolving",
      resolutionStrategy: "Manual signal override with speed restriction",
      confidence: 87.6,
    },
    {
      id: "CONF003",
      type: "resource_conflict",
      severity: "medium",
      trains: ["BOXN-001", "MEMU-205"],
      location: "Platform 3",
      estimatedTime: "14:45",
      description: "Platform occupation conflict between freight and passenger services",
      status: "resolved",
      resolutionStrategy: "Rerouted freight to alternate platform",
      confidence: 91.3,
    },
  ])

  const [newScenario, setNewScenario] = useState<Partial<Scenario>>({
    name: "",
    description: "",
    type: "delay",
    parameters: {
      duration: 30,
      severity: "medium",
      affectedTrains: [],
      location: "",
    },
  })

  const [isRunning, setIsRunning] = useState(false)
  const [simulationProgress, setSimulationProgress] = useState(0)
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)
  const [conflictDetectionActive, setConflictDetectionActive] = useState(true)
  const [selectedConflict, setSelectedConflict] = useState<any>(null)
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false)

  useEffect(() => {
    if (!conflictDetectionActive) return

    const interval = setInterval(() => {
      // Simulate conflict detection and resolution
      setConflicts((prev) =>
        prev.map((conflict) => {
          if (conflict.status === "detected" && Math.random() > 0.7) {
            return {
              ...conflict,
              status: "resolving",
              resolutionStrategy: getResolutionStrategy(conflict.type),
            }
          }
          if (conflict.status === "resolving" && Math.random() > 0.8) {
            return {
              ...conflict,
              status: "resolved",
            }
          }
          return conflict
        }),
      )

      // Occasionally add new conflicts
      if (Math.random() > 0.95) {
        const newConflict: Conflict = {
          id: `CONF${String(Date.now()).slice(-3)}`,
          type: ["collision_risk", "signal_conflict", "resource_conflict", "schedule_conflict"][
            Math.floor(Math.random() * 4)
          ] as any,
          severity: ["critical", "high", "medium", "low"][Math.floor(Math.random() * 4)] as any,
          trains: [`TRAIN${Math.floor(Math.random() * 100)}`],
          location: `Junction ${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
          estimatedTime: new Date(Date.now() + Math.random() * 3600000).toLocaleTimeString().slice(0, 5),
          description: "Automatically detected potential conflict requiring attention",
          status: "detected",
          confidence: Math.random() * 20 + 75,
        }
        setConflicts((prev) => [newConflict, ...prev.slice(0, 9)])
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [conflictDetectionActive])

  const getResolutionStrategy = (type: string): string => {
    const strategies = {
      collision_risk: "Speed restriction and increased separation distance",
      signal_conflict: "Manual signal override with dispatcher control",
      resource_conflict: "Alternative platform assignment and rescheduling",
      schedule_conflict: "Priority-based scheduling adjustment",
    }
    return strategies[type as keyof typeof strategies] || "Standard conflict resolution protocol"
  }

  const runScenario = (scenarioId: string) => {
    setIsRunning(true)
    setSimulationProgress(0)
    setSelectedScenario(scenarioId)

    const interval = setInterval(() => {
      setSimulationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsRunning(false)

          // Update scenario with results including conflict detection
          setScenarios((prev) =>
            prev.map((scenario) =>
              scenario.id === scenarioId
                ? {
                    ...scenario,
                    status: "completed",
                    results: {
                      throughputImpact: -(Math.random() * 40 + 10),
                      delayIncrease: Math.random() * 25 + 5,
                      alternativeRoutes: Math.floor(Math.random() * 4),
                      recoveryTime: Math.random() * 60 + 30,
                      confidence: Math.random() * 15 + 80,
                      conflictsDetected: Math.floor(Math.random() * 10 + 2),
                      conflictsResolved: Math.floor(Math.random() * 8 + 1),
                    },
                  }
                : scenario,
            ),
          )
          return 100
        }
        return prev + Math.random() * 10 + 5
      })
    }, 300)
  }

  const resolveConflict = async (conflictId: string) => {
    console.log(`[v0] Resolving conflict: ${conflictId}`)
    setConflicts((prev) =>
      prev.map((conflict) =>
        conflict.id === conflictId
          ? {
              ...conflict,
              status: "resolving",
              resolutionStrategy: getResolutionStrategy(conflict.type),
            }
          : conflict,
      ),
    )

    // Simulate resolution time
    setTimeout(() => {
      setConflicts((prev) =>
        prev.map((conflict) => (conflict.id === conflictId ? { ...conflict, status: "resolved" } : conflict)),
      )
    }, 3000)
  }

  const createScenario = () => {
    if (!newScenario.name || !newScenario.description) return

    const scenario: Scenario = {
      id: `SCN${String(scenarios.length + 1).padStart(3, "0")}`,
      name: newScenario.name,
      description: newScenario.description,
      type: newScenario.type || "custom",
      status: "draft",
      parameters: {
        duration: newScenario.parameters?.duration || 30,
        severity: newScenario.parameters?.severity || "medium",
        affectedTrains: newScenario.parameters?.affectedTrains || [],
        location: newScenario.parameters?.location || "",
      },
      createdAt: new Date().toISOString(),
    }

    setScenarios((prev) => [scenario, ...prev])
    setNewScenario({
      name: "",
      description: "",
      type: "delay",
      parameters: {
        duration: 30,
        severity: "medium",
        affectedTrains: [],
        location: "",
      },
    })
  }

  const handleConflictResolve = async (conflictId: string, suggestionId?: string, manualResolution?: string) => {
    console.log("[v0] Resolving conflict:", { conflictId, suggestionId, manualResolution })

    try {
      const response = await fetch("/api/conflicts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "resolve",
          conflictId,
          suggestionId,
          manualResolution,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        // Update local conflicts state
        setConflicts((prev) =>
          prev.map((conflict) =>
            conflict.id === conflictId
              ? { ...conflict, status: "resolved", resolvedAt: new Date().toISOString() }
              : conflict,
          ),
        )
      } else {
        throw new Error(data.error || "Resolution failed")
      }
    } catch (error) {
      console.error("[v0] Conflict resolution error:", error)
      throw error
    }
  }

  const openConflictResolution = (conflict: any) => {
    setSelectedConflict(conflict)
    setIsConflictModalOpen(true)
  }

  const getScenarioTypeColor = (type: string) => {
    switch (type) {
      case "delay":
        return "bg-chart-4"
      case "breakdown":
        return "bg-destructive"
      case "weather":
        return "bg-chart-1"
      case "maintenance":
        return "bg-chart-4"
      case "emergency":
        return "bg-destructive"
      default:
        return "bg-muted"
    }
  }

  const getConflictTypeColor = (type: string) => {
    switch (type) {
      case "collision_risk":
        return "bg-destructive"
      case "signal_conflict":
        return "bg-chart-4"
      case "resource_conflict":
        return "bg-chart-2"
      case "schedule_conflict":
        return "bg-chart-1"
      default:
        return "bg-muted"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "resolved":
        return <CheckCircleIcon />
      case "running":
      case "resolving":
        return (
          <div className="animate-pulse">
            <PlayIcon />
          </div>
        )
      case "failed":
      case "detected":
        return <AlertTriangleIcon />
      default:
        return <ClockIcon />
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <RouteIcon />
            Conflict Detection & Scenario Analysis
          </CardTitle>
          <CardDescription>
            Real-time conflict detection with AI-powered resolution strategies and scenario simulation
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="conflicts" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="conflicts">Live Conflicts</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="create">Create Scenario</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="conflicts" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">Real-Time Conflict Detection</CardTitle>
                  <CardDescription>AI-powered monitoring and automatic conflict resolution</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={conflictDetectionActive ? "default" : "secondary"}
                    className={conflictDetectionActive ? "bg-chart-3/10 text-chart-3 border-chart-3/20" : ""}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${conflictDetectionActive ? "bg-chart-3 animate-pulse" : "bg-muted-foreground"}`}
                    />
                    {conflictDetectionActive ? "Active" : "Inactive"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConflictDetectionActive(!conflictDetectionActive)}
                    className="border-border hover:bg-muted bg-transparent"
                  >
                    {conflictDetectionActive ? "Disable" : "Enable"} Detection
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-destructive">
                    {conflicts.filter((c) => c.status === "detected").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Conflicts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-chart-4">
                    {conflicts.filter((c) => c.status === "resolving").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Resolving</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-chart-3">
                    {conflicts.filter((c) => c.status === "resolved").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Resolved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-chart-1">
                    {conflicts.length > 0
                      ? ((conflicts.filter((c) => c.status === "resolved").length / conflicts.length) * 100).toFixed(1)
                      : 0}
                    %
                  </div>
                  <div className="text-sm text-muted-foreground">Resolution Rate</div>
                </div>
              </div>

              <div className="space-y-4">
                {conflicts.map((conflict) => (
                  <div
                    key={conflict.id}
                    className={`p-4 border rounded-lg ${
                      conflict.severity === "critical"
                        ? "border-destructive/20 bg-destructive/5"
                        : conflict.severity === "high"
                          ? "border-chart-4/20 bg-chart-4/5"
                          : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getConflictTypeColor(conflict.type)}`}>
                        {conflict.type === "collision_risk" && <TargetIcon />}
                        {conflict.type === "signal_conflict" && <AlertTriangleIcon />}
                        {conflict.type === "resource_conflict" && <RouteIcon />}
                        {conflict.type === "schedule_conflict" && <ClockIcon />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-foreground">Conflict {conflict.id}</h4>
                          <Badge
                            variant={conflict.severity === "critical" ? "destructive" : "secondary"}
                            className="text-xs capitalize"
                          >
                            {conflict.severity}
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize bg-muted">
                            {conflict.type.replace("_", " ")}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{conflict.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-muted-foreground">Trains:</span>
                            <span className="font-medium text-foreground ml-1">{conflict.trains.join(", ")}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Location:</span>
                            <span className="font-medium text-foreground ml-1">{conflict.location}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">ETA:</span>
                            <span className="font-medium text-foreground ml-1">{conflict.estimatedTime}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Confidence:</span>
                            <span className="font-medium text-foreground ml-1">{conflict.confidence.toFixed(1)}%</span>
                          </div>
                        </div>
                        {conflict.resolutionStrategy && (
                          <div className="mb-3 p-2 bg-muted rounded text-sm">
                            <span className="font-medium text-foreground">Resolution Strategy:</span>
                            <span className="text-muted-foreground ml-1">{conflict.resolutionStrategy}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          {getStatusIcon(conflict.status)}
                          <span className="text-sm font-medium text-foreground capitalize">{conflict.status}</span>
                          {conflict.status === "detected" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => resolveConflict(conflict.id)}
                                className="ml-auto bg-secondary hover:bg-secondary/90"
                              >
                                <ShieldIcon />
                                <span className="ml-1">Auto-Resolve</span>
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openConflictResolution(conflict)}
                                className="border-secondary/20 text-secondary hover:bg-secondary/5 bg-transparent"
                              >
                                <ZapIcon />
                                <span className="ml-1">Manual Resolve</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          {isRunning && selectedScenario && (
            <Card className="border-secondary/20 bg-secondary/5">
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Running Simulation</CardTitle>
                <CardDescription>Scenario: {scenarios.find((s) => s.id === selectedScenario)?.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Progress</span>
                    <Badge variant="secondary" className="animate-pulse bg-secondary/10 text-secondary">
                      {simulationProgress.toFixed(0)}%
                    </Badge>
                  </div>
                  <Progress value={simulationProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    Analyzing traffic patterns, detecting conflicts, calculating alternative routes, and optimizing
                    recovery strategies...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4">
            {scenarios.map((scenario) => (
              <Card key={scenario.id} className="border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getScenarioTypeColor(scenario.type)}`} />
                      <div>
                        <CardTitle className="text-lg text-foreground">{scenario.name}</CardTitle>
                        <CardDescription>{scenario.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(scenario.status)}
                      <Badge variant="outline" className="capitalize bg-muted">
                        {scenario.type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Duration</Label>
                      <div className="font-medium text-foreground">{scenario.parameters.duration}m</div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Severity</Label>
                      <Badge
                        variant={scenario.parameters.severity === "high" ? "destructive" : "secondary"}
                        className="capitalize"
                      >
                        {scenario.parameters.severity}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Location</Label>
                      <div className="font-medium text-foreground">{scenario.parameters.location || "Multiple"}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Affected Trains</Label>
                      <div className="font-medium text-foreground">
                        {scenario.parameters.affectedTrains.length === 0
                          ? "All"
                          : scenario.parameters.affectedTrains.length}
                      </div>
                    </div>
                  </div>

                  {scenario.results && (
                    <div className="border-t border-border pt-4">
                      <h4 className="font-medium mb-3 text-foreground">Simulation Results</h4>
                      <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
                        <div className="text-center">
                          <div
                            className={`text-xl font-bold ${scenario.results.throughputImpact < 0 ? "text-destructive" : "text-chart-3"}`}
                          >
                            {scenario.results.throughputImpact > 0 ? "+" : ""}
                            {scenario.results.throughputImpact.toFixed(1)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Throughput Impact</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-chart-4">
                            +{scenario.results.delayIncrease.toFixed(1)}m
                          </div>
                          <div className="text-xs text-muted-foreground">Avg Delay Increase</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-chart-1">{scenario.results.alternativeRoutes}</div>
                          <div className="text-xs text-muted-foreground">Alternative Routes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-chart-2">
                            {scenario.results.recoveryTime.toFixed(0)}m
                          </div>
                          <div className="text-xs text-muted-foreground">Recovery Time</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-chart-3">
                            {scenario.results.confidence.toFixed(1)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Confidence</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-destructive">{scenario.results.conflictsDetected}</div>
                          <div className="text-xs text-muted-foreground">Conflicts Detected</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-chart-3">{scenario.results.conflictsResolved}</div>
                          <div className="text-xs text-muted-foreground">Conflicts Resolved</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    {scenario.status === "draft" || scenario.status === "completed" ? (
                      <Button
                        size="sm"
                        onClick={() => runScenario(scenario.id)}
                        disabled={isRunning}
                        className="bg-secondary hover:bg-secondary/90"
                      >
                        <PlayIcon />
                        <span className="ml-2">{scenario.status === "completed" ? "Re-run" : "Run"} Simulation</span>
                      </Button>
                    ) : null}

                    <Button size="sm" variant="outline" className="border-border hover:bg-muted bg-transparent">
                      <CopyIcon />
                      <span className="ml-2">Duplicate</span>
                    </Button>

                    {scenario.results && (
                      <Button size="sm" variant="outline" className="border-border hover:bg-muted bg-transparent">
                        <DownloadIcon />
                        <span className="ml-2">Export Results</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Create New Scenario</CardTitle>
              <CardDescription>Define parameters for a new what-if analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scenario-name" className="text-foreground">
                    Scenario Name
                  </Label>
                  <Input
                    id="scenario-name"
                    placeholder="e.g., Track Maintenance at Station B"
                    value={newScenario.name || ""}
                    onChange={(e) => setNewScenario((prev) => ({ ...prev, name: e.target.value }))}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scenario-type" className="text-foreground">
                    Scenario Type
                  </Label>
                  <Select
                    value={newScenario.type}
                    onValueChange={(value) => setNewScenario((prev) => ({ ...prev, type: value as any }))}
                  >
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="delay">Train Delay</SelectItem>
                      <SelectItem value="breakdown">Equipment Breakdown</SelectItem>
                      <SelectItem value="weather">Weather Impact</SelectItem>
                      <SelectItem value="maintenance">Maintenance Work</SelectItem>
                      <SelectItem value="emergency">Emergency Situation</SelectItem>
                      <SelectItem value="custom">Custom Scenario</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scenario-description" className="text-foreground">
                  Description
                </Label>
                <Textarea
                  id="scenario-description"
                  placeholder="Describe the scenario and its expected impact..."
                  value={newScenario.description || ""}
                  onChange={(e) => setNewScenario((prev) => ({ ...prev, description: e.target.value }))}
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-foreground">
                    Duration (minutes)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    max="480"
                    value={newScenario.parameters?.duration || 30}
                    onChange={(e) =>
                      setNewScenario((prev) => ({
                        ...prev,
                        parameters: { ...prev.parameters!, duration: Number.parseInt(e.target.value) },
                      }))
                    }
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="severity" className="text-foreground">
                    Severity Level
                  </Label>
                  <Select
                    value={newScenario.parameters?.severity}
                    onValueChange={(value) =>
                      setNewScenario((prev) => ({
                        ...prev,
                        parameters: { ...prev.parameters!, severity: value as any },
                      }))
                    }
                  >
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Impact</SelectItem>
                      <SelectItem value="medium">Medium Impact</SelectItem>
                      <SelectItem value="high">High Impact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-foreground">
                    Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g., Junction A, Section B-C"
                    value={newScenario.parameters?.location || ""}
                    onChange={(e) =>
                      setNewScenario((prev) => ({
                        ...prev,
                        parameters: { ...prev.parameters!, location: e.target.value },
                      }))
                    }
                    className="bg-input border-border text-foreground"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={createScenario}
                  disabled={!newScenario.name || !newScenario.description}
                  className="bg-secondary hover:bg-secondary/90"
                >
                  <ZapIcon />
                  <span className="ml-2">Create Scenario</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setNewScenario({
                      name: "",
                      description: "",
                      type: "delay",
                      parameters: {
                        duration: 30,
                        severity: "medium",
                        affectedTrains: [],
                        location: "",
                      },
                    })
                  }
                  className="border-border hover:bg-muted bg-transparent"
                >
                  <RotateCcwIcon />
                  <span className="ml-2">Reset</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: "Signal System Failure",
                description: "Complete signal failure at major junction with conflict detection",
                type: "breakdown",
                severity: "high",
                duration: 60,
              },
              {
                name: "Heavy Monsoon Impact",
                description: "Reduced visibility and speed restrictions with resource conflicts",
                type: "weather",
                severity: "medium",
                duration: 180,
              },
              {
                name: "Track Maintenance Block",
                description: "Scheduled maintenance requiring track closure and rerouting",
                type: "maintenance",
                severity: "medium",
                duration: 240,
              },
              {
                name: "Emergency Medical Evacuation",
                description: "Medical emergency requiring immediate response and priority routing",
                type: "emergency",
                severity: "high",
                duration: 45,
              },
            ].map((template, index) => (
              <Card key={index} className="cursor-pointer hover:border-secondary/50 transition-colors border-border">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getScenarioTypeColor(template.type)}`} />
                    <CardTitle className="text-lg text-foreground">{template.name}</CardTitle>
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-4 text-sm">
                      <span className="text-foreground">Duration: {template.duration}m</span>
                      <Badge
                        variant={template.severity === "high" ? "destructive" : "secondary"}
                        className="capitalize"
                      >
                        {template.severity}
                      </Badge>
                    </div>
                  </div>
                  <Button size="sm" className="w-full bg-secondary hover:bg-secondary/90">
                    <CopyIcon />
                    <span className="ml-2">Use Template</span>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <ConflictResolutionModal
        conflict={selectedConflict}
        isOpen={isConflictModalOpen}
        onClose={() => {
          setIsConflictModalOpen(false)
          setSelectedConflict(null)
        }}
        onResolve={handleConflictResolve}
      />
    </div>
  )
}
