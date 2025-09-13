import { type NextRequest, NextResponse } from "next/server"

const mockScenarios = [
  {
    id: "SCN001",
    name: "Signal Failure at Junction A",
    description: "Simulate signal system failure",
    type: "breakdown",
    status: "completed",
    parameters: {
      duration: 45,
      severity: "high",
      location: "Junction A",
    },
    results: {
      throughputImpact: -35.2,
      delayIncrease: 18.7,
      recoveryTime: 67,
      confidence: 92.4,
    },
  },
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: mockScenarios,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch scenarios" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newScenario = {
      id: `SCN${Date.now()}`,
      ...body,
      status: "draft",
      createdAt: new Date().toISOString(),
    }

    mockScenarios.push(newScenario)

    return NextResponse.json({
      success: true,
      data: newScenario,
      message: "Scenario created successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create scenario" }, { status: 500 })
  }
}
