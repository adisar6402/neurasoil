import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

interface ActivityLogEntry {
  id: number;
  action: string;
  details: string;
  timestamp: string;
}

export function ActivityLog() {
  const { data: activities, isLoading } = useQuery<ActivityLogEntry[]>({
    queryKey: ["/api/activity"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded animate-pulse mb-1" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getActivityDotColor = (action: string) => {
    if (action.includes("Prediction")) return "bg-green-500";
    if (action.includes("Alert")) return "bg-yellow-500";
    if (action.includes("Sensor")) return "bg-blue-500";
    if (action.includes("System")) return "bg-purple-500";
    return "bg-gray-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities?.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`w-2 h-2 rounded-full mt-2 ${getActivityDotColor(activity.action)}`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-charcoal">{activity.action}</p>
                <p className="text-xs text-gray-500">
                  {activity.details} - {format(new Date(activity.timestamp), "MMM d, h:mm a")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
