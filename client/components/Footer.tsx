import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-panel mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <p className="font-display text-2xl text-paper mb-2">
            E-Commerce<span className="text-brass">.</span>
          </p>
          <p className="text-muted text-sm leading-relaxed">
            A small, well-kept catalog project with Next.js, Express, and
            Prisma.
          </p>
        </div>

        {/* Shop links */}
        <div>
          <p className="catalog-number mb-3">Shop</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/products"
                className="text-muted hover:text-brass transition-colors"
              >
                Catalog
              </Link>
            </li>
            <li>
              <Link
                href="/cart"
                className="text-muted hover:text-brass transition-colors"
              >
                Cart
              </Link>
            </li>
            <li>
              <Link
                href="/orders"
                className="text-muted hover:text-brass transition-colors"
              >
                Orders
              </Link>
            </li>
          </ul>
        </div>

        {/* Account links */}
        <div>
          <p className="catalog-number mb-3">Account</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/login"
                className="text-muted hover:text-brass transition-colors"
              >
                Log in
              </Link>
            </li>
            <li>
              <Link
                href="/register"
                className="text-muted hover:text-brass transition-colors"
              >
                Register
              </Link>
            </li>
            <li>
              <Link
                href="/admin/products"
                className="text-muted hover:text-brass transition-colors"
              >
                Admin panel
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-muted text-xs font-mono">
            © {new Date().getFullYear()} E-Commerce — Project
          </p>
          <p className="text-muted text-xs font-mono">
            Built by Md. Faysal Hasan
          </p>
        </div>
      </div>
    </footer>
  );
}
