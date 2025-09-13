import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

// Mock conflicts database
const mockConflicts = [
  {
    id: "CNF001",
    type: "platform_conflict",
    severity: "high",
    status: "active",
    title: "Platform Assignment Conflict",
    description: "Two express trains scheduled for same platform at overlapping times",
    affectedTrains: ["EXP001", "EXP002"],
    location: "New Delhi Station - Platform 1",
    detectedAt: new Date(Date.now() - 300000).toISOString(),
    estimatedImpact: {
      delayMinutes: 15,
      affectedPassengers: 2400,
      cascadingDelays: 3,
    },
    suggestions: [],
  },
  {
    id: "CNF002",
    type: "collision_risk",
    severity: "critical",
    status: "active",
    title: "Potential Track Collision",
    description: "Two trains approaching same track section with insufficient spacing",
    affectedTrains: ["LOC045", "FRT123"],
    location: "Junction Alpha - Track 2",
    detectedAt: new Date(Date.now() - 120000).toISOString(),
    estimatedImpact: {
      delayMinutes: 25,
      affectedPassengers: 800,
      cascadingDelays: 5,
    },
    suggestions: [],
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const severity = searchParams.get("severity")
    const type = searchParams.get("type")

    let filteredConflicts = mockConflicts

    if (status) {
      filteredConflicts = filteredConflicts.filter((conflict) => conflict.status === status)
    }

    if (severity) {
      filteredConflicts = filteredConflicts.filter((conflict) => conflict.severity === severity)
    }

    if (type) {
      filteredConflicts = filteredConflicts.filter((conflict) => conflict.type === type)
    }

    return NextResponse.json({
      success: true,
      data: filteredConflicts,
      summary: {
        total: filteredConflicts.length,
        critical: filteredConflicts.filter((c) => c.severity === "critical").length,
        high: filteredConflicts.filter((c) => c.severity === "high").length,
        medium: filteredConflicts.filter((c) => c.severity === "medium").length,
        low: filteredConflicts.filter((c) => c.severity === "low").length,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Conflicts fetch error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch conflicts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, conflictId, suggestionId, manualResolution } = await request.json()

    if (action === "resolve") {
      const conflictIndex = mockConflicts.findIndex((c) => c.id === conflictId)
      if (conflictIndex === -1) {
        return NextResponse.json({ success: false, error: "Conflict not found" }, { status: 404 })
      }

      // Mark conflict as resolved
      mockConflicts[conflictIndex].status = "resolved"
      mockConflicts[conflictIndex].resolvedAt = new Date().toISOString()
      mockConflicts[conflictIndex].resolution = {
        suggestionId,
        manualResolution,
        resolvedBy: "dispatcher",
        timestamp: new Date().toISOString(),
      }

      return NextResponse.json({
        success: true,
        message: "Conflict resolved successfully",
        data: mockConflicts[conflictIndex],
      })
    }

    if (action === "generate_suggestions") {
      const conflict = mockConflicts.find((c) => c.id === conflictId)
      if (!conflict) {
        return NextResponse.json({ success: false, error: "Conflict not found" }, { status: 404 })
      }

      console.log("[v0] Generating AI suggestions for conflict:", conflictId)

      const prompt = `You are an AI railway traffic controller for Indian Railways. Analyze this conflict and provide 3 ranked resolution suggestions.

Conflict Details:
- Type: ${conflict.type}
- Severity: ${conflict.severity}
- Description: ${conflict.description}
- Affected Trains: ${conflict.affectedTrains.join(", ")}
- Location: ${conflict.location}
- Estimated Impact: ${conflict.estimatedImpact.delayMinutes} min delay, ${conflict.estimatedImpact.affectedPassengers} passengers

Provide 3 specific, actionable suggestions ranked by effectiveness. Format as JSON:
{
  "suggestions": [
    {
      "id": "SUG001",
      "title": "Brief title",
      "description": "Detailed action steps",
      "type": "platform_reassignment|route_change|priority_adjustment|delay_introduction",
      "effectiveness": 85-98,
      "implementationTime": "2-15 minutes",
      "impact": {
        "delayReduction": 10-25,
        "passengerImpact": "minimal|moderate|significant",
        "operationalComplexity": "low|medium|high"
      },
      "reasoning": "Why this solution works best"
    }
  ]
}`

      try {
        const { text } = await generateText({
          model: groq("llama-3.3-70b-versatile"),
          prompt,
          temperature: 0.7,
        })

        let aiResult
        try {
          aiResult = JSON.parse(text)
        } catch (parseError) {
          console.log("[v0] AI JSON parse failed, using fallback suggestions")
          aiResult = {
            suggestions: [
              {
                id: "SUG001",
                title: "Reassign Platform",
                description: `Move ${conflict.affectedTrains[0]} to Platform 3 with 5-minute delay`,
                type: "platform_reassignment",
                effectiveness: 92,
                implementationTime: "3 minutes",
                impact: {
                  delayReduction: 18,
                  passengerImpact: "minimal",
                  operationalComplexity: "low",
                },
                reasoning: "Platform 3 is available and requires minimal passenger movement",
              },
              {
                id: "SUG002",
                title: "Priority Adjustment",
                description: `Increase priority of ${conflict.affectedTrains[0]} and delay ${conflict.affectedTrains[1]} by 8 minutes`,
                type: "priority_adjustment",
                effectiveness: 87,
                implementationTime: "2 minutes",
                impact: {
                  delayReduction: 15,
                  passengerImpact: "moderate",
                  operationalComplexity: "medium",
                },
                reasoning: "Maintains express service priority while minimizing overall delay",
              },
              {
                id: "SUG003",
                title: "Route Modification",
                description: `Reroute ${conflict.affectedTrains[1]} via alternate track with 12-minute delay`,
                type: "route_change",
                effectiveness: 78,
                implementationTime: "8 minutes",
                impact: {
                  delayReduction: 12,
                  passengerImpact: "moderate",
                  operationalComplexity: "high",
                },
                reasoning: "Ensures complete separation but requires coordination with multiple signal boxes",
              },
            ],
          }
        }

        // Update conflict with AI suggestions
        const conflictIndex = mockConflicts.findIndex((c) => c.id === conflictId)
        mockConflicts[conflictIndex].suggestions = aiResult.suggestions
        mockConflicts[conflictIndex].suggestionsGeneratedAt = new Date().toISOString()

        return NextResponse.json({
          success: true,
          conflictId,
          suggestions: aiResult.suggestions,
          timestamp: new Date().toISOString(),
        })
      } catch (aiError) {
        console.error("[v0] AI suggestion generation error:", aiError)
        return NextResponse.json(
          {
            success: false,
            error: "Failed to generate AI suggestions",
          },
          { status: 500 },
        )
      }
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Conflicts action error:", error)
    return NextResponse.json({ success: false, error: "Action failed" }, { status: 500 })
  }
}
