import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PredictionCard } from "@/components/prediction-card";
import { format } from "date-fns";
import { Brain, Calendar, TrendingUp } from "lucide-react";

export default function Predictions() {
  const { data: predictions, isLoading } = useQuery({
    queryKey: ["/api/predictions/history"],
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light-gray">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {[...Array(6)].map((_, i) => (
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
            <Brain className="w-6 h-6 text-forest-green" />
            <h1 className="text-2xl font-bold text-charcoal">AI Predictions</h1>
          </div>
          <p className="text-gray-600">Historical prediction results and analysis</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Predictions</p>
                  <p className="text-2xl font-bold text-charcoal">{predictions?.length || 0}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg. Confidence</p>
                  <p className="text-2xl font-bold text-charcoal">
                    {predictions?.length ? 
                      Math.round(predictions.reduce((acc: number, p: any) => acc + p.confidence, 0) / predictions.length * 100) : 0}%
                  </p>
                </div>
                <Brain className="w-8 h-8 text-forest-green" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="text-sm font-medium text-charcoal">
                    {predictions?.length ? 
                      format(new Date(predictions[0].timestamp), "MMM d, h:mm a") : 
                      "Never"
                    }
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-warm-yellow" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Predictions History */}
        <Card>
          <CardHeader>
            <CardTitle>Prediction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {predictions?.length ? (
                predictions.map((prediction: any) => (
                  <div key={prediction.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="text-xs">
                        {format(new Date(prediction.timestamp), "MMM d, yyyy h:mm a")}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Confidence: {Math.round(prediction.confidence * 100)}%
                      </Badge>
                    </div>
                    <PredictionCard
                      predictionType={prediction.predictionType}
                      result={prediction.result}
                      confidence={prediction.confidence}
                      details={prediction.details}
                      timestamp={new Date(prediction.timestamp)}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No predictions available yet</p>
                  <p className="text-sm text-gray-400">Run your first prediction from the dashboard</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
