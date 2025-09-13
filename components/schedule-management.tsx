"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  Clock,
  Train,
  MapPin,
  Users,
  AlertTriangle,
  CheckCircle,
  Edit,
  X,
  Plus,
  Search,
  Download,
  RefreshCw,
} from "lucide-react"

interface TrainSchedule {
  id: string
  trainNumber: string
  trainName: string
  type: "express" | "local" | "freight" | "maintenance"
  route: string
  departure: string
  arrival: string
  platform: string
  status: "scheduled" | "delayed" | "cancelled" | "departed" | "arrived"
  delay: number
  passengers: number
  priority: "high" | "medium" | "low"
  stations: {
    name: string
    arrivalTime: string
    departureTime: string
    platform: string
    status: "pending" | "arrived" | "departed"
  }[]
}

export function ScheduleManagement() {
  const [schedules, setSchedules] = useState<TrainSchedule[]>([
    {
      id: "SCH001",
      trainNumber: "EXP001",
      trainName: "Rajdhani Express",
      type: "express",
      route: "New Delhi - Mumbai",
      departure: "06:00",
      arrival: "20:30",
      platform: "Platform 1",
      status: "scheduled",
      delay: 0,
      passengers: 1200,
      priority: "high",
      stations: [
        { name: "New Delhi", arrivalTime: "06:00", departureTime: "06:00", platform: "Platform 1", status: "pending" },
        { name: "Ghaziabad", arrivalTime: "06:45", departureTime: "06:47", platform: "Platform 2", status: "pending" },
        { name: "Kanpur", arrivalTime: "10:15", departureTime: "10:20", platform: "Platform 3", status: "pending" },
        { name: "Lucknow", arrivalTime: "12:30", departureTime: "12:35", platform: "Platform 1", status: "pending" },
        { name: "Mumbai", arrivalTime: "20:30", departureTime: "20:30", platform: "Platform 4", status: "pending" },
      ],
    },
    {
      id: "SCH002",
      trainNumber: "LOC045",
      trainName: "Local 045",
      type: "local",
      route: "Ghaziabad - Kanpur",
      departure: "07:15",
      arrival: "11:45",
      platform: "Platform 2",
      status: "delayed",
      delay: 5,
      passengers: 800,
      priority: "medium",
      stations: [
        { name: "Ghaziabad", arrivalTime: "07:15", departureTime: "07:15", platform: "Platform 2", status: "departed" },
        { name: "Modinagar", arrivalTime: "07:45", departureTime: "07:47", platform: "Platform 1", status: "arrived" },
        { name: "Meerut", arrivalTime: "08:30", departureTime: "08:35", platform: "Platform 2", status: "pending" },
        { name: "Kanpur", arrivalTime: "11:45", departureTime: "11:45", platform: "Platform 3", status: "pending" },
      ],
    },
    {
      id: "SCH003",
      trainNumber: "FRT203",
      trainName: "Freight 203",
      type: "freight",
      route: "Kanpur - Lucknow",
      departure: "14:00",
      arrival: "18:30",
      platform: "Yard 1",
      status: "scheduled",
      delay: 0,
      passengers: 0,
      priority: "low",
      stations: [
        { name: "Kanpur", arrivalTime: "14:00", departureTime: "14:00", platform: "Yard 1", status: "pending" },
        { name: "Unnao", arrivalTime: "15:30", departureTime: "15:35", platform: "Yard 2", status: "pending" },
        { name: "Lucknow", arrivalTime: "18:30", departureTime: "18:30", platform: "Yard 3", status: "pending" },
      ],
    },
  ])

  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null)
  const [editingSchedule, setEditingSchedule] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")

  const filteredSchedules = schedules.filter((schedule) => {
    const matchesSearch =
      schedule.trainName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.trainNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.route.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || schedule.status === filterStatus
    const matchesType = filterType === "all" || schedule.type === filterType

    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500"
      case "delayed":
        return "bg-yellow-500"
      case "cancelled":
        return "bg-red-500"
      case "departed":
        return "bg-green-500"
      case "arrived":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Clock className="h-4 w-4" />
      case "delayed":
        return <AlertTriangle className="h-4 w-4" />
      case "cancelled":
        return <X className="h-4 w-4" />
      case "departed":
        return <CheckCircle className="h-4 w-4" />
      case "arrived":
        return <MapPin className="h-4 w-4" />
      default:
        return <Train className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "express":
        return "border-primary bg-primary/10 text-primary"
      case "local":
        return "border-blue-500 bg-blue-500/10 text-blue-500"
      case "freight":
        return "border-orange-500 bg-orange-500/10 text-orange-500"
      case "maintenance":
        return "border-gray-500 bg-gray-500/10 text-gray-500"
      default:
        return "border-gray-300 bg-gray-100 text-gray-600"
    }
  }

  const updateScheduleStatus = (scheduleId: string, newStatus: string, delay = 0) => {
    setSchedules((prev) =>
      prev.map((schedule) =>
        schedule.id === scheduleId ? { ...schedule, status: newStatus as any, delay } : schedule,
      ),
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Train Schedule Management
              </CardTitle>
              <CardDescription>Manage train schedules, track delays, and optimize timetables</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Schedule
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search trains, routes, or numbers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
                <SelectItem value="departed">Departed</SelectItem>
                <SelectItem value="arrived">Arrived</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="express">Express</SelectItem>
                <SelectItem value="local">Local</SelectItem>
                <SelectItem value="freight">Freight</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule">Current Schedule</TabsTrigger>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
          <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          <div className="grid gap-4">
            {filteredSchedules.map((schedule) => (
              <Card
                key={schedule.id}
                className={`transition-all ${selectedSchedule === schedule.id ? "ring-2 ring-primary" : ""}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Train className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <h3 className="font-semibold">{schedule.trainName}</h3>
                          <p className="text-sm text-muted-foreground">{schedule.trainNumber}</p>
                        </div>
                      </div>
                      <Badge className={getTypeColor(schedule.type)}>{schedule.type}</Badge>
                      <Badge variant="outline" className={`${getStatusColor(schedule.status)} text-white border-0`}>
                        {getStatusIcon(schedule.status)}
                        <span className="ml-1 capitalize">{schedule.status}</span>
                      </Badge>
                      {schedule.delay > 0 && <Badge variant="destructive">+{schedule.delay}m delay</Badge>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSchedule(selectedSchedule === schedule.id ? null : schedule.id)}
                      >
                        {selectedSchedule === schedule.id ? "Hide Details" : "View Details"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingSchedule(editingSchedule === schedule.id ? null : schedule.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Route</Label>
                      <div className="font-medium">{schedule.route}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Departure</Label>
                      <div className="font-medium flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {schedule.departure}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Arrival</Label>
                      <div className="font-medium flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {schedule.arrival}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Platform</Label>
                      <div className="font-medium">{schedule.platform}</div>
                    </div>
                  </div>

                  {schedule.passengers > 0 && (
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {schedule.passengers} passengers
                      </div>
                      <Badge variant={schedule.priority === "high" ? "default" : "secondary"} className="capitalize">
                        {schedule.priority} priority
                      </Badge>
                    </div>
                  )}

                  {selectedSchedule === schedule.id && (
                    <div className="mt-6 border-t pt-4">
                      <h4 className="font-medium mb-3">Station Schedule</h4>
                      <div className="space-y-3">
                        {schedule.stations.map((station, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-4">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  station.status === "departed"
                                    ? "bg-green-500"
                                    : station.status === "arrived"
                                      ? "bg-blue-500"
                                      : "bg-gray-300"
                                }`}
                              />
                              <div>
                                <div className="font-medium">{station.name}</div>
                                <div className="text-sm text-muted-foreground">{station.platform}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm">
                                Arr: {station.arrivalTime} | Dep: {station.departureTime}
                              </div>
                              <Badge variant="outline" className="capitalize text-xs">
                                {station.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {editingSchedule === schedule.id && (
                    <div className="mt-6 border-t pt-4">
                      <h4 className="font-medium mb-3">Quick Actions</h4>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateScheduleStatus(schedule.id, "delayed", 5)}
                        >
                          Mark Delayed (+5m)
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateScheduleStatus(schedule.id, "departed")}
                        >
                          Mark Departed
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateScheduleStatus(schedule.id, "arrived")}
                        >
                          Mark Arrived
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateScheduleStatus(schedule.id, "cancelled")}
                        >
                          Cancel Train
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Timeline View</CardTitle>
              <CardDescription>Visual timeline of all train movements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 24 }, (_, hour) => (
                  <div key={hour} className="flex items-center gap-4">
                    <div className="w-16 text-sm font-medium text-muted-foreground">
                      {String(hour).padStart(2, "0")}:00
                    </div>
                    <div className="flex-1 h-8 bg-muted rounded relative">
                      {schedules
                        .filter((schedule) => {
                          const depHour = Number.parseInt(schedule.departure.split(":")[0])
                          const arrHour = Number.parseInt(schedule.arrival.split(":")[0])
                          return hour >= depHour && hour <= arrHour
                        })
                        .map((schedule, index) => (
                          <div
                            key={schedule.id}
                            className={`absolute top-1 bottom-1 ${getStatusColor(schedule.status)} rounded text-xs text-white px-2 flex items-center`}
                            style={{
                              left: `${(Number.parseInt(schedule.departure.split(":")[1]) / 60) * 100}%`,
                              width: "120px",
                            }}
                          >
                            {schedule.trainNumber}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conflicts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Conflicts</CardTitle>
              <CardDescription>Identify and resolve scheduling conflicts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-red-900">Platform Conflict Detected</h4>
                      <p className="text-sm text-red-700 mt-1">
                        EXP001 and LOC045 both scheduled for Platform 2 at 07:15. Recommend moving LOC045 to Platform 3.
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline">
                          Auto-Resolve
                        </Button>
                        <Button size="sm" variant="outline">
                          Manual Review
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-yellow-900">Tight Connection Warning</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Connection time between FRT203 and maintenance window is only 15 minutes. Consider adjusting
                        departure time.
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline">
                          Adjust Schedule
                        </Button>
                        <Button size="sm" variant="outline">
                          Accept Risk
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Optimization</CardTitle>
              <CardDescription>AI-powered schedule optimization recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Optimization Suggestions</h4>

                  <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div className="flex-1">
                        <h5 className="font-medium text-green-900">Throughput Improvement</h5>
                        <p className="text-sm text-green-700 mt-1">
                          Adjusting EXP001 departure by 10 minutes can increase section throughput by 8%.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                          Apply Suggestion
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div className="flex-1">
                        <h5 className="font-medium text-blue-900">Delay Reduction</h5>
                        <p className="text-sm text-blue-700 mt-1">
                          Reordering freight trains can reduce average passenger delays by 12%.
                        </p>
                        <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Optimization Metrics</h4>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Current Efficiency</span>
                      <span className="font-medium">87.2%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Potential Improvement</span>
                      <span className="font-medium text-green-500">+12.8%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Delay Reduction</span>
                      <span className="font-medium text-blue-500">-18.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Energy Savings</span>
                      <span className="font-medium text-purple-500">-7.2%</span>
                    </div>
                  </div>

                  <Button className="w-full mt-4">Run Full Optimization</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
