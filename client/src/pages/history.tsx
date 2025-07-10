import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Clock, TrendingUp, Database, Activity } from "lucide-react";

export default function History() {
  const { data: sensorHistory, isLoading: sensorsLoading } = useQuery({
    queryKey: ["/api/sensors/history"],
    refetchInterval: 60000,
  });

  const { data: predictions, isLoading: predictionsLoading } = useQuery({
    queryKey: ["/api/predictions/history"],
    refetchInterval: 60000,
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["/api/activity"],
    refetchInterval: 30000,
  });

  const isLoading = sensorsLoading || predictionsLoading || activitiesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light-gray">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-300 rounded w-1/2" />
                    <div className="h-4 bg-gray-300 rounded w-full" />
                    <div className="h-4 bg-gray-300 rounded w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gray">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-6 h-6 text-forest-green" />
            <h1 className="text-2xl font-bold text-charcoal">Historical Data</h1>
          </div>
          <p className="text-gray-600">Review past sensor readings, predictions, and system activity</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Sensor Readings</p>
                  <p className="text-2xl font-bold text-charcoal">{sensorHistory?.length || 0}</p>
                </div>
                <Database className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Predictions</p>
                  <p className="text-2xl font-bold text-charcoal">{predictions?.length || 0}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-forest-green" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">System Events</p>
                  <p className="text-2xl font-bold text-charcoal">{activities?.length || 0}</p>
                </div>
                <Activity className="w-8 h-8 text-warm-yellow" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Data Points</p>
                  <p className="text-2xl font-bold text-charcoal">
                    {(sensorHistory?.length || 0) + (predictions?.length || 0) + (activities?.length || 0)}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Historical Chart Placeholder */}
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

        {/* Data Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Sensor Readings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Sensor Readings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sensorHistory?.slice(0, 10).map((reading: any) => (
                  <div key={reading.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm capitalize">{reading.sensorType}</div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(reading.timestamp), "MMM d, h:mm a")}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{reading.value}{reading.unit}</div>
                      <Badge
                        variant={reading.status === "normal" ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {reading.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Activity */}
          <Card>
            <CardHeader>
              <CardTitle>System Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities?.slice(0, 10).map((activity: any) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{activity.action}</div>
                      <div className="text-xs text-gray-500 mb-1">{activity.details}</div>
                      <div className="text-xs text-gray-400">
                        {format(new Date(activity.timestamp), "MMM d, h:mm a")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
