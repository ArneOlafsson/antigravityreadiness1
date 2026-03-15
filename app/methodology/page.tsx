'use client';

import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';

export default function MethodologyPage() {
    const dimensions = [
        {
            id: '01',
            title: 'Strategi',
            description: 'Hur AI omformar er långsiktiga konkurrensfördel. Vi analyserar era nuvarande vallgravar och hur snabbt de kan överbryggas av AI-native aktörer.',
            focus: ['Affärsmodells-validitet', 'Information-asymmetry', 'Strategic moat erosion']
        },
        {
            id: '02',
            title: 'Teknologi',
            description: 'Er arkitekturs förmåga att bära och skala AI-lösningar. Vi utvärderar datakvalitet, API-mognad och er tekniska skuld i förhållande till modern AI-stack.',
            focus: ['Datastruktur & Rening', 'API Architecture', 'Compute readiness']
        },
        {
            id: '03',
            title: 'Organisation',
            description: 'Människors förmåga att anpassa sig och styra nya flöden. Det största hindret för AI-transformation är sällan kod, utan kultur och kompetensgap.',
            focus: ['AI-literacy i ledningen', 'Agila beslutsvägar', 'Talent density']
        },
        {
            id: '04',
            title: 'Processer',
            description: 'Automatiseringspotential och effektivitetsvinster. Vi identifierar var i värdekedjan AI kan radera 80% av de manuella stegen och sänka marginalkostnaden mot noll.',
            focus: ['Workflow automation', 'Unit economics impact', 'Agent-readiness']
        },
        {
            id: '05',
            title: 'Marknad',
            description: 'Hur era kunders förväntningar och konkurrenternas offensiv förändras. Om kunden förväntar sig ett svar på millisekunder, räcker inte en 24-timmars svarstid.',
            focus: ['Customer expectation shift', 'Competitive pricing pressure', 'Product-market fit erosion']
        }
    ];

    return (
        <div className="bg-soft min-h-screen pb-16">
            <Navbar />
            
            <header className="py-12 md:py-20 lg:py-32">
                <div className="container">
                    <div className="max-w-3xl accent-border-left pl-6 md:pl-10">
                        <span className="uppercase-spaced text-xs" style={{ color: 'var(--accent-teal)' }}>Vår Vetenskapliga Grund</span>
                        <h1 className="serif-font text-4xl md:text-5xl lg:text-6xl mt-6 mb-6 leading-tight">Analysmodellen som definierar vinnarna.</h1>
                        <p className="text-base md:text-lg leading-relaxed text-muted">
                            AI Disruption Scanner bygger på en proprietär metodik utvecklad för att ge beslutsfattare en obeveklig spegel av sin verklighet. 
                            Vi mäter inte bara "AI-mognad", vi mäter er förmåga att överleva i en värld där marginalkostnaden för intelligens går mot noll.
                        </p>
                    </div>
                </div>
            </header>

            <section className="py-12 md:py-16 bg-white border-y">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="serif-font text-3xl md:text-4xl mb-6">Disruption Index (0-100)</div>
                            <p className="mb-4 leading-relaxed text-sm">
                                Vår poängsättning är asymmetrisk. En poäng på 70+ indikerar inte bara behov av förändring, utan en omedelbar risk för marknadsförlust. 
                                Vi viktar samman data från era svar med branschspecifik benchmarkdata och 36 unika AI-disruptionsscenarier.
                            </p>
                            <div className="grid grid-cols-2 gap-4 md:gap-6 mt-8">
                                <div className="p-4 bg-soft border">
                                    <div className="serif-font text-xl md:text-2xl mb-1">0-30</div>
                                    <div className="uppercase-spaced text-[0.6rem] opacity-60">Stark Position</div>
                                </div>
                                <div className="p-4 bg-soft border" style={{ borderLeft: '4px solid var(--accent-teal)' }}>
                                    <div className="serif-font text-xl md:text-2xl mb-1">70-100</div>
                                    <div className="uppercase-spaced text-[0.6rem] opacity-60" style={{ color: '#D32F2F' }}>Kritisk Risk</div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-navy text-white shadow-2xl p-8 md:p-12 lg:p-16">
                                <h3 className="serif-font text-2xl mb-4">Varför 5 dimensioner?</h3>
                                <p className="opacity-70 leading-relaxed mb-6 text-sm">
                                    De flesta organisationer misslyckas för att de ser AI som ett teknikprojekt. 
                                    Vår metodik tvingar fram en helhetssyn. Om tekniken är 100/100 men strategin är 20/100, kommer organisationen bara att "göra fel saker snabbare".
                                </p>
                                <div className="h-1 w-16 bg-teal"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24">
                <div className="container">
                    <div className="mb-12 md:mb-20 text-center">
                        <h2 className="serif-font text-3xl md:text-4xl text-navy">De Fem Dimensionerna</h2>
                        <div className="h-1 w-12 bg-teal mx-auto mt-4"></div>
                    </div>
                    <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
                        {dimensions.map((dim) => (
                            <div key={dim.id} className="card bg-white p-8 md:p-10 flex flex-col md:flex-row gap-8 group hover:shadow-xl transition-all duration-500 border-0 shadow-sm">
                                <div className="serif-font text-5xl md:text-6xl opacity-10 leading-none group-hover:opacity-100 group-hover:text-teal transition-all md:w-20">{dim.id}</div>
                                <div className="flex-1">
                                    <h3 className="serif-font text-2xl mb-4">{dim.title}</h3>
                                    <p className="text-muted leading-relaxed mb-6 text-sm md:text-base">{dim.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {dim.focus.map((f) => (
                                            <span key={f} className="tag text-[0.6rem] uppercase-spaced">{f}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 md:py-32 bg-navy text-white text-center">
                <div className="container">
                    <h2 className="serif-font text-4xl md:text-5xl mb-8">Redo att möta spegeln?</h2>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/signup" className="btn-primary w-full sm:w-auto" style={{ padding: '0.8rem 2.5rem' }}>Starta Analys</Link>
                        <Link href="/login" className="btn-outline w-full sm:w-auto" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white', padding: '0.8rem 2.5rem' }}>Logga in</Link>
                    </div>
                </div>
            </section>

            <style jsx>{`
                .bg-teal { background: var(--accent-teal); }
                .text-teal { color: var(--accent-teal); }
                .tag {
                    display: inline-block;
                    background: #f7f9fc;
                    border: 1px solid #e1e4e8;
                    padding: 0.3rem 0.7rem;
                    border-radius: 2px;
                    font-weight: 500;
                }
                .bg-navy { 
                  background-color: var(--primary-navy);
                  background-image: radial-gradient(circle at 20% 30%, rgba(0, 43, 73, 0.8) 0%, transparent 100%);
                }
            `}</style>
            <Footer />
        </div>
    );
}
