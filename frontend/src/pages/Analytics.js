import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";
import { getAnalytics } from "../services/api";

function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getAnalytics();
        setData(res);
      } catch (err) {
        console.error(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    load();

    const interval = setInterval(load, 5000); // 🔥 auto refresh

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading analytics...</p>;
  }

  if (!data) {
    return <p className="text-center mt-10 text-red-500">Failed to load analytics</p>;
  }

  // ✅ Pie data
  const pieData = [
    { name: "Approved", value: data.approved },
    { name: "Rejected", value: data.rejected },
    { name: "Pending", value: data.pending },
  ];

  // ✅ Bar data
  const barData = [
    { name: "Jobs", value: data.total_jobs },
    { name: "Candidates", value: data.total_candidates },
  ];

  return (
    <div className="p-6">

      <h2 className="text-3xl font-bold mb-6">
        HR Analytics Dashboard
      </h2>

      {/* EXPORT BUTTONS */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => window.open("http://127.0.0.1:8000/api/export/csv/")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Export Excel
        </button>

        <button
          onClick={() => window.open("http://127.0.0.1:8000/api/export/pdf/")}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Export PDF
        </button>
      </div>

      {/* SUMMARY */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card title="Jobs" value={data.total_jobs} />
        <Card title="Candidates" value={data.total_candidates} />
        <Card title="Pending" value={data.pending} />
        <Card title="Approved" value={data.approved} />
      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* PIE */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Status Distribution</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" label>
                <Cell fill="#16a34a" />
                <Cell fill="#dc2626" />
                <Cell fill="#f59e0b" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold mb-2">Overview</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* TOP JOB */}
      {data.top_job && (
        <div className="mt-6 bg-white p-4 rounded-xl shadow">
          <h3 className="font-bold">Top Job</h3>
          <p>{data.top_job._id}</p>
          <p className="text-gray-500">
            {data.top_job.count} applications
          </p>
        </div>
      )}

    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow text-center">
      <p className="text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

export default Analytics;