"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

// Types
interface Station {
  id: string
  name: string
  code: string
  coordinates: [number, number]
  zone: string
  platforms: number
  isJunction: boolean
}

interface Train {
  id: string
  name: string
  type: "Express" | "Passenger" | "Freight"
  position: [number, number]
  destination: string
  speed: number
  delay: number
  status: "running" | "stopped" | "delayed"
  priority: number
  isHeld: boolean
  holdUntil?: number
  route: string[]
  nextStation: string
  estimatedArrival: string
}

interface ConflictData {
  id: string
  trains: string[]
  distance: number
  severity: "high" | "medium" | "low"
  resolved: boolean
}

interface KPIData {
  averageDelay: number
  punctualityRate: number
  networkThroughput: number
}

interface MapInstance {
  map: any
  stationCluster: any
  trainCluster: any
  L: any
}

export function LiveTrainMap() {
  const [stations, setStations] = useState<Station[]>([])
  const [trains, setTrains] = useState<Train[]>([])
  const [selectedTrain, setSelectedTrain] = useState<string>("")
  const [conflicts, setConflicts] = useState<ConflictData[]>([])
  const [kpis, setKpis] = useState<KPIData>({
    averageDelay: 0,
    punctualityRate: 100,
    networkThroughput: 0,
  })
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<MapInstance | null>(null)
  const markersRef = useRef<Map<string, any>>(new Map())
  const conflictLinesRef = useRef<Map<string, any>>(new Map())
  const { toast } = useToast()

  const generateMockData = useCallback(() => {
    console.log("[v0] Generating mock railway data")

    // Generate stations
    const mockStations: Station[] = []
    const zones = ["Northern", "Western", "Eastern", "Southern", "Central"]

    for (let i = 0; i < 100; i++) {
      mockStations.push({
        id: `station-${i}`,
        name: `Station ${i + 1}`,
        code: `ST${String(i + 1).padStart(3, "0")}`,
        coordinates: [
          20 + Math.random() * 15, // Latitude range for India
          70 + Math.random() * 20, // Longitude range for India
        ] as [number, number],
        zone: zones[Math.floor(Math.random() * zones.length)],
        platforms: Math.floor(Math.random() * 8) + 2,
        isJunction: Math.random() > 0.8,
      })
    }

    // Generate trains
    const mockTrains: Train[] = []
    const trainTypes: Train["type"][] = ["Express", "Passenger", "Freight"]
    const statuses: Train["status"][] = ["running", "stopped", "delayed"]

    for (let i = 0; i < 50; i++) {
      const type = trainTypes[Math.floor(Math.random() * trainTypes.length)]
      const status = statuses[Math.floor(Math.random() * statuses.length)]

      mockTrains.push({
        id: `train-${i}`,
        name: `${type} ${i + 1}`,
        type,
        position: [20 + Math.random() * 15, 70 + Math.random() * 20] as [number, number],
        destination: `Station ${Math.floor(Math.random() * 100) + 1}`,
        speed: status === "stopped" ? 0 : Math.floor(Math.random() * 120) + 20,
        delay: Math.floor(Math.random() * 30),
        status,
        priority: Math.floor(Math.random() * 5) + 1,
        isHeld: false,
        route: [`ST${String(Math.floor(Math.random() * 100) + 1).padStart(3, "0")}`],
        nextStation: `Station ${Math.floor(Math.random() * 100) + 1}`,
        estimatedArrival: new Date(Date.now() + Math.random() * 3600000).toLocaleTimeString(),
      })
    }

    return { stations: mockStations, trains: mockTrains }
  }, [])

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Try to load real data first
        try {
          const response = await fetch("https://raw.githubusercontent.com/datameet/railways/master/trains.json")
          if (response.ok) {
            const data = await response.json()
            if (data.features && Array.isArray(data.features)) {
              console.log("[v0] Loaded real railway data")
              // Process real data here if needed
            }
          }
        } catch (apiError) {
          console.log("[v0] API unavailable, using mock data")
        }

        // Generate mock data
        const { stations: mockStations, trains: mockTrains } = generateMockData()
        setStations(mockStations)
        setTrains(mockTrains)

        console.log("[v0] Data loaded successfully")
      } catch (error) {
        console.error("[v0] Failed to load data:", error)
        setError("Failed to load railway data")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [generateMockData])

  useEffect(() => {
    if (!mapRef.current || isMapLoaded) return

    const initializeMap = async () => {
      try {
        console.log("[v0] Initializing map")

        // Dynamic imports for Leaflet
        const L = await import("leaflet")
        await import("leaflet.markercluster")

        // Create map
        const map = L.map(mapRef.current!).setView([28.6139, 77.209], 6) // Delhi center

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map)

        // Create marker cluster groups using window.L
        const stationCluster = (window as any).L.markerClusterGroup({
          maxClusterRadius: 50,
          iconCreateFunction: (cluster: any) => {
            const count = cluster.getChildCount()
            return L.divIcon({
              html: `<div style="background-color: #3b82f6; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${count}</div>`,
              className: "custom-cluster-icon",
              iconSize: [30, 30],
            })
          },
        })

        const trainCluster = (window as any).L.markerClusterGroup({
          maxClusterRadius: 30,
          iconCreateFunction: (cluster: any) => {
            const count = cluster.getChildCount()
            return L.divIcon({
              html: `<div style="background-color: #dc2626; color: white; border-radius: 4px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${count}</div>`,
              className: "custom-cluster-icon",
              iconSize: [28, 28],
            })
          },
        })

        map.addLayer(stationCluster)
        map.addLayer(trainCluster)

        mapInstanceRef.current = { map, stationCluster, trainCluster, L }
        setIsMapLoaded(true)

        console.log("[v0] Map initialized successfully")
      } catch (error) {
        console.error("[v0] Failed to initialize map:", error)
        setError("Failed to initialize map")
      }
    }

    initializeMap()
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current || !isMapLoaded || stations.length === 0) return

    const { stationCluster, trainCluster, L } = mapInstanceRef.current

    // Clear existing markers
    stationCluster.clearLayers()
    trainCluster.clearLayers()
    markersRef.current.clear()

    // Add station markers
    stations.forEach((station) => {
      const iconHtml = station.isJunction
        ? `<div style="background-color: #3b82f6; width: 14px; height: 14px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`
        : `<div style="background-color: #6b7280; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 2px rgba(0,0,0,0.3);"></div>`

      const icon = L.divIcon({
        html: iconHtml,
        className: "custom-div-icon",
        iconSize: station.isJunction ? [20, 20] : [14, 14],
        iconAnchor: station.isJunction ? [10, 10] : [7, 7],
      })

      const marker = L.marker(station.coordinates, { icon }).bindPopup(`
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">${station.name}</h3>
          <div style="font-size: 14px; color: #6b7280; line-height: 1.4;">
            <p style="margin: 2px 0;"><strong>Code:</strong> ${station.code}</p>
            <p style="margin: 2px 0;"><strong>Zone:</strong> ${station.zone}</p>
            <p style="margin: 2px 0;"><strong>Platforms:</strong> ${station.platforms}</p>
            ${station.isJunction ? '<p style="margin: 2px 0; color: #3b82f6;"><strong>Junction Station</strong></p>' : ""}
          </div>
        </div>
      `)

      stationCluster.addLayer(marker)
      markersRef.current.set(`station-${station.code}`, marker)
    })

    // Add train markers
    trains.forEach((train) => {
      const color = getTrainMarkerColor(train.type, train.status)
      const size = train.type === "Express" ? 18 : train.type === "Freight" ? 16 : 14
      const letter = train.type[0]

      const iconHtml = `
        <div style="
          background-color: ${color}; 
          width: ${size}px; 
          height: ${size}px; 
          border-radius: 4px; 
          border: 2px solid white; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: ${size - 6}px;
        ">${letter}</div>
      `

      const icon = L.divIcon({
        html: iconHtml,
        className: "custom-div-icon",
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      })

      const marker = L.marker(train.position, { icon }).bindPopup(`
        <div style="min-width: 250px;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">${train.name}</h3>
          <div style="font-size: 14px; color: #6b7280; line-height: 1.4;">
            <p style="margin: 2px 0;"><strong>Type:</strong> ${train.type}</p>
            <p style="margin: 2px 0;"><strong>Status:</strong> <span style="color: ${color};">${train.status}</span></p>
            <p style="margin: 2px 0;"><strong>Speed:</strong> ${train.speed} km/h</p>
            <p style="margin: 2px 0;"><strong>Delay:</strong> ${train.delay} minutes</p>
            <p style="margin: 2px 0;"><strong>Destination:</strong> ${train.destination}</p>
            <p style="margin: 2px 0;"><strong>Next Station:</strong> ${train.nextStation}</p>
            <p style="margin: 2px 0;"><strong>ETA:</strong> ${train.estimatedArrival}</p>
          </div>
        </div>
      `)

      trainCluster.addLayer(marker)
      markersRef.current.set(`train-${train.id}`, marker)
    })

    console.log(`[v0] Updated map with ${stations.length} stations and ${trains.length} trains`)
  }, [stations, trains, isMapLoaded])

  useEffect(() => {
    if (trains.length === 0) return

    const detectConflicts = () => {
      const newConflicts: ConflictData[] = []

      for (let i = 0; i < trains.length; i++) {
        for (let j = i + 1; j < trains.length; j++) {
          const train1 = trains[i]
          const train2 = trains[j]

          if (train1.status === "stopped" || train2.status === "stopped") continue

          const distance = calculateDistance(train1.position, train2.position)

          if (distance < 0.5) {
            const conflictId = `${train1.id}-${train2.id}`
            const severity: "high" | "medium" | "low" = distance < 0.2 ? "high" : distance < 0.35 ? "medium" : "low"

            newConflicts.push({
              id: conflictId,
              trains: [train1.id, train2.id],
              distance,
              severity,
              resolved: false,
            })
          }
        }
      }

      setConflicts(newConflicts)

      // Draw conflict lines
      if (mapInstanceRef.current && newConflicts.length > 0) {
        const { map, L } = mapInstanceRef.current

        conflictLinesRef.current.forEach((line) => map.removeLayer(line))
        conflictLinesRef.current.clear()

        newConflicts.forEach((conflict) => {
          const train1 = trains.find((t) => t.id === conflict.trains[0])
          const train2 = trains.find((t) => t.id === conflict.trains[1])

          if (train1 && train2) {
            const color =
              conflict.severity === "high" ? "#dc2626" : conflict.severity === "medium" ? "#f59e0b" : "#10b981"
            const line = L.polyline([train1.position, train2.position], {
              color,
              weight: 3,
              opacity: 0.7,
              dashArray: "10, 10",
            }).addTo(map)

            conflictLinesRef.current.set(conflict.id, line)
          }
        })
      }
    }

    const interval = setInterval(detectConflicts, 5000)
    return () => clearInterval(interval)
  }, [trains])

  useEffect(() => {
    if (trains.length === 0) return

    const updateKPIs = () => {
      const totalTrains = trains.length
      const totalDelay = trains.reduce((sum, train) => sum + train.delay, 0)
      const onTimeTrains = trains.filter((train) => train.delay <= 5).length
      const movingTrains = trains.filter((train) => train.speed > 0)
      const avgSpeed =
        movingTrains.length > 0 ? movingTrains.reduce((sum, train) => sum + train.speed, 0) / movingTrains.length : 0

      setKpis({
        averageDelay: totalDelay / totalTrains,
        punctualityRate: (onTimeTrains / totalTrains) * 100,
        networkThroughput: Math.round(avgSpeed * 0.6),
      })
    }

    const interval = setInterval(updateKPIs, 10000)
    updateKPIs() // Initial calculation
    return () => clearInterval(interval)
  }, [trains])

  // Helper functions
  const getTrainMarkerColor = (type: Train["type"], status: Train["status"]) => {
    if (status === "stopped") return "#6b7280"
    if (status === "delayed") return "#f59e0b"

    switch (type) {
      case "Express":
        return "#dc2626"
      case "Passenger":
        return "#3b82f6"
      case "Freight":
        return "#059669"
      default:
        return "#6b7280"
    }
  }

  const calculateDistance = (pos1: [number, number], pos2: [number, number]) => {
    const R = 6371 // Earth's radius in km
    const dLat = ((pos2[0] - pos1[0]) * Math.PI) / 180
    const dLon = ((pos2[1] - pos1[1]) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((pos1[0] * Math.PI) / 180) *
        Math.cos((pos2[0] * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const handleTrainSelect = (trainId: string) => {
    setSelectedTrain(trainId)
    const train = trains.find((t) => t.id === trainId)
    if (train && mapInstanceRef.current) {
      const { map } = mapInstanceRef.current
      map.setView(train.position, 10)

      const marker = markersRef.current.get(`train-${trainId}`)
      if (marker) {
        marker.openPopup()
      }
    }
  }

  const handleEmergencyStop = (trainId: string) => {
    setTrains((prev) =>
      prev.map((train) => (train.id === trainId ? { ...train, status: "stopped" as const, speed: 0 } : train)),
    )

    toast({
      title: "Emergency Stop Activated",
      description: `Train ${trainId} has been stopped for safety`,
      variant: "destructive",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading railway network...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert className="border-destructive/20 bg-destructive/5">
        <AlertTitle className="text-destructive">System Error</AlertTitle>
        <AlertDescription className="text-destructive/80">{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Live Railway Network Map</CardTitle>
            <CardDescription>
              Real-time visualization of trains and stations across the Indian Railway network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div ref={mapRef} className="h-96 w-full rounded-lg border" />
          </CardContent>
        </Card>

        <div className="space-y-4">
          {/* Train Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Train Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedTrain} onValueChange={handleTrainSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select train to track" />
                </SelectTrigger>
                <SelectContent>
                  {trains.map((train) => (
                    <SelectItem key={train.id} value={train.id}>
                      {train.name} - {train.status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedTrain && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => handleEmergencyStop(selectedTrain)}
                >
                  Emergency Stop
                </Button>
              )}
            </CardContent>
          </Card>

          {/* KPIs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Network KPIs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Punctuality</span>
                  <span>{kpis.punctualityRate.toFixed(1)}%</span>
                </div>
                <Progress value={kpis.punctualityRate} className="mt-1" />
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Avg Delay</span>
                  <span>{kpis.averageDelay.toFixed(1)}m</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Throughput</span>
                  <span>{kpis.networkThroughput}/h</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conflicts */}
          {conflicts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-destructive">Active Conflicts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {conflicts.slice(0, 3).map((conflict) => (
                    <div key={conflict.id} className="text-xs">
                      <Badge variant={conflict.severity === "high" ? "destructive" : "secondary"}>
                        {conflict.severity.toUpperCase()}
                      </Badge>
                      <p className="mt-1">
                        Trains {conflict.trains.join(" & ")} - {conflict.distance.toFixed(2)}km apart
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{stations.length}</div>
            <p className="text-sm text-muted-foreground">Total Stations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-secondary">{trains.length}</div>
            <p className="text-sm text-muted-foreground">Active Trains</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-chart-3">{trains.filter((t) => t.status === "running").length}</div>
            <p className="text-sm text-muted-foreground">Running</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-destructive">{conflicts.length}</div>
            <p className="text-sm text-muted-foreground">Conflicts</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
