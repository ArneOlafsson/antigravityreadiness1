'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function PrivacyPage() {
  return (
    <div className="bg-soft min-height-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-20 md:py-32">
        <div className="max-w-3xl mx-auto bg-white p-10 md:p-20 shadow-sm border border-gray-100">
          <div className="accent-border-left mb-12">
            <span className="uppercase-spaced text-xs block mb-4" style={{ color: 'var(--accent-teal)' }}>Juridisk Information</span>
            <h1 className="serif-font text-4xl md:text-5xl">Sekretesspolicy</h1>
          </div>
          
          <div className="prose prose-lg">
            <section className="mb-12">
              <h2 className="serif-font text-2xl mb-4">1. Inledning</h2>
              <p className="text-muted leading-relaxed">
                Din integritet är av högsta prioritet för Olafsson Strategic Group. Denna policy beskriver hur vi samlar in, använder och skyddar din information när du använder AI Disruption Scanner. Vi följer strikt GDPR och svenska dataskyddslagar.
              </p>
            </section>
            
            <section className="mb-12">
              <h2 className="serif-font text-2xl mb-4">2. Datainsamling</h2>
              <p className="text-muted leading-relaxed">
                Vi samlar endast in information som är absolut nödvändig för att tillhandahålla vår analystjänst:
              </p>
              <ul className="text-muted mt-4 space-y-2">
                <li>• Kontaktuppgifter (namn, e-post, företagsnamn)</li>
                <li>• Verksamhetsdata som matas in under analysen</li>
                <li>• Tekniska loggar för systemsäkerhet</li>
              </ul>
            </section>
            
            <section className="mb-12">
              <h2 className="serif-font text-2xl mb-4">3. Syfte och Lagring</h2>
              <p className="text-muted leading-relaxed">
                Datan används uteslutande för att generera din personliga AI-disruption rapport. Vi säljer aldrig din data till tredje part. All data lagras på säkra servrar inom EU med kryptering både vid överföring och lagring.
              </p>
            </section>
            
            <section className="mb-12">
              <h2 className="serif-font text-2xl mb-4">4. Dina Rättigheter</h2>
              <p className="text-muted leading-relaxed">
                Du har när som helst rätt att begära ett registerutdrag, korrigering eller radering av din data. Kontakta oss på legal@olafsson.com för sådana ärenden.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />

      <style jsx>{`
        .bg-soft { background: #f9f9f9; }
        .min-height-screen { min-height: 100vh; }
        .mx-auto { margin-left: auto; margin-right: auto; }
        .prose p { margin-bottom: 1.5rem; }
        ul { padding-left: 0; list-style: none; }
      `}</style>
    </div>
  );
}
