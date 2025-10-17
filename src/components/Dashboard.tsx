// src/components/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { markTriggered } from "../redux/alertSlice";

const socket: Socket = io("http://localhost:4000");

const Dashboard: React.FC = () => {
  const [prices, setPrices] = useState<Record<string, { usd: number }>>({});
  const alerts = useSelector((state: RootState) => state.alerts);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    socket.on("prices", (data: Record<string, { usd: number }>) => {
      setPrices(data);

      // check each alert against updated prices
      if (alerts && alerts.length > 0) {
        alerts.forEach(alertObj => {
  if (alertObj.triggered) return;

  const coinId = (alertObj.symbol || "").toLowerCase();
  const priceObj = data[coinId] ?? data[alertObj.symbol];

  if (!priceObj) return;

  const current = priceObj.usd;
  const target = alertObj.target;

  const isTriggered =
    (alertObj.type === "above" && current >= target) ||
    (alertObj.type === "below" && current <= target);

  if (isTriggered) {
    try {
      // ✅ Now alert() refers to the browser's built-in alert function
      alert(`${alertObj.symbol.toUpperCase()} crossed ${target} USD! Current: ${current}`);
    } catch (e) {
      console.log("ALERT:", `${alertObj.symbol} crossed ${target}`, e);
    }

    dispatch(
      markTriggered({ id: alertObj._id, symbol: alertObj.symbol, target })
    );
  }
});

      }
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    return () => {
      socket.off("prices");
      socket.off("connect");
    };
  }, [alerts, dispatch]);

  return (
    <div>
      <h2>Dashboard</h2>

      <h3>Live Prices</h3>
      <ul>
        {Object.entries(prices).length === 0 && <li>No prices yet...</li>}
        {Object.entries(prices).map(([coin, v]) => (
          <li key={coin}>
            {coin.toUpperCase()}: ${v.usd}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
