import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import Loading from '../Loading' // Import the Loading component


export default function RevenueReport() {
  const [timeframe, setTimeframe] = useState("day");
  const [revenueData, setRevenueData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        setLoading(true);
        const axiosInstance = axios.create({
          baseURL: "https://lms-backend-flwq.onrender.com/api/v1/admin",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const response = await axiosInstance.get(`/analytics/revenue?timeframe=${timeframe}`);
        const { totalRevenue, breakdown } = response.data.data;

        // Format breakdown for chart and table
        const formattedData = breakdown.map(item => {
          let timeLabel;
          if (timeframe === "day") {
            const date = new Date(item.time);
            timeLabel = date.toLocaleDateString("en-US", { weekday: "short" });
          } else if (timeframe === "month") {
            const date = new Date(item.time);
            timeLabel = date.toLocaleDateString("en-US", { month: "short" });
          } else {
            timeLabel = item.time; // Year as string (e.g., "2023")
          }
          return { time: timeLabel, revenue: item.revenue };
        });

        setRevenueData(formattedData);
        setTotalRevenue(totalRevenue);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching revenue:", error);
        const errorMessage =
          error.response?.status === 401
            ? "Unauthorized: Please check your token or log in again."
            : "Failed to fetch revenue data. Please try again later.";
        setError(errorMessage);
        setLoading(false);
      }
    };

    if (token) {
      fetchRevenue();
    } else {
      setError("No authentication token found. Please log in.");
      setLoading(false);
    }
  }, [token, timeframe]);

  const xKey = "time"; // Consistent key after formatting

  // Format revenue as currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="p-6 text-gray-800 text-red-600 text-center">{error}</div>;
  }

  return (
    <div className="p-4 bg-white rounded shadow-lg max-w-4xl mx-auto mt-10">
      {/* Back Arrow */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-cyan-600 hover:text-cyan-800 mb-4"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <h1 className="text-2xl font-bold mb-4">Revenue Report</h1>
      <div className="mb-4 text-lg">Total Revenue: {formatCurrency(totalRevenue)}</div>

      {/* Timeframe selector */}
      <div className="mb-6 flex gap-4">
        {["day", "month", "year"].map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-4 py-2 rounded-md font-semibold
              ${timeframe === tf ? "card-bg text-white" : "bg-gray-200 text-black"}
              hover:bg-cyan-700 hover:text-white transition`}
          >
            {tf.charAt(0).toUpperCase() + tf.slice(1)}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="mb-8" style={{ width: "100%", height: 350 }}>
        {revenueData.length > 0 ? (
          <ResponsiveContainer>
            <LineChart data={revenueData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#14b8a6"
                strokeWidth={3}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No revenue data available for this timeframe
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="card-bg text-white">
              <th className="p-3 text-left rounded-tl-md">Time</th>
              <th className="p-3 text-left rounded-tr-md">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {revenueData.length > 0 ? (
              revenueData.map((item, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-200 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="p-3">{item.time}</td>
                  <td className="p-3">{formatCurrency(item.revenue)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="p-3 text-center text-gray-500">
                  No revenue data available for this timeframe
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}