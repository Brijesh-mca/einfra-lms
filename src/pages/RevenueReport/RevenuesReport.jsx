import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { ArrowLeft } from "lucide-react";

const dataDaily = [
  { day: "Mon", revenue: 400 },
  { day: "Tue", revenue: 300 },
  { day: "Wed", revenue: 500 },
  { day: "Thu", revenue: 700 },
  { day: "Fri", revenue: 600 },
  { day: "Sat", revenue: 800 },
  { day: "Sun", revenue: 900 },
];

const dataMonthly = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 3000 },
  { month: "Mar", revenue: 5000 },
  { month: "Apr", revenue: 7000 },
  { month: "May", revenue: 6000 },
  { month: "Jun", revenue: 8000 },
  { month: "Jul", revenue: 9000 },
  { month: "Aug", revenue: 7500 },
  { month: "Sep", revenue: 6500 },
  { month: "Oct", revenue: 8500 },
  { month: "Nov", revenue: 9000 },
  { month: "Dec", revenue: 10000 },
];

const dataYearly = [
  { year: "2018", revenue: 45000 },
  { year: "2019", revenue: 50000 },
  { year: "2020", revenue: 55000 },
  { year: "2021", revenue: 60000 },
  { year: "2022", revenue: 65000 },
  { year: "2023", revenue: 70000 },
];

export default function RevenueReport() {
  const [timeframe, setTimeframe] = useState("day");
  const navigate = useNavigate();

  const chartData = timeframe === "day" ? dataDaily
                  : timeframe === "month" ? dataMonthly
                  : dataYearly;

  const xKey = timeframe === "day" ? "day"
            : timeframe === "month" ? "month"
            : "year";

  return (
    <div className="p-2 bg-white rounded shadow-lg max-w-4xl mx-auto mt-10">
      {/* Back Arrow */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-cyan-600 hover:text-cyan-800 mb-4"
      >
        <ArrowLeft size={20} /> Back
      </button>

      <h1 className="text-2xl font-bold mb-4">Revenue Report</h1>

      {/* Timeframe selector */}
      <div className="mb-6 flex gap-4">
        {["day", "month", "year"].map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            className={`px-4 py-2 rounded-md font-semibold
              ${timeframe === tf ? "bg-cyan-600 text-white" : "bg-gray-200 text-black"}
              hover:bg-cyan-700 hover:text-white transition`}
          >
            {tf.charAt(0).toUpperCase() + tf.slice(1)}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
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
      </div>
    </div>
  );
}
