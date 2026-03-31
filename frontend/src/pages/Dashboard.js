import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, CartesianGrid, ResponsiveContainer
} from "recharts";
import { motion } from "framer-motion";
import { getAllCandidates } from "../services/api";

function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  useEffect(() => {
    const load = async () => {
      try {
        const result = await getAllCandidates();
        setData(Array.isArray(result) ? result : []);
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const safeData = Array.isArray(data) ? data : [];

  const approved = safeData.filter(d => d.hr_status === "approved").length;
  const rejected = safeData.filter(d => d.hr_status === "rejected").length;

  const avgScore =
    safeData.length > 0
      ? Math.round(
          safeData.reduce((sum, d) => sum + (d.score || 0), 0) /
          safeData.length
        )
      : 0;

  const stats = [
    { title: "Total Candidates", value: safeData.length },
    { title: "Selected", value: approved },
    { title: "Rejected", value: rejected },
    { title: "Avg Score", value: `${avgScore}%` },
  ];

  const chartData = safeData.map((d, i) => ({
    name: `C${i + 1}`,
    score: d.score || 0,
  }));

  if (loading) {
    return <p className="p-6">Loading dashboard...</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">
        HR Dashboard
      </h1>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-5 rounded-xl shadow-lg"
          >
            <p className="text-sm opacity-80">{s.title}</p>
            <h2 className="text-2xl font-bold">{s.value}</h2>
          </motion.div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="mb-3 font-semibold">Candidate Scores</h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="mb-3 font-semibold">Score Trend</h3>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid stroke="#eee" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#16a34a"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;