import Link from "next/link";
import {
  BookOpen,
  ShieldCheck,
  Zap,
  Layers,
  Code,
  Briefcase,
  Globe,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <p className="catalog-number mb-2">About</p>
      <h1 className="font-display text-4xl sm:text-5xl text-paper mb-5">
        A catalog built like a ledger
      </h1>
      <p className="text-muted text-lg max-w-2xl leading-relaxed mb-14">
        E-Commerce is a small, full-stack storefront where every product is
        numbered, priced, and tracked — no clutter, just a clean record of
        what's on the shelf and what's in your cart.
      </p>

      {/* Values grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
        {[
          {
            icon: BookOpen,
            title: "Kept in order",
            desc: "Every listing follows the same format — title, category, price, and stock — so nothing gets lost in translation.",
          },
          {
            icon: ShieldCheck,
            title: "Accounts you can trust",
            desc: "Passwords are hashed, sessions run on signed tokens, and role-based access keeps admin tools where they belong.",
          },
          {
            icon: Zap,
            title: "Built for speed",
            desc: "Real-time cart and order updates without full page reloads — add an item and watch the count change instantly.",
          },
          {
            icon: Layers,
            title: "Simple, modular stack",
            desc: "A REST API on Express and Prisma, paired with a Next.js storefront — easy to read, easy to extend.",
          },
        ].map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="bg-panel border border-line rounded-xl p-5"
          >
            <div className="w-10 h-10 rounded-lg bg-brass/10 flex items-center justify-center mb-3">
              <Icon size={18} className="text-brass" />
            </div>
            <h3 className="text-paper font-medium mb-1.5">{title}</h3>
            <p className="text-muted text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* Stack */}
      <div className="bg-panel border border-line rounded-xl p-6 mb-16">
        <h2 className="text-paper font-medium mb-4">Under the hood</h2>
        <div className="flex flex-wrap gap-2">
          {[
            "Next.js",
            "TypeScript",
            "Express.js",
            "Prisma ORM",
            "PostgreSQL",
            "JWT Auth",
            "Tailwind CSS",
          ].map((tech) => (
            <span
              key={tech}
              className="text-xs font-mono text-muted bg-ink border border-line px-3 py-1.5 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Creator */}
      <div className="border-t border-line pt-10">
        <p className="catalog-number mb-3">Built by</p>
        <h2 className="font-display text-2xl text-paper mb-2">
          Md. Faysal Hasan
        </h2>
        <p className="text-muted text-sm max-w-xl leading-relaxed mb-5">
          Full Stack (MERN) developer, BSc in CSE at Green University of
          Bangladesh. This project was built as the SCIC/EJP-13 backend
          assignment — a production-style REST API paired with a matching
          storefront.
        </p>
        <div className="flex gap-3">
          <a
            href="https://github.com/faysalhasanmd"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-muted hover:text-brass text-sm transition-colors"
          >
            <Code size={15} /> GitHub
          </a>
          <span className="text-line">·</span>
          <a
            href="#"
            className="flex items-center gap-1.5 text-muted hover:text-brass text-sm transition-colors"
          >
            <Briefcase size={15} /> LinkedIn
          </a>
          <span className="text-line">·</span>
          <a
            href="#"
            className="flex items-center gap-1.5 text-muted hover:text-brass text-sm transition-colors"
          >
            <Globe size={15} /> Portfolio
          </a>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-14 text-center">
        <Link
          href="/products"
          className="inline-block bg-brass text-ink px-6 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Browse the catalog
        </Link>
      </div>
    </div>
  );
}
