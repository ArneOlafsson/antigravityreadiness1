'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
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
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Fetch assessment
                const assessmentRef = doc(db, 'assessments', user.uid);
                const assessmentSnap = await getDoc(assessmentRef);
                
                // Fetch profile
                const profileRef = doc(db, 'users', user.uid);
                const profileSnap = await getDoc(profileRef);

                if (profileSnap.exists()) {
                    setUserProfile(profileSnap.data());
                }

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
        return () => unsubscribe();
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
        <div className="bg-soft min-h-100">
            <Navbar />

            {/* PRINT ONLY: COVER PAGE */}
            <div className="print-only page-break-after">
                <div className="h-screen flex flex-col justify-between p-32 bg-navy text-white relative overflow-hidden" style={{ height: '297mm', width: '210mm' }}>
                    <div className="absolute inset-0 z-0 opacity-10">
                        {/* High-end accent */}
                        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal opacity-20 rounded-full -mr-96 -mt-96 blur-3xl"></div>
                    </div>
                    
                    <div className="relative z-10">
                        <div className="uppercase-spaced tracking-[0.5em] text-xs opacity-70 mb-20">Confidential — Strategic Intelligence</div>
                        <div className="mt-10">
                            <div className="serif-font text-8xl mb-4 leading-tight">AI Readiness</div>
                            <div className="serif-font text-5xl italic opacity-50 ml-2">2026 Strategy Report</div>
                            <div className="h-1 w-32 bg-teal mt-12" style={{ backgroundColor: 'var(--accent-teal)' }}></div>
                        </div>
                    </div>

                    <div className="relative z-10 flex justify-between items-end">
                        <div className="text-left">
                            <div className="text-xs uppercase-spaced opacity-60 mb-2">Prepared For</div>
                            <div className="text-4xl font-bold serif-font text-white">{userProfile?.companyName || 'Organisationen'}</div>
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
            <div className="print-only page-break-after p-32 bg-white">
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
                        <div className="mt-16 pt-8 border-t border-navy/10 text-[0.6rem] opacity-40 uppercase-spaced">
                            Riskklassificering: {data.score > 60 ? 'KRITISK ADAPTATION KRÄVS' : 'MODERAT POSITIONERING'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-20 relative z-10">
                <header className="flex justify-between items-end mb-16 accent-border-left">
                    <div>
                        <div className="uppercase-spaced mb-2" style={{ color: 'var(--accent-teal)' }}>Exekutiv Analys</div>
                        <h1 className="serif-font text-5xl">Dashboard: {userProfile?.companyName || 'Din Organisation'}</h1>
                        <p className="text-muted mt-2">Strategisk AI-bedömning utförd {new Date(data.lastUpdated || Date.now()).toLocaleDateString('sv-SE')}</p>
                    </div>
                    <div className="text-right print-only mb-2">
                        <span className="text-[0.6rem] uppercase-spaced opacity-60">Sida 3 av 5</span>
                        <div className="h-0.5 w-12 bg-navy ml-auto mt-2"></div>
                    </div>
                    <div className="flex gap-4 no-print">
                        <button className="btn-outline" style={{ padding: '0.8rem 1.5rem', fontSize: '0.7rem' }} onClick={handlePrint}>Exportera Fullständig Rapport (PDF)</button>
                        <button className="btn-primary" style={{ padding: '0.8rem 1.5rem', fontSize: '0.7rem' }} onClick={() => window.location.href = '/assessment'}>Uppdatera Data</button>
                    </div>
                </header>

                <div className="grid col-main-side gap-12">
                    <div className="flex flex-col gap-12">

                        {/* Main Score Section */}
                        <div className="card hero-score flex items-center justify-between bg-navy text-white">
                            <div className="flex-1">
                                <div className="uppercase-spaced mb-4" style={{ color: 'var(--accent-teal)' }}>AI Disruption Score</div>
                                <h2 className="serif-font text-3xl mb-4" style={{ color: 'white' }}>{getRiskLabel(data.score)}</h2>
                                <p style={{ opacity: 0.7, maxWidth: '400px' }}>Indikerar en hög sårbarhet för marknadsstörningar drivna av AI-native aktörer.</p>
                            </div>
                            <div className="score-display">
                                <div className="serif-font text-8xl" style={{ color: 'var(--accent-teal)' }}>{data.score}</div>
                                <div className="uppercase-spaced text-right">/ 100</div>
                            </div>
                        </div>

                        {/* Charts Section */}
                        <div className="grid col-2 gap-12">
                            <div className="card bg-white">
                                <h3 className="serif-font text-2xl mb-8">Riskprofil per Kategori</h3>
                                <div style={{ height: '350px' }}>
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

                            <div className="card bg-white">
                                <h3 className="serif-font text-2xl mb-8">Branschbenchmark</h3>
                                <div style={{ height: '350px' }}>
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
                        <div className="card bg-white page-break-after" style={{ padding: '2rem 3rem' }}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="serif-font text-2xl accent-border-left pl-6">Strategisk Analys av Riskprofil</h3>
                                <p className="text-muted" style={{ fontSize: '0.65rem' }}>
                                    AI-mognad baserat på fem kritiska dimensioner.
                                </p>
                            </div>
                            
                            <div className="grid col-main-side gap-8 items-start">
                                <div className="analysis-grid grid col-2 gap-x-8 gap-y-2" style={{ alignContent: 'start' }}>
                                    {data.categories.map((cat: any) => (
                                        <div key={cat.name} className="analysis-item" style={{ paddingBottom: '0.4rem', borderBottom: '1px solid #f8f8f8' }}>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="serif-font text-md" style={{ margin: 0 }}>{cat.name}</h4>
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
                                            <p className="text-xs text-muted" style={{ lineHeight: '1.3', fontSize: '0.7rem' }}>
                                                {getCategoryDescription(cat.name, cat.score)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="analysis-summary bg-soft p-6 flex flex-col justify-start border-left relative summary-pointer" style={{ minHeight: '100%' }}>
                                    <h4 className="uppercase-spaced text-xs mb-3" style={{ color: 'var(--accent-teal)' }}>Sammanfattning</h4>
                                    <p className="serif-font text-xl mb-4" style={{ color: 'var(--primary-navy)', lineHeight: '1.3' }}>
                                        "Din riskprofil är asymmetrisk. Du har en teknisk grund som är din 'sköld', men din marknadsposition är under attack."
                                    </p>
                                    <p className="text-xs italic" style={{ color: '#666' }}>
                                        Rekommendation: Prioritera {data.categories.reduce((prev: any, current: any) => (prev.score > current.score) ? prev : current).name.toLowerCase()}.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Simulation Teasers (Hidden in full print) */}
                        <div className="card bg-white accent-border-left no-print">
                            <h3 className="serif-font text-2xl mb-6">AI Attack Simulation</h3>
                            <div className="flex flex-col gap-6">
                                <div className="sim-box p-8 bg-soft">
                                    <h4 className="serif-font text-xl mb-4">Sannolik effekt: 40% Automatisering</h4>
                                    <p className="text-muted">En utmanare med 0 i fasta personalkostnader kan erbjuda 80% av era tjänster till 20% av priset inom 18 månader.</p>
                                    <button className="btn-outline mt-6" style={{ fontSize: '0.65rem' }} onClick={() => window.location.href = '/dashboard/simulation'}>Öppna simulering</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="side-column flex flex-col gap-12 no-print">
                        <div className="card bg-navy">
                            <div className="uppercase-spaced mb-2" style={{ color: 'var(--accent-teal)', fontSize: '0.7rem' }}>Strategi</div>
                            <h3 className="serif-font text-2xl mb-8">Transformation Roadmap</h3>
                            <div className="roadmap-path">
                                <div className="path-item active">
                                    <div className="serif-font text-3xl mb-2">01</div>
                                    <h5 className="uppercase-spaced mb-2" style={{ color: 'var(--accent-teal)' }}>Awareness</h5>
                                    <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                                        {data.score > 60 
                                            ? `Kritisk prioritet: Utbilda styrelsen om er sårbarhet (${data.score}/100) för att säkra mandat.`
                                            : `Strategisk briefing: Genomgång av resultat för ledningsgruppen.`}
                                    </p>
                                </div>
                                <div className="path-item mt-8 active">
                                    <div className="serif-font text-3xl mb-2">02</div>
                                    <h5 className="uppercase-spaced mb-2" style={{ color: '#fff' }}>Hämta Hem "Low Hanging Fruit"</h5>
                                    <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                                        Pilotprojekt inom {data.categories.find((c: any) => c.score < 40)?.name || 'interna processer'} för att bevisa AI-värde snabbt.
                                    </p>
                                </div>
                                <div className="path-item mt-8 opacity-40">
                                    <div className="serif-font text-3xl mb-2">03</div>
                                    <h5 className="uppercase-spaced mb-2">Offensiv Skalning</h5>
                                    <p style={{ fontSize: '0.85rem' }}>
                                        Omstrukturering av {data.categories.reduce((p: any, c: any) => p.score > c.score ? p : c).name} för att sänka marginalkostnaden mot noll.
                                    </p>
                                </div>
                            </div>
                            <Link 
                                href="/dashboard/roadmap"
                                className="btn-outline w-full mt-10 text-center" 
                                style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.65rem', display: 'block' }}
                            >
                                Fullständig Handlingsplan (Betalversion)
                            </Link>
                        </div>

                        <div className="card bg-white border">
                            <h3 className="serif-font text-2xl mb-6">AI Defense Strategy</h3>
                            <div className="flex flex-col gap-5">
                                <div className="flex flex-col gap-1">
                                    <div className="flex justify-between text-xs font-bold mb-1">
                                        <span>Skyddsnivå</span>
                                        <span>{100 - data.score}%</span>
                                    </div>
                                    <div style={{ height: '4px', background: '#eee', borderRadius: '2px' }}>
                                        <div style={{ height: '100%', width: `${100 - data.score}%`, background: 'var(--accent-teal)', borderRadius: '2px' }}></div>
                                    </div>
                                </div>
                                <ul className="flex flex-col gap-4 mt-2">
                                    <li className="flex items-center gap-2 text-sm"><span style={{ color: 'var(--accent-teal)' }}>✓</span> Etablera AI-policy</li>
                                    <li className="flex items-center gap-2 text-sm"><span style={{ color: 'var(--accent-teal)' }}>✓</span> Inventera skugg-AI</li>
                                    <li className="flex items-center gap-2 text-sm text-muted"><span style={{ color: '#ccc' }}>○</span> Syntetisk dataträning</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PRINT ONLY: PAGE 4 & 5 (STRATEGIC IMPLEMENTATION & TRANSFORMATION) */}
                <div className="print-only">
                    {/* PAGE 4: STRATEGISK IMPLEMENTATION */}
                    <div className="page-break-after p-32 bg-white relative" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                        <div className="flex justify-between items-start mb-16">
                            <h2 className="serif-font text-5xl accent-border-left pl-10">Strategisk Implementation</h2>
                            <div className="text-right">
                                <span className="text-[0.6rem] uppercase-spaced opacity-60">Sida 4 av 5</span>
                                <div className="h-0.5 w-12 bg-navy ml-auto mt-2"></div>
                            </div>
                        </div>
                        
                        <div className="relative pl-24 flex-grow">
                            <div className="absolute left-[3.5rem] top-0 bottom-10 w-[1px] bg-navy opacity-10"></div>
                            <div className="space-y-20">
                                <div className="relative">
                                    <div className="absolute -left-[5.5rem] top-0 bg-navy text-white w-16 h-16 flex items-center justify-center font-bold text-xl rounded-full shadow-lg border-4 border-white">Q1</div>
                                    <div className="bg-soft p-12 border-l-4 border-navy relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] rotate-12">
                                            <div className="serif-font text-6xl">FOUNDATION</div>
                                        </div>
                                        <h3 className="serif-font text-2xl mb-6">Fas 1: Defensiv Säkring & Governance</h3>
                                        <div className="grid grid-cols-2 gap-10">
                                            <div className="p-8 bg-white border shadow-sm">
                                                <div className="text-[0.55rem] uppercase-spaced text-teal mb-3 font-bold" style={{ color: 'var(--accent-teal)' }}>Teknisk Säkring</div>
                                                <h5 className="font-bold text-sm mb-3">"LLM-Guardrails"</h5>
                                                <p className="text-[0.7rem] opacity-70 leading-relaxed">Etablering av säkra API-gateways för att förhindra att känslig bolagsdata läcker till publika AI-träningsset.</p>
                                            </div>
                                            <div className="p-8 bg-white border shadow-sm">
                                                <div className="text-[0.55rem] uppercase-spaced text-teal mb-3 font-bold" style={{ color: 'var(--accent-teal)' }}>Ledningsmandat</div>
                                                <h5 className="font-bold text-sm mb-3">Risk-stress-test</h5>
                                                <p className="text-[0.7rem] opacity-70 leading-relaxed">Kvantifiering av rörliga kostnader som kan automatiseras för att frigöra budget till offensiv AI-utveckling.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-[5.5rem] top-0 bg-teal text-navy w-16 h-16 flex items-center justify-center font-bold text-xl rounded-full shadow-lg border-4 border-white" style={{ backgroundColor: 'var(--accent-teal)' }}>Q2</div>
                                    <div className="bg-white p-12 border-l-4 border-teal shadow-xl relative overflow-hidden" style={{ borderColor: 'var(--accent-teal)' }}>
                                        <div className="absolute top-0 right-0 p-4 opacity-[0.05] -rotate-12">
                                            <div className="serif-font text-6xl">GROWTH</div>
                                        </div>
                                        <h3 className="serif-font text-2xl mb-6">Fas 2: Operationell Acceleration</h3>
                                        <div className="grid grid-cols-2 gap-10">
                                            <div className="p-8 bg-soft border">
                                                <div className="text-[0.55rem] uppercase-spaced text-navy mb-3 font-bold">Automation</div>
                                                <h5 className="font-bold text-sm mb-3">Agentiska Arbetsflöden</h5>
                                                <p className="text-[0.7rem] opacity-70 leading-relaxed">Implementering av autonoma agenter för repetitiv datahantering. Mål: 30% högre genomströmning.</p>
                                            </div>
                                            <div className="p-8 bg-soft border">
                                                <div className="text-[0.55rem] uppercase-spaced text-navy mb-3 font-bold">Data Asset</div>
                                                <h5 className="font-bold text-sm mb-3">Syntetisk Datastruktur</h5>
                                                <p className="text-[0.7rem] opacity-70 leading-relaxed">Strukturering av kundhistorik till en 'AI-ready' vektor-databas för att möjliggöra hyper-personalisering.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto pt-10 border-t border-navy/5 flex justify-between items-end">
                            <div className="text-[0.55rem] uppercase-spaced opacity-40">Property of {userProfile?.companyName} — Confidential</div>
                            <div className="flex gap-4">
                                <div className="w-24 h-8 bg-soft border border-dashed flex items-center justify-center text-[0.4rem] opacity-30 italic">Signatur Analys</div>
                                <div className="w-24 h-8 bg-soft border border-dashed flex items-center justify-center text-[0.4rem] opacity-30 italic">Signatur Ledning</div>
                            </div>
                        </div>
                    </div>

                    {/* PAGE 5: TRANSFORMATION & GAP-ANALYS */}
                    <div className="p-32 bg-white relative overflow-hidden" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                        <div className="flex justify-between items-start mb-16">
                            <h2 className="serif-font text-5xl accent-border-left pl-10">Transformation & Gap-analys</h2>
                            <div className="text-right">
                                <span className="text-[0.6rem] uppercase-spaced opacity-60">Sida 5 av 5</span>
                                <div className="h-0.5 w-12 bg-navy ml-auto mt-2"></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-12 flex-grow">
                            <div className="p-14 bg-navy text-white relative flex flex-col justify-center">
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
                                    <div className="p-5 bg-navy text-white text-center text-[0.55rem] uppercase-spaced tracking-[0.3em] font-bold mt-10">
                                        DETALJERAD TEKNISK BILAGA BIFOGAS SEPARAT
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-16 pt-8 border-t border-navy/5 flex justify-between items-center">
                            <div className="text-[0.55rem] uppercase-spaced opacity-30 italic">Strategy Document Ref: {Math.random().toString(36).substring(7).toUpperCase()}</div>
                            <div className="serif-font text-sm opacity-60">Olafsson AI Strategic Advisory</div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .bg-soft { background: #fafafa; min-height: 100vh; }
        .bg-navy { background: var(--primary-navy); }
        .grid { display: grid; }
        .col-main-side { grid-template-columns: 2fr 1fr; }
        .col-2 { grid-template-columns: 1fr 1fr; }
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
        .analysis-item:last-child { border-bottom: none !important; }

        .print-only { display: none; }

        @media print {
          .no-print, nav, .navbar { display: none !important; }
          .print-only { display: block !important; }
          .page-break-after { page-break-after: always; }
          .container { width: 100% !important; max-width: none !important; padding: 0 !important; margin: 0 !important; }
          .bg-soft { background: white !important; }
          .card { border: 1px solid #eee !important; box-shadow: none !important; break-inside: avoid; margin-bottom: 2rem; }
          body { color: black !important; background: white !important; }
          .col-main-side { grid-template-columns: 1fr !important; }
          .hero-score { background: #002B49 !important; -webkit-print-color-adjust: exact; }
          .accent-border-left { border-left: 8px solid var(--primary-navy) !important; -webkit-print-color-adjust: exact; }
          .bg-navy { background: #002B49 !important; -webkit-print-color-adjust: exact; color: white !important; }
        }
      `}</style>
        </div>
    );
}
