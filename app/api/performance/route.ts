import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get("timeRange") || "24h"

    // Mock performance data based on time range
    const generateData = (hours: number) => {
      const data = []
      for (let i = 0; i < hours; i += 4) {
        data.push({
          time: `${String(i).padStart(2, "0")}:00`,
          throughput: Math.floor(Math.random() * 50) + 100,
          delays: Math.random() * 4 + 1,
          onTime: Math.random() * 10 + 90,
          passengers: Math.floor(Math.random() * 500) + 800,
        })
      }
      return data
    }

    const hours = timeRange === "1h" ? 1 : timeRange === "24h" ? 24 : timeRange === "7d" ? 168 : 720
    const performanceData = generateData(hours)

    const kpis = {
      onTimePerformance: 94.2 + (Math.random() - 0.5) * 4,
      sectionThroughput: 156 + Math.floor((Math.random() - 0.5) * 20),
      averageDelay: 2.3 + (Math.random() - 0.5) * 1,
      passengerSatisfaction: 87.6 + (Math.random() - 0.5) * 6,
      energyEfficiency: 92.1 + (Math.random() - 0.5) * 4,
      systemAvailability: 99.7 + (Math.random() - 0.5) * 0.6,
    }

    return NextResponse.json({
      success: true,
      data: {
        kpis,
        performanceData,
        timeRange,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch performance data" }, { status: 500 })
  }
}
