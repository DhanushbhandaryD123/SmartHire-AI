import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import { getAllCandidates } from "../services/api";

function Analytics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getAllCandidates();
        setData(Array.isArray(result) ? result : []);
      } catch {
        setData([]);
      }
    };

    load();
  }, []);

  const approved = data.filter(c => c.hr_status === "approved").length;
  const rejected = data.filter(c => c.hr_status === "rejected").length;

  const pieData = [
    { name: "Approved", value: approved },
    { name: "Rejected", value: rejected },
  ];

  const barData = [
    { range: "0-50", count: data.filter(c => c.score < 50).length },
    { range: "50-75", count: data.filter(c => c.score >= 50 && c.score < 75).length },
    { range: "75-100", count: data.filter(c => c.score >= 75).length },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Analytics</h2>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-white p-4 rounded-xl shadow">
          <PieChart width={300} height={300}>
            <Pie data={pieData} dataKey="value">
              <Cell fill="#16a34a" />
              <Cell fill="#dc2626" />
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <BarChart width={400} height={300} data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#2563eb" />
          </BarChart>
        </div>

      </div>
    </div>
  );
}

export default Analytics;