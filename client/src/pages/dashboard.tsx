import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SensorCard } from "@/components/sensor-card";
import { PredictionCard } from "@/components/prediction-card";
import { ActivityLog } from "@/components/activity-log";
import { apiRequest } from "@/lib/queryClient";
import { RefreshCw, Sun, CloudRain, TrendingUp, Download, Settings, X } from "lucide-react";

export default function Dashboard() {
  const queryClient = useQueryClient();

  // Fetch sensor data
  const { data: sensors, isLoading: sensorsLoading } = useQuery({
    queryKey: ["/api/sensors/latest"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch predictions
  const { data: predictions, isLoading: predictionsLoading } = useQuery({
    queryKey: ["/api/predictions/latest"],
    refetchInterval: 60000, // Refetch every minute
  });

  // Fetch alerts
  const { data: alerts, isLoading: alertsLoading } = useQuery({
    queryKey: ["/api/alerts"],
    refetchInterval: 30000,
  });

  // Run prediction mutation
  const runPredictionMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/predictions/run"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/predictions/latest"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activity"] });
    },
  });

  // Dismiss alert mutation
  const dismissAlertMutation = useMutation({
    mutationFn: (alertId: number) => apiRequest("POST", `/api/alerts/${alertId}/dismiss`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
    },
  });

  return (
    <div className="min-h-screen bg-light-gray">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Banner */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <div>
              <p className="text-sm font-medium text-green-800">System Status: Online</p>
              <p className="text-xs text-green-600">Last sensor reading: 30 seconds ago</p>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden mb-8">
          <img
            src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&h=400"
            alt="African farmers working with soil in agricultural field"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 flex items-center">
            <div className="px-8 text-white">
              <h2 className="text-3xl font-bold mb-2">Welcome to NeuraSoil</h2>
              <p className="text-lg opacity-90 mb-4">Monitor your soil health with AI-powered predictions</p>
              <div className="text-sm opacity-75">
                🌱 Built by Abdulrahman Adisa Amuda – Africa Deep Tech 2025
              </div>
            </div>
          </div>
        </div>

        {/* Active Alerts */}
        {alerts && alerts.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-charcoal">Active Alerts</h3>
              <span className="text-sm text-gray-500">Real-time monitoring</span>
            </div>
            <div className="space-y-3">
              {alerts.map((alert: any) => (
                <Alert key={alert.id} className={`
                  ${alert.alertType === 'critical' ? 'bg-red-50 border-red-200' : 
                    alert.alertType === 'warning' ? 'bg-yellow-50 border-yellow-200' : 
                    'bg-blue-50 border-blue-200'}
                `}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <AlertDescription>
                        <div className="font-medium mb-1">{alert.title}</div>
                        <div className="text-sm mb-1">{alert.message}</div>
                        {alert.recommendation && (
                          <div className="text-xs opacity-75">
                            Recommendation: {alert.recommendation}
                          </div>
                        )}
                      </AlertDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dismissAlertMutation.mutate(alert.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {/* Sensor Data Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-charcoal">Live Sensor Data</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <RefreshCw className="w-4 h-4" />
              <span>Auto-refresh: 30s</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sensorsLoading ? (
              [...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-6 bg-gray-300 rounded w-3/4" />
                      <div className="h-8 bg-gray-300 rounded w-1/2" />
                      <div className="h-4 bg-gray-300 rounded w-1/4" />
                      <div className="h-2 bg-gray-300 rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              sensors?.map((sensor: any) => (
                <SensorCard
                  key={sensor.id}
                  type={sensor.sensorType}
                  value={sensor.value}
                  unit={sensor.unit}
                  status={sensor.status}
                />
              ))
            )}
          </div>
        </div>

        {/* AI Predictions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-5 h-5 text-forest-green" />
                    <CardTitle>AI Predictions</CardTitle>
                  </div>
                  <Button
                    onClick={() => runPredictionMutation.mutate()}
                    disabled={runPredictionMutation.isPending}
                    className="bg-forest-green hover:bg-green-600"
                  >
                    {runPredictionMutation.isPending ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    Run Prediction
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {predictionsLoading ? (
                    [...Array(3)].map((_, i) => (
                      <div key={i} className="border border-gray-200 rounded-lg p-4">
                        <div className="animate-pulse space-y-3">
                          <div className="h-5 bg-gray-300 rounded w-1/2" />
                          <div className="h-4 bg-gray-300 rounded w-full" />
                          <div className="h-4 bg-gray-300 rounded w-3/4" />
                        </div>
                      </div>
                    ))
                  ) : (
                    predictions?.map((prediction: any) => (
                      <PredictionCard
                        key={prediction.id}
                        predictionType={prediction.predictionType}
                        result={prediction.result}
                        confidence={prediction.confidence}
                        details={prediction.details}
                        timestamp={new Date(prediction.timestamp)}
                      />
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Weather Integration */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Sun className="w-5 h-5 text-sky-blue" />
                  <CardTitle className="text-base">Weather Forecast</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Today</span>
                    <div className="flex items-center space-x-2">
                      <Sun className="w-4 h-4 text-warm-yellow" />
                      <span className="text-sm font-medium">32°C</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tomorrow</span>
                    <div className="flex items-center space-x-2">
                      <CloudRain className="w-4 h-4 text-sky-blue" />
                      <span className="text-sm font-medium">28°C</span>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                    <p className="text-sm text-blue-800">💧 Rain expected tomorrow - reduce irrigation</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="w-4 h-4 mr-3" />
                    View Trends
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-3" />
                    Export Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Historical Data Chart */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Historical Trends</CardTitle>
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Interactive Chart Visualization</p>
                <p className="text-sm text-gray-400">Soil moisture, pH, and temperature trends over time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Log */}
        <ActivityLog />
      </main>
    </div>
  );
}
