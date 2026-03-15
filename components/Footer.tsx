'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer py-24 bg-navy text-white">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 border-b border-gray-800 pb-16 mb-12">
          <div className="serif-font text-2xl md:text-3xl tracking-tighter text-center md:text-left">AI DISRUPTION SCANNER</div>
          <nav className="flex flex-wrap justify-center gap-6 md:gap-12">
            <Link href="/privacy" className="uppercase-spaced text-xs hover:text-teal transition-colors">Sekretess</Link>
            <Link href="/terms" className="uppercase-spaced text-xs hover:text-teal transition-colors">Villkor</Link>
            <Link href="mailto:arne@olafsson.se?subject=AI%20Disruption%20Scanner%202026" className="uppercase-spaced text-xs hover:text-teal transition-colors">Kontakt</Link>
          </nav>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center opacity-50">
          <div className="uppercase-spaced text-[0.6rem] tracking-[0.1em] md:tracking-[0.2em]">© 2025 Olafsson Strategic Group — All Rights Reserved</div>
          <div className="uppercase-spaced text-[0.6rem] tracking-[0.1em] md:tracking-[0.2em]">Crafted for Executives</div>
        </div>
      </div>
      <style jsx>{`
        .bg-navy { background: var(--primary-navy); }
        .hover\:text-teal:hover { color: var(--accent-teal); }
        .transition-colors { transition: color 0.2s ease; }
      `}</style>
    </footer>
  );
}
