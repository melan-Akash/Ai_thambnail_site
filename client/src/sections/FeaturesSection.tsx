"use client";

import SectionTitle from "../components/SectionTitle";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { featuresData } from "../data/features";

export default function FeaturesSection() {
  return (
    <div id="features" className="px-4 md:px-16 lg:px-24 xl:px-32">
      <SectionTitle
        text1="Features"
        text2="What you get"
        text3="Everything you need to generate high-converting AI thumbnails."
      />

      {/* FEATURES CARDS */}
      <div className="flex flex-wrap items-center justify-center gap-6 mt-16 px-6">
        {featuresData.map((feature, index) => (
          <motion.div
            key={index}
            className={
              index === 1
                ? "p-px rounded-[13px] bg-gradient-to-br from-pink-600 to-slate-800"
                : ""
            }
            initial={{ y: 120, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: index * 0.15,
              type: "spring",
              stiffness: 300,
              damping: 40,
            }}
          >
            <div className="p-6 rounded-xl space-y-4 border border-slate-800 bg-slate-950 max-w-80 w-full">
              {/* ICON */}
              <img
                src={feature.icon}
                alt={feature.title}
                className="w-10 h-10"
              />

              <h3 className="text-base font-medium text-white">
                {feature.title}
              </h3>

              <p className="text-slate-400 line-clamp-2 pb-4">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* SHOWCASE SECTION */}
      <div className="mt-40 relative mx-auto max-w-5xl">
        <div className="absolute -z-50 w-96 h-96 -top-10 -left-20 rounded-full bg-pink-500/40 blur-3xl"></div>

        <motion.p
          className="text-slate-300 text-lg max-w-3xl"
          initial={{ y: 120, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          Our AI Thumbnail Generator helps creators design eye-catching thumbnails
          that boost clicks, views, and engagement — no design skills required.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 mt-8 gap-10">
          <motion.div
            className="md:col-span-2"
            initial={{ y: 120, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            <img
              src="/assets/features-showcase-1.png"
              alt="AI Thumbnail Generator preview"
              className="rounded-xl"
            />
          </motion.div>

          <motion.div
            className="md:col-span-1"
            initial={{ y: 120, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <img
              src="/assets/features-showcase-2.png"
              alt="Thumbnail examples"
              className="rounded-xl hover:-translate-y-1 transition duration-300"
            />

            <h3 className="text-xl text-slate-300 font-medium mt-6">
              Thumbnails that drive clicks
            </h3>

            <p className="text-slate-400 mt-2">
              AI-optimized layouts, colors, and typography designed to increase
              engagement.
            </p>

            <a
              href="#"
              className="group flex items-center gap-2 mt-4 text-pink-600 hover:text-pink-700 transition"
            >
              Try AI Thumbnail Generator
              <ArrowUpRight className="size-5 group-hover:translate-x-1 transition" />
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
