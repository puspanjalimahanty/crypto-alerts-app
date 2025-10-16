import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadAlerts, deleteAlertAsync } from "../redux/alertSlice";
import { RootState, AppDispatch } from "../redux/store";

// ✅ Define Alert interface
interface Alert {
  _id: string;
  symbol: string;
  target: number;
  type: "above" | "below";
  triggered?: boolean;
}

const Alerts = () => {
  const dispatch = useDispatch<AppDispatch>(); // ✅ Typed dispatch
  const alerts = useSelector((state: RootState) => state.alerts) as Alert[];

  useEffect(() => {
    dispatch(loadAlerts());
  }, [dispatch]);

  return (
    <div>
      <h2>Active Alerts</h2>
      <ul>
        {alerts.map((alert) => (
          <li key={alert._id}>
            {alert.symbol.toUpperCase()} {alert.type} {alert.target} USD
            <button onClick={() => dispatch(deleteAlertAsync(alert._id))}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Alerts;
