import mongoose from "mongoose";

const sensorDataSchema = new mongoose.Schema({
  moisture: { type: Number, required: true },
  pH: { type: Number, required: true },
  temperature: { type: Number, required: true },
  pressure: { type: Number, required: true },
  prediction: { type: String, default: "Unknown" },
  timestamp: { type: Date, default: Date.now },
});

export const SensorData = mongoose.model("SensorData", sensorDataSchema);
