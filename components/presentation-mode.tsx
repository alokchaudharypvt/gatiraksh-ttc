"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const PresentationIcon = () => (
  <svg className="h-4 w-4 text-secondary" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h7l-3 3v1h8v-1l-3-3h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12H5V5h14v10z" />
  </svg>
)

const PlayIcon = () => (
  <svg className="h-4 w-4 text-chart-3" fill="currentColor" viewBox="0 0 24 24">
    <polygon points="5,3 19,12 5,21" />
  </svg>
)

const ClockIcon = () => (
  <svg className="h-4 w-4 text-chart-4" fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
)

const CheckCircleIcon = () => (
  <svg className="h-4 w-4 text-chart-3" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22,4 12,14.01 9,11.01" />
  </svg>
)

const TargetIcon = () => (
  <svg className="h-4 w-4 text-secondary" fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
)

interface PresentationStep {
  id: string
  title: string
  description: string
  duration: number
  action?: string
  highlight?: string[]
}

const presentationSteps: PresentationStep[] = [
  {
    id: "intro",
    title: "System Overview",
    description: "Introduce the Railway Traffic Control System and its AI capabilities",
    duration: 60,
    highlight: ["dashboard", "real-time-data"],
  },
  {
    id: "train-tracking",
    title: "Real-Time Train Visualization",
    description: "Show live train movements across Indian Railway corridors",
    duration: 120,
    action: "focus_train_viz",
    highlight: ["train-positions", "corridor-selection", "speed-indicators"],
  },
  {
    id: "conflict-detection",
    title: "AI Conflict Detection",
    description: "Demonstrate automatic conflict detection and alert system",
    duration: 90,
    action: "trigger_conflict",
    highlight: ["conflict-alerts", "severity-indicators", "affected-trains"],
  },
  {
    id: "ai-resolution",
    title: "Intelligent Resolution",
    description: "Show AI-powered suggestion generation and conflict resolution",
    duration: 150,
    action: "show_ai_suggestions",
    highlight: ["ai-suggestions", "effectiveness-scores", "implementation-time"],
  },
  {
    id: "performance",
    title: "Performance Analytics",
    description: "Display system performance improvements and metrics",
    duration: 90,
    action: "show_analytics",
    highlight: ["throughput-metrics", "delay-reduction", "efficiency-scores"],
  },
  {
    id: "conclusion",
    title: "Impact Summary",
    description: "Summarize benefits and next steps",
    duration: 60,
    highlight: ["roi-metrics", "scalability", "implementation-roadmap"],
  },
]

