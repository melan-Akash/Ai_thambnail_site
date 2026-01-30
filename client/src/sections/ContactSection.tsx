"use client";

import SectionTitle from "../components/SectionTitle";
import { ArrowRightIcon, MailIcon, UserIcon } from "lucide-react";
import { motion } from "motion/react";

export default function ContactSection() {
  return (
    <div className="px-4 md:px-16 lg:px-24 xl:px-32">
      <SectionTitle
        text1="Contact"
        text2="Get in touch"
        text3="Have questions or need help? Reach out and our team will get back to you shortly."
      />

      <form
        onSubmit={(e) => e.preventDefault()}
        className="grid sm:grid-cols-2 gap-3 sm:gap-5 max-w-2xl mx-auto text-slate-300 mt-16 w-full"
      >
        {/* NAME */}
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 320, damping: 70 }}
        >
          <p className="mb-2 font-medium">Full name</p>
          <div className="flex items-center pl-3 rounded-lg border border-slate-700 focus-within:border-pink-500">
            <UserIcon className="size-5 text-slate-400" />
            <input
              name="name"
              type="text"
              placeholder="Enter your full name"
              className="w-full p-3 bg-transparent outline-none"
            />
          </div>
        </motion.div>

        {/* EMAIL */}
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 280, damping: 70 }}
        >
          <p className="mb-2 font-medium">Email address</p>
          <div className="flex items-center pl-3 rounded-lg border border-slate-700 focus-within:border-pink-500">
            <MailIcon className="size-5 text-slate-400" />
            <input
              name="email"
              type="email"
              placeholder="Enter your email address"
              className="w-full p-3 bg-transparent outline-none"
            />
          </div>
        </motion.div>

        {/* MESSAGE */}
        <motion.div
          className="sm:col-span-2"
          initial={{ y: 120, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 240, damping: 70 }}
        >
          <p className="mb-2 font-medium">Your message</p>
          <textarea
            name="message"
            rows={8}
            placeholder="Tell us how we can help you with AI thumbnail generation..."
            className="focus:border-pink-500 resize-none w-full p-3 bg-transparent outline-none rounded-lg border border-slate-700"
          />
        </motion.div>

        {/* SUBMIT BUTTON */}
        <motion.button
          type="submit"
          className="w-max flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-10 py-3 rounded-full"
          initial={{ y: 120, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 280, damping: 70 }}
        >
          Send message
          <ArrowRightIcon className="size-5" />
        </motion.button>
      </form>
    </div>
  );
}
