import axios from "axios";

const API_URL = "http://localhost:4000/api/alerts"; // ✅ Correct route

export const fetchAlerts = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createAlert = async (alertData: {
  symbol: string;
  target: number;
  type: string;
  userSocketId?: string;
}) => {
  const res = await axios.post(API_URL, alertData);
  return res.data;
};

export const deleteAlert = async (id: string) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
