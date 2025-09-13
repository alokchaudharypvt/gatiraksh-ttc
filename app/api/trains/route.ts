import { type NextRequest, NextResponse } from "next/server"

// Mock database - in production, this would connect to a real database
const mockTrains = [
  {
    id: "EXP001",
    name: "Rajdhani Express",
    type: "express",
    status: "on-time",
    position: 75,
    speed: 120,
    delay: 0,
    nextStation: "New Delhi",
    passengers: 1200,
    priority: "high",
    route: "New Delhi - Mumbai",
    departure: "06:00",
    arrival: "20:30",
    platform: "Platform 1",
  },
  {
    id: "LOC045",
    name: "Local 045",
    type: "local",
    status: "delayed",
    position: 45,
    speed: 80,
    delay: 5,
    nextStation: "Ghaziabad",
    passengers: 800,
    priority: "medium",
    route: "Ghaziabad - Kanpur",
    departure: "07:15",
    arrival: "11:45",
    platform: "Platform 2",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const type = searchParams.get("type")

    let filteredTrains = mockTrains

    if (status) {
      filteredTrains = filteredTrains.filter((train) => train.status === status)
    }

    if (type) {
      filteredTrains = filteredTrains.filter((train) => train.type === type)
    }

    return NextResponse.json({
      success: true,
      data: filteredTrains,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch trains" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["id", "name", "type", "route"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // In production, save to database
    const newTrain = {
      ...body,
      status: body.status || "scheduled",
      position: body.position || 0,
      speed: body.speed || 0,
      delay: body.delay || 0,
      passengers: body.passengers || 0,
      priority: body.priority || "medium",
    }

    mockTrains.push(newTrain)

    return NextResponse.json({
      success: true,
      data: newTrain,
      message: "Train created successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create train" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ success: false, error: "Train ID is required" }, { status: 400 })
    }

    const trainIndex = mockTrains.findIndex((train) => train.id === id)
    if (trainIndex === -1) {
      return NextResponse.json({ success: false, error: "Train not found" }, { status: 404 })
    }

    // Update train
    mockTrains[trainIndex] = { ...mockTrains[trainIndex], ...updates }

    return NextResponse.json({
      success: true,
      data: mockTrains[trainIndex],
      message: "Train updated successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update train" }, { status: 500 })
  }
}