export function PresentationMode() {
  const [isActive, setIsActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [stepProgress, setStepProgress] = useState(0)
  const [totalProgress, setTotalProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [presentationTimer, setPresentationTimer] = useState<NodeJS.Timeout | null>(null)

  const totalDuration = presentationSteps.reduce((sum, step) => sum + step.duration, 0)

  useEffect(() => {
    if (isActive && !isPaused) {
      const timer = setInterval(() => {
        setStepProgress((prev) => {
          const currentStepDuration = presentationSteps[currentStep]?.duration || 60
          const increment = (100 / currentStepDuration) * 1 // 1 second intervals

          if (prev >= 100) {
            // Move to next step
            if (currentStep < presentationSteps.length - 1) {
              setCurrentStep((prev) => prev + 1)
              return 0
            } else {
              // Presentation complete
              setIsActive(false)
              return 100
            }
          }

          return prev + increment
        })

        // Update total progress
        const completedSteps = presentationSteps.slice(0, currentStep)
        const completedDuration = completedSteps.reduce((sum, step) => sum + step.duration, 0)
        const currentStepDuration = presentationSteps[currentStep]?.duration || 60
        const currentStepCompleted = (stepProgress / 100) * currentStepDuration

        setTotalProgress(((completedDuration + currentStepCompleted) / totalDuration) * 100)
      }, 1000)

      setPresentationTimer(timer)
      return () => clearInterval(timer)
    }
  }, [isActive, isPaused, currentStep, stepProgress])

  const startPresentation = () => {
    setIsActive(true)
    setCurrentStep(0)
    setStepProgress(0)
    setTotalProgress(0)
    setIsPaused(false)

    // Trigger presentation mode event
    window.dispatchEvent(
      new CustomEvent("presentationModeStart", {
        detail: { step: presentationSteps[0] },
      }),
    )
  }

  const pausePresentation = () => {
    setIsPaused(!isPaused)
    if (presentationTimer) {
      clearInterval(presentationTimer)
      setPresentationTimer(null)
    }
  }

  const stopPresentation = () => {
    setIsActive(false)
    setIsPaused(false)
    setCurrentStep(0)
    setStepProgress(0)
    setTotalProgress(0)

    if (presentationTimer) {
      clearInterval(presentationTimer)
      setPresentationTimer(null)
    }

    window.dispatchEvent(new CustomEvent("presentationModeStop"))
  }

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex)
    setStepProgress(0)

    // Calculate total progress up to this step
    const completedSteps = presentationSteps.slice(0, stepIndex)
    const completedDuration = completedSteps.reduce((sum, step) => sum + step.duration, 0)
    setTotalProgress((completedDuration / totalDuration) * 100)

    // Trigger step change event
    window.dispatchEvent(
      new CustomEvent("presentationStepChange", {
        detail: { step: presentationSteps[stepIndex] },
      }),
    )
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const currentStepData = presentationSteps[currentStep]
  const remainingTime = currentStepData ? Math.ceil(currentStepData.duration * (1 - stepProgress / 100)) : 0

  return (
    <Card className="border-secondary/20 bg-secondary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <PresentationIcon />
          Presentation Mode
        </CardTitle>
        <CardDescription>
          Guided presentation flow for hackathon demonstrations and stakeholder meetings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="control" className="space-y-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="control">Presentation Control</TabsTrigger>
            <TabsTrigger value="script">Speaker Notes</TabsTrigger>
            <TabsTrigger value="metrics">Live Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="control" className="space-y-4">
            {!isActive ? (
              <div className="text-center space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground">Ready to Present</h3>
                  <p className="text-sm text-muted-foreground">
                    {presentationSteps.length} steps • {formatTime(totalDuration)} total duration
                  </p>
                </div>

                <Button onClick={startPresentation} className="bg-secondary hover:bg-secondary/90" size="lg">
                  <PlayIcon />
                  <span className="ml-2">Start Presentation</span>
                </Button>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
                  {presentationSteps.map((step, index) => (
                    <Button
                      key={step.id}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        startPresentation()
                        goToStep(index)
                      }}
                      className="text-xs border-border hover:bg-muted bg-transparent"
                    >
                      {index + 1}. {step.title}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Current Step Display */}
                <Card className="border-secondary/20 bg-secondary/5">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                        Step {currentStep + 1} of {presentationSteps.length}
                      </Badge>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ClockIcon />
                        {formatTime(remainingTime)} remaining
                      </div>
                    </div>

                    <h3 className="font-semibold text-foreground mb-1">{currentStepData?.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{currentStepData?.description}</p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Step Progress</span>
                        <span>{stepProgress.toFixed(0)}%</span>
                      </div>
                      <Progress value={stepProgress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Overall Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">Overall Progress</span>
                    <span className="text-muted-foreground">{totalProgress.toFixed(0)}%</span>
                  </div>
                  <Progress value={totalProgress} className="h-3" />
                </div>

                {/* Controls */}
                <div className="flex gap-2">
                  <Button
                    onClick={pausePresentation}
                    variant="outline"
                    size="sm"
                    className="border-border hover:bg-muted bg-transparent"
                  >
                    {isPaused ? <PlayIcon /> : <ClockIcon />}
                    <span className="ml-2">{isPaused ? "Resume" : "Pause"}</span>
                  </Button>

                  <Button
                    onClick={stopPresentation}
                    variant="outline"
                    size="sm"
                    className="border-destructive/20 text-destructive hover:bg-destructive/5 bg-transparent"
                  >
                    Stop Presentation
                  </Button>

                  <div className="flex gap-1 ml-auto">
                    <Button
                      onClick={() => goToStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0}
                      variant="outline"
                      size="sm"
                      className="border-border hover:bg-muted bg-transparent"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => goToStep(Math.min(presentationSteps.length - 1, currentStep + 1))}
                      disabled={currentStep === presentationSteps.length - 1}
                      variant="outline"
                      size="sm"
                      className="border-border hover:bg-muted bg-transparent"
                    >
                      Next
                    </Button>
                  </div>
                </div>

                {/* Step Navigation */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {presentationSteps.map((step, index) => (
                    <Button
                      key={step.id}
                      variant={index === currentStep ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToStep(index)}
                      className={`text-xs ${
                        index === currentStep
                          ? "bg-secondary hover:bg-secondary/90"
                          : "border-border hover:bg-muted bg-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        {index < currentStep && <CheckCircleIcon />}
                        {index === currentStep && <TargetIcon />}
                        <span>
                          {index + 1}. {step.title}
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="script" className="space-y-4">
            <div className="space-y-4">
              {presentationSteps.map((step, index) => (
                <Card
                  key={step.id}
                  className={`border ${
                    index === currentStep && isActive ? "border-secondary bg-secondary/5" : "border-border"
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">
                        Step {index + 1}: {step.title}
                      </CardTitle>
                      <Badge variant="outline" className="text-xs bg-muted">
                        {formatTime(step.duration)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-2">{step.description}</p>

                    {step.action && (
                      <div className="text-xs text-secondary">
                        <strong>Action:</strong> {step.action.replace("_", " ")}
                      </div>
                    )}

                    {step.highlight && (
                      <div className="text-xs text-chart-3 mt-1">
                        <strong>Highlight:</strong> {step.highlight.join(", ")}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="border-border">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-chart-3">94.2%</div>
                  <div className="text-xs text-muted-foreground">AI Accuracy</div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-secondary">18.5%</div>
                  <div className="text-xs text-muted-foreground">Performance Gain</div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-chart-1">22%</div>
                  <div className="text-xs text-muted-foreground">Delay Reduction</div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-chart-2">340%</div>
                  <div className="text-xs text-muted-foreground">ROI (12 months)</div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-sm">Key Talking Points</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon />
                  <span>Real-time conflict detection in under 100ms</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon />
                  <span>AI suggestions generated in under 2 seconds</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon />
                  <span>Supports 13,000+ daily trains across Indian Railways</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon />
                  <span>Proactive vs reactive approach to traffic management</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon />
                  <span>₹2.5 crore annual savings per major junction</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
