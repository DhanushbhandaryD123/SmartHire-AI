import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobs } from "../services/api";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  useEffect(() => {
    getJobs().then(data => {
      const found = data.find(j => j._id === id);
      setJob(found);
    });
  }, [id]);

  if (!job) return <p className="p-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-10">

      <h1 className="text-3xl font-bold mb-4">{job.title}</h1>

      <p className="text-gray-600 mb-4">{job.description}</p>

      <p className="mb-6">
        <b>Skills:</b> {job.keywords.join(", ")}
      </p>

      <button
        onClick={() => navigate(`/apply/${job._id}`)}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Apply Now
      </button>

    </div>
  );
}

export default JobDetails;
 