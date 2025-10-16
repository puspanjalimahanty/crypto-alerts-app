import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addAlertAsync } from "../redux/alertSlice";
import { AppDispatch } from "../redux/store";
import { io } from "socket.io-client";

const AlertForm = () => {
  const dispatch = useDispatch<AppDispatch>(); // ✅ Typed dispatch
  const [symbol, setSymbol] = useState("");
  const [target, setTarget] = useState<number>(0);
  const [type, setType] = useState<"above" | "below">("above");
  const socket = io("http://localhost:4000");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addAlertAsync({ symbol, target, type, userSocketId: socket.id }));

    

    setSymbol("");
    setTarget(0);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Alert</h2>
      <input
        type="text"
        placeholder="Coin Symbol"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Target Price"
        value={target}
        onChange={(e) => setTarget(Number(e.target.value))}
        required
      />
      <select value={type} onChange={(e) => setType(e.target.value as "above" | "below")}>
        <option value="above">Above</option>
        <option value="below">Below</option>
      </select>
      <button type="submit">Add Alert</button>
    </form>
  );
};

export default AlertForm;
