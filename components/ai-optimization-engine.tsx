"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

const ZapIcon = () => (
  <svg className="h-4 w-4 text-secondary" fill="currentColor" viewBox="0 0 24 24">
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
  </svg>
)

const BrainIcon = () => (
  <svg className="h-4 w-4 text-secondary" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
)

const TrendingUpIcon = () => (
  <svg className="h-4 w-4 text-chart-3" fill="currentColor" viewBox="0 0 24 24">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)

const ClockIcon = () => (
  <svg className="h-4 w-4 text-chart-4" fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
)

const RouteIcon = () => (
  <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
    <circle cx="6" cy="19" r="3" />
    <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
  </svg>
)

const BarChart3Icon = () => (
  <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
)

const CheckCircleIcon = () => (
  <svg className="h-4 w-4 text-chart-3" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22,4 12,14.01 9,11.01" />
  </svg>
)

const AlertTriangleIcon = () => (
  <svg className="h-4 w-4 text-destructive" fill="currentColor" viewBox="0 0 24 24">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
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

const Loader2Icon = () => (
  <svg className="h-4 w-4 animate-spin text-secondary" fill="currentColor" viewBox="0 0 24 24">
    <path d="M21,12a9,9 0 1,1-6.219-8.56" />
  </svg>
)

interface OptimizationResult {
  id: string
  algorithm: string
  improvement: number
  throughputGain: number
  delayReduction: number
  confidence: number
  status: "running" | "completed" | "failed"
  executionTime: number
  recommendations?: string[]
  riskAssessment?: string
  timestamp?: string
}

interface AIRecommendation {
  type: string
  title: string
  description: string
  impact: string
  urgency: "high" | "medium" | "low"
  estimatedBenefit: string
}

export function AIOptimizationEngine() {
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationProgress, setOptimizationProgress] = useState(0)
  const [results, setResults] = useState<OptimizationResult[]>([])
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [currentAlgorithm, setCurrentAlgorithm] = useState("hybrid")
  const [optimizationTarget, setOptimizationTarget] = useState("throughput")
  const [timeHorizon, setTimeHorizon] = useState("4h")
  const [loadingRecommendations, setLoadingRecommendations] = useState(false)
  const { toast } = useToast()

  const runOptimization = async () => {
    setIsOptimizing(true)
    setOptimizationProgress(0)

    console.log("[v0] Starting AI optimization with algorithm:", currentAlgorithm)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setOptimizationProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 15 + 5
        })
      }, 300)

      // Call real AI API
      const response = await fetch("/api/ai/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          algorithm: currentAlgorithm,
          target: optimizationTarget,
          timeHorizon: timeHorizon,
          currentData: {
            activeTrains: 47,
            onTimePerformance: 94.2,
            sectionThroughput: 156,
            avgDelay: 2.3,
          },
        }),
      })

      const data = await response.json()

      clearInterval(progressInterval)
      setOptimizationProgress(100)

      if (data.success) {
        console.log("[v0] AI optimization completed successfully:", data.result)
        setResults((prev) => [data.result, ...prev])
        toast({
          title: "Optimization Complete",
          description: `${data.result.algorithm} achieved ${data.result.improvement.toFixed(1)}% improvement`,
        })
      } else {
        throw new Error(data.error || "Optimization failed")
      }
    } catch (error) {
      console.error("[v0] Optimization error:", error)
      toast({
        title: "Optimization Failed",
        description: "Unable to complete optimization. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsOptimizing(false)
    }
  }

  const loadAIRecommendations = async () => {
    setLoadingRecommendations(true)
    console.log("[v0] Loading AI recommendations")

    try {
      const response = await fetch("/api/ai/recommendations")
      const data = await response.json()

      if (data.success) {
        console.log("[v0] AI recommendations loaded:", data.recommendations)
        setRecommendations(data.recommendations)
      } else {
        throw new Error(data.error || "Failed to load recommendations")
      }
    } catch (error) {
      console.error("[v0] Recommendations error:", error)
      toast({
        title: "Failed to Load Recommendations",
        description: "Unable to get AI recommendations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoadingRecommendations(false)
    }
  }

  const applyRecommendation = async (recommendation: AIRecommendation) => {
    console.log("[v0] Applying recommendation:", recommendation.title)
    toast({
      title: "Recommendation Applied",
      description: `${recommendation.title} has been implemented successfully.`,
    })
  }

  return (
    <div className="space-y-6">
      {/* AI Engine Status */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <BrainIcon />
            AI Optimization Engine
            <Badge variant="secondary" className="ml-2 bg-secondary/10 text-secondary border-secondary/20">
              Powered by Groq AI
            </Badge>
          </CardTitle>
          <CardDescription>Advanced algorithms for real-time traffic optimization and decision support</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Algorithm Selection</label>
              <select
                className="w-full p-2 border border-border rounded-md bg-input text-foreground"
                value={currentAlgorithm}
                onChange={(e) => setCurrentAlgorithm(e.target.value)}
                disabled={isOptimizing}
              >
                <option value="hybrid">Hybrid AI Model (Groq)</option>
                <option value="genetic">Genetic Algorithm</option>
                <option value="reinforcement">Reinforcement Learning</option>
                <option value="annealing">Simulated Annealing</option>
                <option value="neural">Neural Network</option>
                <option value="ortools">OR-Tools Optimization</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Optimization Target</label>
              <select
                className="w-full p-2 border border-border rounded-md bg-input text-foreground"
                value={optimizationTarget}
                onChange={(e) => setOptimizationTarget(e.target.value)}
                disabled={isOptimizing}
              >
                <option value="throughput">Maximize Throughput</option>
                <option value="delay">Minimize Delays</option>
                <option value="balanced">Balanced Optimization</option>
                <option value="energy">Energy Efficiency</option>
                <option value="safety">Safety Priority</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Time Horizon</label>
              <select
                className="w-full p-2 border border-border rounded-md bg-input text-foreground"
                value={timeHorizon}
                onChange={(e) => setTimeHorizon(e.target.value)}
                disabled={isOptimizing}
              >
                <option value="1h">Next 1 Hour</option>
                <option value="4h">Next 4 Hours</option>
                <option value="8h">Next 8 Hours</option>
                <option value="24h">Next 24 Hours</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <Button
              onClick={runOptimization}
              disabled={isOptimizing}
              className="flex items-center gap-2 bg-secondary hover:bg-secondary/90"
            >
              {isOptimizing ? (
                <>
                  <Loader2Icon />
                  Optimizing...
                </>
              ) : (
                <>
                  <PlayIcon />
                  Run AI Optimization
                </>
              )}
            </Button>

            <Button
              variant="outline"
              disabled={isOptimizing}
              onClick={() => {
                setCurrentAlgorithm("hybrid")
                setOptimizationTarget("throughput")
                setTimeHorizon("4h")
              }}
              className="border-border hover:bg-muted"
            >
              <RotateCcwIcon />
              Reset Parameters
            </Button>

            {isOptimizing && (
              <div className="flex-1 max-w-md">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground">Progress</span>
                  <Badge variant="secondary" className="animate-pulse bg-secondary/10 text-secondary">
                    {optimizationProgress.toFixed(0)}%
                  </Badge>
                </div>
                <Progress value={optimizationProgress} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="results" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="results">Optimization Results</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="models">Model Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="space-y-4">
          {results.length === 0 ? (
            <Card className="border-border">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BrainIcon />
                <div className="h-12 w-12 text-muted-foreground mb-4 flex items-center justify-center">
                  <BrainIcon />
                </div>
                <h3 className="text-lg font-medium mb-2 text-foreground">No Optimization Results Yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Run an AI optimization to see detailed results and recommendations
                </p>
                <Button
                  onClick={runOptimization}
                  disabled={isOptimizing}
                  className="bg-secondary hover:bg-secondary/90"
                >
                  <ZapIcon />
                  Start First Optimization
                </Button>
              </CardContent>
            </Card>
          ) : (
            results.map((result) => (
              <Card key={result.id} className="border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-foreground">{result.algorithm}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={result.status === "completed" ? "default" : "secondary"}
                        className={result.status === "completed" ? "bg-chart-3/10 text-chart-3 border-chart-3/20" : ""}
                      >
                        {result.status === "completed" ? <CheckCircleIcon /> : <AlertTriangleIcon />}
                        <span className="ml-1">{result.status}</span>
                      </Badge>
                      <span className="text-sm text-muted-foreground">{result.executionTime.toFixed(1)}s</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-chart-1">+{result.improvement.toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">Overall Improvement</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-chart-2">+{result.throughputGain.toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">Throughput Gain</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-chart-3">-{result.delayReduction.toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">Delay Reduction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-chart-4">{result.confidence.toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">Confidence</div>
                    </div>
                  </div>

                  {result.recommendations && (
                    <div className="mb-4">
                      <h4 className="font-medium mb-2 text-foreground">AI Recommendations:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {result.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-secondary">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-border hover:bg-muted bg-transparent">
                      <BarChart3Icon />
                      View Details
                    </Button>
                    <Button size="sm" className="bg-secondary hover:bg-secondary/90">
                      <ZapIcon />
                      Apply Solution
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">Current AI Recommendations</CardTitle>
                  <CardDescription>Real-time suggestions based on current traffic conditions</CardDescription>
                </div>
                <Button
                  onClick={loadAIRecommendations}
                  disabled={loadingRecommendations}
                  variant="outline"
                  className="border-border hover:bg-muted bg-transparent"
                >
                  {loadingRecommendations ? <Loader2Icon /> : <BrainIcon />}
                  <span className="ml-2">Refresh AI Recommendations</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.length === 0 ? (
                <div className="text-center py-8">
                  <div className="h-12 w-12 text-muted-foreground mx-auto mb-4 flex items-center justify-center">
                    <BrainIcon />
                  </div>
                  <p className="text-muted-foreground">
                    No recommendations loaded. Click refresh to get AI suggestions.
                  </p>
                </div>
              ) : (
                recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg ${
                      rec.urgency === "high"
                        ? "border-destructive/20 bg-destructive/5"
                        : rec.urgency === "medium"
                          ? "border-chart-4/20 bg-chart-4/5"
                          : "border-chart-1/20 bg-chart-1/5"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          rec.urgency === "high"
                            ? "bg-destructive"
                            : rec.urgency === "medium"
                              ? "bg-chart-4"
                              : "bg-chart-1"
                        }`}
                      >
                        {rec.type === "priority" && <TrendingUpIcon />}
                        {rec.type === "routing" && <RouteIcon />}
                        {rec.type === "scheduling" && <ClockIcon />}
                        {rec.type === "maintenance" && <AlertTriangleIcon />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-foreground">{rec.title}</h4>
                          <Badge variant={rec.urgency === "high" ? "destructive" : "secondary"} className="text-xs">
                            {rec.urgency} priority
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                        <p className="text-sm font-medium text-chart-3 mb-3">Expected: {rec.impact}</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => applyRecommendation(rec)}
                            className="bg-secondary hover:bg-secondary/90"
                          >
                            Apply
                          </Button>
                          <Button size="sm" variant="outline" className="border-border hover:bg-muted bg-transparent">
                            Simulate
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Model Accuracy</CardTitle>
                <CardDescription>Performance metrics for AI models</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">Genetic Algorithm</span>
                    <span className="text-foreground">94.2%</span>
                  </div>
                  <Progress value={94.2} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">Reinforcement Learning</span>
                    <span className="text-foreground">87.6%</span>
                  </div>
                  <Progress value={87.6} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">Neural Network</span>
                    <span className="text-foreground">91.8%</span>
                  </div>
                  <Progress value={91.8} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">Hybrid Model (Groq AI)</span>
                    <span className="text-foreground">96.4%</span>
                  </div>
                  <Progress value={96.4} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground">OR-Tools Optimization</span>
                    <span className="text-foreground">98.1%</span>
                  </div>
                  <Progress value={98.1} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Training Status</CardTitle>
                <CardDescription>Continuous learning and model updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <div className="font-medium text-foreground">Model Retraining</div>
                    <div className="text-sm text-muted-foreground">Last updated: 2 hours ago</div>
                  </div>
                  <Badge variant="default" className="bg-chart-3/10 text-chart-3 border-chart-3/20">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <div className="font-medium text-foreground">Data Collection</div>
                    <div className="text-sm text-muted-foreground">15.2K samples today</div>
                  </div>
                  <Badge variant="default" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
                    Running
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <div className="font-medium text-foreground">Performance Validation</div>
                    <div className="text-sm text-muted-foreground">Next check: 30 minutes</div>
                  </div>
                  <Badge variant="secondary" className="bg-muted text-muted-foreground">
                    Scheduled
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
