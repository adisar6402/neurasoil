import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Droplets, TestTubeDiagonal, Thermometer, Weight } from "lucide-react";

interface SensorCardProps {
  type: string;
  value: number;
  unit: string;
  status: string;
  optimal?: string;
}

const sensorConfig = {
  moisture: {
    icon: Droplets,
    label: "Soil Moisture",
    color: "text-sky-blue",
    min: 0,
    max: 50,
    optimal: "25-35%",
    getProgressColor: (value: number) => {
      if (value < 20) return "bg-red-500";
      if (value < 25) return "bg-orange-500";
      if (value > 35) return "bg-orange-500";
      return "bg-green-500";
    }
  },
  ph: {
    icon: TestTubeDiagonal,
    label: "pH Level",
    color: "text-forest-green",
    min: 0,
    max: 10,
    optimal: "6.0-7.0",
    getProgressColor: (value: number) => {
      if (value < 6.0 || value > 7.0) return "bg-orange-500";
      return "bg-green-500";
    }
  },
  temperature: {
    icon: Thermometer,
    label: "Temperature",
    color: "text-warm-yellow",
    min: 0,
    max: 40,
    optimal: "20-30°C",
    getProgressColor: (value: number) => {
      if (value < 20 || value > 30) return "bg-orange-500";
      return "bg-green-500";
    }
  },
  pressure: {
    icon: Weight,
    label: "Soil Pressure",
    color: "text-earth-brown",
    min: 0,
    max: 2.5,
    optimal: "0.8-1.5 kPa",
    getProgressColor: (value: number) => {
      if (value < 0.8 || value > 1.5) return "bg-orange-500";
      return "bg-green-500";
    }
  }
};

export function SensorCard({ type, value, unit, status, optimal }: SensorCardProps) {
  const config = sensorConfig[type as keyof typeof sensorConfig];
  
  if (!config) return null;

  const Icon = config.icon;
  const progressValue = (value / config.max) * 100;
  const progressColor = config.getProgressColor(value);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "critical":
        return "Critical";
      case "warning":
        return "Warning";
      default:
        return "Optimal";
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon className={`w-5 h-5 ${config.color}`} />
            <h4 className="font-medium text-charcoal">{config.label}</h4>
          </div>
          <Badge variant="outline" className="text-xs">
            Live
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="text-2xl font-bold text-charcoal">
            {value}{unit}
          </div>
          
          <Badge className={getStatusColor(status)}>
            {getStatusLabel(status)}
          </Badge>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${progressColor}`}
              style={{ width: `${Math.min(progressValue, 100)}%` }}
            />
          </div>
          
          <div className="text-xs text-gray-500">
            Optimal: {optimal || config.optimal}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
