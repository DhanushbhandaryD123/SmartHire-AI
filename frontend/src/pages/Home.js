import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaRobot,
  FaSearch,
  FaUserCheck,
  FaChartLine,
  FaFileAlt,
  FaBell,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";
import Hero3D from "../components/Hero3D";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const popIn = {
  hidden: { opacity: 0, scale: 0.85, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white min-h-screen overflow-hidden">

      {/* ===== HERO ===== */}
      <section className="pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-center md:text-left"
          >
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Building Smart Hiring <br />
              <span className="text-orange-400">with AI</span>
            </h1>

            <p className="text-gray-300 max-w-xl mx-auto md:mx-0 mt-6">
              SmartHire AI helps companies find the best candidates using
              AI-powered resume analysis, ATS scoring, and automated hiring workflows.
            </p>

            <div className="mt-8 flex justify-center md:justify-start gap-4">
              <motion.button
                onClick={() => navigate("/careers")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange-500 px-6 py-3 rounded-full hover:bg-orange-600 transition"
              >
                Explore Jobs
              </motion.button>

              <motion.button
                onClick={() => navigate("/register")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition"
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>

          {/* 3D Object */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Hero3D />
          </motion.div>

        </div>
      </section>

      {/* ===== STATS ===== */}
      <motion.section
        className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6 px-6 pb-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        {[
          { title: "150+", desc: "Jobs Posted" },
          { title: "10K+", desc: "Candidates" },
          { title: "95%", desc: "Match Accuracy" },
          { title: "24/7", desc: "AI Screening" },
        ].map((s) => (
          <motion.div key={s.title} variants={popIn} whileHover={{ scale: 1.06 }}>
            <Stat title={s.title} desc={s.desc} />
          </motion.div>
        ))}
      </motion.section>

      {/* ===== SERVICES ===== */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeUp}
          className="text-3xl font-semibold text-center mb-4"
        >
          Our Services
        </motion.h2>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeUp}
          custom={1}
          className="text-gray-300 text-center max-w-2xl mx-auto mb-10"
        >
          End-to-end recruitment tools powered by AI — from sourcing to onboarding.
        </motion.p>

        <motion.div
          className="grid md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {[
            {
              title: "Resume Screening",
              desc: "AI scans and ranks resumes against job requirements in seconds.",
              img: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80",
            },
            {
              title: "Candidate Sourcing",
              desc: "Find and engage top talent across multiple channels automatically.",
              img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80",
            },
            {
              title: "Interview Scheduling",
              desc: "Automated scheduling and reminders for HR teams and candidates.",
              img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80",
            },
            {
              title: "Analytics & Reports",
              desc: "Track hiring funnel performance with real-time dashboards.",
              img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
            },
            {
              title: "Onboarding Automation",
              desc: "Smooth digital onboarding flows for new hires from day one.",
              img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80",
            },
            {
              title: "HR Workflow Tools",
              desc: "Approve, reject, and manage candidates from a single dashboard.",
              img: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=600&q=80",
            },
          ].map((service) => (
            <motion.div
              key={service.title}
              variants={popIn}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/10 rounded-xl overflow-hidden backdrop-blur transition shadow-lg hover:shadow-2xl"
            >
              <motion.img
                src={service.img}
                alt={service.title}
                className="w-full h-40 object-cover"
                loading="lazy"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.4 }}
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-orange-400">
                  {service.title}
                </h3>
                <p className="text-gray-300 text-sm">{service.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeUp}
          className="text-3xl font-semibold text-center mb-10"
        >
          Powerful Features
        </motion.h2>

        <motion.div
          className="grid md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {[
            {
              icon: <FaRobot size={28} />,
              title: "AI Resume Scoring",
              desc: "Automatically evaluate resumes using keyword matching and ATS scoring.",
              img: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=600&q=80",
            },
            {
              icon: <FaSearch size={28} />,
              title: "Smart Filtering",
              desc: "Instantly shortlist top candidates based on skills and experience.",
              img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
            },
            {
              icon: <FaBell size={28} />,
              title: "Automated Hiring",
              desc: "Streamline hiring with automated workflows and notifications.",
              img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
            },
            {
              icon: <FaUserCheck size={28} />,
              title: "Candidate Tracking",
              desc: "Monitor every applicant's status from applied to hired in real time.",
              img: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=80",
            },
            {
              icon: <FaFileAlt size={28} />,
              title: "Smart Resume Parsing",
              desc: "Extract skills, experience, and education automatically from any resume.",
              img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80",
            },
            {
              icon: <FaChartLine size={28} />,
              title: "Hiring Analytics",
              desc: "Get actionable insights into your recruitment pipeline performance.",
              img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
            },
          ].map((f) => (
            <motion.div key={f.title} variants={popIn} whileHover={{ y: -6 }}>
              <Feature icon={f.icon} title={f.title} desc={f.desc} img={f.img} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ===== CLIENTS ===== */}
      <section className="max-w-6xl mx-auto px-6 pb-20 text-center">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeUp}
          className="text-3xl font-semibold mb-8"
        >
          Trusted by Teams
        </motion.h2>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 text-gray-300"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={staggerContainer}
        >
          {["Google", "Amazon", "Microsoft", "StartupX"].map((name) => (
            <motion.div
              key={name}
              variants={popIn}
              whileHover={{ scale: 1.08 }}
              className="bg-white/10 p-6 rounded-xl"
            >
              {name}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ===== CTA ===== */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={fadeUp}
        className="text-center pb-20 px-6"
      >
        <h2 className="text-3xl font-bold mb-4">
          Ready to transform hiring?
        </h2>

        <motion.button
          onClick={() => navigate("/register")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-orange-500 px-8 py-3 rounded-full hover:bg-orange-600 transition"
        >
          Start Now
        </motion.button>
      </motion.section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-black/40 border-t border-white/10 pt-14 pb-8 px-6 text-gray-400">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3">
              SmartHire <span className="text-orange-400">AI</span>
            </h3>
            <p className="text-sm">
              AI-powered hiring platform that helps companies find, screen,
              and hire the best talent faster.
            </p>
            <div className="flex gap-4 mt-4 text-lg">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition"><FaFacebook /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition"><FaTwitter /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition"><FaLinkedin /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition"><FaInstagram /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => navigate("/")} className="hover:text-orange-400 transition">Home</button></li>
              <li><button onClick={() => navigate("/careers")} className="hover:text-orange-400 transition">Careers</button></li>
              <li><button onClick={() => navigate("/register")} className="hover:text-orange-400 transition">Get Started</button></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-3">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>Resume Screening</li>
              <li>Candidate Sourcing</li>
              <li>Interview Scheduling</li>
              <li>Hiring Analytics</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-3">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <FaPhoneAlt className="text-orange-400" />
                <a href="tel:+918431457057" className="hover:text-orange-400 transition">
                  +91 84314 57057
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-orange-400" />
                <a href="mailto:support@smarthireai.com" className="hover:text-orange-400 transition">
                  support@smarthireai.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <FaMapMarkerAlt className="text-orange-400 mt-1" />
                <span>Bengaluru, Karnataka, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-white/10 mt-10 pt-6 text-center text-sm">
          <p>© 2026 SmartHire AI. All rights reserved.</p>
          <p className="mt-1">
            AI-powered hiring platform for modern companies
          </p>
        </div>
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

function Feature({ icon, title, desc, img }) {
  return (
    <div className="bg-white/10 rounded-xl overflow-hidden backdrop-blur hover:shadow-2xl transition h-full">
      {img && (
        <img
          src={img}
          alt={title}
          className="w-full h-36 object-cover"
          loading="lazy"
        />
      )}
      <div className="p-6">
        <div className="text-orange-400 mb-3">{icon}</div>
        <h3 className="text-xl font-semibold mb-2 text-orange-400">
          {title}
        </h3>
        <p className="text-gray-300">{desc}</p>
      </div>
    </div>
  );
}

export default Home;
