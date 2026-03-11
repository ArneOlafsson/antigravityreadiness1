'use client';

import Navbar from '../components/Navbar';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section className="hero overflow-hidden">
        <div className="container py-24 md:py-40 flex flex-col md:flex-row items-center gap-20">
          <div className="hero-content flex-1">
            <div className="accent-border-left">
              <span className="uppercase-spaced text-xs" style={{ color: 'var(--accent-teal)' }}>Strategisk AI-Analys</span>
              <h1 className="title serif-font mt-6 mb-8">Framtidssäkra din strategiska position.</h1>
              <p className="subtitle leading-relaxed">
                Analysera din verksamhets exponering mot AI-disruption med samma metodik som världens ledande strategihus. Gå från sårbarhet till försprång.
              </p>
              <div className="cta flex flex-wrap gap-4 mt-12">
                <Link href="/signup" className="btn-primary" style={{ padding: '1rem 2.5rem' }}>Påbörja Analys</Link>
                <Link href="/methodology" className="btn-outline" style={{ padding: '1rem 2.5rem' }}>Vår Metodik</Link>
              </div>
            </div>
          </div>
          <div className="hero-image flex-1 relative hidden md:block">
            <div className="image-wrapper relative">
              <div className="bg-navy absolute -inset-4 transform translate-x-4 translate-y-4 -z-10"></div>
              <img src="/images/hero.png" alt="SaaS Hero" className="hero-img border-0" />
              <div className="glass shadow-2xl absolute -bottom-10 -left-10 p-8 border" style={{ width: '280px' }}>
                <div className="uppercase-spaced text-xs mb-2" style={{ color: 'var(--accent-teal)' }}>Global Benchmark Data</div>
                <div className="serif-font text-2xl">Index 2025</div>
                <div className="h-1 w-12 bg-navy mt-4"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section - Cleaner alignment */}
      <section className="trust border-y bg-soft py-10">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="stat-box">
              <div className="serif-font text-5xl mb-3">500+</div>
              <div className="uppercase-spaced text-xs tracking-widest">Industripunkter</div>
            </div>
            <div className="stat-box border-x-0 md:border-x">
              <div className="serif-font text-5xl mb-3">0-100</div>
              <div className="uppercase-spaced text-xs tracking-widest">Disruption Index</div>
            </div>
            <div className="stat-box">
              <div className="serif-font text-5xl mb-3">100%</div>
              <div className="uppercase-spaced text-xs tracking-widest">Datasekretess</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Strategic Grid */}
      <section className="features py-40">
        <div className="container">
          <div className="mb-20">
            <div className="h-1 w-20 bg-teal mb-8"></div>
            <h2 className="serif-font text-5xl lg:text-6xl max-w-2xl leading-tight">Ett kraftfullt verktyg för beslutsfattare.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="feat-card card flex flex-col justify-between">
              <div>
                <div className="uppercase-spaced text-xs mb-8" style={{ color: 'var(--accent-teal)' }}>Diagnos</div>
                <h3 className="serif-font text-3xl mb-6">AI Disruption Score</h3>
                <p className="text-muted leading-relaxed">Ett precisionsmått på din verksamhets sårbarhet och mognad i AI-eran.</p>
              </div>
            </div>
            <div className="feat-card card bg-navy text-white flex flex-col justify-between shadow-2xl relative z-10">
              <div>
                <div className="uppercase-spaced text-xs mb-8" style={{ color: 'var(--accent-teal)' }}>Simulering</div>
                <h3 className="serif-font text-3xl mb-6">AI Attack Simulation</h3>
                <p className="opacity-70 leading-relaxed">Hur skulle en AI-native konkurrent montera ner din nuvarande affärsmodell?</p>
              </div>
            </div>
            <div className="feat-card card flex flex-col justify-between">
              <div>
                <div className="uppercase-spaced text-xs mb-8" style={{ color: 'var(--accent-teal)' }}>Strategi</div>
                <h3 className="serif-font text-3xl mb-6">Transformation Roadmap</h3>
                <p className="text-muted leading-relaxed">En konkret färdplan för att skydda värdet och bygga nya intäktsströmmar.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer py-24 bg-navy text-white">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 border-b border-gray-800 pb-16 mb-12">
            <div className="serif-font text-3xl tracking-tighter">AI DISRUPTION SCANNER</div>
            <nav className="flex gap-12">
              <Link href="#" className="uppercase-spaced text-xs hover:text-teal transition-colors">Sekretess</Link>
              <Link href="#" className="uppercase-spaced text-xs hover:text-teal transition-colors">Villkor</Link>
              <Link href="#" className="uppercase-spaced text-xs hover:text-teal transition-colors">Kontakt</Link>
            </nav>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center opacity-50">
            <div className="uppercase-spaced text-[0.6rem] tracking-[0.2em]">© 2025 Olafsson Strategic Group — All Rights Reserved</div>
            <div className="uppercase-spaced text-[0.6rem] tracking-[0.2em]">Crafted for Executives</div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .title { font-size: clamp(3rem, 8vw, 5.5rem); line-height: 0.95; letter-spacing: -3px; }
        .subtitle { font-size: 1.25rem; max-width: 580px; color: var(--text-muted); }
        .grid { display: grid; }
        .image-wrapper { position: relative; max-width: 90%; margin-left: auto; }
        .hero-img { width: 100%; height: auto; display: block; filter: grayscale(10%); }
        .bg-teal { background: var(--accent-teal); }
        
        @media (max-width: 768px) {
          .title { letter-spacing: -1px; }
          .hero-content { text-align: left; }
        }
      `}</style>
    </div>
  );
}
