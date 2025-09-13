"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

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

const XCircleIcon = () => (
  <svg className="h-4 w-4 text-destructive" fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
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

const BrainIcon = () => (
  <svg className="h-4 w-4 text-secondary" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
    <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
    <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
    <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
    <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
    <path d="M6 18a4 4 0 0 1-1.967-.516" />
    <path d="M19.967 17.484A4 4 0 0 1 18 18" />
  </svg>
)

interface ConflictSuggestion {
  id: string
  title: string
  description: string
  type: "platform_reassignment" | "route_change" | "priority_adjustment" | "delay_introduction"
  effectiveness: number
  implementationTime: string
  impact: {
    delayReduction: number
    passengerImpact: "minimal" | "moderate" | "significant"
    operationalComplexity: "low" | "medium" | "high"
  }
  reasoning: string
}

interface Conflict {
  id: string
  type: "platform_conflict" | "collision_risk" | "signal_conflict" | "resource_conflict"
  severity: "critical" | "high" | "medium" | "low"
  status: "active" | "resolving" | "resolved"
  title: string
  description: string
  affectedTrains: string[]
  location: string
  detectedAt: string
  estimatedImpact: {
    delayMinutes: number
    affectedPassengers: number
    cascadingDelays: number
  }
  suggestions: ConflictSuggestion[]
}

interface ConflictResolutionModalProps {
  conflict: Conflict | null
  isOpen: boolean
  onClose: () => void
  onResolve: (conflictId: string, suggestionId?: string, manualResolution?: string) => void
}

export function ConflictResolutionModal({ conflict, isOpen, onClose, onResolve }: ConflictResolutionModalProps) {
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null)
  const [manualResolution, setManualResolution] = useState("")
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false)
  const [isResolving, setIsResolving] = useState(false)
  const [suggestions, setSuggestions] = useState<ConflictSuggestion[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (conflict && isOpen) {
      if (conflict.suggestions && conflict.suggestions.length > 0) {
        setSuggestions(conflict.suggestions)
      } else {
        generateAISuggestions()
      }
      setSelectedSuggestion(null)
      setManualResolution("")
    }
  }, [conflict, isOpen])

  const generateAISuggestions = async () => {
    if (!conflict) return

    setIsGeneratingSuggestions(true)
    console.log("[v0] Generating AI suggestions for conflict:", conflict.id)

    try {
      const response = await fetch("/api/conflicts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "generate_suggestions",
          conflictId: conflict.id,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setSuggestions(data.suggestions)
        toast({
          title: "AI Suggestions Generated",
          description: `Generated ${data.suggestions.length} resolution strategies for conflict ${conflict.id}`,
        })
      } else {
        throw new Error(data.error || "Failed to generate suggestions")
      }
    } catch (error) {
      console.error("[v0] AI suggestion generation error:", error)
      toast({
        title: "Suggestion Generation Failed",
        description: "Unable to generate AI suggestions. Please try manual resolution.",
        variant: "destructive",
      })

      // Fallback suggestions
      setSuggestions([
        {
          id: "FALLBACK_001",
          title: "Manual Resolution Required",
          description: "Please provide manual resolution strategy",
          type: "priority_adjustment",
          effectiveness: 75,
          implementationTime: "5 minutes",
          impact: {
            delayReduction: 10,
            passengerImpact: "moderate",
            operationalComplexity: "medium",
          },
          reasoning: "AI suggestions unavailable - manual intervention recommended",
        },
      ])
    } finally {
      setIsGeneratingSuggestions(false)
    }
  }

  const handleResolve = async () => {
    if (!conflict) return

    setIsResolving(true)

    try {
      await onResolve(conflict.id, selectedSuggestion || undefined, manualResolution || undefined)

      toast({
        title: "Conflict Resolved",
        description: `Successfully resolved conflict ${conflict.id}`,
      })

      onClose()
    } catch (error) {
      console.error("[v0] Conflict resolution error:", error)
      toast({
        title: "Resolution Failed",
        description: "Unable to resolve conflict. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsResolving(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-destructive border-destructive/20 bg-destructive/5"
      case "high":
        return "text-chart-4 border-chart-4/20 bg-chart-4/5"
      case "medium":
        return "text-chart-2 border-chart-2/20 bg-chart-2/5"
      case "low":
        return "text-chart-1 border-chart-1/20 bg-chart-1/5"
      default:
        return "text-muted-foreground border-border bg-muted/5"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "platform_conflict":
        return <ClockIcon />
      case "collision_risk":
        return <AlertTriangleIcon />
      case "signal_conflict":
        return <ZapIcon />
      case "resource_conflict":
        return <ClockIcon />
      default:
        return <AlertTriangleIcon />
    }
  }

  const getEffectivenessColor = (effectiveness: number) => {
    if (effectiveness >= 90) return "text-chart-3"
    if (effectiveness >= 75) return "text-chart-2"
    if (effectiveness >= 60) return "text-chart-4"
    return "text-destructive"
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "low":
        return "text-chart-3"
      case "medium":
        return "text-chart-4"
      case "high":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  if (!conflict) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            {getTypeIcon(conflict.type)}
            Resolve Conflict: {conflict.id}
          </DialogTitle>
          <DialogDescription>
            AI-powered conflict resolution with ranked suggestions and manual override options
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Conflict Details */}
          <Card className={`border ${getSeverityColor(conflict.severity)}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{conflict.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={conflict.severity === "critical" ? "destructive" : "secondary"}
                    className="capitalize"
                  >
                    {conflict.severity}
                  </Badge>
                  <Badge variant="outline" className="capitalize bg-muted">
                    {conflict.type.replace("_", " ")}
                  </Badge>
                </div>
              </div>
              <CardDescription>{conflict.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Affected Trains</Label>
                  <div className="font-medium text-foreground">{conflict.affectedTrains.join(", ")}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Location</Label>
                  <div className="font-medium text-foreground">{conflict.location}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Expected Delay</Label>
                  <div className="font-medium text-destructive">{conflict.estimatedImpact.delayMinutes} minutes</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Affected Passengers</Label>
                  <div className="font-medium text-foreground">
                    {conflict.estimatedImpact.affectedPassengers.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BrainIcon />
                  <CardTitle>AI Resolution Suggestions</CardTitle>
                </div>
                {isGeneratingSuggestions && (
                  <Badge variant="secondary" className="animate-pulse bg-secondary/10 text-secondary">
                    Generating...
                  </Badge>
                )}
              </div>
              <CardDescription>
                Ranked suggestions based on effectiveness, implementation time, and operational impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isGeneratingSuggestions ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-secondary"></div>
                    <span className="text-sm text-muted-foreground">Analyzing conflict patterns...</span>
                  </div>
                  <Progress value={66} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    AI is evaluating train positions, platform availability, and operational constraints to generate
                    optimal resolution strategies.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {suggestions.map((suggestion, index) => (
                    <Card
                      key={suggestion.id}
                      className={`cursor-pointer transition-all border ${
                        selectedSuggestion === suggestion.id
                          ? "border-secondary bg-secondary/5"
                          : "border-border hover:border-secondary/50"
                      }`}
                      onClick={() => setSelectedSuggestion(suggestion.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <Badge variant="outline" className="bg-muted">
                              #{index + 1}
                            </Badge>
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-foreground">{suggestion.title}</h4>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-sm font-medium ${getEffectivenessColor(suggestion.effectiveness)}`}
                                >
                                  {suggestion.effectiveness}% effective
                                </span>
                                <Badge variant="outline" className="text-xs bg-muted">
                                  {suggestion.implementationTime}
                                </Badge>
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground">{suggestion.description}</p>

                            <div className="grid grid-cols-3 gap-4 text-xs">
                              <div>
                                <span className="text-muted-foreground">Delay Reduction:</span>
                                <span className="font-medium text-chart-3 ml-1">
                                  {suggestion.impact.delayReduction} min
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Passenger Impact:</span>
                                <span className="font-medium text-foreground ml-1 capitalize">
                                  {suggestion.impact.passengerImpact}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Complexity:</span>
                                <span
                                  className={`font-medium ml-1 capitalize ${getComplexityColor(suggestion.impact.operationalComplexity)}`}
                                >
                                  {suggestion.impact.operationalComplexity}
                                </span>
                              </div>
                            </div>

                            <div className="bg-muted/50 p-2 rounded text-xs">
                              <span className="font-medium text-foreground">Reasoning:</span>
                              <span className="text-muted-foreground ml-1">{suggestion.reasoning}</span>
                            </div>
                          </div>

                          {selectedSuggestion === suggestion.id && <CheckCircleIcon />}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Manual Resolution */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Manual Resolution (Optional)</CardTitle>
              <CardDescription>Provide custom resolution strategy if AI suggestions are not suitable</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="manual-resolution" className="text-foreground">
                  Custom Resolution Strategy
                </Label>
                <Textarea
                  id="manual-resolution"
                  placeholder="Describe your manual resolution approach..."
                  value={manualResolution}
                  onChange={(e) => setManualResolution(e.target.value)}
                  className="bg-input border-border text-foreground"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isResolving}
              className="border-border hover:bg-muted bg-transparent"
            >
              Cancel
            </Button>

            <div className="flex items-center gap-2">
              {!selectedSuggestion && !manualResolution && (
                <Button
                  variant="outline"
                  onClick={generateAISuggestions}
                  disabled={isGeneratingSuggestions || isResolving}
                  className="border-secondary/20 text-secondary hover:bg-secondary/5 bg-transparent"
                >
                  <BrainIcon />
                  <span className="ml-2">Regenerate Suggestions</span>
                </Button>
              )}

              <Button
                onClick={handleResolve}
                disabled={(!selectedSuggestion && !manualResolution) || isResolving}
                className="bg-secondary hover:bg-secondary/90"
              >
                {isResolving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Resolving...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon />
                    <span className="ml-2">Apply Resolution</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
