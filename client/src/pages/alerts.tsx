import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { Bell, AlertTriangle, Info, AlertCircle, X, CheckCircle } from "lucide-react";

export default function Alerts() {
  const queryClient = useQueryClient();

  const { data: alerts, isLoading } = useQuery({
    queryKey: ["/api/alerts"],
    refetchInterval: 30000,
  });

  const dismissAlertMutation = useMutation({
    mutationFn: (alertId: number) => apiRequest("POST", `/api/alerts/${alertId}/dismiss`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
    },
  });

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return AlertTriangle;
      case "warning":
        return AlertCircle;
      case "info":
        return Info;
      default:
        return Bell;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

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
            <Bell className="w-6 h-6 text-forest-green" />
            <h1 className="text-2xl font-bold text-charcoal">Alerts & Notifications</h1>
          </div>
          <p className="text-gray-600">Monitor system alerts and recommendations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Alerts</p>
                  <p className="text-2xl font-bold text-charcoal">{alerts?.length || 0}</p>
                </div>
                <Bell className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Critical</p>
                  <p className="text-2xl font-bold text-red-600">
                    {alerts?.filter((a: any) => a.alertType === "critical").length || 0}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Warnings</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {alerts?.filter((a: any) => a.alertType === "warning").length || 0}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Info</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {alerts?.filter((a: any) => a.alertType === "info").length || 0}
                  </p>
                </div>
                <Info className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts List */}
        <Card>
          <CardHeader>
            <CardTitle>Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts?.length ? (
                alerts.map((alert: any) => {
                  const Icon = getAlertIcon(alert.alertType);
                  return (
                    <Alert key={alert.id} className={getAlertColor(alert.alertType)}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <Icon className="w-5 h-5 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-medium">{alert.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {alert.alertType.toUpperCase()}
                              </Badge>
                            </div>
                            <AlertDescription className="mb-2">
                              {alert.message}
                            </AlertDescription>
                            {alert.recommendation && (
                              <div className="text-sm opacity-90 mb-2">
                                <strong>Recommendation:</strong> {alert.recommendation}
                              </div>
                            )}
                            <div className="text-xs opacity-75">
                              {format(new Date(alert.timestamp), "MMM d, yyyy h:mm a")}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dismissAlertMutation.mutate(alert.id)}
                          disabled={dismissAlertMutation.isPending}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </Alert>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-500">No active alerts</p>
                  <p className="text-sm text-gray-400">All systems are operating normally</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
