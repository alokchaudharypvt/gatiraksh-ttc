"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Settings,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Plus,
  Search,
} from "lucide-react"

interface Alert {
  id: string
  title: string
  message: string
  type: "critical" | "warning" | "info" | "success"
  category: "safety" | "delay" | "technical" | "weather" | "security" | "maintenance"
  priority: "high" | "medium" | "low"
  timestamp: string
  status: "active" | "acknowledged" | "resolved"
  source: string
  affectedTrains: string[]
  location: string
  estimatedResolution?: string
  actions?: string[]
}

interface NotificationSettings {
  soundEnabled: boolean
  visualEnabled: boolean
  emailEnabled: boolean
  smsEnabled: boolean
  categories: {
    [key: string]: boolean
  }
  priorities: {
    [key: string]: boolean
  }
}

export function AlertsNotifications() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "ALT001",
      title: "Signal System Malfunction",
      message: "Signal failure detected at Junction A. Automatic systems switched to manual control.",
      type: "critical",
      category: "safety",
      priority: "high",
      timestamp: "2024-01-15T14:30:00Z",
      status: "active",
      source: "Signal Control System",
      affectedTrains: ["EXP001", "LOC045"],
      location: "Junction A",
      estimatedResolution: "45 minutes",
      actions: ["Switch to Manual Control", "Dispatch Maintenance Team", "Reroute Traffic"],
    },
    {
      id: "ALT002",
      title: "Train Delay Alert",
      message: "Rajdhani Express (EXP001) delayed by 15 minutes due to signal issues.",
      type: "warning",
      category: "delay",
      priority: "medium",
      timestamp: "2024-01-15T14:25:00Z",
      status: "acknowledged",
      source: "Traffic Control",
      affectedTrains: ["EXP001"],
      location: "Section A-B",
      estimatedResolution: "20 minutes",
    },
    {
      id: "ALT003",
      title: "Weather Advisory",
      message: "Heavy rainfall expected in the next 2 hours. Speed restrictions may apply.",
      type: "info",
      category: "weather",
      priority: "medium",
      timestamp: "2024-01-15T14:15:00Z",
      status: "active",
      source: "Weather Service",
      affectedTrains: ["ALL"],
      location: "Section B-C",
      estimatedResolution: "3 hours",
    },
    {
      id: "ALT004",
      title: "Maintenance Completed",
      message: "Scheduled track maintenance at Platform 3 completed successfully.",
      type: "success",
      category: "maintenance",
      priority: "low",
      timestamp: "2024-01-15T13:45:00Z",
      status: "resolved",
      source: "Maintenance Team",
      affectedTrains: [],
      location: "Platform 3",
    },
  ])

  const [settings, setSettings] = useState<NotificationSettings>({
    soundEnabled: true,
    visualEnabled: true,
    emailEnabled: true,
    smsEnabled: false,
    categories: {
      safety: true,
      delay: true,
      technical: true,
      weather: true,
      security: true,
      maintenance: false,
    },
    priorities: {
      high: true,
      medium: true,
      low: false,
    },
  })

  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [newAlert, setNewAlert] = useState({
    title: "",
    message: "",
    type: "warning" as const,
    category: "technical" as const,
    priority: "medium" as const,
    location: "",
    affectedTrains: "",
  })

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || alert.type === filterType
    const matchesStatus = filterStatus === "all" || alert.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "info":
        return <Bell className="h-5 w-5 text-blue-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "border-red-500 bg-red-50"
      case "warning":
        return "border-yellow-500 bg-yellow-50"
      case "info":
        return "border-blue-500 bg-blue-50"
      case "success":
        return "border-green-500 bg-green-50"
      default:
        return "border-gray-300 bg-gray-50"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === alertId ? { ...alert, status: "acknowledged" as const } : alert)),
    )
  }

  const resolveAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, status: "resolved" as const } : alert)))
  }

  const createAlert = () => {
    if (!newAlert.title || !newAlert.message) return

    const alert: Alert = {
      id: `ALT${String(alerts.length + 1).padStart(3, "0")}`,
      title: newAlert.title,
      message: newAlert.message,
      type: newAlert.type,
      category: newAlert.category,
      priority: newAlert.priority,
      timestamp: new Date().toISOString(),
      status: "active",
      source: "Manual Entry",
      affectedTrains: newAlert.affectedTrains ? newAlert.affectedTrains.split(",").map((t) => t.trim()) : [],
      location: newAlert.location,
    }

    setAlerts((prev) => [alert, ...prev])
    setNewAlert({
      title: "",
      message: "",
      type: "warning",
      category: "technical",
      priority: "medium",
      location: "",
      affectedTrains: "",
    })
  }

  // Simulate real-time alerts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) {
        // 10% chance every 10 seconds
        const alertTypes = ["warning", "info"] as const
        const categories = ["delay", "technical", "weather"] as const
        const locations = ["Junction A", "Platform 2", "Section B-C", "Signal Box 1"]

        const newAlert: Alert = {
          id: `ALT${Date.now()}`,
          title: "System Alert",
          message: "Automated system alert generated",
          type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
          category: categories[Math.floor(Math.random() * categories.length)],
          priority: "medium",
          timestamp: new Date().toISOString(),
          status: "active",
          source: "Automated System",
          affectedTrains: [],
          location: locations[Math.floor(Math.random() * locations.length)],
        }

        setAlerts((prev) => [newAlert, ...prev.slice(0, 19)]) // Keep only 20 alerts
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const activeAlertsCount = alerts.filter((a) => a.status === "active").length
  const criticalAlertsCount = alerts.filter((a) => a.type === "critical" && a.status === "active").length

  return (
    <div className="space-y-6">
      {/* Header with Alert Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Alerts & Notifications
                {activeAlertsCount > 0 && (
                  <Badge variant="destructive" className="animate-pulse">
                    {activeAlertsCount} Active
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Real-time system alerts and notification management</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{criticalAlertsCount}</div>
                <div className="text-xs text-muted-foreground">Critical</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">
                  {alerts.filter((a) => a.type === "warning" && a.status === "active").length}
                </div>
                <div className="text-xs text-muted-foreground">Warnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {alerts.filter((a) => a.type === "info" && a.status === "active").length}
                </div>
                <div className="text-xs text-muted-foreground">Info</div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="history">Alert History</TabsTrigger>
          <TabsTrigger value="create">Create Alert</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search alerts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="acknowledged">Acknowledged</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Alert List */}
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id} className={`${getAlertColor(alert.type)} border-l-4`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{alert.title}</h3>
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(alert.priority)}`} />
                          <Badge variant="outline" className="capitalize">
                            {alert.category}
                          </Badge>
                          <Badge
                            variant={
                              alert.status === "active"
                                ? "destructive"
                                : alert.status === "acknowledged"
                                  ? "secondary"
                                  : "default"
                            }
                          >
                            {alert.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(alert.timestamp).toLocaleString()}
                          </span>
                          <span>Location: {alert.location}</span>
                          <span>Source: {alert.source}</span>
                          {alert.affectedTrains.length > 0 && <span>Trains: {alert.affectedTrains.join(", ")}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {alert.status === "active" && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => acknowledgeAlert(alert.id)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Acknowledge
                          </Button>
                          <Button size="sm" onClick={() => resolveAlert(alert.id)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Resolve
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                {alert.actions && alert.actions.length > 0 && (
                  <CardContent>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Recommended Actions:</Label>
                      <div className="flex flex-wrap gap-2">
                        {alert.actions.map((action, index) => (
                          <Button key={index} size="sm" variant="outline">
                            <Zap className="h-3 w-3 mr-1" />
                            {action}
                          </Button>
                        ))}
                      </div>
                    </div>
                    {alert.estimatedResolution && (
                      <div className="mt-3 text-sm text-muted-foreground">
                        Estimated resolution time: {alert.estimatedResolution}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert History</CardTitle>
              <CardDescription>Historical alert data and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">{alerts.length}</div>
                  <div className="text-sm text-muted-foreground">Total Alerts</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-500">
                    {alerts.filter((a) => a.status === "resolved").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Resolved</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-yellow-500">
                    {alerts.filter((a) => a.status === "acknowledged").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Acknowledged</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-500">
                    {alerts.filter((a) => a.status === "active").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Active</div>
                </div>
              </div>

              <div className="space-y-2">
                {alerts.slice(0, 10).map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getAlertIcon(alert.type)}
                      <div>
                        <div className="font-medium">{alert.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(alert.timestamp).toLocaleString()} • {alert.location}
                        </div>
                      </div>
                    </div>
                    <Badge variant={alert.status === "resolved" ? "default" : "secondary"}>{alert.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Alert</CardTitle>
              <CardDescription>Manually create system alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="alert-title">Alert Title</Label>
                  <Input
                    id="alert-title"
                    placeholder="Enter alert title"
                    value={newAlert.title}
                    onChange={(e) => setNewAlert((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alert-location">Location</Label>
                  <Input
                    id="alert-location"
                    placeholder="e.g., Junction A, Platform 2"
                    value={newAlert.location}
                    onChange={(e) => setNewAlert((prev) => ({ ...prev, location: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alert-message">Message</Label>
                <Textarea
                  id="alert-message"
                  placeholder="Detailed alert message"
                  value={newAlert.message}
                  onChange={(e) => setNewAlert((prev) => ({ ...prev, message: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="alert-type">Alert Type</Label>
                  <Select
                    value={newAlert.type}
                    onValueChange={(value) => setNewAlert((prev) => ({ ...prev, type: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="info">Information</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alert-category">Category</Label>
                  <Select
                    value={newAlert.category}
                    onValueChange={(value) => setNewAlert((prev) => ({ ...prev, category: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="safety">Safety</SelectItem>
                      <SelectItem value="delay">Delay</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="weather">Weather</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alert-priority">Priority</Label>
                  <Select
                    value={newAlert.priority}
                    onValueChange={(value) => setNewAlert((prev) => ({ ...prev, priority: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="affected-trains">Affected Trains (comma-separated)</Label>
                <Input
                  id="affected-trains"
                  placeholder="e.g., EXP001, LOC045"
                  value={newAlert.affectedTrains}
                  onChange={(e) => setNewAlert((prev) => ({ ...prev, affectedTrains: e.target.value }))}
                />
              </div>

              <Button onClick={createAlert} disabled={!newAlert.title || !newAlert.message}>
                <Plus className="h-4 w-4 mr-2" />
                Create Alert
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure alert preferences and notification channels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">Notification Channels</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {settings.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                      <Label>Sound Notifications</Label>
                    </div>
                    <Switch
                      checked={settings.soundEnabled}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, soundEnabled: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {settings.visualEnabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      <Label>Visual Notifications</Label>
                    </div>
                    <Switch
                      checked={settings.visualEnabled}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, visualEnabled: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <Label>Email Notifications</Label>
                    </div>
                    <Switch
                      checked={settings.emailEnabled}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, emailEnabled: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      <Label>SMS Notifications</Label>
                    </div>
                    <Switch
                      checked={settings.smsEnabled}
                      onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, smsEnabled: checked }))}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Alert Categories</h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(settings.categories).map(([category, enabled]) => (
                    <div key={category} className="flex items-center justify-between">
                      <Label className="capitalize">{category}</Label>
                      <Switch
                        checked={enabled}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            categories: { ...prev.categories, [category]: checked },
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Priority Levels</h4>
                <div className="space-y-4">
                  {Object.entries(settings.priorities).map(([priority, enabled]) => (
                    <div key={priority} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(priority)}`} />
                        <Label className="capitalize">{priority} Priority</Label>
                      </div>
                      <Switch
                        checked={enabled}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            priorities: { ...prev.priorities, [priority]: checked },
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button>
                <Settings className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
