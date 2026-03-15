'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function TermsPage() {
  return (
    <div className="bg-soft min-height-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-20 md:py-32">
        <div className="max-w-3xl mx-auto bg-white p-10 md:p-20 shadow-sm border border-gray-100">
          <div className="accent-border-left mb-12">
            <span className="uppercase-spaced text-xs block mb-4" style={{ color: 'var(--accent-teal)' }}>Juridisk Information</span>
            <h1 className="serif-font text-4xl md:text-5xl">Användarvillkor</h1>
          </div>
          
          <div className="prose prose-lg">
            <section className="mb-12">
              <h2 className="serif-font text-2xl mb-4">1. Allmänt</h2>
              <p className="text-muted leading-relaxed">
                Genom att använda AI Disruption Scanner (härefter "Tjänsten") godkänner du dessa användarvillkor. Tjänsten tillhandahålls av Olafsson Strategic Group och är avsedd för affärsanalys och strategisk planering.
              </p>
            </section>
            
            <section className="mb-12">
              <h2 className="serif-font text-2xl mb-4">2. Tjänstens Syfte</h2>
              <p className="text-muted leading-relaxed">
                Analysen och resultaten från Tjänsten är baserade på tillgänglig AI-benchmark data och användarens inmatningar. Resultaten ska ses som vägledande beslutsstöd och utgör inte juridisk eller finansiell rådgivning.
              </p>
            </section>
            
            <section className="mb-12">
              <h2 className="serif-font text-2xl mb-4">3. Immateriella Rättigheter</h2>
              <p className="text-muted leading-relaxed">
                Allt innehåll, metodik och algoritmer i Tjänsten tillhör Olafsson Strategic Group. Som användare äger du rätten till dina specifika resultatrapporter för internt bruk inom din organisation.
              </p>
            </section>
            
            <section className="mb-12">
              <h2 className="serif-font text-2xl mb-4">4. Ansvarsbegränsning</h2>
              <p className="text-muted leading-relaxed">
                Olafsson Strategic Group ansvarar inte för direkta eller indirekta skador som kan uppstå till följd av beslut fattade baserat på Tjänstens resultat. Vi strävar efter 100% tillgänglighet men kan inte garantera avbrottsfri drift.
              </p>
            </section>
            
            <section className="mb-12">
              <h2 className="serif-font text-2xl mb-4">5. Ändringar</h2>
              <p className="text-muted leading-relaxed">
                Vi förbehåller oss rätten att uppdatera dessa villkor. Fortsatt användning av Tjänsten efter sådana ändringar innebär ett tyst godkännande av de nya villkoren.
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
      `}</style>
    </div>
  );
}
