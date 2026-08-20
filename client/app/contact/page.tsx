"use client";

import { useState } from "react";
import api from "@/lib/axios";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await api.post("/contact", form);
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div>
      {/* Header — consistent with catalog page */}
      <p className="catalog-number mb-2">Get in Touch</p>
      <h1 className="font-display text-4xl text-paper mb-4">
        Have a question? Write it down.
      </h1>
      <p className="text-muted text-lg max-w-md mb-12 leading-relaxed">
        Whether it&apos;s an order, a product query, or just feedback — drop us
        a line and we&apos;ll get back to you, entry by entry.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_0.8fr] gap-12">
        {/* Left — form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="catalog-number block mb-2">Name</label>
              <input
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full bg-panel border hairline rounded-sm px-3 py-2 text-paper focus:border-brass outline-none"
              />
            </div>
            <div>
              <label className="catalog-number block mb-2">Email</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@email.com"
                className="w-full bg-panel border hairline rounded-sm px-3 py-2 text-paper focus:border-brass outline-none"
              />
            </div>
          </div>

          <div>
            <label className="catalog-number block mb-2">Subject</label>
            <input
              name="subject"
              required
              value={form.subject}
              onChange={handleChange}
              placeholder="What's this about?"
              className="w-full bg-panel border hairline rounded-sm px-3 py-2 text-paper focus:border-brass outline-none"
            />
          </div>

          <div>
            <label className="catalog-number block mb-2">Message</label>
            <textarea
              name="message"
              required
              rows={6}
              value={form.message}
              onChange={handleChange}
              placeholder="Write your message here…"
              className="w-full bg-panel border hairline rounded-sm px-3 py-2 text-paper focus:border-brass outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-brass text-ink px-6 py-3 rounded-full font-mono text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {status === "loading" ? "Sending…" : "Send message"}
          </button>

          {status === "success" && (
            <p className="text-teal font-mono text-sm">
              Message sent — we&apos;ll be in touch soon.
            </p>
          )}
          {status === "error" && (
            <p className="text-red-400 font-mono text-sm">
              Something went wrong — please try again.
            </p>
          )}
        </form>

        {/* Right — ledger-style info card */}
        <div className="bg-panel border hairline rounded-sm p-6 h-fit">
          <div className="flex justify-between items-start mb-6">
            <span className="catalog-number">No. C-01</span>
            <span className="catalog-number">Open</span>
          </div>

          <p className="font-display text-2xl text-paper mb-1">
            Contact Ledger
          </p>
          <p className="text-muted text-sm mb-6">
            Reach us directly through any of the channels below.
          </p>

          <div className="space-y-4 pt-4 border-t border-line">
            <div className="flex justify-between items-center">
              <span className="text-muted text-sm font-mono">Email</span>
              <span className="text-paper text-sm font-mono">
                faysalhasanmd393@gmail.com
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted text-sm font-mono">Phone</span>
              <span className="text-paper text-sm font-mono">
                +880 1798484639
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted text-sm font-mono">Hours</span>
              <span className="text-paper text-sm font-mono">Mon–Fri, 9–6</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 mt-4 border-t border-line">
            <span className="text-xs font-mono text-teal">Avg. reply time</span>
            <span className="font-mono text-brass text-lg">~24h</span>
          </div>
        </div>
      </div>
    </div>
  );
}
