import { NextResponse } from "next/server"

// Demo seed data for reproducible hackathon demonstrations
const demoTrains = [
  {
    id: "12951",
    name: "Mumbai Rajdhani Express",
    type: "express",
    status: "on-time",
    position: 75,
    speed: 130,
    delay: 0,
    nextStation: "New Delhi",
    passengers: 1200,
    priority: "high",
    route: "Mumbai Central - New Delhi",
    coach: "AC-1",
    corridor: "delhi-mumbai",
    departure: "06:00",
    arrival: "20:30",
    platform: "Platform 1",
  },
  {
    id: "12615",
    name: "Grand Trunk Express",
    type: "express",
    status: "delayed",
    position: 45,
    speed: 85,
    delay: 12,
    nextStation: "Ghaziabad Junction",
    passengers: 1800,
    priority: "high",
    route: "Chennai Central - New Delhi",
    coach: "AC-2",
    corridor: "delhi-chennai",
    departure: "07:15",
    arrival: "11:45",
    platform: "Platform 2",
  },
  {
    id: "12002",
    name: "Shatabdi Express",
    type: "express",
    status: "approaching",
    position: 85,
    speed: 150,
    delay: 0,
    nextStation: "New Delhi",
    passengers: 1050,
    priority: "high",
    route: "New Delhi - Bhopal",
    coach: "AC Chair Car",
    corridor: "delhi-mumbai",
    departure: "08:00",
    arrival: "14:30",
    platform: "Platform 1",
  },
]

const demoConflicts = [
  {
    id: "DEMO_CNF001",
    type: "platform_conflict",
    severity: "high",
    status: "active",
    title: "Platform Assignment Conflict",
    description: "Rajdhani Express and Shatabdi Express both scheduled for Platform 1 at overlapping times",
    affectedTrains: ["12951", "12002"],
    location: "New Delhi Station - Platform 1",
    detectedAt: new Date(Date.now() - 300000).toISOString(),
    estimatedImpact: {
      delayMinutes: 15,
      affectedPassengers: 2250,
      cascadingDelays: 3,
    },
    suggestions: [],
  },
  {
    id: "DEMO_CNF002",
    type: "collision_risk",
    severity: "critical",
    status: "active",
    title: "Track Collision Risk",
    description: "Grand Trunk Express approaching same track section as freight train with insufficient spacing",
    affectedTrains: ["12615", "BOXN-001"],
    location: "Junction Alpha - Track 2",
    detectedAt: new Date(Date.now() - 120000).toISOString(),
    estimatedImpact: {
      delayMinutes: 25,
      affectedPassengers: 1800,
      cascadingDelays: 5,
    },
    suggestions: [],
  },
]

const demoScenarios = [
  {
    id: "DEMO_SCN001",
    name: "Platform Conflict Demo Scenario",
    description: "Demonstrates AI conflict resolution for platform assignment conflicts",
    type: "demo",
    status: "ready",
    parameters: {
      duration: 15,
      severity: "high",
      affectedTrains: ["12951", "12002"],
      location: "New Delhi Station",
    },
    expectedResults: {
      throughputImpact: -12.5,
      delayIncrease: 8.3,
      alternativeRoutes: 2,
      recoveryTime: 12,
      confidence: 94.2,
      conflictsDetected: 1,
      conflictsResolved: 1,
    },
  },
  {
    id: "DEMO_SCN002",
    name: "Signal Failure Recovery Demo",
    description: "Shows system response to signal failure with multiple train rerouting",
    type: "demo",
    status: "ready",
    parameters: {
      duration: 30,
      severity: "high",
      affectedTrains: ["12615", "64501", "BOXN-001"],
      location: "Junction Alpha",
    },
    expectedResults: {
      throughputImpact: -28.7,
      delayIncrease: 18.5,
      alternativeRoutes: 3,
      recoveryTime: 45,
      confidence: 89.1,
      conflictsDetected: 4,
      conflictsResolved: 4,
    },
  },
]

export async function POST(request: Request) {
  try {
    const { mode } = await request.json()

    console.log("[v0] Loading demo seed data for mode:", mode)

    const seedData = {
      trains: demoTrains,
      conflicts: demoConflicts,
      scenarios: demoScenarios,
      timestamp: new Date().toISOString(),
      mode: mode || "standard",
    }

    // Customize seed data based on demo mode
    switch (mode) {
      case "conflict_demo":
        // Focus on conflict scenarios
        seedData.conflicts = demoConflicts
        seedData.trains = demoTrains.map((train) => ({
          ...train,
          // Set up trains for conflict demonstration
          position: train.id === "12951" ? 95 : train.id === "12002" ? 90 : train.position,
          status: train.id === "12615" ? "delayed" : train.status,
          delay: train.id === "12615" ? 15 : train.delay,
        }))
        break

      case "optimization_demo":
        // Focus on AI optimization
        seedData.trains = demoTrains.map((train) => ({
          ...train,
          delay: Math.random() * 10 + 5, // Add some delays for optimization
          speed: train.speed * (0.8 + Math.random() * 0.2), // Vary speeds
        }))
        break

      case "performance_demo":
        // Focus on performance metrics
        seedData.trains = [
          ...demoTrains,
          ...Array.from({ length: 15 }, (_, i) => ({
            id: `DEMO_${i + 100}`,
            name: `Demo Train ${i + 1}`,
            type: i % 3 === 0 ? "express" : i % 3 === 1 ? "local" : "freight",
            status: ["on-time", "delayed", "approaching"][i % 3],
            position: Math.random() * 100,
            speed: 60 + Math.random() * 80,
            delay: Math.random() * 15,
            nextStation: `Station ${String.fromCharCode(65 + (i % 10))}`,
            passengers: i % 3 !== 2 ? Math.floor(Math.random() * 1000 + 500) : undefined,
            priority: ["high", "medium", "low"][i % 3],
            route: `Route ${i + 1}`,
            coach: "Standard",
            corridor: ["delhi-mumbai", "delhi-chennai", "delhi-kolkata"][i % 3],
          })),
        ]
        break

      default:
        // Standard demo mode
        break
    }

    return NextResponse.json({
      success: true,
      message: `Demo seed data loaded for ${mode} mode`,
      data: seedData,
      instructions:
        {
          conflict_demo: "Click 'Manual Resolve' on any conflict to see AI suggestions",
          optimization_demo: "Use 'AI Optimization' button to see performance improvements",
          performance_demo: "Navigate to Performance tab to see comprehensive analytics",
          standard: "Explore all features with realistic Indian Railway data",
        }[mode] || "Demo data loaded successfully",
    })
  } catch (error) {
    console.error("[v0] Demo seed loading error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to load demo seed data",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      availableModes: [
        {
          id: "standard",
          name: "Standard Demo",
          description: "Complete system demonstration with all features",
        },
        {
          id: "conflict_demo",
          name: "Conflict Resolution Demo",
          description: "Focus on AI-powered conflict detection and resolution",
        },
        {
          id: "optimization_demo",
          name: "AI Optimization Demo",
          description: "Showcase AI optimization engine capabilities",
        },
        {
          id: "performance_demo",
          name: "Performance Analytics Demo",
          description: "Comprehensive performance monitoring and analytics",
        },
      ],
      currentMode: "standard",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get demo modes",
      },
      { status: 500 },
    )
  }
}
