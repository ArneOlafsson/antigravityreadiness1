'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import Link from 'next/link'; // Added Link import
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';

export default function Dashboard() {
    const [data, setData] = useState<any>(null);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    // Removed: const [showPremiumPlan, setShowPremiumPlan] = useState(false);

    useEffect(() => {
        let unsubscribeProfile: () => void = () => {};

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Fetch assessment
                const assessmentRef = doc(db, 'assessments', user.uid);
                const assessmentSnap = await getDoc(assessmentRef);
                
                // Fetch profile in real-time
                const profileRef = doc(db, 'users', user.uid);
                unsubscribeProfile = onSnapshot(profileRef, (profileSnap) => {
                    if (profileSnap.exists()) {
                        setUserProfile(profileSnap.data());
                    }
                });

                if (assessmentSnap.exists()) {
                    const parsed = assessmentSnap.data();
                    const chartCategories = parsed.categories.map((cat: any) => {
                        const nameMap: Record<string, string> = {
                            'AFFÄRSMODELLENS EXPONERING': 'Affärsmodell',
                            'AUTOMATISERINGSRISK I PROCESSER': 'Processer',
                            'DATA & DIGITALISERING': 'Data/Digital',
                            'KONKURRENSTRYCK': 'Konkurrens',
                            'ORGANISATORISK ANPASSNINGSFÖRMÅGA': 'Anpassning'
                        };
                        return { ...cat, name: nameMap[cat.name] || cat.name };
                    });
                    setData({ ...parsed, categories: chartCategories });
                } else {
                    // Default fallback if no assessment found
                    setData({
                        score: 0,
                        categories: [],
                        timestamp: new Date().toISOString()
                    });
                }
                setLoading(false);
            } else {
                window.location.href = '/login';
            }
        });
        return () => {
            unsubscribe();
            unsubscribeProfile();
        };
    }, []);

    if (loading || !data) {
        return (
            <div className="bg-navy min-h-100 flex items-center justify-center text-white">
                <div className="text-center">
                    <div className="loader mb-8 mx-auto"></div>
                    <h1 className="serif-font text-3xl">Hämtar Insikter...</h1>
                    <style jsx>{`
                        .bg-navy { background: var(--primary-navy); min-height: 100vh; }
                        .loader { width: 60px; height: 1px; background: rgba(255,255,255,0.2); position: relative; overflow: hidden; }
                        .loader::after { content: ''; position: absolute; left: -100%; width: 100%; height: 100%; background: var(--accent-teal); animation: slide 2s infinite; }
                        @keyframes slide { to { left: 100%; } }
                    `}</style>
                </div>
            </div>
        );
    }

    const getRiskLabel = (s: number) => {
        if (s < 20) return 'Låg Risk';
        if (s < 40) return 'Moderat Risk';
        if (s < 60) return 'Signifikant Risk';
        return 'Kritisk Exponering';
    };

    const getCategoryDescription = (name: string, score: number) => {
        const descriptions: Record<string, { high: string, low: string }> = {
            'Affärsmodell': {
                high: "AI börjar ifrågasätta hur ni tjänar pengar. Det finns en risk att era nuvarande marginaler börjar ätas upp av nya prismodeller och hög automation.",
                low: "Er affärsmodell har naturliga defensiva egenskaper mot AI-driven priserosion just nu."
            },
            'Processer': {
                high: "Era interna flöden är personalintensiva. En konkurrent med AI-native processer kan leverera snabbare och med betydligt lägre overhead.",
                low: "Ni har redan börjat optimera era processer, vilket ger er ett operativt försprång i omställningen."
            },
            'Data/Digital': {
                high: "Bristande datakvalitet hindrar er från att bygga egna AI-försvar. Detta kan bli er mest sårbara länk i strategin.",
                low: "Er digitala mognad är hög. Detta är din viktigaste tillgång – en 'sköld' som vi kan bygga vidare på."
            },
            'Konkurrens': {
                high: "Branschen utsätts för ett hårt tryck från nya aktörer. Din marknadsposition utmanas aggressivt av AI-användning.",
                low: "Konkurrensen i ditt segment har ännu inte börjat utnyttja AI fullt ut, vilket ger er ett värdefullt tidsfönster."
            },
            'Anpassning': {
                high: "Organisatorisk tröghet riskerar att sakta ner er. AI kräver en snabbare beslutscykel än vad ni har idag.",
                low: "Ni har en agil kultur som gör att ni kan pivotera snabbt när teknologin skapar nya möjligheter."
            }
        };

        const desc = descriptions[name] || { high: "Hög strategisk exponering.", low: "God motståndskraft." };
        return score > 50 ? desc.high : desc.low;
    };

    const handlePrint = () => {
        if (typeof window !== 'undefined') {
            window.print();
        }
    };

    const industryScenarios: Record<string, string> = {
        'Finans': "En AI-native utmanare använder autonoma agenter för hyper-personalisering, vilket kan sänka era priser med 40% och eliminera behovet av traditionella handläggare.",
        'Tillverkning': "Generativ design-disruption gör att konkurrenter kan producera komponenter 40% lättare och billigare, vilket gör nuvarande patent utdaterade inom 18 månader.",
        'Tjänsteproduktion': "Agentiska projektteam ersätter juniora resurser med 80% färre anställda, vilket gör nuvarande debiterbara modeller ohållbara.",
        'default': "En AI-native utmanare automatiserar kundanskaffning och drift helt, vilket pressar marknadens marginaler kraftigt."
    };

    const currentScenario = industryScenarios[userProfile?.industry] || industryScenarios['default'];

    return (
        <div className="bg-soft main-wrapper">
            <Navbar />

            {/* PRINT ONLY: COVER PAGE */}
            <div className="print-only print-page">
                <div className="flex flex-col justify-between p-12 lg:p-20 bg-navy text-white relative print-full-page">
                    <div className="absolute inset-0 z-0 opacity-10">
                        {/* High-end accent */}
                        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal opacity-20 rounded-full -mr-96 -mt-96 blur-3xl"></div>
                    </div>
                    
                    <div className="relative z-10 mt-10">
                        <div className="uppercase-spaced tracking-[0.5em] text-xs opacity-70 mb-20">Confidential — Strategic Intelligence</div>
                        <div className="mt-10">
                            <div className="serif-font text-6xl lg:text-8xl mb-4 leading-tight">AI Readiness</div>
                            <div className="serif-font text-4xl lg:text-5xl italic opacity-50 ml-2">2026 Strategy Report</div>
                            <div className="h-1 w-32 bg-teal mt-12" style={{ backgroundColor: 'var(--accent-teal)' }}></div>
                        </div>
                    </div>

                    <div className="relative z-10 flex justify-between items-end mt-20 border-t border-white/20 pt-8">
                        <div className="text-left">
                            <div className="text-xs uppercase-spaced opacity-60 mb-2">Prepared For</div>
                            <div className="text-3xl lg:text-4xl font-bold serif-font text-white">{userProfile?.companyName || 'Organisationen'}</div>
                        </div>
                        <div className="text-right text-[0.6rem] uppercase-spaced opacity-60 leading-loose">
                            AI Disruption Scanner — Strategy Team<br />
                            Generated: {new Date().toLocaleDateString('sv-SE')}<br />
                            Analytical Lead: Olafsson AI
                        </div>
                    </div>
                </div>
            </div>

            {/* PRINT ONLY: EXECUTIVE SUMMARY */}
            <div className="print-only print-page bg-white">
                <div className="flex flex-col p-12 lg:p-20 print-full-page">
                <div className="flex justify-between items-start mb-20">
                    <h2 className="serif-font text-6xl accent-border-left pl-10">Exekutiv Sammanfattning</h2>
                    <div className="text-right">
                        <span className="text-[0.6rem] uppercase-spaced opacity-60">Sida 2 av 5</span>
                        <div className="h-0.5 w-12 bg-navy ml-auto mt-2"></div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-20 text-sm leading-relaxed">
                    <div className="pr-12">
                        <p className="mb-10 text-2xl serif-font italic opacity-90 leading-snug">"Den största risken med AI är inte teknologiskt eftersläp – det är en otillräcklig strategisk fantasi."</p>
                        <p className="mb-8 leading-loose text-lg">Efter en grundlig analys av <strong>{userProfile?.companyName}</strong> har vi fastställt ett AI Disruption Score på <strong>{data.score}/100</strong>.</p>
                        <p className="leading-loose opacity-80">Rapporten belyser en kritisk brytpunkt. De närmaste sex månaderna kräver en offensiv omställning för att säkra marknadspositionen mot en ny generation AI-native konkurrenter som opererar med bråkdelen av era nuvarande marginalkostnader.</p>
                    </div>
                    <div className="p-16 bg-soft border-l-[12px] border-navy">
                        <h4 className="font-bold mb-10 uppercase-spaced text-xs">Strategiska Slutsatser</h4>
                        <ul className="space-y-8 text-md font-medium">
                            <li className="flex gap-4">
                                <span className="text-teal font-bold" style={{ color: 'var(--accent-teal)' }}>[!]</span>
                                <span>Operationella marginaler under direkt hot.</span>
                            </li>
                            <li className="flex gap-4">
                                <span className="text-teal font-bold" style={{ color: 'var(--accent-teal)' }}>[!]</span>
                                <span>30-40% automationspotential identifierad i kärnprocesser.</span>
                            </li>
                            <li className="flex gap-4">
                                <span className="text-teal font-bold" style={{ color: 'var(--accent-teal)' }}>[!]</span>
                                <span>Kulturellt gap: Behov av omedelbar upskilling av nyckelpersonal.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            </div>

            <div className="container py-20 print:py-0 relative z-10">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 accent-border-left">
                    <div>
                        <div className="uppercase-spaced mb-2" style={{ color: 'var(--accent-teal)' }}>Exekutiv Analys</div>
                        <h1 className="serif-font text-4xl md:text-5xl">Dashboard: {userProfile?.companyName || 'Din Organisation'}</h1>
                        <p className="text-muted mt-2">Strategisk AI-bedömning utförd {new Date(data.lastUpdated || Date.now()).toLocaleDateString('sv-SE')}</p>
                    </div>
                    <div className="text-right print-only mb-2">
                        <span className="text-[0.6rem] uppercase-spaced opacity-60">Sida 3 av 5</span>
                        <div className="h-0.5 w-12 bg-navy ml-auto mt-2"></div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 mt-8 md:mt-0 no-print w-full md:w-auto">
                        <button className="btn-primary text-center" style={{ padding: '0.8rem 1.5rem', fontSize: '0.7rem' }} onClick={() => window.location.href = '/assessment'}>Uppdatera Data</button>
                    </div>
                </header>

                <div className="main-grid">
                    <div className="content-column flex flex-col gap-12">

                        {/* Main Score Section */}
                        <div className="card hero-score flex flex-col sm:flex-row items-center justify-between bg-navy text-white gap-8">
                            <div className="flex-1 text-center sm:text-left">
                                <div className="uppercase-spaced mb-4" style={{ color: 'var(--accent-teal)' }}>AI Disruption Score</div>
                                <h2 className="serif-font text-3xl md:text-4xl mb-4" style={{ color: 'white' }}>{getRiskLabel(data.score)}</h2>
                                <p style={{ opacity: 0.7, maxWidth: '400px' }}>Indikerar en hög sårbarhet för marknadsstörningar drivna av AI-native aktörer.</p>
                            </div>
                            <div className="score-display">
                                <div className="serif-font text-7xl md:text-8xl" style={{ color: 'var(--accent-teal)' }}>{data.score}</div>
                                <div className="uppercase-spaced text-right">/ 100</div>
                            </div>
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 print-chart-grid">
                            <div className="card bg-white p-6 md:p-8 flex flex-col items-center">
                                <h3 className="serif-font text-2xl mb-8">Riskprofil per Kategori</h3>
                                <div className="chart-container">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="60%" data={data.categories} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                                            <PolarGrid stroke="#eee" />
                                            <PolarAngleAxis dataKey="name" tick={{ fontSize: 9, fill: '#002B49', fontWeight: 700 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                            <Radar name="Scoring" dataKey="score" stroke="var(--accent-teal)" fill="var(--accent-teal)" fillOpacity={0.2} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="card bg-white p-6 md:p-8">
                                <h3 className="serif-font text-2xl mb-8">Branschbenchmark</h3>
                                <div className="chart-container">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={[
                                            { name: userProfile?.companyName?.split(' ')[0] || 'Din Org', score: data.score },
                                            { name: 'Branschsnitt', score: 52 },
                                            { name: 'Topp 10%', score: 31 },
                                        ]} layout="vertical" margin={{ left: 20 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                                            <XAxis type="number" domain={[0, 100]} hide />
                                            <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10, fontWeight: 700, fill: '#002B49' }} />
                                            <Tooltip />
                                            <Bar dataKey="score" fill="var(--primary-navy)" radius={0} barSize={25} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Analysis Section */}
                        <div className="card bg-white page-break-after p-6 md:p-12">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                                <h3 className="serif-font text-2xl accent-border-left pl-6">Strategisk Analys av Riskprofil</h3>
                                <p className="text-muted" style={{ fontSize: '0.65rem' }}>
                                    AI-mognad baserat på fem kritiska dimensioner.
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12 items-start">
                                <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                                    {data.categories.map((cat: any) => (
                                        <div key={cat.name} className="analysis-item pb-4 border-b border-gray-50">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="serif-font text-lg">{cat.name}</h4>
                                                <span className="uppercase-spaced" style={{ 
                                                    fontSize: '0.55rem',
                                                    color: cat.score > 70 ? '#D32F2F' : cat.score > 40 ? '#F57C00' : 'var(--accent-teal)',
                                                    fontWeight: 700,
                                                    background: cat.score > 70 ? 'rgba(211,47,47,0.05)' : 'transparent',
                                                    padding: '1px 4px'
                                                }}>
                                                    {cat.score > 70 ? 'KRITISK' : cat.score > 40 ? 'MODERAT' : 'STYRKA'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted leading-relaxed">
                                                {getCategoryDescription(cat.name, cat.score)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="analysis-summary bg-soft p-8 flex flex-col justify-center border-left relative summary-pointer min-h-full">
                                    <h4 className="uppercase-spaced text-xs mb-4" style={{ color: 'var(--accent-teal)' }}>Sammanfattning</h4>
                                    <p className="serif-font text-xl mb-6 text-navy leading-snug">
                                        "Din riskprofil är asymmetrisk. Du har en teknisk grund som är din 'sköld', men din marknadsposition är under attack."
                                    </p>
                                    <p className="text-xs italic text-gray-500">
                                        Rekommendation: Prioritera {data.categories.reduce((prev: any, current: any) => (prev.score > current.score) ? prev : current).name.toLowerCase()}.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Simulation Teasers (Hidden in full print) */}
                        <div className="card bg-white accent-border-left no-print p-6 md:p-12">
                            <h3 className="serif-font text-2xl mb-6">AI Attack Simulation</h3>
                            <div className="flex flex-col gap-6">
                                <div className="sim-box p-6 md:p-10 bg-soft">
                                    <h4 className="serif-font text-xl mb-4">Sannolik effekt: 40% Automatisering</h4>
                                    <p className="text-muted text-sm md:text-base">En utmanare med 0 i fasta personalkostnader kan erbjuda 80% av era tjänster till 20% av priset inom 18 månader.</p>
                                    <button className="btn-outline mt-8" style={{ fontSize: '0.65rem' }} onClick={() => window.location.href = '/dashboard/simulation'}>Öppna simulering</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="side-column flex flex-col gap-12 no-print">
                        <div className="card bg-navy p-8 md:p-10">
                            <div className="uppercase-spaced mb-2" style={{ color: 'var(--accent-teal)', fontSize: '0.7rem' }}>Strategi</div>
                            <h3 className="serif-font text-2xl mb-8 text-white">Transformation Roadmap</h3>
                            <div className="roadmap-path">
                                <div className="path-item active">
                                    <div className="serif-font text-3xl mb-2 text-white">01</div>
                                    <h5 className="uppercase-spaced mb-2" style={{ color: 'var(--accent-teal)' }}>Awareness</h5>
                                    <p className="text-white opacity-70 text-sm">
                                        {data.score > 60 
                                            ? `Kritisk prioritet: Utbilda styrelsen om er sårbarhet (${data.score}/100) för att säkra mandat.`
                                            : `Strategisk briefing: Genomgång av resultat för ledningsgruppen.`}
                                    </p>
                                </div>
                                <div className="path-item mt-8 active">
                                    <div className="serif-font text-3xl mb-2 text-white">02</div>
                                    <h5 className="uppercase-spaced mb-2 text-white">Hämta Hem "Low Hanging Fruit"</h5>
                                    <p className="text-white opacity-90 text-sm">
                                        Pilotprojekt inom {data.categories.find((c: any) => c.score < 40)?.name || 'interna processer'} för att bevisa AI-värde snabbt.
                                    </p>
                                </div>
                                <div className="path-item mt-8 opacity-40">
                                    <div className="serif-font text-3xl mb-2 text-white">03</div>
                                    <h5 className="uppercase-spaced mb-2 text-white">Offensiv Skalning</h5>
                                    <p className="text-white text-sm">
                                        Omstrukturering av {data.categories.reduce((p: any, c: any) => p.score > c.score ? p : c).name} för att sänka marginalkostnaden mot noll.
                                    </p>
                                </div>
                            </div>
                            {userProfile?.isPro ? (
                                <Link 
                                    href="/dashboard/roadmap"
                                    className="btn-primary w-full mt-12 text-center" 
                                    style={{ fontSize: '0.65rem', display: 'block', background: 'var(--accent-teal)', color: 'var(--primary-navy)' }}
                                >
                                    Visa Fullständig Handlingsplan
                                </Link>
                            ) : (
                                <Link 
                                    href={`https://buy.stripe.com/aFacMYgnofMI62P0Ix93y00${auth.currentUser?.uid ? `?client_reference_id=${auth.currentUser.uid}` : ''}`}
                                    className="btn-outline w-full mt-12 text-center" 
                                    style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.65rem', display: 'block' }}
                                >
                                    Köp Fullständig Handlingsplan
                                </Link>
                            )}
                        </div>

                        <div className="card bg-white border p-8">
                            <h3 className="serif-font text-2xl mb-8">AI Defense Strategy</h3>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between text-xs font-bold mb-1">
                                        <span>Skyddsnivå</span>
                                        <span>{100 - data.score}%</span>
                                    </div>
                                    <div style={{ height: '4px', background: '#eee', borderRadius: '2px' }}>
                                        <div style={{ height: '100%', width: `${100 - data.score}%`, background: 'var(--accent-teal)', borderRadius: '2px' }}></div>
                                    </div>
                                </div>
                                <ul className="flex flex-col gap-5 mt-2">
                                    <li className="flex items-center gap-3 text-sm"><span style={{ color: 'var(--accent-teal)' }}>✓</span> Etablera AI-policy</li>
                                    <li className="flex items-center gap-3 text-sm"><span style={{ color: 'var(--accent-teal)' }}>✓</span> Inventera skugg-AI</li>
                                    <li className="flex items-center gap-3 text-sm text-muted"><span style={{ color: '#ccc' }}>○</span> Syntetisk dataträning</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PRINT ONLY: PAGE 4 & 5 (STRATEGIC IMPLEMENTATION & TRANSFORMATION) */}
            <div className="print-only">
                {/* PAGE 4: STRATEGISK IMPLEMENTATION */}
                <div className="print-page bg-white">
                    <div className="flex flex-col p-12 lg:p-20 relative print-full-page">
                        {/* ... existing print code ... */}
                        <div className="flex justify-between items-start mb-16">
                            <h2 className="serif-font text-5xl accent-border-left pl-10">Strategisk Implementation</h2>
                            <div className="text-right">
                                <span className="text-[0.6rem] uppercase-spaced opacity-60">Sida 4 av 5</span>
                                <div className="h-0.5 w-12 bg-navy ml-auto mt-2"></div>
                            </div>
                        </div>
                        
                        <div className="relative pl-12 lg:pl-24 flex-grow">
                            <div className="absolute left-[3.5rem] top-0 bottom-10 w-[1px] bg-navy opacity-10 hidden lg:block"></div>
                            <div className="space-y-20">
                                <div className="relative">
                                    <div className="hidden lg:flex absolute -left-[5.5rem] top-0 bg-navy text-white w-16 h-16 items-center justify-center font-bold text-xl rounded-full shadow-lg border-4 border-white">Q1</div>
                                    <div className="bg-soft p-8 lg:p-12 border-l-4 border-navy relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] rotate-12">
                                            <div className="serif-font text-6xl">FOUNDATION</div>
                                        </div>
                                        <h3 className="serif-font text-2xl mb-6 flex items-center gap-4"><span className="lg:hidden bg-navy text-white w-8 h-8 flex items-center justify-center rounded-full text-xs">Q1</span>Fas 1: Defensiv Säkring & Governance</h3>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
                                            <div className="p-6 lg:p-8 bg-white border shadow-sm">
                                                <div className="text-[0.55rem] uppercase-spaced text-teal mb-3 font-bold" style={{ color: 'var(--accent-teal)' }}>Teknisk Säkring</div>
                                                <h5 className="font-bold text-sm mb-3">"LLM-Guardrails"</h5>
                                                <p className="text-[0.7rem] opacity-70 leading-relaxed">Etablering av säkra API-gateways för att förhindra att känslig bolagsdata läcker till publika AI-träningsset.</p>
                                            </div>
                                            <div className="p-6 lg:p-8 bg-white border shadow-sm">
                                                <div className="text-[0.55rem] uppercase-spaced text-teal mb-3 font-bold" style={{ color: 'var(--accent-teal)' }}>Ledningsmandat</div>
                                                <h5 className="font-bold text-sm mb-3">Risk-stress-test</h5>
                                                <p className="text-[0.7rem] opacity-70 leading-relaxed">Kvantifiering av rörliga kostnader som kan automatiseras för att frigöra budget till offensiv AI-utveckling.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="hidden lg:flex absolute -left-[5.5rem] top-0 bg-teal text-navy w-16 h-16 items-center justify-center font-bold text-xl rounded-full shadow-lg border-4 border-white" style={{ backgroundColor: 'var(--accent-teal)' }}>Q2</div>
                                    <div className="bg-white p-8 lg:p-12 border-l-4 border-teal shadow-xl relative overflow-hidden" style={{ borderColor: 'var(--accent-teal)' }}>
                                        <div className="absolute top-0 right-0 p-4 opacity-[0.05] -rotate-12">
                                            <div className="serif-font text-6xl">GROWTH</div>
                                        </div>
                                        <h3 className="serif-font text-2xl mb-6 flex items-center gap-4"><span className="lg:hidden bg-teal text-white w-8 h-8 flex items-center justify-center rounded-full text-xs" style={{ backgroundColor: 'var(--accent-teal)' }}>Q2</span>Fas 2: Operationell Acceleration</h3>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
                                            <div className="p-6 lg:p-8 bg-soft border">
                                                <div className="text-[0.55rem] uppercase-spaced text-navy mb-3 font-bold">Automation</div>
                                                <h5 className="font-bold text-sm mb-3">Agentiska Arbetsflöden</h5>
                                                <p className="text-[0.7rem] opacity-70 leading-relaxed">Implementering av autonoma agenter för repetitiv datahantering. Mål: 30% högre genomströmning.</p>
                                            </div>
                                            <div className="p-6 lg:p-8 bg-soft border">
                                                <div className="text-[0.55rem] uppercase-spaced text-navy mb-3 font-bold">Data Asset</div>
                                                <h5 className="font-bold text-sm mb-3">Syntetisk Datastruktur</h5>
                                                <p className="text-[0.7rem] opacity-70 leading-relaxed">Strukturering av kundhistorik till en 'AI-ready' vektor-databas för att möjliggöra hyper-personalisering.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-navy/5 flex justify-between items-end shrink-0">
                            <div className="text-[0.55rem] uppercase-spaced opacity-40">Property of {userProfile?.companyName} — Confidential</div>
                            <div className="flex gap-4">
                                <div className="w-24 h-8 bg-soft border border-dashed flex items-center justify-center text-[0.4rem] opacity-30 italic">Signatur Analys</div>
                                <div className="w-24 h-8 bg-soft border border-dashed flex items-center justify-center text-[0.4rem] opacity-30 italic">Signatur Ledning</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PAGE 5: TRANSFORMATION & GAP-ANALYS */}
                <div className="print-page bg-white">
                    <div className="flex flex-col p-12 lg:p-20 relative overflow-hidden print-full-page">
                        <div className="flex justify-between items-start mb-12 shrink-0">
                            <h2 className="serif-font text-5xl accent-border-left pl-10">Transformation & Gap-analys</h2>
                            <div className="text-right">
                                <span className="text-[0.6rem] uppercase-spaced opacity-60">Sida 5 av 5</span>
                                <div className="h-0.5 w-12 bg-navy ml-auto mt-2"></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-12 flex-grow">
                            <div className="p-10 lg:p-14 bg-navy text-white relative flex flex-col justify-center">
                                <div className="absolute top-0 right-0 p-10 opacity-10">
                                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07L19.07 4.93"/></svg>
                                </div>
                                <h5 className="uppercase-spaced text-[0.65rem] mb-6 text-teal" style={{ color: 'var(--accent-teal)' }}>Strategisk Pivot: 2026-H2</h5>
                                <h3 className="serif-font text-5xl mb-8 leading-tight">"Från resurs-intensiv <br/>till insikts-driven."</h3>
                                <p className="opacity-70 text-lg leading-relaxed mb-10 max-w-2xl">I andra halvåret skiftas fokus från defensiv effektivisering till offensiv innovation. Genom att bygga på de data-grundvalar som lagts under Q1/Q2 kan <strong>{userProfile?.companyName}</strong> börja erbjuda tjänster med nära noll i marginalkostnad.</p>
                                
                                <div className="flex justify-between items-end border-t border-white/10 pt-10">
                                    <div className="flex gap-16">
                                        <div>
                                            <div className="text-[0.6rem] uppercase-spaced opacity-40 mb-2">Målnivå Readiness</div>
                                            <div className="text-4xl font-bold text-teal" style={{ color: 'var(--accent-teal)' }}>{Math.min(95, data.score + 25)}%</div>
                                        </div>
                                        <div>
                                            <div className="text-[0.6rem] uppercase-spaced opacity-40 mb-2">Relativ Marknadsposition</div>
                                            <div className="text-4xl font-bold text-white">TOP 5%</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[0.6rem] uppercase-spaced opacity-40 mb-2">Analytisk Status</div>
                                        <div className="text-sm font-bold bg-teal text-navy px-4 py-1" style={{ backgroundColor: 'var(--accent-teal)' }}>OFFENSIV</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-12">
                                <div className="p-12 border bg-soft flex flex-col">
                                    <h4 className="serif-font text-xl mb-10 uppercase-spaced border-b pb-4">Avdelningsspecifik Analys</h4>
                                    <div className="space-y-10 flex-grow">
                                        {[
                                            { name: 'Marknad & Sälj', status: 'KRITISK', gap: 85 },
                                            { name: 'IT & Operation', status: 'MODERAT', gap: 45 },
                                            { name: 'Ledning & HR', status: 'MODERAT', gap: 60 }
                                        ].map((d, i) => (
                                            <div key={i}>
                                                <div className="flex justify-between text-[0.65rem] mb-3 font-bold uppercase-spaced">
                                                    <span className="text-navy">{d.name}</span>
                                                    <span style={{ color: d.status === 'KRITISK' ? '#D32F2F' : 'inherit' }}>{d.status} GAP</span>
                                                </div>
                                                <div className="h-1.5 bg-white border w-full overflow-hidden">
                                                    <div className="h-full bg-navy" style={{ width: `${d.gap}%` }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="mt-8 text-[0.6rem] italic opacity-50">Gap-analysen baseras på nuvarande resursallokering kontra AI-native benchmark.</p>
                                </div>
                                <div className="p-12 border bg-white shadow-sm flex flex-col justify-between">
                                    <div>
                                        <h4 className="serif-font text-xl mb-10 uppercase-spaced border-b pb-4">Simulerat Attack-utfall</h4>
                                        <div className="mb-8">
                                            <p className="text-[0.8rem] text-navy font-bold leading-relaxed mb-4">Branschspecifik insikt ({userProfile?.industry || 'Allmän'}):</p>
                                            <p className="text-[0.75rem] opacity-80 leading-relaxed italic border-l-2 border-teal pl-6" style={{ borderColor: 'var(--accent-teal)' }}>
                                                "{currentScenario}"
                                            </p>
                                        </div>
                                        <p className="text-[0.7rem] opacity-70 leading-relaxed">Simuleringen bekräftar att er främsta sårbarhet ligger i prispress. Utmanare kan operera med <strong>60-70% lägre overhead</strong>. Att bibehålla nuvarande operativa struktur innebär en hög risk för marginal-erosion.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-6 border-t border-navy/5 flex justify-between items-center shrink-0">
                            <div className="text-[0.55rem] uppercase-spaced opacity-30 italic">Strategy Document Ref: {Math.random().toString(36).substring(7).toUpperCase()}</div>
                            <div className="serif-font text-sm opacity-60">Olafsson AI Strategic Advisory</div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .bg-soft { background: #fafafa; }
        .main-wrapper { min-height: 100vh; }
        .bg-navy { background: var(--primary-navy); }
        .grid { display: grid; }
        .main-grid { display: grid; grid-template-columns: 1fr; gap: 3rem; }
        
        @media (min-width: 1024px) {
          .main-grid { grid-template-columns: 2fr 1fr; }
        }
        
        .score-display { text-align: right; }
        .path-item { position: relative; padding-bottom: 2rem; }
        .path-item::after { content: ''; position: absolute; left: 0; bottom: 0; width: 40px; height: 1px; background: rgba(255,255,255,0.2); }
        
        .summary-pointer::before {
          content: "";
          position: absolute;
          left: -12px;
          top: 40px;
          width: 0;
          height: 0;
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
          border-right: 12px solid #f7f7f7;
          z-index: 1;
        }

        @media (max-width: 1279px) {
          .summary-pointer::before { display: none; }
        }

        .analysis-item:last-child { border-bottom: none !important; }

        .print-only { display: none; }

        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          html, body {
            width: auto !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            display: block !important;
            box-sizing: border-box;
            background: white !important;
          }
          .bg-soft { background: white !important; }
          .min-h-100 { min-height: auto !important; }
          .main-wrapper { min-height: auto !important; }
          
          .print-page {
            page-break-after: always !important;
            break-after: page !important;
            display: block !important;
          }
          .print-full-page {
            min-height: 24cm !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
          }
          
          .page-break-after {
            page-break-after: always !important;
            break-after: page !important;
          }
          .no-print, nav, .navbar, footer { display: none !important; }
          .print-only { display: block !important; }
          
          /* Dashboard Layout in Print */
          .container { width: 100% !important; max-width: 100% !important; padding: 0 !important; margin: 0 !important; }
          .main-grid { display: block !important; }
          .content-column { display: block !important; width: 100% !important; }
          
          .print-chart-grid { 
            display: flex !important; 
            flex-direction: row !important; 
            gap: 5mm !important; 
            margin-bottom: 5mm !important;
          }
          .print-chart-grid > * { flex: 1 !important; width: 48% !important; margin: 0 !important; page-break-inside: avoid !important; break-inside: avoid !important; }
          
          .card { border: 1px solid #ddd !important; box-shadow: none !important; margin-bottom: 10mm !important; padding: 5mm !important; }
          
          .analysis-item { page-break-inside: avoid !important; break-inside: avoid !important; }
          
          body { color: black !important; background: white !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .hero-score { background: #002B49 !important; color: white !important; }
          .accent-border-left { border-left: 8px solid #002B49 !important; }
          .bg-navy { background: #002B49 !important; color: white !important; }
        }

        .chart-container {
          width: 100%;
          height: 350px;
        }
        @media (max-width: 768px) {
          .chart-container {
            height: 300px;
          }
        }
        @media (max-width: 480px) {
          .chart-container {
            height: 250px;
          }
        }
      `}</style>
        </div>
    );
}
