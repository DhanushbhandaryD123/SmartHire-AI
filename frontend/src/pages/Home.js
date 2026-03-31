import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white min-h-screen">

      {/* ===== HERO ===== */}
      <section className="pt-32 pb-20 text-center px-6 animate-fadeIn">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          Building Smart Hiring <br />
          <span className="text-orange-400">with AI</span>
        </h1>

        <p className="text-gray-300 max-w-2xl mx-auto mt-6">
          SmartHire AI helps companies find the best candidates using
          AI-powered resume analysis, ATS scoring, and automated hiring workflows.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => navigate("/careers")}
            className="bg-orange-500 px-6 py-3 rounded-full hover:bg-orange-600 transition"
          >
            Explore Jobs
          </button>

          <button
            onClick={() => navigate("/register")}
            className="border border-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6 px-6 pb-20">
        <Stat title="150+" desc="Jobs Posted" />
        <Stat title="10K+" desc="Candidates" />
        <Stat title="95%" desc="Match Accuracy" />
        <Stat title="24/7" desc="AI Screening" />
      </section>

      {/* ===== FEATURES ===== */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-semibold text-center mb-10">
          Powerful Features
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <Feature
            title="AI Resume Scoring"
            desc="Automatically evaluate resumes using keyword matching and ATS scoring."
          />

          <Feature
            title="Smart Filtering"
            desc="Instantly shortlist top candidates based on skills and experience."
          />

          <Feature
            title="Automated Hiring"
            desc="Streamline hiring with automated workflows and notifications."
          />

        </div>
      </section>

      {/* ===== CLIENTS ===== */}
      <section className="max-w-6xl mx-auto px-6 pb-20 text-center">
        <h2 className="text-3xl font-semibold mb-8">
          Trusted by Teams
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-gray-300">
          <div className="bg-white/10 p-6 rounded-xl">Google</div>
          <div className="bg-white/10 p-6 rounded-xl">Amazon</div>
          <div className="bg-white/10 p-6 rounded-xl">Microsoft</div>
          <div className="bg-white/10 p-6 rounded-xl">StartupX</div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="text-center pb-20 px-6">
        <h2 className="text-3xl font-bold mb-4">
          Ready to transform hiring?
        </h2>

        <button
          onClick={() => navigate("/register")}
          className="bg-orange-500 px-8 py-3 rounded-full hover:bg-orange-600 transition"
        >
          Start Now
        </button>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-black/40 border-t border-white/10 py-10 text-center text-gray-400">
        <p>© 2026 SmartHire AI</p>
        <p className="text-sm mt-2">
          AI-powered hiring platform for modern companies
        </p>
      </footer>

    </div>
  );
}

/* ===== COMPONENTS ===== */

function Stat({ title, desc }) {
  return (
    <div className="bg-white/10 p-6 rounded-xl text-center backdrop-blur hover:scale-105 transition">
      <h3 className="text-2xl font-bold text-orange-400">{title}</h3>
      <p className="text-gray-300">{desc}</p>
    </div>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="bg-white/10 p-6 rounded-xl backdrop-blur hover:shadow-2xl transition">
      <h3 className="text-xl font-semibold mb-2 text-orange-400">
        {title}
      </h3>
      <p className="text-gray-300">{desc}</p>
    </div>
  );
}

export default Home;
 