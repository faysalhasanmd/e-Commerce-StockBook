import Link from "next/link";

export default function Hero() {
  return (
    <section className="border-b border-line mb-20">
      <div className="max-w-6xl mx-auto px-6  grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-12 items-center">
        {/* Left — thesis */}
        <div>
          <p className="catalog-number mb-4">Est. 2026 — Vol. I</p>
          <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] text-paper mb-6">
            Every item,
            <br />
            kept in <span className="text-brass italic">order.</span>
          </h1>
          <p className="text-muted text-lg max-w-md mb-8 leading-relaxed">
            A catalog run like a ledger — each product numbered, priced, and
            accounted for. Browse the collection, add what you need, and check
            out in a few lines.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/products"
              className="bg-brass text-ink px-6 py-3 rounded-full font-mono text-sm hover:opacity-90 transition-opacity"
            >
              Browse the catalog
            </Link>
            <Link
              href="/register"
              className="border border-line px-6 py-3 rounded-full font-mono text-sm text-paper hover:border-brass transition-colors"
            >
              Create an account
            </Link>
          </div>
        </div>

        {/* Right — signature element: a stacked ledger-card motif */}
        <div className="relative hidden md:block h-72">
          <div className="absolute inset-0 rotate-3 bg-panel border border-line rounded-sm shadow-sm" />
          <div className="absolute inset-0 -rotate-2 translate-x-4 bg-panel border border-line rounded-sm shadow-sm" />
          <div className="absolute inset-0 bg-panel border border-brass/30 rounded-sm shadow-md p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="catalog-number">No. 001</span>
              <span className="catalog-number">In stock</span>
            </div>
            <div>
              <p className="font-display text-2xl text-paper mb-1">
                Sample Entry
              </p>
              <p className="text-muted text-sm mb-4">
                Catalog item, ready to ship
              </p>
              <div className="flex justify-between items-center pt-4 border-t border-line">
                <span className="font-mono text-brass text-xl">$49.00</span>
                <span className="text-xs font-mono text-teal">12 left</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
