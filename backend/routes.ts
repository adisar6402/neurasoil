import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { sensorSimulator } from "../simulator/sensors";
import { mlPredictor } from "../ml/predictor";
import { insertSensorReadingSchema, insertAlertSchema } from "../shared/schema";
import { Parser } from "json2csv";

export async function registerRoutes(app: Express): Promise<Server> {
  // Start sensor simulation with delay to prevent startup overload
  setTimeout(() => {
    sensorSimulator.start();
  }, 3000);

  // Get latest sensor readings
  app.get("/api/sensors/latest", async (req, res) => {
    try {
      const readings = await storage.getLatestSensorReadings();
      res.json(readings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sensor readings" });
    }
  });

  // Get sensor readings history
  app.get("/api/sensors/history", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const readings = await storage.getSensorReadingsHistory(limit);
      res.json(readings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sensor history" });
    }
  });

  // Get sensor readings by type
  app.get("/api/sensors/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const readings = await storage.getSensorReadingsByType(type);
      res.json(readings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sensor readings" });
    }
  });

  // Export sensor data as CSV
  app.get("/api/sensors/export", async (req, res) => {
  try {
    const format = (req.query.format as string)?.toLowerCase() || "csv";
    const limit = parseInt(req.query.limit as string) || 1000;

    const readings = await storage.getSensorReadingsHistory(limit);

    // ✅ Transform timestamp to ISO string to fix empty export issue
    const transformedReadings = readings.map(reading => ({
      ...reading,
      timestamp: reading.timestamp.toISOString(), // 🛠️ Ensure date is exportable
    }));

    if (format === "csv") {
      const fields = ['id', 'sensorType', 'value', 'unit', 'status', 'timestamp'];
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(transformedReadings);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="sensor_data.csv"');
      res.send(csv);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="sensor_data.json"');
      res.json(transformedReadings);
    }
  } catch (error) {
    console.error("❌ Export error:", error);
    res.status(500).json({ error: "Failed to export sensor data" });
  }
});

  // Get trends data
  app.get("/api/trends", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 7;
      const readings = await storage.getSensorReadingsHistory(days * 24 * 2); // Assuming 2 readings per hour
      const predictions = await storage.getPredictionsHistory(days * 10);
      
      res.json({
        sensorReadings: readings,
        predictions: predictions,
        summary: {
          totalReadings: readings.length,
          totalPredictions: predictions.length,
          avgConfidence: predictions.length > 0 ? 
            predictions.reduce((acc, p) => acc + p.confidence, 0) / predictions.length : 0
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trends data" });
    }
  });

  // Run ML prediction
  app.post("/api/predictions/run", async (req, res) => {
    try {
      await mlPredictor.runPrediction();
      const predictions = await storage.getLatestPredictions();
      res.json(predictions);
    } catch (error) {
      res.status(500).json({ error: "Failed to run prediction" });
    }
  });

  // Get latest predictions
  app.get("/api/predictions/latest", async (req, res) => {
    try {
      const predictions = await storage.getLatestPredictions();
      res.json(predictions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch predictions" });
    }
  });

  // Get predictions history
  app.get("/api/predictions/history", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const predictions = await storage.getPredictionsHistory(limit);
      res.json(predictions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch predictions history" });
    }
  });

  // Get active alerts
  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getActiveAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alerts" });
    }
  });

  // Dismiss alert
  app.post("/api/alerts/:id/dismiss", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.dismissAlert(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to dismiss alert" });
    }
  });

  // Get activity log
  app.get("/api/activity", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const activities = await storage.getActivityLog(limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activity log" });
    }
  });

  // Settings endpoints
  app.get("/api/settings", async (req, res) => {
    try {
      // Return default settings - in production this would be from database
      res.json({
        language: "en",
        units: "metric",
        alertPreferences: {
          criticalAlerts: true,
          warningAlerts: true,
          infoAlerts: true,
          smsNotifications: true
        },
        refreshInterval: 30000
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/settings", async (req, res) => {
    try {
      // In production, save to database
      const settings = req.body;
      await storage.insertActivity({
        action: "Settings updated",
        details: `Settings changed: ${JSON.stringify(settings)}`
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to save settings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}