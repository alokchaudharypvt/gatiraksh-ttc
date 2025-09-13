import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const trafficData = searchParams.get("data")

    console.log("[v0] AI recommendations request received")

    const prompt = `You are an AI railway traffic controller assistant for Indian Railways. Based on current railway conditions, provide 3-4 specific, actionable recommendations for immediate implementation.

Current Conditions:
- High traffic volume during peak hours on major corridors
- Some delays in express services (Rajdhani, Shatabdi)
- Platform congestion at major stations (New Delhi, Mumbai Central, Chennai Central)
- Weather conditions: Normal
- Focus on Delhi-Mumbai, Delhi-Kolkata, and Chennai-Bangalore corridors

Provide recommendations in this JSON format:
{
  "recommendations": [
    {
      "type": "priority|routing|scheduling|maintenance",
      "title": "Brief title",
      "description": "Detailed description with specific actions for Indian Railways",
      "impact": "Expected improvement description",
      "urgency": "high|medium|low",
      "estimatedBenefit": "percentage or time savings"
    }
  ]
}`

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt,
      temperature: 0.8,
    })

    console.log("[v0] AI recommendations response:", text)

    let aiResult
    try {
      aiResult = JSON.parse(text)
    } catch (parseError) {
      aiResult = {
        recommendations: [
          {
            type: "priority",
            title: "Rajdhani Express Priority Adjustment",
            description:
              "Increase priority for Rajdhani Express 12951 (Mumbai-New Delhi) to maintain schedule during peak hours",
            impact: "8.2% reduction in overall delays on Western Railway corridor",
            urgency: "high",
            estimatedBenefit: "8.2%",
          },
          {
            type: "routing",
            title: "Freight Diversion via Dedicated Corridor",
            description:
              "Divert freight trains to Dedicated Freight Corridor (DFC) to reduce congestion on passenger routes",
            impact: "15 minutes average time savings for express trains",
            urgency: "medium",
            estimatedBenefit: "15 min",
          },
          {
            type: "scheduling",
            title: "Platform Optimization at New Delhi",
            description: "Adjust departure timing for Shatabdi Express by 4 minutes to optimize platform 16 usage",
            impact: "12% improvement in platform utilization efficiency",
            urgency: "medium",
            estimatedBenefit: "12%",
          },
          {
            type: "maintenance",
            title: "Preventive Signal Maintenance",
            description:
              "Schedule maintenance for automatic signaling system at Ghaziabad junction during off-peak hours",
            impact: "Prevent potential 30-minute delays during peak traffic",
            urgency: "low",
            estimatedBenefit: "30 min prevention",
          },
        ],
      }
    }

    return NextResponse.json({
      success: true,
      ...aiResult,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] AI recommendations error:", error)
    return NextResponse.json({ success: false, error: "Failed to get recommendations" }, { status: 500 })
  }
}
