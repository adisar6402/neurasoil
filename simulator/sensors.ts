import { storage } from "../backend/storage";
import { InsertSensorReading, InsertActivityLog } from "../shared/schema";

export class SensorSimulator {
  private isRunning = false;
  private intervals: NodeJS.Timeout[] = [];

  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log("🌱 NeuraSoil by Abdulrahman Adisa Amuda – Africa Deep Tech 2025 started successfully.");
    
    // Log startup activity
    storage.insertActivity({
      action: "System startup",
      details: "🌱 NeuraSoil by Abdulrahman Adisa Amuda – Africa Deep Tech 2025 started successfully"
    });

    // Start sensor simulations
    this.simulateSensorReadings();
  }

  stop() {
    this.isRunning = false;
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
  }

  private simulateSensorReadings() {
    // Simulate sensor readings every 45 seconds (optimized for free tier)
    const interval = setInterval(async () => {
      if (this.isRunning) {
        await this.generateSensorData();
      }
    }, 45000);
    
    this.intervals.push(interval);
    
    // Generate initial readings after a small delay
    setTimeout(() => {
      if (this.isRunning) {
        this.generateSensorData();
      }
    }, 2000);
  }

  private async generateSensorData() {
    const sensorData = [
      {
        sensorType: "moisture",
        value: this.generateMoisture(),
        unit: "%",
        status: "normal"
      },
      {
        sensorType: "ph",
        value: this.generatePH(),
        unit: "pH",
        status: "normal"
      },
      {
        sensorType: "temperature",
        value: this.generateTemperature(),
        unit: "°C",
        status: "normal"
      },
      {
        sensorType: "pressure",
        value: this.generatePressure(),
        unit: "kPa",
        status: "normal"
      }
    ];

    // Insert sensor readings
    for (const data of sensorData) {
      // Determine status based on value
      data.status = this.getSensorStatus(data.sensorType, data.value);
      
      await storage.insertSensorReading(data as InsertSensorReading);
      
      // Generate alerts for problematic readings
      if (data.status !== "normal") {
        await this.generateAlert(data);
      }
    }

    // Log sensor data collection
    await storage.insertActivity({
      action: "Sensor data collected",
      details: "All sensors reporting values"
    });
  }

  private generateMoisture(): number {
    // Base moisture around 18% (low) with some variation
    return Math.round((15 + Math.random() * 10) * 10) / 10;
  }

  private generatePH(): number {
    // pH around 6.8 (good) with small variation
    return Math.round((6.5 + Math.random() * 0.6) * 10) / 10;
  }

  private generateTemperature(): number {
    // Temperature around 28°C (good) with variation
    return Math.round((25 + Math.random() * 8) * 10) / 10;
  }

  private generatePressure(): number {
    // Pressure around 1.2 kPa (good) with variation
    return Math.round((1.0 + Math.random() * 0.5) * 10) / 10;
  }

  private getSensorStatus(type: string, value: number): string {
    switch (type) {
      case "moisture":
        if (value < 20) return "critical";
        if (value < 25) return "warning";
        if (value > 35) return "warning";
        return "normal";
      
      case "ph":
        if (value < 6.0 || value > 7.0) return "warning";
        return "normal";
      
      case "temperature":
        if (value < 20 || value > 30) return "warning";
        return "normal";
      
      case "pressure":
        if (value < 0.8 || value > 1.5) return "warning";
        return "normal";
      
      default:
        return "normal";
    }
  }

  private async generateAlert(sensorData: any) {
    let title = "";
    let message = "";
    let recommendation = "";
    let alertType = "warning";

    switch (sensorData.sensorType) {
      case "moisture":
        if (sensorData.value < 20) {
          title = "Critical Soil Moisture Level";
          message = `Moisture level: ${sensorData.value}% (Critical: Below 20%)`;
          recommendation = "Immediate irrigation required";
          alertType = "critical";
        } else if (sensorData.value < 25) {
          title = "Low Soil Moisture Detected";
          message = `Moisture level: ${sensorData.value}% (Optimal: 25-35%)`;
          recommendation = "Increase irrigation frequency";
        }
        break;
      
      case "ph":
        title = "pH Level Out of Range";
        message = `pH level: ${sensorData.value} (Optimal: 6.0-7.0)`;
        recommendation = sensorData.value < 6.0 ? "Consider lime application" : "Monitor soil acidity";
        break;
      
      case "temperature":
        title = "Temperature Warning";
        message = `Temperature: ${sensorData.value}°C (Optimal: 20-30°C)`;
        recommendation = sensorData.value > 30 ? "Provide shade or increase irrigation" : "Monitor soil temperature";
        break;
      
      case "pressure":
        title = "Soil Pressure Warning";
        message = `Pressure: ${sensorData.value} kPa (Optimal: 0.8-1.5 kPa)`;
        recommendation = "Monitor soil compaction levels";
        break;
    }

    if (title) {
      await storage.insertAlert({
        alertType,
        title,
        message,
        recommendation,
        dismissed: false
      });

      // Log alert creation
      console.log(`⚠️ ${title}: ${message}`);
      await storage.insertActivity({
        action: "Alert generated",
        details: `⚠️ ${title}: ${message}`
      });
    }
  }
}

export const sensorSimulator = new SensorSimulator();