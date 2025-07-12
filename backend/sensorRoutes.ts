import express from 'express';
import { SensorData } from './models/SensorData';

const router = express.Router();

// Save sensor data to MongoDB
router.post('/api/sensor', async (req, res) => {
  try {
    const entry = new SensorData(req.body);
    await entry.save();
    res.status(201).json({ message: 'Sensor data saved', data: entry });
  } catch (err) {
    console.error('❌ Save error:', err);
    res.status(500).json({ message: 'Failed to save sensor data' });
  }
});

// Fetch latest sensor data (100 entries)
router.get('/api/sensor/history', async (_req, res) => {
  try {
    const logs = await SensorData.find().sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve history' });
  }
});

export default router;
