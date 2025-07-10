import { 
  sensorReadings, 
  predictions, 
  alerts, 
  activityLog,
  type SensorReading,
  type InsertSensorReading,
  type Prediction,
  type InsertPrediction,
  type Alert,
  type InsertAlert,
  type ActivityLog,
  type InsertActivityLog
} from "../shared/schema";

export interface IStorage {
  // Sensor readings
  insertSensorReading(reading: InsertSensorReading): Promise<SensorReading>;
  getLatestSensorReadings(): Promise<SensorReading[]>;
  getSensorReadingsByType(type: string): Promise<SensorReading[]>;
  getSensorReadingsHistory(limit?: number): Promise<SensorReading[]>;
  
  // Predictions
  insertPrediction(prediction: InsertPrediction): Promise<Prediction>;
  getLatestPredictions(): Promise<Prediction[]>;
  getPredictionsHistory(limit?: number): Promise<Prediction[]>;
  
  // Alerts
  insertAlert(alert: InsertAlert): Promise<Alert>;
  getActiveAlerts(): Promise<Alert[]>;
  dismissAlert(id: number): Promise<void>;
  
  // Activity log
  insertActivity(activity: InsertActivityLog): Promise<ActivityLog>;
  getActivityLog(limit?: number): Promise<ActivityLog[]>;
}

export class MemStorage implements IStorage {
  private sensorReadings: Map<number, SensorReading>;
  private predictions: Map<number, Prediction>;
  private alerts: Map<number, Alert>;
  private activityLog: Map<number, ActivityLog>;
  private currentId: number;
  private maxStorageSize: number;

  constructor() {
    this.sensorReadings = new Map();
    this.predictions = new Map();
    this.alerts = new Map();
    this.activityLog = new Map();
    this.currentId = 1;
    this.maxStorageSize = 200; // Limit memory usage
  }

  private cleanupOldEntries<T>(map: Map<number, T>, maxSize: number) {
    if (map.size > maxSize) {
      const entries = Array.from(map.entries());
      const toDelete = entries.slice(0, entries.length - maxSize);
      toDelete.forEach(([key]) => map.delete(key));
    }
  }

  async insertSensorReading(reading: InsertSensorReading): Promise<SensorReading> {
    const id = this.currentId++;
    const newReading: SensorReading = {
      ...reading,
      id,
      timestamp: new Date(),
      status: reading.status || "normal",
    };
    this.sensorReadings.set(id, newReading);
    this.cleanupOldEntries(this.sensorReadings, this.maxStorageSize);
    return newReading;
  }

  async getLatestSensorReadings(): Promise<SensorReading[]> {
    const readings = Array.from(this.sensorReadings.values());
    const latestByType = new Map<string, SensorReading>();
    
    readings.forEach(reading => {
      if (!latestByType.has(reading.sensorType) || 
          reading.timestamp > latestByType.get(reading.sensorType)!.timestamp) {
        latestByType.set(reading.sensorType, reading);
      }
    });
    
    return Array.from(latestByType.values());
  }

  async getSensorReadingsByType(type: string): Promise<SensorReading[]> {
    return Array.from(this.sensorReadings.values())
      .filter(reading => reading.sensorType === type)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getSensorReadingsHistory(limit = 100): Promise<SensorReading[]> {
    return Array.from(this.sensorReadings.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async insertPrediction(prediction: InsertPrediction): Promise<Prediction> {
    const id = this.currentId++;
    const newPrediction: Prediction = {
      ...prediction,
      id,
      timestamp: new Date(),
    };
    this.predictions.set(id, newPrediction);
    return newPrediction;
  }

  async getLatestPredictions(): Promise<Prediction[]> {
    const predictions = Array.from(this.predictions.values());
    const latestByType = new Map<string, Prediction>();
    
    predictions.forEach(prediction => {
      if (!latestByType.has(prediction.predictionType) || 
          prediction.timestamp > latestByType.get(prediction.predictionType)!.timestamp) {
        latestByType.set(prediction.predictionType, prediction);
      }
    });
    
    return Array.from(latestByType.values());
  }

  async getPredictionsHistory(limit = 50): Promise<Prediction[]> {
    return Array.from(this.predictions.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async insertAlert(alert: InsertAlert): Promise<Alert> {
    const id = this.currentId++;
    const newAlert: Alert = {
      ...alert,
      id,
      timestamp: new Date(),
      recommendation: alert.recommendation || null,
      dismissed: alert.dismissed || false,
    };
    this.alerts.set(id, newAlert);
    return newAlert;
  }

  async getActiveAlerts(): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .filter(alert => !alert.dismissed)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async dismissAlert(id: number): Promise<void> {
    const alert = this.alerts.get(id);
    if (alert) {
      this.alerts.set(id, { ...alert, dismissed: true });
    }
  }

  async insertActivity(activity: InsertActivityLog): Promise<ActivityLog> {
    const id = this.currentId++;
    const newActivity: ActivityLog = {
      ...activity,
      id,
      timestamp: new Date(),
    };
    this.activityLog.set(id, newActivity);
    this.cleanupOldEntries(this.activityLog, 50); // Keep fewer activity logs
    return newActivity;
  }

  async getActivityLog(limit = 50): Promise<ActivityLog[]> {
    return Array.from(this.activityLog.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();