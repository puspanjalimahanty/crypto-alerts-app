import express from "express";
import { AlertModel } from "../models/alert";

const router = express.Router();

// Get all alerts
router.get("/", async (req, res) => {
   console.log("📡 GET /api/alerts called");
  try {
    const alerts = await AlertModel.find();
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
});

// Create new alert
router.post("/", async (req, res) => {
  console.log("📩 Received POST /api/alerts with:", req.body);
  try {
    const { symbol, target, type, userSocketId } = req.body;
const alert = new AlertModel({
  symbol,
  target,
  type,
  userSocketId: userSocketId || null,
  triggered: false,
  coinId: symbol.toLowerCase(),
});

    await alert.save();
    res.status(201).json(alert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create alert" });
  }
  console.log("📩 New alert received:", req.body);

});

// Delete alert
router.delete("/:id", async (req, res) => {
  try {
    const alert = await AlertModel.findByIdAndDelete(req.params.id);
    res.json(alert);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete alert" });
  }
});

export default router;
