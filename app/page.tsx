'use client';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section className="hero overflow-hidden">
        <div className="container py-16 md:py-40 flex flex-col md:flex-row items-center gap-12 md:gap-20">
          <div className="hero-content flex-1 text-left">
            <div className="accent-border-left">
              <span className="uppercase-spaced text-xs" style={{ color: 'var(--accent-teal)' }}>Strategisk AI-Analys</span>
              <h1 className="title serif-font mt-6 mb-8">Testa hur snabbt AI kan montera ner din affärsmodell.</h1>
              <p className="subtitle leading-relaxed">
                Analysera din verksamhets exponering mot AI-disruption inspirerad av strategiska analysmodeller från världens ledande strategihus. Gå från sårbarhet till försprång.
              </p>
              <div className="cta flex flex-wrap gap-4 mt-12">
                <Link href="/signup" className="btn-primary" style={{ padding: '1rem 2.5rem' }}>Påbörja Analys</Link>
                <Link href="/methodology" className="btn-outline" style={{ padding: '1rem 2.5rem' }}>Vår Metodik</Link>
              </div>
            </div>
          </div>
          <div className="hero-image flex-1 relative mt-16 md:mt-0 lg:ml-10">
            <div className="image-wrapper relative w-full border border-gray-200 bg-white p-6 md:p-8 shadow-2xl">
              <div className="bg-navy absolute -inset-3 transform translate-x-4 translate-y-4 -z-10"></div>
              
              <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-6">
                <div>
                  <div className="uppercase-spaced text-xs mb-2 font-bold" style={{ color: 'var(--accent-teal)' }}>Exempel</div>
                  <div className="serif-font text-2xl md:text-3xl">AI Disruption Score</div>
                </div>
                <div className="text-right">
                  <div className="serif-font text-3xl md:text-4xl text-navy">67<span className="text-lg md:text-xl text-muted font-sans">/100</span></div>
                </div>
              </div>

              <div className="mb-6 flex items-center gap-3">
                <span className="font-bold uppercase-spaced text-xs tracking-wider text-navy">Risknivå:</span>
                <span className="bg-red-100 text-red-700 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded">Hög</span>
              </div>

              <div className="mb-8">
                <div className="uppercase-spaced text-xs font-bold mb-3 border-b border-gray-100 pb-2 text-navy">Största hot</div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 mt-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
                    </span>
                    <span className="text-sm md:text-base text-gray-800">AI-automatiserad kundsupport</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 mt-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
                    </span>
                    <span className="text-sm md:text-base text-gray-800">AI-driven prissättning</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 mt-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
                    </span>
                    <span className="text-sm md:text-base text-gray-800">AI-baserad produktutveckling</span>
                  </li>
                </ul>
              </div>

              <div>
                <div className="uppercase-spaced text-xs font-bold mb-3 border-b border-gray-100 pb-2 text-navy">Rekommenderade åtgärder</div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-soft flex items-center justify-center text-xs font-bold mt-0.5" style={{ color: 'var(--accent-teal)' }}>1</span>
                    <span className="text-sm md:text-base font-medium text-gray-800">Automatisera support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-soft flex items-center justify-center text-xs font-bold mt-0.5" style={{ color: 'var(--accent-teal)' }}>2</span>
                    <span className="text-sm md:text-base font-medium text-gray-800">Implementera AI-driven analys</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-soft flex items-center justify-center text-xs font-bold mt-0.5" style={{ color: 'var(--accent-teal)' }}>3</span>
                    <span className="text-sm md:text-base font-medium text-gray-800">Utveckla AI-assisterad försäljning</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section - Cleaner alignment */}
      <section className="trust border-y bg-soft py-10">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 text-center">
            <div className="stat-box">
              <div className="serif-font text-4xl md:text-5xl mb-3">500+</div>
              <div className="uppercase-spaced text-xs tracking-widest">Industripunkter</div>
            </div>
            <div className="stat-box border-x-0 md:border-x">
              <div className="serif-font text-4xl md:text-5xl mb-3">0-100</div>
              <div className="uppercase-spaced text-xs tracking-widest">Disruption Index</div>
            </div>
            <div className="stat-box sm:col-span-2 md:col-span-1">
              <div className="serif-font text-4xl md:text-5xl mb-3">100%</div>
              <div className="uppercase-spaced text-xs tracking-widest">Datasekretess</div>
            </div>
          </div>
          <p className="text-center text-muted text-sm mt-8 max-w-2xl mx-auto">
            Baserat på analyser av AI-automation, affärsmodeller och digitalisering i över 500 industriella datapunkter.
          </p>
        </div>
      </section>

      {/* Features - Strategic Grid */}
      <section className="features py-24 md:py-40">
        <div className="container">
          <div className="mb-16 md:mb-20">
            <div className="h-1 w-20 bg-teal mb-8"></div>
            <h2 className="serif-font text-4xl md:text-5xl lg:text-6xl max-w-2xl leading-tight">Ett kraftfullt verktyg för beslutsfattare.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="feat-card card flex flex-col justify-between">
              <div>
                <div className="uppercase-spaced text-xs mb-8" style={{ color: 'var(--accent-teal)' }}>Diagnos</div>
                <h3 className="serif-font text-2xl md:text-3xl mb-6">AI Disruption Score</h3>
                <p className="text-muted leading-relaxed text-sm md:text-base mb-4">Ett precisionsmått på din verksamhets sårbarhet och mognad i AI-eran.</p>
                <ul className="text-muted text-sm md:text-base space-y-2">
                  <li className="flex items-start"><span className="mr-2" style={{ color: 'var(--accent-teal)' }}>•</span> Kvantifierar AI-risk (0–100)</li>
                  <li className="flex items-start"><span className="mr-2" style={{ color: 'var(--accent-teal)' }}>•</span> Benchmark mot andra företag</li>
                  <li className="flex items-start"><span className="mr-2" style={{ color: 'var(--accent-teal)' }}>•</span> Identifierar svagaste punkterna</li>
                </ul>
              </div>
              
              {/* Disruption Index Graph */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-navy uppercase tracking-widest">Index Benchmark</span>
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold">78/100</span>
                </div>
                <div className="relative w-full h-24 flex items-end justify-between gap-[2px]">
                  {[2, 5, 8, 12, 18, 25, 35, 48, 65, 85, 100, 90, 70, 45, 25, 12, 5].map((h, i) => {
                    const isHighRisk = i > 7 && i < 11;
                    const isTarget = i === 10;
                    return (
                      <div key={i} className="w-full bg-gray-50 rounded-t-sm relative group h-full flex items-end">
                        <div 
                          className="w-full rounded-t-sm transition-all duration-500"
                          style={{ 
                            height: `${h}%`,
                            backgroundColor: isHighRisk ? '#ef4444' : 'var(--accent-teal)',
                            opacity: isHighRisk ? 0.8 : 0.3
                          }}
                        ></div>
                        {isTarget && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-600"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="feat-card card bg-navy text-white flex flex-col justify-between shadow-2xl relative z-10">
              <div>
                <div className="uppercase-spaced text-xs mb-8" style={{ color: 'var(--accent-teal)' }}>Simulering</div>
                <h3 className="serif-font text-2xl md:text-3xl mb-6">AI Attack Simulation</h3>
                <p className="opacity-70 leading-relaxed text-sm md:text-base mb-4">Hur skulle en AI-native konkurrent montera ner din nuvarande affärsmodell?</p>
                <ul className="opacity-90 text-sm md:text-base space-y-2">
                  <li className="flex items-start"><span className="mr-2" style={{ color: 'var(--accent-teal)' }}>•</span> Simulerar AI-native konkurrent</li>
                  <li className="flex items-start"><span className="mr-2" style={{ color: 'var(--accent-teal)' }}>•</span> Visar vilka delar som kan automatiseras</li>
                  <li className="flex items-start"><span className="mr-2" style={{ color: 'var(--accent-teal)' }}>•</span> Identifierar nya prispress-scenarier</li>
                </ul>
              </div>
              
              {/* AI Attack Diagram */}
              <div className="mt-8 pt-6 border-t border-white/10 flex-grow flex items-center justify-center">
                <div className="relative w-full h-32">
                  <svg width="100%" height="100%" viewBox="0 0 200 120" fill="none" className="mx-auto overflow-visible">
                    {/* Attack Vectors */}
                    <path d="M 40 20 C 70 20 80 40 90 45" stroke="var(--accent-teal)" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />
                    <path d="M 40 80 C 70 80 80 60 90 55" stroke="var(--accent-teal)" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" />
                    <path d="M 160 50 L 115 50" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" className="animate-pulse" style={{ animationDelay: '500ms' }} />
                    
                    {/* Nodes */}
                    <circle cx="40" cy="20" r="12" fill="rgba(20, 184, 166, 0.1)" stroke="var(--accent-teal)" strokeWidth="1" />
                    <circle cx="40" cy="20" r="3" fill="var(--accent-teal)" />
                    
                    <circle cx="40" cy="80" r="12" fill="rgba(20, 184, 166, 0.1)" stroke="var(--accent-teal)" strokeWidth="1" />
                    <circle cx="40" cy="80" r="3" fill="var(--accent-teal)" />
                    
                    <circle cx="160" cy="50" r="12" fill="rgba(239, 68, 68, 0.1)" stroke="#ef4444" strokeWidth="1" />
                    <circle cx="160" cy="50" r="3" fill="#ef4444" />
                    
                    {/* Core Target */}
                    <rect x="95" y="40" width="20" height="20" rx="3" fill="rgba(255,255,255,0.05)" stroke="white" strokeWidth="1.5" />
                    <circle cx="105" cy="50" r="2" fill="white" className="animate-ping" />
                    
                    {/* Labels */}
                    <text x="40" y="42" fill="var(--accent-teal)" fontSize="8" textAnchor="middle" opacity="0.8">AI-Agent</text>
                    <text x="40" y="102" fill="var(--accent-teal)" fontSize="8" textAnchor="middle" opacity="0.8">AI-Agent</text>
                    <text x="160" y="72" fill="#ff6b6b" fontSize="8" textAnchor="middle" opacity="0.9">Disruption</text>
                  </svg>
                </div>
              </div>
            </div>
            <div className="feat-card card flex flex-col justify-between">
              <div>
                <div className="uppercase-spaced text-xs mb-8" style={{ color: 'var(--accent-teal)' }}>Strategi</div>
                <h3 className="serif-font text-2xl md:text-3xl mb-6">Transformation Roadmap</h3>
                <p className="text-muted leading-relaxed text-sm md:text-base mb-4">En konkret färdplan för att skydda värdet och bygga nya intäktsströmmar.</p>
                <ul className="text-muted text-sm md:text-base space-y-2">
                  <li className="flex items-start"><span className="mr-2" style={{ color: 'var(--accent-teal)' }}>•</span> Prioriterad AI-strategi</li>
                  <li className="flex items-start"><span className="mr-2" style={{ color: 'var(--accent-teal)' }}>•</span> ROI-beräkning</li>
                  <li className="flex items-start"><span className="mr-2" style={{ color: 'var(--accent-teal)' }}>•</span> Implementationsplan</li>
                </ul>
              </div>
              
              {/* Heatmap List */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-bold text-navy uppercase tracking-widest">Heatmap Affärsmodell</span>
                </div>
                <div className="w-full">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-[9px] uppercase tracking-wider text-muted font-bold">
                        <th className="font-bold py-2 font-normal">Funktion</th>
                        <th className="font-bold py-2 text-center font-normal">Risk</th>
                        <th className="font-bold py-2 font-normal">Förklaring</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      {[
                        { label: 'Sälj', risk: 'yellow', text: 'AI kan automatisera prospektering' },
                        { label: 'Support', risk: 'red', text: 'Chatbots kan ersätta stora delar' },
                        { label: 'HR', risk: 'green', text: 'Mindre direkt påverkan' },
                        { label: 'Marknad', risk: 'red', text: 'Generativ AI förändrar innehåll' },
                        { label: 'Ekonomi', risk: 'yellow', text: 'AI kan automatisera analys' },
                      ].map((item, i) => (
                        <tr key={i} className="border-b border-gray-50 last:border-0">
                          <td className="py-2.5 font-medium text-gray-800 w-[25%]">{item.label}</td>
                          <td className="py-2.5 w-[15%] text-center align-middle">
                            <span 
                              style={{
                                display: 'inline-block',
                                width: '10px',
                                height: '10px',
                                minWidth: '10px',
                                minHeight: '10px',
                                borderRadius: '50%',
                                backgroundColor: item.risk === 'red' ? '#ef4444' : item.risk === 'yellow' ? '#f59e0b' : '#34d399',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                              }}
                            ></span>
                          </td>
                          <td className="py-2.5 text-muted w-[60%]">{item.text}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="how-it-works py-20 bg-soft border-t">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="serif-font text-3xl md:text-4xl mb-10 text-center">Hur analysen fungerar</h2>
            <div className="space-y-4">
              {[
                "20 strategiska frågor",
                "AI analyserar affärsmodellen",
                "Disruption Score genereras",
                "AI Attack Simulation",
                "Strategisk roadmap"
              ].map((step, index) => (
                <div key={index} className="flex items-center gap-6 p-5 card bg-white shadow-sm">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-navy text-white flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="text-lg md:text-xl">{step}</div>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center text-lg">
              <span className="font-bold">Tid:</span> 10 minuter
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .title { 
          font-size: clamp(2.5rem, 8vw, 5.5rem); 
          line-height: 1; 
          letter-spacing: -1px; 
        }
        @media (min-width: 768px) {
          .title { letter-spacing: -3px; }
        }
        .subtitle { font-size: 1.125rem; }
        @media (min-width: 768px) {
          .subtitle { font-size: 1.25rem; }
        }
        .subtitle { max-width: 580px; color: var(--text-muted); }
        .image-wrapper { position: relative; max-width: 100%; margin: 0 auto; }
        @media (min-width: 768px) {
          .image-wrapper { max-width: 90%; margin-left: auto; }
        }
        .hero-img { width: 100%; height: auto; display: block; filter: grayscale(10%); }
        .hero-stat-card { width: 220px; }
        @media (min-width: 768px) {
          .hero-stat-card { width: 280px; }
        }
        .bg-teal { background: var(--accent-teal); }
        
        .hero-content {
          animation: fadeInUp 0.8s ease-out;
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
