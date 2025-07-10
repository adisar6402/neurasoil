import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Droplets, Sprout, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

interface PredictionCardProps {
  predictionType: string;
  result: string;
  confidence: number;
  details: string;
  timestamp: Date;
}

const predictionConfig = {
  soil_health: {
    icon: AlertTriangle,
    label: "Soil Health Status",
    getIcon: (result: string) => {
      if (result.includes("Critical")) return AlertTriangle;
      if (result.includes("Moderate")) return AlertCircle;
      return CheckCircle;
    },
    getColor: (result: string) => {
      if (result.includes("Critical")) return "bg-red-100 text-red-600";
      if (result.includes("Moderate")) return "bg-yellow-100 text-yellow-600";
      return "bg-green-100 text-green-600";
    }
  },
  water_movement: {
    icon: Droplets,
    label: "Underground Water Movement",
    getIcon: () => Droplets,
    getColor: () => "bg-blue-100 text-blue-600"
  },
  crop_suitability: {
    icon: Sprout,
    label: "Crop Suitability",
    getIcon: () => Sprout,
    getColor: () => "bg-green-100 text-green-600"
  }
};

export function PredictionCard({ predictionType, result, confidence, details }: PredictionCardProps) {
  const config = predictionConfig[predictionType as keyof typeof predictionConfig];
  
  if (!config) return null;

  const Icon = config.getIcon(result);
  const colorClass = config.getColor(result);

  return (
    <Card className="border border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-charcoal">{config.label}</h4>
          <Badge variant="outline" className="text-xs">
            Confidence: {Math.round(confidence * 100)}%
          </Badge>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-charcoal">{result}</p>
            <p className="text-sm text-gray-600">{details}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
