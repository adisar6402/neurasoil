import { storage } from "../backend/storage";
import { InsertPrediction, InsertActivityLog } from "../shared/schema";

export class MLPredictor {
  async runPrediction(): Promise<void> {
    console.log("🧠 Running AI prediction analysis...");
    
    // Get latest sensor readings
    const sensorReadings = await storage.getLatestSensorReadings();
    
    // Generate predictions based on sensor data
    const predictions = await this.generatePredictions(sensorReadings);
    
    // Store predictions
    for (const prediction of predictions) {
      await storage.insertPrediction(prediction);
    }
    
    // Log prediction completion
    const soilHealthPrediction = predictions.find(p => p.predictionType === "soil_health");
    const logMessage = `✅ Prediction made: ${soilHealthPrediction?.result || "Analysis completed"}`;
    console.log(logMessage);
    
    await storage.insertActivity({
      action: "Prediction completed successfully",
      details: logMessage
    });
  }

  private async generatePredictions(sensorReadings: any[]): Promise<InsertPrediction[]> {
    const moisture = sensorReadings.find(r => r.sensorType === "moisture");
    const ph = sensorReadings.find(r => r.sensorType === "ph");
    const temperature = sensorReadings.find(r => r.sensorType === "temperature");
    const pressure = sensorReadings.find(r => r.sensorType === "pressure");

    const predictions: InsertPrediction[] = [];

    // Soil Health Prediction
    const soilHealthPrediction = this.predictSoilHealth(moisture, ph, temperature, pressure);
    predictions.push(soilHealthPrediction);

    // Water Movement Prediction
    const waterMovementPrediction = this.predictWaterMovement(moisture, pressure);
    predictions.push(waterMovementPrediction);

    // Crop Suitability Prediction
    const cropSuitabilityPrediction = this.predictCropSuitability(ph, temperature, moisture);
    predictions.push(cropSuitabilityPrediction);

    return predictions;
  }

  private predictSoilHealth(moisture: any, ph: any, temperature: any, pressure: any): InsertPrediction {
    let result = "Good";
    let confidence = 0.85;
    let details = "Soil conditions are optimal for healthy plant growth.";

    // Analyze moisture levels
    if (moisture && moisture.value < 20) {
      result = "Critical Risk";
      confidence = 0.94;
      details = "Severe moisture deficit detected. Immediate irrigation required to prevent crop stress.";
    } else if (moisture && moisture.value < 25) {
      result = "Moderate Risk";
      confidence = 0.89;
      details = "Low moisture levels detected. Recommend immediate irrigation to maintain soil health.";
    }

    // Factor in pH levels
    if (ph && (ph.value < 6.0 || ph.value > 7.0)) {
      if (result === "Good") {
        result = "Moderate Risk";
        confidence = 0.82;
        details = "pH levels are suboptimal. Consider soil amendment to improve nutrient availability.";
      }
    }

    // Factor in temperature
    if (temperature && (temperature.value < 20 || temperature.value > 30)) {
      confidence = Math.max(confidence - 0.05, 0.7);
    }

    return {
      predictionType: "soil_health",
      result,
      confidence,
      details
    };
  }

  private predictWaterMovement(moisture: any, pressure: any): InsertPrediction {
    let result = "Stable Flow";
    let confidence = 0.87;
    let details = "Water table stable at 2.1m depth. No erosion risk detected.";

    if (moisture && moisture.value < 15) {
      result = "High Drainage";
      confidence = 0.83;
      details = "Rapid water drainage detected. Monitor for potential water table depletion.";
    } else if (moisture && moisture.value > 35) {
      result = "Poor Drainage";
      confidence = 0.79;
      details = "Water retention high. Monitor for waterlogging and root rot conditions.";
    }

    if (pressure && pressure.value > 1.5) {
      result = "Restricted Flow";
      confidence = 0.85;
      details = "Soil compaction detected. Water movement may be restricted.";
    }

    return {
      predictionType: "water_movement",
      result,
      confidence,
      details
    };
  }

  private predictCropSuitability(ph: any, temperature: any, moisture: any): InsertPrediction {
    let result = "Corn: Good";
    let confidence = 0.78;
    let details = "Conditions suitable for corn cultivation. Expected yield: 75-85%";

    // Analyze conditions for corn
    let suitabilityScore = 0;
    
    if (ph && ph.value >= 6.0 && ph.value <= 7.0) {
      suitabilityScore += 0.3;
    }
    
    if (temperature && temperature.value >= 20 && temperature.value <= 30) {
      suitabilityScore += 0.3;
    }
    
    if (moisture && moisture.value >= 25 && moisture.value <= 35) {
      suitabilityScore += 0.4;
    }

    if (suitabilityScore >= 0.8) {
      result = "Corn: Excellent";
      confidence = 0.91;
      details = "Ideal conditions for corn planting. Expected yield: 85-95%";
    } else if (suitabilityScore >= 0.6) {
      result = "Corn: Good";
      confidence = 0.85;
      details = "Good conditions for corn cultivation. Expected yield: 75-85%";
    } else {
      result = "Corn: Fair";
      confidence = 0.72;
      details = "Suboptimal conditions for corn. Consider soil improvement. Expected yield: 60-75%";
    }

    return {
      predictionType: "crop_suitability",
      result,
      confidence,
      details
    };
  }
}

export const mlPredictor = new MLPredictor();