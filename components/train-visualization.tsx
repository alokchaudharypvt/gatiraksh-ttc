"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LiveTrainMap } from "./live-train-map"

const TrainIcon = () => (
  <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C8 2 5 5 5 9v6c0 3.5 2.5 6 6 6h2c3.5 0 6-2.5 6-6V9c0-4-3-7-7-7zm0 2c3 0 5 2 5 5v6c0 2.5-1.5 4-4 4h-2c-2.5 0-4-1.5-4-4V9c0-3 2-5 5-5z" />
  </svg>
)

const MapPinIcon = () => (
  <svg className="h-4 w-4 text-secondary" fill="currentColor" viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const ClockIcon = () => (
  <svg className="h-4 w-4 text-chart-4" fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12,6 12,12 16,14" />
  </svg>
)

const AlertTriangleIcon = () => (
  <svg className="h-4 w-4 text-destructive" fill="currentColor" viewBox="0 0 24 24">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const CheckCircleIcon = () => (
  <svg className="h-4 w-4 text-chart-3" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22,4 12,14.01 9,11.01" />
  </svg>
)

const ZapIcon = () => (
  <svg className="h-4 w-4 text-secondary" fill="currentColor" viewBox="0 0 24 24">
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
  </svg>
)

const RouteIcon = () => (
  <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
    <circle cx="6" cy="19" r="3" />
    <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
  </svg>
)

const UsersIcon = () => (
  <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const LayersIcon = () => (
  <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
    <polygon points="12,2 2,7 12,12 22,7" />
    <polyline points="2,17 12,22 22,17" />
    <polyline points="2,12 12,17 22,12" />
  </svg>
)

interface TrainData {
  id: string
  name: string
  type: "express" | "local" | "freight" | "maintenance"
  status: "on-time" | "delayed" | "stopped" | "approaching"
  position: number
  speed: number
  delay: number
  nextStation: string
  passengers?: number
  priority: "high" | "medium" | "low"
  route: string
  coach: string
  corridor: string
}

interface Station {
  code: string
  name: string
  position: number
  coordinates: { lat: number; lng: number }
  zone: string
  platforms: number
  isJunction: boolean
}

interface RailwayCorridor {
  id: string
  name: string
  distance: number
  stations: Station[]
  color: string
}

export function TrainVisualization() {
  const [trains, setTrains] = useState<TrainData[]>([
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
    },
    {
      id: "64501",
      name: "Delhi EMU Local",
      type: "local",
      status: "on-time",
      position: 25,
      speed: 60,
      delay: 3,
      nextStation: "Faridabad",
      passengers: 950,
      priority: "medium",
      route: "New Delhi - Palwal",
      coach: "General",
      corridor: "delhi-local",
    },
    {
      id: "BOXN-001",
      name: "Coal Freight",
      type: "freight",
      status: "stopped",
      position: 15,
      speed: 0,
      delay: 25,
      nextStation: "Kanpur Central",
      priority: "low",
      route: "Jharia - Dadri",
      coach: "BOXN",
      corridor: "delhi-mumbai",
    },
  ])

  const [selectedTrain, setSelectedTrain] = useState<string | null>(null)
  const [selectedCorridor, setSelectedCorridor] = useState<string>("delhi-mumbai")
  const [mapLayers, setMapLayers] = useState({
    stations: true,
    signals: true,
    freight: true,
    zones: false,
  })

  const corridors: RailwayCorridor[] = [
    {
      id: "delhi-mumbai",
      name: "Delhi - Mumbai Central (Western Railway)",
      distance: 1384,
      color: "#3b82f6",
      stations: [
        {
          code: "NDLS",
          name: "New Delhi",
          position: 0,
          coordinates: { lat: 28.6448, lng: 77.2097 },
          zone: "NR",
          platforms: 16,
          isJunction: true,
        },
        {
          code: "GZB",
          name: "Ghaziabad Junction",
          position: 15,
          coordinates: { lat: 28.6692, lng: 77.4538 },
          zone: "NR",
          platforms: 8,
          isJunction: true,
        },
        {
          code: "CNB",
          name: "Kanpur Central",
          position: 35,
          coordinates: { lat: 26.4499, lng: 80.3319 },
          zone: "NCR",
          platforms: 10,
          isJunction: true,
        },
        {
          code: "JHS",
          name: "Jhansi Junction",
          position: 55,
          coordinates: { lat: 25.4484, lng: 78.5685 },
          zone: "NCR",
          platforms: 6,
          isJunction: true,
        },
        {
          code: "BPL",
          name: "Bhopal Junction",
          position: 75,
          coordinates: { lat: 23.2599, lng: 77.4126 },
          zone: "WCR",
          platforms: 6,
          isJunction: true,
        },
        {
          code: "MMCT",
          name: "Mumbai Central",
          position: 100,
          coordinates: { lat: 19.033, lng: 72.8397 },
          zone: "WR",
          platforms: 7,
          isJunction: true,
        },
      ],
    },
    {
      id: "delhi-chennai",
      name: "Delhi - Chennai Central (Grand Trunk Route)",
      distance: 2194,
      color: "#10b981",
      stations: [
        {
          code: "NDLS",
          name: "New Delhi",
          position: 0,
          coordinates: { lat: 28.6448, lng: 77.2097 },
          zone: "NR",
          platforms: 16,
          isJunction: true,
        },
        {
          code: "AGC",
          name: "Agra Cantt",
          position: 20,
          coordinates: { lat: 27.1767, lng: 78.0081 },
          zone: "NCR",
          platforms: 5,
          isJunction: false,
        },
        {
          code: "JHS",
          name: "Jhansi Junction",
          position: 35,
          coordinates: { lat: 25.4484, lng: 78.5685 },
          zone: "NCR",
          platforms: 6,
          isJunction: true,
        },
        {
          code: "BPL",
          name: "Bhopal Junction",
          position: 50,
          coordinates: { lat: 23.2599, lng: 77.4126 },
          zone: "WCR",
          platforms: 6,
          isJunction: true,
        },
        {
          code: "NGP",
          name: "Nagpur Junction",
          position: 70,
          coordinates: { lat: 21.1458, lng: 79.0882 },
          zone: "CR",
          platforms: 6,
          isJunction: true,
        },
        {
          code: "MAS",
          name: "Chennai Central",
          position: 100,
          coordinates: { lat: 13.0827, lng: 80.2707 },
          zone: "SR",
          platforms: 12,
          isJunction: true,
        },
      ],
    },
    {
      id: "delhi-kolkata",
      name: "Delhi - Kolkata (Howrah) Main Line",
      distance: 1441,
      color: "#f59e0b",
      stations: [
        {
          code: "NDLS",
          name: "New Delhi",
          position: 0,
          coordinates: { lat: 28.6448, lng: 77.2097 },
          zone: "NR",
          platforms: 16,
          isJunction: true,
        },
        {
          code: "CNB",
          name: "Kanpur Central",
          position: 30,
          coordinates: { lat: 26.4499, lng: 80.3319 },
          zone: "NCR",
          platforms: 10,
          isJunction: true,
        },
        {
          code: "ALD",
          name: "Allahabad Junction",
          position: 45,
          coordinates: { lat: 25.4358, lng: 81.8463 },
          zone: "NCR",
          platforms: 10,
          isJunction: true,
        },
        {
          code: "MGS",
          name: "Mughal Sarai",
          position: 65,
          coordinates: { lat: 25.2854, lng: 83.1193 },
          zone: "ECR",
          platforms: 8,
          isJunction: true,
        },
        {
          code: "PNBE",
          name: "Patna Junction",
          position: 80,
          coordinates: { lat: 25.5941, lng: 85.1376 },
          zone: "ECR",
          platforms: 10,
          isJunction: true,
        },
        {
          code: "HWH",
          name: "Howrah Junction",
          position: 100,
          coordinates: { lat: 22.5726, lng: 88.3639 },
          zone: "ER",
          platforms: 23,
          isJunction: true,
        },
      ],
    },
  ]

  const currentCorridor = corridors.find((c) => c.id === selectedCorridor) || corridors[0]

  useEffect(() => {
    const interval = setInterval(() => {
      setTrains((prev) =>
        prev.map((train) => ({
          ...train,
          position: train.status !== "stopped" ? Math.min(100, train.position + Math.random() * 1.5) : train.position,
          speed: train.status === "stopped" ? 0 : Math.max(0, train.speed + (Math.random() - 0.5) * 8),
          delay: train.status === "delayed" ? Math.max(0, train.delay + (Math.random() - 0.7) * 2) : train.delay,
        })),
      )
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  const getTrainColor = (type: string, status: string) => {
    if (status === "delayed") return "bg-destructive"
    if (status === "stopped") return "bg-chart-4"

    switch (type) {
      case "express":
        return "bg-chart-1"
      case "local":
        return "bg-chart-3"
      case "freight":
        return "bg-primary"
      case "maintenance":
        return "bg-chart-4"
      default:
        return "bg-chart-1"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "on-time":
        return <CheckCircleIcon />
      case "delayed":
        return <AlertTriangleIcon />
      case "stopped":
        return <ClockIcon />
      case "approaching":
        return <MapPinIcon />
      default:
        return <TrainIcon />
    }
  }

  const handleTrainControl = async (trainId: string, action: string) => {
    console.log(`[v0] Train control action: ${action} for train ${trainId}`)

    try {
      const response = await fetch("/api/trains/control", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trainId,
          action,
          timestamp: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        console.log(`[v0] Train control response:`, data)

        setTrains((prev) =>
          prev.map((train) =>
            train.id === trainId ? { ...train, status: action === "emergency_stop" ? "stopped" : train.status } : train,
          ),
        )
      }
    } catch (error) {
      console.error(`[v0] Train control error:`, error)
    }
  }

  const filteredTrains = trains.filter((train) => train.corridor === selectedCorridor)

  return (
    <div className="space-y-6">
      <LiveTrainMap />

      {/* Keep existing visualization as secondary view */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <RouteIcon />
            Indian Railway Network - Corridor View
          </CardTitle>
          <CardDescription>Traditional corridor-based visualization of train movements</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCorridor} onValueChange={setSelectedCorridor} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 bg-muted">
              <TabsTrigger value="delhi-mumbai" className="text-xs">
                Delhi - Mumbai
              </TabsTrigger>
              <TabsTrigger value="delhi-chennai" className="text-xs">
                Delhi - Chennai
              </TabsTrigger>
              <TabsTrigger value="delhi-kolkata" className="text-xs">
                Delhi - Kolkata
              </TabsTrigger>
            </TabsList>

            {corridors.map((corridor) => (
              <TabsContent key={corridor.id} value={corridor.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{corridor.name}</h3>
                    <p className="text-sm text-muted-foreground">Distance: {corridor.distance} km</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMapLayers((prev) => ({ ...prev, stations: !prev.stations }))}
                      className={mapLayers.stations ? "bg-secondary/10 border-secondary/20" : ""}
                    >
                      <LayersIcon />
                      Stations
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMapLayers((prev) => ({ ...prev, zones: !prev.zones }))}
                      className={mapLayers.zones ? "bg-secondary/10 border-secondary/20" : ""}
                    >
                      <LayersIcon />
                      Zones
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <div className="h-32 bg-gradient-to-r from-muted/50 to-card rounded-lg relative overflow-hidden border-2 border-border">
                    {/* Track Lines */}
                    <div className="absolute top-1/2 left-0 right-0 h-3 bg-primary/20 transform -translate-y-1/2 rounded-full" />
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-primary transform -translate-y-1/2" />

                    {/* Railway Zone Indicators */}
                    {mapLayers.zones &&
                      corridor.stations.map((station, index) => {
                        if (index === 0) return null
                        const prevStation = corridor.stations[index - 1]
                        return (
                          <div
                            key={`zone-${station.code}`}
                            className="absolute top-1/4 h-1/2 bg-gradient-to-r from-transparent to-secondary/10 border-l border-secondary/30"
                            style={{
                              left: `${prevStation.position}%`,
                              width: `${station.position - prevStation.position}%`,
                            }}
                          >
                            <div className="absolute -top-6 left-2 text-xs font-medium text-secondary">
                              {station.zone}
                            </div>
                          </div>
                        )
                      })}

                    {/* Station Markers */}
                    {mapLayers.stations &&
                      corridor.stations.map((station) => (
                        <div
                          key={station.code}
                          className="absolute top-0 bottom-0 w-1 bg-foreground"
                          style={{ left: `${station.position}%` }}
                        >
                          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-xs font-bold text-foreground whitespace-nowrap">
                            {station.code}
                            {station.isJunction && <span className="text-secondary ml-1">●</span>}
                          </div>
                          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap max-w-20 text-center">
                            {station.name}
                          </div>
                          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
                            P{station.platforms}
                          </div>
                        </div>
                      ))}

                    {/* Trains on this corridor */}
                    {filteredTrains.map((train) => (
                      <div
                        key={train.id}
                        className={`absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 cursor-pointer transition-all duration-2000 ${
                          selectedTrain === train.id ? "scale-125 z-10" : "hover:scale-110"
                        }`}
                        style={{ left: `${train.position}%` }}
                        onClick={() => setSelectedTrain(selectedTrain === train.id ? null : train.id)}
                      >
                        <div
                          className={`w-12 h-7 ${getTrainColor(train.type, train.status)} rounded-md flex items-center justify-center shadow-lg border-2 border-background`}
                        >
                          <TrainIcon />
                        </div>
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-xs font-bold whitespace-nowrap bg-background px-1 rounded border border-border">
                          {train.id}
                        </div>
                        {train.speed > 0 && (
                          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground bg-background px-1 rounded border border-border">
                            {train.speed.toFixed(0)} km/h
                          </div>
                        )}
                        {train.delay > 0 && (
                          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-xs text-destructive bg-destructive/10 px-1 rounded border border-destructive/20">
                            +{train.delay.toFixed(0)}m
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-chart-1 rounded"></div>
                    <span>Express Trains</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-chart-3 rounded"></div>
                    <span>Local Trains</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded"></div>
                    <span>Freight Trains</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-secondary">●</span>
                    <span>Junction Stations</span>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Active Trains - {currentCorridor.name}</CardTitle>
            <CardDescription>Current trains operating on the selected corridor</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredTrains.map((train) => (
              <div
                key={train.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedTrain === train.id
                    ? "border-secondary bg-secondary/5"
                    : "border-border hover:border-secondary/50"
                }`}
                onClick={() => setSelectedTrain(selectedTrain === train.id ? null : train.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={train.priority === "high" ? "default" : "secondary"}
                      className={
                        train.priority === "high" ? "bg-destructive/10 text-destructive border-destructive/20" : ""
                      }
                    >
                      {train.id}
                    </Badge>
                    <div
                      className={`${train.status === "on-time" ? "text-green-700 dark:text-green-400" : train.status === "delayed" ? "text-destructive" : "text-amber-700 dark:text-amber-400"}`}
                    >
                      {getStatusIcon(train.status)}
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize bg-muted">
                    {train.type}
                  </Badge>
                </div>
                <h4 className="font-semibold mb-1 text-foreground">{train.name}</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Route:</span>
                    <span className="font-medium text-foreground">{train.route}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next Station:</span>
                    <span className="font-medium text-foreground">{train.nextStation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Speed:</span>
                    <span className="font-medium text-foreground">{train.speed.toFixed(0)} km/h</span>
                  </div>
                  {train.delay > 0 && (
                    <div className="flex justify-between text-destructive">
                      <span>Delay:</span>
                      <span className="font-medium">{train.delay.toFixed(0)}m</span>
                    </div>
                  )}
                  {train.passengers && (
                    <div className="flex justify-between">
                      <span>Passengers:</span>
                      <span className="font-medium text-foreground">{train.passengers}</span>
                    </div>
                  )}
                </div>
                <Progress value={train.position} className="mt-3" />
              </div>
            ))}
          </CardContent>
        </Card>

        {selectedTrain && (
          <Card className="border-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-secondary">
                <TrainIcon />
                Train Control: {selectedTrain}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const train = filteredTrains.find((t) => t.id === selectedTrain)
                if (!train) return null

                return (
                  <div className="space-y-4">
                    <div className="bg-muted p-3 rounded-lg">
                      <h5 className="font-semibold text-foreground mb-2">{train.name}</h5>
                      <p className="text-sm text-muted-foreground">{train.route}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Status</label>
                        <div className="flex items-center gap-2 mt-1">
                          <div
                            className={`${train.status === "on-time" ? "text-green-700 dark:text-green-400" : train.status === "delayed" ? "text-destructive" : "text-amber-700 dark:text-amber-400"}`}
                          >
                            {getStatusIcon(train.status)}
                          </div>
                          <span className="capitalize font-medium text-foreground">{train.status}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Coach Type</label>
                        <Badge
                          variant="outline"
                          className="mt-1 capitalize bg-secondary/10 text-secondary border-secondary/20"
                        >
                          {train.coach}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Journey Progress</label>
                      <Progress value={train.position} className="mt-2" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{currentCorridor.stations[0].name}</span>
                        <span>{train.position.toFixed(1)}% Complete</span>
                        <span>{currentCorridor.stations[currentCorridor.stations.length - 1].name}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Current Speed</label>
                        <div className="text-2xl font-bold text-secondary mt-1">
                          {train.speed.toFixed(0)} <span className="text-sm font-normal">km/h</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Delay</label>
                        <div
                          className={`text-2xl font-bold mt-1 ${train.delay > 0 ? "text-destructive" : "text-chart-3"}`}
                        >
                          {train.delay.toFixed(0)}m
                        </div>
                      </div>
                    </div>

                    {train.passengers && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Passenger Load</label>
                        <div className="flex items-center gap-2 mt-1">
                          <UsersIcon />
                          <span className="text-lg font-medium text-foreground">{train.passengers} passengers</span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-4">
                      <Button
                        size="sm"
                        className="flex-1 bg-secondary hover:bg-secondary/90"
                        onClick={() => handleTrainControl(train.id, "optimize_route")}
                      >
                        <ZapIcon />
                        <span className="ml-2">Optimize Route</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-destructive/20 text-destructive hover:bg-destructive/5 bg-transparent"
                        onClick={() => handleTrainControl(train.id, "emergency_stop")}
                      >
                        <AlertTriangleIcon />
                        <span className="ml-2">Emergency Stop</span>
                      </Button>
                    </div>
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
