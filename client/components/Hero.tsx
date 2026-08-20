"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Monitor,
  TrendingUp,
  Coins,
  FileText,
  ShoppingCart,
  Award,
  Heart,
  BarChart3,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="border-b border-line mb-20 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-3">
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          {/* Left — thesis */}
          <div>
            <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] text-paper mb-6">
              The ultimate
              <br />
              product with <span className="text-brass italic">pleasure.</span>
            </h1>
            <p className="text-muted text-lg max-w-md mb-8 leading-relaxed">
              Let your product do the magic care for you. A catalog run like a
              ledger — each item numbered, priced, and accounted for. Browse the
              collection and check out in a few lines.
            </p>
            <div className="flex flex-wrap items-center gap-6 mb-12">
              <Link
                href="/products"
                className="bg-brass text-ink px-6 py-3 rounded-full font-mono text-sm hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
              <Link
                href="/about"
                className="font-mono text-sm text-brass hover:opacity-80 transition-opacity"
              >
                Learn More →
              </Link>
            </div>

            {/* Our Service */}
            <div>
              <p className="font-display text-lg text-paper mb-4">
                Our Service:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: Monitor, label: "Electronic Products" },
                  { icon: TrendingUp, label: "In-Demand Products" },
                  { icon: Coins, label: "Best Prices" },
                  { icon: FileText, label: "1-Year Warranty" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="bg-teal/10 border border-teal/30 rounded-lg p-4 hover:bg-teal/20 transition-colors"
                  >
                    <Icon size={22} className="text-teal mb-3" />
                    <p className="text-paper text-xs font-medium leading-snug">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — illustration composition */}
          <div className="relative hidden md:flex items-center justify-center h-[420px]">
            {/* Concentric circle background */}
            <div className="absolute w-[380px] h-[380px] rounded-full bg-teal/10" />
            <div className="absolute w-[300px] h-[300px] rounded-full bg-teal/15" />

            {/* Center — actual product image */}
            <div className="relative w-72 h-72 flex items-center justify-center drop-shadow-2xl">
              <div className="relative w-full h-full">
                <Image
                  src="/mouse-product.png"
                  alt="Featured product — wireless mouse"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Floating badge — top left */}
            <div className="absolute top-6 left-2 w-12 h-12 rounded-full bg-brass flex items-center justify-center shadow-md">
              <div className="w-3 h-3 rounded-full bg-white" />
            </div>

            {/* Floating badge — top right, stats */}
            <div className="absolute top-10 right-0 w-14 h-14 rounded-full bg-brass flex items-center justify-center shadow-md">
              <BarChart3 size={22} className="text-ink" />
            </div>

            {/* Our Clients card — bottom right, pushed outward to match */}
            <div className="absolute bottom-2 -right-6 bg-panel border border-line rounded-lg shadow-md p-4 w-40 z-10">
              <div className="flex items-center gap-1 mb-2">
                <Heart size={14} className="text-brass" />
                <p className="text-paper text-xs font-semibold">Our Clients</p>
              </div>
              <div className="flex items-center -space-x-2">
                {["#A9772E", "#3D6E60", "#A03F2C"].map((color, i) => (
                  <div
                    key={i}
                    style={{ backgroundColor: color }}
                    className="w-7 h-7 rounded-full border-2 border-panel"
                  />
                ))}
                <span className="text-[10px] font-mono text-muted pl-2">
                  4+
                </span>
              </div>
            </div>

            {/* Decorative dots */}
            <div className="absolute -top-2 right-16 w-2 h-2 rounded-full bg-rust/60" />
            <div className="absolute bottom-10 -left-4 w-2 h-2 rounded-full bg-rust/60" />
          </div>
        </div>
      </div>
    </section>
  );
}
