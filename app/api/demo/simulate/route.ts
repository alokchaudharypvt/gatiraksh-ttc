import { NextResponse } from "next/server"

// Deterministic simulation for reproducible demo results
export async function POST(request: Request) {
  try {
    const { scenario, timeScale, duration } = await request.json()

    console.log("[v0] Starting demo simulation:", { scenario, timeScale, duration })

    // Simulate time progression with deterministic results
    const simulationSteps = Math.floor(duration / (timeScale || 1))
    const events = []

    // Generate predictable events for demo
    for (let step = 0; step < simulationSteps; step++) {
      const timeOffset = step * (timeScale || 1)

      // Platform conflict at step 3
      if (step === 3 && scenario === "conflict_demo") {
        events.push({
          time: timeOffset,
          type: "conflict_detected",
          data: {
            id: "SIM_CNF001",
            type: "platform_conflict",
            severity: "high",
            trains: ["12951", "12002"],
            location: "New Delhi - Platform 1",
            description: "Platform assignment conflict detected",
          },
        })
      }

      // AI suggestion generation at step 4
      if (step === 4 && scenario === "conflict_demo") {
        events.push({
          time: timeOffset,
          type: "ai_suggestions_generated",
          data: {
            conflictId: "SIM_CNF001",
            suggestions: [
              {
                id: "SUG001",
                title: "Reassign to Platform 3",
                effectiveness: 92,
                implementationTime: "3 minutes",
              },
              {
                id: "SUG002",
                title: "Delay Shatabdi by 8 minutes",
                effectiveness: 87,
                implementationTime: "2 minutes",
              },
            ],
          },
        })
      }

      // Conflict resolution at step 6
      if (step === 6 && scenario === "conflict_demo") {
        events.push({
          time: timeOffset,
          type: "conflict_resolved",
          data: {
            conflictId: "SIM_CNF001",
            resolution: "Platform reassignment applied",
            delayReduction: 12,
            status: "resolved",
          },
        })
      }

      // Performance optimization events
      if (scenario === "optimization_demo") {
        if (step === 2) {
          events.push({
            time: timeOffset,
            type: "optimization_started",
            data: {
              algorithm: "Hybrid AI Model",
              target: "throughput",
              expectedImprovement: "15-20%",
            },
          })
        }

        if (step === 5) {
          events.push({
            time: timeOffset,
            type: "optimization_completed",
            data: {
              improvement: 18.5,
              throughputGain: 12.3,
              delayReduction: 22.1,
              confidence: 94.7,
            },
          })
        }
      }

      // Train position updates
      events.push({
        time: timeOffset,
        type: "train_position_update",
        data: {
          trains: [
            {
              id: "12951",
              position: Math.min(100, 75 + step * 2),
              speed: 130 + Math.sin(step * 0.5) * 10,
              delay: Math.max(0, step > 3 ? 5 - step : 0),
            },
            {
              id: "12615",
              position: Math.min(100, 45 + step * 1.5),
              speed: 85 + Math.cos(step * 0.3) * 8,
              delay: Math.max(0, 12 - step * 0.8),
            },
          ],
        },
      })
    }

    return NextResponse.json({
      success: true,
      simulation: {
        id: `SIM_${Date.now()}`,
        scenario,
        duration,
        timeScale,
        events,
        totalSteps: simulationSteps,
        deterministicSeed: 12345, // Fixed seed for reproducible results
        expectedOutcome:
          {
            conflict_demo: "Platform conflict detected and resolved with AI suggestions",
            optimization_demo: "18.5% performance improvement achieved",
            performance_demo: "Comprehensive metrics collected and analyzed",
            standard: "Full system demonstration completed",
          }[scenario] || "Simulation completed successfully",
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Demo simulation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Simulation failed",
      },
      { status: 500 },
    )
  }
}
