"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

const PlayIcon = () => (
  <svg className="h-4 w-4 text-secondary" fill="currentColor" viewBox="0 0 24 24">
    <polygon points="5,3 19,12 5,21" />
  </svg>
)

const PauseIcon = () => (
  <svg className="h-4 w-4 text-chart-4" fill="currentColor" viewBox="0 0 24 24">
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
)

const RotateCcwIcon = () => (
  <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
    <polyline points="1,4 1,10 7,10" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </svg>
)

const DatabaseIcon = () => (
  <svg className="h-4 w-4 text-chart-3" fill="currentColor" viewBox="0 0 24 24">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
    <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
  </svg>
)

const ZapIcon = () => (
  <svg className="h-4 w-4 text-secondary" fill="currentColor" viewBox="0 0 24 24">
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
  </svg>
)

const CheckCircleIcon = () => (
  <svg className="h-4 w-4 text-chart-3" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22,4 12,14.01 9,11.01" />
  </svg>
)

const ClockIcon = () => (
  <svg className="h-4 w-4 text-chart-4" fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
)

interface DemoMode {
  id: string
  name: string
  description: string
}

interface SimulationEvent {
  time: number
  type: string
  data: any
}

export function DemoControlPanel() {
  const [demoModes, setDemoModes] = useState<DemoMode[]>([])
  const [selectedMode, setSelectedMode] = useState<string>("standard")
  const [isLoading, setIsLoading] = useState(false)
  const [isDemoActive, setIsDemoActive] = useState(false)
  const [simulationProgress, setSimulationProgress] = useState(0)
  const [currentEvent, setCurrentEvent] = useState<SimulationEvent | null>(null)
  const [simulationEvents, setSimulationEvents] = useState<SimulationEvent[]>([])
  const [timeScale, setTimeScale] = useState(1)
  const { toast } = useToast()

  useEffect(() => {
    loadDemoModes()
  }, [])

  const loadDemoModes = async () => {
    try {
      const response = await fetch("/api/demo/seed")
      if (response.ok) {
        const data = await response.json()
        setDemoModes(data.availableModes || [])
      }
    } catch (error) {
      console.error("[v0] Failed to load demo modes:", error)
    }
  }

  const loadDemoData = async () => {
    setIsLoading(true)
    console.log("[v0] Loading demo data for mode:", selectedMode)

    try {
      const response = await fetch("/api/demo/seed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: selectedMode,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Demo Data Loaded",
          description: data.instructions || `${selectedMode} demo data loaded successfully`,
        })

        // Store demo data in localStorage for components to access
        localStorage.setItem("demoData", JSON.stringify(data.data))
        localStorage.setItem("demoMode", selectedMode)

        // Trigger a custom event to notify other components
        window.dispatchEvent(
          new CustomEvent("demoDataLoaded", {
            detail: { mode: selectedMode, data: data.data },
          }),
        )
      } else {
        throw new Error(data.error || "Failed to load demo data")
      }
    } catch (error) {
      console.error("[v0] Demo data loading error:", error)
      toast({
        title: "Demo Loading Failed",
        description: "Unable to load demo data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const startDemoSimulation = async () => {
    setIsDemoActive(true)
    setSimulationProgress(0)
    setCurrentEvent(null)
    console.log("[v0] Starting demo simulation for mode:", selectedMode)

    try {
      const response = await fetch("/api/demo/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scenario: selectedMode,
          timeScale: timeScale,
          duration: 60, // 1 minute demo
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setSimulationEvents(data.simulation.events)

        toast({
          title: "Demo Simulation Started",
          description: data.simulation.expectedOutcome,
        })

        // Simulate real-time event progression
        simulateEventProgression(data.simulation.events)
      } else {
        throw new Error(data.error || "Simulation failed")
      }
    } catch (error) {
      console.error("[v0] Demo simulation error:", error)
      toast({
        title: "Simulation Failed",
        description: "Unable to start demo simulation. Please try again.",
        variant: "destructive",
      })
      setIsDemoActive(false)
    }
  }

  const simulateEventProgression = (events: SimulationEvent[]) => {
    let eventIndex = 0
    const totalEvents = events.length

    const progressInterval = setInterval(() => {
      if (eventIndex < totalEvents) {
        const event = events[eventIndex]
        setCurrentEvent(event)
        setSimulationProgress((eventIndex / totalEvents) * 100)

        // Dispatch event for other components to react
        window.dispatchEvent(
          new CustomEvent("demoSimulationEvent", {
            detail: event,
          }),
        )

        eventIndex++
      } else {
        clearInterval(progressInterval)
        setIsDemoActive(false)
        setSimulationProgress(100)
        setCurrentEvent(null)

        toast({
          title: "Demo Simulation Complete",
          description: "All simulation events have been processed successfully.",
        })
      }
    }, 2000 / timeScale) // Adjust timing based on time scale
  }

  const pauseSimulation = () => {
    setIsDemoActive(false)
    toast({
      title: "Simulation Paused",
      description: "Demo simulation has been paused. Click Play to continue.",
    })
  }

  const resetDemo = () => {
    setIsDemoActive(false)
    setSimulationProgress(0)
    setCurrentEvent(null)
    setSimulationEvents([])

    // Clear demo data
    localStorage.removeItem("demoData")
    localStorage.removeItem("demoMode")

    window.dispatchEvent(new CustomEvent("demoReset"))

    toast({
      title: "Demo Reset",
      description: "Demo has been reset to initial state.",
    })
  }

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "conflict_detected":
        return "🚨"
      case "ai_suggestions_generated":
        return "🤖"
      case "conflict_resolved":
        return "✅"
      case "optimization_started":
        return "⚡"
      case "optimization_completed":
        return "🎯"
      case "train_position_update":
        return "🚂"
      default:
        return "📊"
    }
  }

  return (
    <Card className="border-secondary/20 bg-secondary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <ZapIcon />
          Demo Control Panel
        </CardTitle>
        <CardDescription>
          Hackathon demonstration mode with reproducible scenarios and real-time simulation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="setup" className="space-y-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="setup">Demo Setup</TabsTrigger>
            <TabsTrigger value="simulation">Live Simulation</TabsTrigger>
            <TabsTrigger value="events">Event Log</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Demo Mode</label>
                <Select value={selectedMode} onValueChange={setSelectedMode}>
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {demoModes.map((mode) => (
                      <SelectItem key={mode.id} value={mode.id}>
                        {mode.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {demoModes.find((m) => m.id === selectedMode)?.description}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Time Scale</label>
                <Select value={timeScale.toString()} onValueChange={(value) => setTimeScale(Number(value))}>
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">0.5x (Slow)</SelectItem>
                    <SelectItem value="1">1x (Normal)</SelectItem>
                    <SelectItem value="2">2x (Fast)</SelectItem>
                    <SelectItem value="4">4x (Very Fast)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={loadDemoData}
                disabled={isLoading || isDemoActive}
                className="bg-chart-3 hover:bg-chart-3/90"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <DatabaseIcon />
                    <span className="ml-2">Load Demo Data</span>
                  </>
                )}
              </Button>

              <Button
                onClick={startDemoSimulation}
                disabled={isDemoActive || isLoading}
                className="bg-secondary hover:bg-secondary/90"
              >
                <PlayIcon />
                <span className="ml-2">Start Simulation</span>
              </Button>

              <Button
                onClick={resetDemo}
                variant="outline"
                disabled={isLoading}
                className="border-border hover:bg-muted bg-transparent"
              >
                <RotateCcwIcon />
                <span className="ml-2">Reset Demo</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="simulation" className="space-y-4">
            {isDemoActive ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="animate-pulse bg-secondary/10 text-secondary">
                      Simulation Running
                    </Badge>
                    <span className="text-sm text-muted-foreground">{simulationProgress.toFixed(0)}% Complete</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={pauseSimulation}
                    variant="outline"
                    className="border-chart-4/20 text-chart-4 hover:bg-chart-4/5 bg-transparent"
                  >
                    <PauseIcon />
                    <span className="ml-2">Pause</span>
                  </Button>
                </div>

                <Progress value={simulationProgress} className="h-2" />

                {currentEvent && (
                  <Card className="border-secondary/20 bg-secondary/5">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getEventIcon(currentEvent.type)}</span>
                        <div>
                          <h4 className="font-medium text-foreground capitalize">
                            {currentEvent.type.replace("_", " ")}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {currentEvent.data.description ||
                              currentEvent.data.message ||
                              JSON.stringify(currentEvent.data).slice(0, 100)}
                          </p>
                        </div>
                        <Badge variant="outline" className="ml-auto bg-muted">
                          T+{currentEvent.time}s
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <ClockIcon />
                <h3 className="font-medium text-foreground mt-2">No Active Simulation</h3>
                <p className="text-sm text-muted-foreground">
                  Load demo data and start a simulation to see real-time events
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {simulationEvents.length > 0 ? (
                simulationEvents.map((event, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded border border-border bg-card">
                    <span className="text-lg">{getEventIcon(event.type)}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground capitalize">
                          {event.type.replace("_", " ")}
                        </span>
                        <Badge variant="outline" className="text-xs bg-muted">
                          T+{event.time}s
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {event.data.description ||
                          event.data.message ||
                          `${Object.keys(event.data).length} data fields`}
                      </p>
                    </div>
                    {index <= Math.floor((simulationProgress / 100) * simulationEvents.length) && <CheckCircleIcon />}
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">
                    No simulation events yet. Start a simulation to see the event timeline.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
