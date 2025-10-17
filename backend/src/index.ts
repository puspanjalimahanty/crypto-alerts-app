import express from "express";
import mongoose from "mongoose";
import Redis from "ioredis";
import dotenv from "dotenv";
import axios from "axios";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import cron from "node-cron";
import alertRoutes from "./routes/alerts";
import { AlertModel } from "./models/alert";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/alerts", alertRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// const redis = new Redis(process.env.REDIS_URL as string);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

const COINS = ["bitcoin", "ethereum", "dogecoin"]; // You can modify this list
const PORT = process.env.PORT || 4000;

// 🕒 Fetch crypto prices every 30 seconds
cron.schedule("*/30 * * * * *", async () => {
  try {
    const res = await axios.get(
      `${process.env.COINGECKO_API_URL}/simple/price?ids=${COINS.join(",")}&vs_currencies=usd`
    );
    const prices = res.data;

    // Cache in Redis for 2 minutes
    //await redis.set("prices", JSON.stringify(prices), "EX", 120);

    // Emit latest prices to all clients
    io.emit("prices", prices);

    // Check user alerts
    const alerts = await AlertModel.find({ triggered: false });
for (const alert of alerts) {
  // Use symbol in lowercase to match COINGECKO API ids
  const coinId = alert.symbol.toLowerCase();
  const currentPrice = prices[coinId]?.usd;
  if (!currentPrice) continue;

  if (
    (alert.type === "above" && currentPrice >= alert.target) ||
    (alert.type === "below" && currentPrice <= alert.target)
  ) {
    alert.triggered = true;
    await alert.save();

    // Emit alert only if userSocketId exists
    if (alert.userSocketId) {
      io.to(alert.userSocketId).emit("alert", {
        message: `${alert.symbol.toUpperCase()} crossed ${alert.target} USD!`,
      });
      console.log(`📢 Sent alert to ${alert.userSocketId}`);
    }
  }
}


    console.log("✅ Prices updated");
  } catch (err: any) {
    console.error("❌ Error fetching prices:", err);
  }
});

// WebSocket connection setup
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);
  socket.emit("connected", { id: socket.id });
});

// Start server
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
