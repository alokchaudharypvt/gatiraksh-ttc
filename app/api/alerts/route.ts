import { type NextRequest, NextResponse } from "next/server"

// Mock alerts database
const mockAlerts = [
  {
    id: "ALT001",
    title: "Signal System Malfunction",
    message: "Signal failure detected at Junction A",
    type: "critical",
    category: "safety",
    priority: "high",
    timestamp: new Date().toISOString(),
    status: "active",
    source: "Signal Control System",
    location: "Junction A",
    affectedTrains: ["EXP001", "LOC045"],
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const type = searchParams.get("type")
    const priority = searchParams.get("priority")

    let filteredAlerts = mockAlerts

    if (status) {
      filteredAlerts = filteredAlerts.filter((alert) => alert.status === status)
    }

    if (type) {
      filteredAlerts = filteredAlerts.filter((alert) => alert.type === type)
    }

    if (priority) {
      filteredAlerts = filteredAlerts.filter((alert) => alert.priority === priority)
    }

    return NextResponse.json({
      success: true,
      data: filteredAlerts,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch alerts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const requiredFields = ["title", "message", "type", "category"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const newAlert = {
      id: `ALT${Date.now()}`,
      ...body,
      timestamp: new Date().toISOString(),
      status: "active",
      source: body.source || "API",
    }

    mockAlerts.unshift(newAlert)

    return NextResponse.json({
      success: true,
      data: newAlert,
      message: "Alert created successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create alert" }, { status: 500 })
  }
}
