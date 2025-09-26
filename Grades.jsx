import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { DollarSign, Heart, PieChart } from "lucide-react";
import { fetchGrades } from "../api";

export default function Grades() {
  const location = useLocation();
  const [report, setReport] = useState(location.state || null);

  useEffect(() => {
    if (!report) {
      fetchGrades().then(setReport);
    }
  }, [report]);

  if (!report) return <p className="p-6 text-center">Loading results...</p>;

  return (
    <div className="flex flex-col bg-[#eaf4ff] text-slate-800 overflow-y-auto min-h-screen">
      {/* Header */}
      <div className="bg-[#1252a3] text-white py-4 px-4 shadow-md flex items-center justify-center gap-2">
        <h1 className="text-base sm:text-lg font-bold">Performance Report</h1>
      </div>

      {/* Overall Grade */}
      <div className="bg-white rounded-lg shadow-md m-6 p-6 text-center border-2 border-[#f2a900]">
        <h2 className="text-xl font-bold mb-2">Overall Strategy Grade</h2>
        <div className="text-5xl font-bold text-blue-600">
          {report.overallGrade || "N/A"}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        <MetricCard icon={<DollarSign />} title="Cash" value={`$${report.cash}`} />
        <MetricCard icon={<Heart />} title="Loyalty" value={`${report.loyalty}/100`} />
        <MetricCard icon={<PieChart />} title="Market Share" value={`${report.marketShare}%`} />
      </div>

      <div className="text-center mt-6">
        <Link
          to="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-bold"
        >
          Back to Start
        </Link>
      </div>
    </div>
  );
}

function MetricCard({ icon, title, value }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
      <div className="mb-3">{icon}</div>
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
