import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get("timeRange") || "24h"
    const metric = searchParams.get("metric") || "all"

    console.log("[v0] Performance analytics request:", { timeRange, metric })

    // Generate realistic performance data
    const generateTimeSeriesData = (hours: number) => {
      const data = []
      const now = new Date()

      for (let i = hours; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000)
        data.push({
          timestamp: time.toISOString(),
          throughput: Math.floor(Math.random() * 40 + 140),
          onTimePerformance: Math.random() * 10 + 90,
          averageDelay: Math.random() * 3 + 1,
          activeTrains: Math.floor(Math.random() * 20 + 35),
          incidents: Math.floor(Math.random() * 3),
        })
      }
      return data
    }

    const hours = timeRange === "1h" ? 1 : timeRange === "4h" ? 4 : timeRange === "8h" ? 8 : 24
    const timeSeriesData = generateTimeSeriesData(hours)

    const analytics = {
      summary: {
        totalTrains: 1247,
        onTimePerformance: 94.2,
        averageThroughput: 156,
        totalDelayMinutes: 342,
        incidentCount: 7,
        efficiencyScore: 92.8,
      },
      trends: {
        throughputTrend: "+5.2%",
        performanceTrend: "+2.1%",
        delayTrend: "-8.7%",
        incidentTrend: "-12.3%",
      },
      timeSeriesData,
      topPerformingRoutes: [
        { route: "Express Line A-B", performance: 98.5, throughput: 89 },
        { route: "Local Circuit C-D", performance: 96.2, throughput: 67 },
        { route: "Freight Corridor E-F", performance: 91.8, throughput: 45 },
      ],
      bottlenecks: [
        { location: "Junction Alpha", impact: "High", delayMinutes: 12.3 },
        { location: "Platform 7", impact: "Medium", delayMinutes: 8.7 },
        { location: "Signal Box Beta", impact: "Low", delayMinutes: 4.2 },
      ],
    }

    return NextResponse.json({
      success: true,
      timeRange,
      analytics,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Performance analytics error:", error)
    return NextResponse.json({ success: false, error: "Analytics request failed" }, { status: 500 })
  }
}
