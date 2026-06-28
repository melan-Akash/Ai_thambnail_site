'use client';

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CTASection() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return (
    <motion.div
      className="max-w-5xl mt-40 py-16 p-6 md:pl-20 md:w-full mx-4 md:mx-auto flex flex-col md:flex-row gap-6 items-center justify-between text-left bg-gradient-to-b from-pink-900 to-pink-950 rounded-2xl text-white"
      initial={{ y: 150, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 320, damping: 70 }}
    >
      <div>
        <motion.h1
          className="text-4xl md:text-[46px] md:leading-[56px] font-semibold bg-gradient-to-r from-white to-pink-400 bg-clip-text text-transparent"
          initial={{ y: 80, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 280, damping: 70 }}
        >
          Ready to skyrocket your CTR?
        </motion.h1>

        <motion.p
          className="mt-2 text-lg bg-gradient-to-r from-white to-pink-400 bg-clip-text text-transparent"
          initial={{ y: 80, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 70 }}
        >
          Start creating high-converting thumbnails with Thumblify today.
        </motion.p>
      </div>

      <motion.button
        onClick={() => navigate(isLoggedIn ? '/generate' : '/login')}
        className="px-12 py-3 mt-4 text-sm font-medium text-slate-800 bg-white rounded-full hover:bg-slate-200 transition cursor-pointer"
        initial={{ y: 80, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 280, damping: 70 }}
      >
        Get Started
      </motion.button>
    </motion.div>
  );
}
