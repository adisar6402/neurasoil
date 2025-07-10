import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { sensorService } from "./services/sensors";
import { mlService } from "./services/ml";
import { insertSensorReadingSchema, insertAlertSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Start sensor simulation
  sensorService.startSimulation();

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

  // Run ML prediction
  app.post("/api/predictions/run", async (req, res) => {
    try {
      await mlService.runPrediction();
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

  const httpServer = createServer(app);
  return httpServer;
}
