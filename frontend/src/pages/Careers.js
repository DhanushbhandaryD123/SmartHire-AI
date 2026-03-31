import { useEffect, useState } from "react";
import { getJobs } from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Careers() {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getJobs().then(setJobs);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-yellow-200 p-10">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold">Join Our Team</h1>
        <p className="text-gray-600 mt-2">
          Explore exciting career opportunities
        </p>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">

        {jobs.map((job, index) => (
          <motion.div
            key={job._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
          >

            {/* TOP CARD */}
            <div className="p-6 h-40 flex flex-col justify-between bg-gray-100">

              <div>
                <p className="text-sm text-gray-500">
                  ${100 + index * 10}/hr
                </p>

                <h2 className="text-xl font-bold mt-2">
                  {job.title}
                </h2>
              </div>

              <span className="text-xl">→</span>
            </div>

            {/* BOTTOM */}
            <div className="flex items-center justify-between p-4">

              <div className="flex items-center gap-3">
                <div className="bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                  {job.title[0]}
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    {job.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {job.keywords?.join(", ")}
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/jobs/${job._id}`)}
                className="bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800"
              >
                View
              </button>

            </div>

          </motion.div>
        ))}

      </div>
    </div>
  );
}

export default Careers;
 