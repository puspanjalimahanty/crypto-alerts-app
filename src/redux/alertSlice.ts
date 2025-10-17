// src/redux/alertSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchAlerts, createAlert, deleteAlert } from "../api/cryptoApi";

export interface Alert {
  _id?: string;
  symbol: string;            // e.g. "bitcoin" or "BTC" depending on your UI
  target: number;
  type: "above" | "below";
  triggered?: boolean;      // used locally & persisted if backend supports
  userSocketId?: string;
}

export const loadAlerts = createAsyncThunk<Alert[]>("alerts/load", async () => {
  return await fetchAlerts();
});

export const addAlertAsync = createAsyncThunk<Alert, Alert>(
  "alerts/add",
  async (alert) => {
    return await createAlert(alert);
  }
);

export const deleteAlertAsync = createAsyncThunk<Alert, string>(
  "alerts/delete",
  async (id) => {
    return await deleteAlert(id);
  }
);

const alertSlice = createSlice({
  name: "alerts",
  initialState: [] as Alert[],
  reducers: {
    // mark alert triggered locally (so UI won't re-alert)
    markTriggered(state, action: PayloadAction<{ id?: string; symbol: string; target: number }>) {
      const { id, symbol, target } = action.payload;
      const idx = id ? state.findIndex(a => a._id === id) : state.findIndex(a => a.symbol === symbol && a.target === target && !a.triggered);
      if (idx >= 0) state[idx].triggered = true;
    },
    // optional: reset triggered flags (useful for demo resets)
    resetTriggeredAll(state) {
      state.forEach(a => (a.triggered = false));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAlerts.fulfilled, (_, action: PayloadAction<Alert[]>) => action.payload)
      .addCase(addAlertAsync.fulfilled, (state, action: PayloadAction<Alert>) => {
        state.push(action.payload);
      })
      .addCase(deleteAlertAsync.fulfilled, (state, action: PayloadAction<Alert>) => {
        return state.filter(alert => alert._id !== action.payload._id);
      });
  },
});

export const { markTriggered, resetTriggeredAll } = alertSlice.actions;
export default alertSlice.reducer;
