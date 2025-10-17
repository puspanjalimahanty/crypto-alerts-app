import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  target: { type: Number, required: true },
  type: { type: String, required: true },
  triggered: { type: Boolean, default: false },
  userSocketId: { type: String },
  coinId: { type: String },
});

export const AlertModel = mongoose.model("Alert", alertSchema);
