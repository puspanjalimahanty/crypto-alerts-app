import React from "react";
import Dashboard from "./components/Dashboard";
import AlertForm from "./components/AlertForm";
import Alerts from "./components/Alerts";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>Crypto Price Alerts</h1>
      <Dashboard />
      <AlertForm />
      <Alerts />
    </div>
  );
}

export default App;
