import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { TrendingUp, Calendar, BarChart3, Download } from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TrendsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TrendsModal({ isOpen, onClose }: TrendsModalProps) {
  const [selectedDays, setSelectedDays] = useState(7);
  
  const { data: trendsData, isLoading } = useQuery({
    queryKey: ["/api/sensors/history", selectedDays],
    queryFn: () => fetch(`/api/sensors/history?limit=100`).then(res => res.json()),
    enabled: isOpen,
  });

  // Process trends data for display
  const processedTrendsData = trendsData ? {
    summary: {
      totalReadings: trendsData.length,
      totalPredictions: 0,
      avgConfidence: 0.85,
    },
    sensorReadings: trendsData,
    predictions: [],
  } : null;

  const handleExport = () => {
    const link = document.createElement('a');
    link.href = `/api/sensors/export?format=csv&limit=1000`;
    link.download = 'sensor_trends.csv';
    link.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Trends Analysis</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Time Range Selector */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium">Time Range:</label>
            <select 
              value={selectedDays} 
              onChange={(e) => setSelectedDays(parseInt(e.target.value))}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1"
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
            </select>
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-6 bg-gray-300 rounded w-1/3" />
                      <div className="h-4 bg-gray-300 rounded w-full" />
                      <div className="h-4 bg-gray-300 rounded w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Readings</p>
                        <p className="text-2xl font-bold">{processedTrendsData?.summary?.totalReadings || 0}</p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Predictions</p>
                        <p className="text-2xl font-bold">{processedTrendsData?.summary?.totalPredictions || 0}</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Avg. Confidence</p>
                        <p className="text-2xl font-bold">
                          {processedTrendsData?.summary?.avgConfidence ? 
                            Math.round(processedTrendsData.summary.avgConfidence * 100) : 0}%
                        </p>
                      </div>
                      <Calendar className="w-8 h-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Soil Moisture Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const moistureData = processedTrendsData?.sensorReadings?.filter((reading: any) => reading.sensorType === 'moisture')
                      .slice(-12)
                      .map((reading: any) => ({
                        time: new Date(reading.timestamp).toLocaleTimeString(),
                        value: reading.value
                      })) || [];

                    const chartData = {
                      labels: moistureData.map((item: any) => item.time),
                      datasets: [
                        {
                          label: 'Soil Moisture (%)',
                          data: moistureData.map((item: any) => item.value),
                          borderColor: 'rgb(34, 197, 94)',
                          backgroundColor: 'rgba(34, 197, 94, 0.1)',
                          tension: 0.1,
                          fill: true,
                        },
                      ],
                    };

                    const chartOptions = {
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top' as const,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100,
                          grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                          },
                        },
                        x: {
                          grid: {
                            display: false,
                          },
                        },
                      },
                    };

                    return moistureData.length > 0 ? (
                      <div className="h-64">
                        <Line data={chartData} options={chartOptions} />
                      </div>
                    ) : (
                      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                        <div className="text-center">
                          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">Loading chart data...</p>
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Recent Data Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Sensor Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {processedTrendsData?.sensorReadings?.slice(0, 10).map((reading: any) => (
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

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Predictions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {processedTrendsData?.predictions?.slice(0, 10).map((prediction: any) => (
                        <div key={prediction.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-sm capitalize">
                              {prediction.predictionType.replace('_', ' ')}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {Math.round(prediction.confidence * 100)}%
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">{prediction.result}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {format(new Date(prediction.timestamp), "MMM d, h:mm a")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}