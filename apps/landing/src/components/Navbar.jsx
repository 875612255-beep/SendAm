import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Menu, X } from 'lucide-react';
import { whatsappUrl } from '@/lib/links.js';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 text-lg font-bold text-primary sm:text-xl"
        >
          <img src="/logo-sent-mark.svg" alt="" className="h-7 w-7 shrink-0" aria-hidden="true" />
          <span>SendAm</span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          <a href="#features" className="text-sm font-medium text-slate-600 transition-colors hover:text-primary">
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-slate-600 transition-colors hover:text-primary">
            How it works
          </a>
          <a href="#faq" className="text-sm font-medium text-slate-600 transition-colors hover:text-primary">
            FAQ
          </a>
          <Link to="/onboarding" className="text-sm font-medium text-slate-600 transition-colors hover:text-primary">
            Onboarding
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={whatsappUrl('create wallet')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-whatsapp focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-whatsapp"
          >
            <MessageCircle size={16} aria-hidden="true" />
            <span className="hidden sm:inline">Open WhatsApp</span>
            <span className="sm:hidden">Start</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu-drawer"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary md:hidden"
          >
            {mobileMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          id="mobile-menu-drawer"
          className="border-b border-slate-100 bg-white px-4 py-4 md:hidden"
        >
          <div className="flex flex-col gap-3">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-primary"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-primary"
            >
              How it works
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-primary"
            >
              FAQ
            </a>
            <Link
              to="/onboarding"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-primary"
            >
              Onboarding Checkpoints
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
