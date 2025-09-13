// API client for railway control system

export class RailwayAPI {
  private baseUrl: string

  constructor(baseUrl = "/api") {
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || "API request failed")
    }

    return data.data
  }

  // Train operations
  async getTrains(filters?: { status?: string; type?: string }) {
    const params = new URLSearchParams()
    if (filters?.status) params.append("status", filters.status)
    if (filters?.type) params.append("type", filters.type)

    const query = params.toString()
    return this.request(`/trains${query ? `?${query}` : ""}`)
  }

  async createTrain(trainData: any) {
    return this.request("/trains", {
      method: "POST",
      body: JSON.stringify(trainData),
    })
  }

  async updateTrain(id: string, updates: any) {
    return this.request("/trains", {
      method: "PUT",
      body: JSON.stringify({ id, ...updates }),
    })
  }

  // Alert operations
  async getAlerts(filters?: { status?: string; type?: string; priority?: string }) {
    const params = new URLSearchParams()
    if (filters?.status) params.append("status", filters.status)
    if (filters?.type) params.append("type", filters.type)
    if (filters?.priority) params.append("priority", filters.priority)

    const query = params.toString()
    return this.request(`/alerts${query ? `?${query}` : ""}`)
  }

  async createAlert(alertData: any) {
    return this.request("/alerts", {
      method: "POST",
      body: JSON.stringify(alertData),
    })
  }

  // Optimization operations
  async runOptimization(params: { algorithm?: string; target?: string; timeHorizon?: string }) {
    return this.request("/optimization", {
      method: "POST",
      body: JSON.stringify(params),
    })
  }

  async getOptimizationHistory() {
    return this.request("/optimization")
  }

  // Scenario operations
  async getScenarios() {
    return this.request("/scenarios")
  }

  async createScenario(scenarioData: any) {
    return this.request("/scenarios", {
      method: "POST",
      body: JSON.stringify(scenarioData),
    })
  }

  // Performance operations
  async getPerformanceData(timeRange?: string) {
    const params = timeRange ? `?timeRange=${timeRange}` : ""
    return this.request(`/performance${params}`)
  }

  // Real-time data simulation
  async getRealtimeUpdates() {
    // In production, this would be a WebSocket connection
    return this.request("/trains")
  }
}

// Export singleton instance
export const railwayAPI = new RailwayAPI()

// Utility functions for data processing
export const processTrainData = (trains: any[]) => {
  return trains.map((train) => ({
    ...train,
    efficiency: calculateEfficiency(train),
    riskLevel: calculateRiskLevel(train),
  }))
}

export const calculateEfficiency = (train: any) => {
  const baseEfficiency = 100
  const delayPenalty = train.delay * 2
  const speedBonus = train.speed > 100 ? 5 : 0

  return Math.max(0, baseEfficiency - delayPenalty + speedBonus)
}

export const calculateRiskLevel = (train: any) => {
  if (train.delay > 30) return "high"
  if (train.delay > 10) return "medium"
  return "low"
}

// WebSocket connection for real-time updates
export class RealTimeConnection {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  connect(onMessage: (data: any) => void, onError?: (error: Event) => void) {
    try {
      // In production, use actual WebSocket URL
      // this.ws = new WebSocket('ws://localhost:3001/ws')

      // Simulate real-time updates for demo
      const interval = setInterval(() => {
        const mockUpdate = {
          type: "train_update",
          data: {
            id: "EXP001",
            position: Math.random() * 100,
            speed: Math.random() * 120 + 60,
            delay: Math.random() * 10,
          },
          timestamp: new Date().toISOString(),
        }
        onMessage(mockUpdate)
      }, 3000)

      return () => clearInterval(interval)
    } catch (error) {
      console.error("WebSocket connection failed:", error)
      if (onError) onError(error as Event)
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}

export const realTimeConnection = new RealTimeConnection()
