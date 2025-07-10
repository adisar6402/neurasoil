import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Sensor readings table
export const sensorReadings = pgTable("sensor_readings", {
  id: serial("id").primaryKey(),
  sensorType: text("sensor_type").notNull(), // moisture, ph, temperature, pressure
  value: real("value").notNull(),
  unit: text("unit").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  status: text("status").notNull().default("normal"), // normal, warning, critical
});

// Predictions table
export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  predictionType: text("prediction_type").notNull(), // soil_health, water_movement, crop_suitability
  result: text("result").notNull(),
  confidence: real("confidence").notNull(),
  details: text("details").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Alerts table
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  alertType: text("alert_type").notNull(), // warning, info, critical
  title: text("title").notNull(),
  message: text("message").notNull(),
  recommendation: text("recommendation"),
  dismissed: boolean("dismissed").default(false),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Activity log table
export const activityLog = pgTable("activity_log", {
  id: serial("id").primaryKey(),
  action: text("action").notNull(),
  details: text("details").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Insert schemas
export const insertSensorReadingSchema = createInsertSchema(sensorReadings).omit({
  id: true,
  timestamp: true,
});

export const insertPredictionSchema = createInsertSchema(predictions).omit({
  id: true,
  timestamp: true,
});

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
  timestamp: true,
});

export const insertActivityLogSchema = createInsertSchema(activityLog).omit({
  id: true,
  timestamp: true,
});

// Types
export type SensorReading = typeof sensorReadings.$inferSelect;
export type InsertSensorReading = z.infer<typeof insertSensorReadingSchema>;
export type Prediction = typeof predictions.$inferSelect;
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;
export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type ActivityLog = typeof activityLog.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
