import Link from 'next/link';
import Image from 'next/image';

export function MarketingFooter() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900 font-sans">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Logo + Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/alpha-logo-white.png"
                alt="Alpha"
                width={130}
                height={36}
                className="h-9 w-auto object-contain"
              />
            </Link>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              People. Connections. Opportunities. Growth.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition" aria-label="LinkedIn">
                in
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition" aria-label="X Twitter">
                𝕏
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition" aria-label="Instagram">
                📸
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition" aria-label="YouTube">
                ▶
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Product</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/product" className="hover:text-white transition">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition">Pricing</Link></li>
              <li><Link href="/solutions" className="hover:text-white transition">Integrations</Link></li>
            </ul>
          </div>

          {/* Solutions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Solutions</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/solutions" className="hover:text-white transition">Individuals</Link></li>
              <li><Link href="/solutions" className="hover:text-white transition">Teams</Link></li>
              <li><Link href="/solutions" className="hover:text-white transition">Businesses</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Resources</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/resources" className="hover:text-white transition">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>© 2026 Alpha SaaS Platform Inc. All rights reserved.</div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Designed for modern professionals worldwide.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
