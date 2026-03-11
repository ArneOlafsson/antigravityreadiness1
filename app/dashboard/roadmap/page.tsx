'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { 
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

export default function RoadmapPage() {
    const [userProfile, setUserProfile] = useState<any>(null);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                window.location.href = '/login';
                return;
            }

            try {
                // Fetch profile
                const profileRef = doc(db, 'users', user.uid);
                const profileSnap = await getDoc(profileRef);
                if (profileSnap.exists()) {
                    setUserProfile(profileSnap.data());
                }

                // Fetch assessment (source of truth for scores)
                const assessmentRef = doc(db, 'assessments', user.uid);
                const assessmentSnap = await getDoc(assessmentRef);
                
                if (assessmentSnap.exists()) {
                    const parsed = assessmentSnap.data();
                    const nameMap: Record<string, string> = {
                        'AFFÄRSMODELLENS EXPONERING': 'Strategi',
                        'AUTOMATISERINGSRISK I PROCESSER': 'Processer',
                        'DATA & DIGITALISERING': 'Teknologi',
                        'KONKURRENSTRYCK': 'Marknad',
                        'ORGANISATORISK ANPASSNINGSFÖRMÅGA': 'Organisation'
                    };

                    const categories = parsed.categories.map((cat: any) => ({
                        ...cat,
                        name: nameMap[cat.name] || cat.name
                    }));
                    
                    setData({
                        score: parsed.score || 0,
                        categories
                    });
                } else {
                    // Fallback
                    setData({
                        score: 0,
                        categories: []
                    });
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching roadmap data:", err);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const [isGenerating, setIsGenerating] = useState(false);

    const handlePrint = () => {
        setIsGenerating(true);
        // Simulate "generation" of 42-page report
        setTimeout(() => {
            setIsGenerating(false);
            window.print();
        }, 1500);
    };

    if (loading) {
        return (
            <div className="bg-soft min-h-screen flex items-center justify-center">
                <div className="loader"></div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="bg-soft min-h-screen">
            <Navbar />
            
            {/* PRINT ONLY: COVER PAGE */}
            <div className="print-only page-break-after">
                <div className="h-screen flex flex-col justify-between p-32 bg-navy text-white relative overflow-hidden">
                    {/* Background Hero Image with Overlay */}
                    <div className="absolute inset-0 z-0 opacity-20">
                        <img src="/images/hero.png" alt="" className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="relative z-10">
                        <div className="uppercase-spaced tracking-[0.5em] text-xs opacity-70 mb-20">Confidential — Strategic Intelligence</div>
                        <div className="mt-10">
                            <div className="serif-font text-9xl mb-2 leading-tight">AI Disruption</div>
                            <div className="serif-font text-5xl italic opacity-50 ml-2">2026 Strategic Roadmap</div>
                            <div className="h-1 w-24 bg-teal mt-12"></div>
                        </div>
                    </div>

                    <div className="relative z-10 flex justify-between items-end">
                        <div className="text-left">
                            <div className="text-xs uppercase-spaced opacity-60 mb-2">Prepared For</div>
                            <div className="text-3xl font-bold serif-font">{userProfile?.companyName || 'Organisationen'}</div>
                        </div>
                        <div className="text-right text-[0.65rem] uppercase-spaced opacity-60 leading-loose">
                            AI Disruption Scanner — Strategy Team<br />
                            Generated: {new Date().toLocaleDateString('sv-SE')}<br />
                            Report ID: {Math.random().toString(36).substring(7).toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>

            {/* PRINT ONLY: EXECUTIVE SUMMARY */}
            <div className="print-only page-break-after p-32 bg-white">
                <h2 className="serif-font text-5xl mb-16 accent-border-left pl-10">Exekutiv Sammanfattning</h2>
                <div className="grid grid-cols-2 gap-20 text-sm leading-relaxed">
                    <div>
                        <p className="mb-8 text-lg serif-font italic opacity-80">"Vi befinner oss i en tid där 'wait and see' är den mest riskfyllda strategin en ledningsgrupp kan anta."</p>
                        <p className="mb-6 leading-loose">Efter en djupgående analys av {userProfile?.companyName} kan vi konstatera att organisationen har en total riskscore på <strong>{data.score}/100</strong>. Detta placerar er i zonen för 'Kritisk Exponering'.</p>
                        <p className="leading-loose">Behovet av omedelbar acceleration inom 'Processer' och 'Strategisk Pivot' är påtagligt. De kommande 12 månaderna kommer att definiera bolagets relevans på marknaden för det kommande decenniet.</p>
                    </div>
                    <div className="p-12 bg-soft border-left" style={{ borderLeftWidth: '4px', borderLeftColor: 'var(--primary-navy)' }}>
                        <h4 className="font-bold mb-8 uppercase-spaced text-xs">Huvudsakliga Slutsatser</h4>
                        <ul className="space-y-6 text-sm">
                            <li className="flex gap-3">
                                <span className="text-navy font-bold">•</span>
                                <span>Strategisk vallgrav eroderar med nuvarande teknikutveckling.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-navy font-bold">•</span>
                                <span>Marginalkostnad för kärnprocesser kan sänkas med 35% via AI-agenter.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-navy font-bold">•</span>
                                <span>Personal hos konkurrenter har 2x högre AI-literacy, vilket skapar ett talent-gap.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            
            {/* PRINT ONLY: DATA & RISK EVIDENCE */}
            <div className="print-only page-break-after p-24 bg-white">
                <h2 className="serif-font text-5xl mb-12 accent-border-left pl-10">Data & Risk-evidens</h2>
                <div className="grid grid-cols-2 gap-8">
                    <div className="p-10 border bg-soft rounded-lg flex flex-col" style={{ height: '480px' }}>
                        <h4 className="font-bold mb-8 uppercase-spaced text-[0.65rem] text-center opacity-60">Dimensionell Profil (0-100)</h4>
                        <div className="flex-1 flex justify-start items-center">
                            <div style={{ width: '350px', height: '350px', marginLeft: '90px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart 
                                        data={data.categories} 
                                        margin={{ top: 10, right: 10, bottom: 10, left: 40 }}
                                    >
                                        <PolarGrid stroke="#ddd" />
                                        <PolarAngleAxis 
                                            dataKey="name" 
                                            tick={{ fontSize: 9, fill: '#002B49', fontWeight: 600 }} 
                                        />
                                        <Radar
                                            name="Din Profil"
                                            dataKey="score"
                                            stroke="var(--primary-navy)"
                                            fill="var(--primary-navy)"
                                            fillOpacity={0.3}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                    <div className="p-10 border bg-soft rounded-lg flex flex-col" style={{ height: '480px' }}>
                        <h4 className="font-bold mb-8 uppercase-spaced text-[0.65rem] text-center opacity-60">Benchmark: Branschjämförelse</h4>
                        <div className="flex-1 flex justify-center items-center">
                            <div style={{ width: '280px', height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart 
                                        data={[
                                            { name: userProfile?.companyName?.split(' ')[0] || 'Din Org', score: data.score },
                                            { name: 'Snitt', score: 52 },
                                            { name: 'Topp 10%', score: 31 },
                                        ]} 
                                        margin={{ top: 20, right: 0, bottom: 20, left: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                        <XAxis 
                                            dataKey="name" 
                                            tick={{ fontSize: 9, fill: '#002B49', fontWeight: 600 }}
                                            axisLine={false}
                                            tickLine={false}
                                            interval={0}
                                        />
                                        <YAxis domain={[0, 100]} hide />
                                        <Bar 
                                            dataKey="score" 
                                            fill="var(--accent-teal)" 
                                            radius={[4, 4, 0, 0]} 
                                            barSize={40} 
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <p className="text-[0.55rem] opacity-40 mt-4 text-center italic">Datakälla: AI Disruption Index Global Database (Q1 2026)</p>
                    </div>
                </div>
                <div className="mt-12 p-10 bg-navy text-white text-sm leading-relaxed border-left" style={{ borderLeftColor: 'var(--accent-teal)', borderLeftWidth: '8px' }}>
                    <h5 className="font-bold mb-3 uppercase-spaced text-xs" style={{ color: 'var(--accent-teal)' }}>Analytikerkommentar:</h5>
                    <p className="opacity-80 leading-relaxed text-xs">Denna 5-dimensionella analys belyser en kritisk asymmetri mellan er strategiska ambition och operativa förmåga. Med ett resultat på {data.score}/100 presterar ni {data.score > 52 ? 'sämre än' : 'bättre än'} branschsnittet, vilket indikerar att {data.score > 52 ? 'brådskande' : 'fortsatta'} åtgärder krävs för att bibehålla marknadsrelevans.</p>
                </div>
            </div>

            {/* PRINT ONLY: STRATEGISK IMPLEMENTATION (ROADMAP) */}
            <div className="print-only page-break-after p-32 bg-white relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-navy opacity-[0.02] -mr-32 -mt-32 rounded-full"></div>
                <h2 className="serif-font text-5xl mb-20 accent-border-left pl-10 relative z-10">Strategisk Implementation</h2>
                
                <div className="relative pl-24">
                    {/* Vertical Timeline Line */}
                    <div className="absolute left-[3.5rem] top-0 bottom-0 w-[1px] bg-navy opacity-10"></div>
                    
                    <div className="space-y-24">
                        {/* Q1 Section */}
                        <div className="relative">
                            <div className="absolute -left-[5.5rem] top-0 flex flex-col items-center">
                                <div className="bg-navy text-white w-16 h-16 flex items-center justify-center font-bold text-xl rounded-full relative z-10 shadow-lg">Q1</div>
                                <div className="text-[0.6rem] uppercase-spaced mt-3 opacity-40 font-bold">Jan – Mar</div>
                            </div>
                            
                            <div className="bg-soft p-12 rounded-none border-l-4 border-navy">
                                <div className="mb-8">
                                    <h3 className="serif-font text-3xl mb-2">Grundläggande Skydd & Governance</h3>
                                    <p className="text-sm opacity-60 uppercase-spaced">Säkring av infrastruktur & etiska riktlinjer</p>
                                </div>
                                <div className="grid grid-cols-2 gap-12">
                                    <div className="p-8 bg-white border-b-2 border-soft">
                                        <div className="uppercase-spaced text-[0.55rem] text-teal mb-3">Taktik 01</div>
                                        <h5 className="font-bold text-sm mb-3 text-navy">Implementera "LLM-Guardrails"</h5>
                                        <p className="text-[0.7rem] opacity-80 leading-relaxed">Etablera en isolerad miljö för generativ AI. Säkra att ingen känslig kunddata eller IP lämnar organisationens kontroll via publika modeller.</p>
                                    </div>
                                    <div className="p-8 bg-white border-b-2 border-soft">
                                        <div className="uppercase-spaced text-[0.55rem] text-teal mb-3">Taktik 02</div>
                                        <h5 className="font-bold text-sm mb-3 text-navy">Styrelse-briefing & Mandat</h5>
                                        <p className="text-[0.7rem] opacity-80 leading-relaxed">Workshop för ledningsgruppen för att fastställa riskaptit och säkra budget för Q2:s accelerationsfas. Identifiera 'Early Adopters'.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Q2 Section */}
                        <div className="relative">
                            <div className="absolute -left-[5.5rem] top-0 flex flex-col items-center">
                                <div className="bg-teal text-navy w-16 h-16 flex items-center justify-center font-bold text-xl rounded-full relative z-10 shadow-lg" style={{ backgroundColor: 'var(--accent-teal)' }}>Q2</div>
                                <div className="text-[0.6rem] uppercase-spaced mt-3 opacity-40 font-bold">Apr – Jun</div>
                            </div>
                            
                            <div className="bg-white p-12 rounded-none border-l-4 border-teal" style={{ borderColor: 'var(--accent-teal)', boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
                                <div className="mb-8">
                                    <h3 className="serif-font text-3xl mb-2">Operationell Acceleration</h3>
                                    <p className="text-sm opacity-60 uppercase-spaced">Automatisering av värdekedjan</p>
                                </div>
                                <div className="grid grid-cols-2 gap-12">
                                    <div className="p-8 bg-soft">
                                        <div className="uppercase-spaced text-[0.55rem] text-navy mb-3">Taktik 03</div>
                                        <h5 className="font-bold text-sm mb-3 text-navy">Agentisk Processoptimering</h5>
                                        <p className="text-[0.7rem] opacity-80 leading-relaxed">Sjösätt AI-agenter i de mest personalintensiva flödena. Mål: 30% reduktion av administrativ tid inom {data.categories.find((c: any) => c.score > 60)?.name || 'kärnverksamheten'}.</p>
                                    </div>
                                    <div className="p-8 bg-soft">
                                        <div className="uppercase-spaced text-[0.55rem] text-navy mb-3">Taktik 04</div>
                                        <h5 className="font-bold text-sm mb-3 text-navy">Data-modernisering</h5>
                                        <p className="text-[0.7rem] opacity-80 leading-relaxed">Strukturera ostrukturerad data för RAG-applikationer. Skapa den 'data-sjö' som krävs för att träna egna, domänspecifika modeller under H2.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="mt-20 pt-10 border-t flex justify-between items-center opacity-40 italic text-[0.6rem]">
                    <span>Strategisk Roadmap: Vision 2026</span>
                    <span>Sida 4 av 5</span>
                </div>
            </div>

            {/* PRINT ONLY: TRANSFORMATION & GAP-ANALYS */}
            <div className="print-only page-break-after p-32 bg-white relative overflow-hidden">
                <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-teal opacity-[0.03] -mr-64 -mt-64 rotate-45"></div>
                
                <h2 className="serif-font text-5xl mb-16 accent-border-left pl-10 relative z-10">Transformation & Gap-analys</h2>
                
                <div className="grid grid-cols-1 gap-16 relative z-10">
                    {/* H2 Pivot Section */}
                    <div className="p-16 bg-navy text-white rounded-none relative">
                        <div className="absolute top-8 right-12 serif-font text-8xl opacity-10">H2</div>
                        <div className="max-w-3xl">
                            <h5 className="uppercase-spaced text-xs mb-6" style={{ color: 'var(--accent-teal)' }}>Långsiktig Strategi: 2026-H2</h5>
                            <h3 className="serif-font text-5xl mb-8 leading-tight text-white">"Från försäljning av volym till leverans av intelligens."</h3>
                            <p className="opacity-80 leading-relaxed text-sm mb-10">
                                Under andra halvåret 2026 skiftar vi fokus från intern effektivitet till marknadsoffensiv. Genom att integrera AI direkt i kunderbjudandet skapar vi nya intäktsströmmar med nära noll i marginalkostnad. Detta är inte en inkrementell förbättring – det är en fullständig affärsmodells-pivot.
                            </p>
                            
                            <div className="flex items-center gap-12 bg-white/5 p-8 border border-white/10">
                                <div className="flex-1">
                                    <div className="flex justify-between items-end mb-3">
                                        <span className="text-[0.65rem] uppercase-spaced opacity-60">Transformation Readiness Index</span>
                                        <span className="text-3xl font-bold text-teal" style={{ color: 'var(--accent-teal)' }}>{Math.min(95, data.score + 15)}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-teal" style={{ width: '65%', backgroundColor: 'var(--accent-teal)' }}></div>
                                    </div>
                                </div>
                                <div className="text-right border-l border-white/20 pl-12">
                                    <div className="text-[0.55rem] uppercase-spaced opacity-40 mb-1">Målstatus</div>
                                    <div className="text-[0.65rem] font-bold tracking-widest text-[#FFD700]">OFFENSIV</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-16">
                        {/* Detailed Gap Analysis */}
                        <div className="p-12 border bg-soft flex flex-col shadow-sm">
                            <h4 className="serif-font text-2xl mb-10 flex items-center gap-3">
                                <span className="w-2 h-8 bg-navy block"></span>
                                Avdelningsvis Gap-analys
                            </h4>
                            <div className="space-y-10 flex-1">
                                {[
                                    { name: 'Marknad & Sälj', risk: 'KRITISK', level: 85, color: '#D32F2F', desc: 'Hög risk för priserosion vid AI-native konkurrens.' },
                                    { name: 'IT & Operation', risk: 'MODERAT', level: 45, color: '#F57C00', desc: 'Befintlig skuld saktar ner transformationshastigheten.' },
                                    { name: 'Ledning & Strategi', risk: 'STYRKA', level: 25, color: 'var(--accent-teal)', desc: 'God insikt och driv för nödvändiga förändringar.' }
                                ].map((dept, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-xs mb-3 font-bold text-navy uppercase-spaced">
                                            <span>{dept.name}</span>
                                            <span style={{ color: dept.color }}>{dept.risk}</span>
                                        </div>
                                        <div className="h-2 bg-white w-full rounded-full overflow-hidden border mb-3">
                                            <div className="h-full" style={{ width: `${dept.level}%`, backgroundColor: dept.color }}></div>
                                        </div>
                                        <p className="text-[0.6rem] opacity-50 italic">{dept.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Attack Simulation Results */}
                        <div className="p-12 border bg-white flex flex-col shadow-sm">
                            <h4 className="serif-font text-2xl mb-10 flex items-center gap-3">
                                <span className="w-2 h-8 bg-teal block" style={{ backgroundColor: 'var(--accent-teal)' }}></span>
                                Simulering: Utfall
                            </h4>
                            <div className="space-y-10">
                                <div className="p-6 border-l-2 border-soft">
                                    <h6 className="font-bold uppercase-spaced text-[0.65rem] mb-3 text-navy">Scenario: "The Zero-Marginal Challenger"</h6>
                                    <p className="opacity-70 leading-relaxed text-[0.7rem]">
                                        Simuleringen visar att en utmanare med AI-native arkitektur kan erbjuda 80% av er nuvarande service till 15% av priset. Utan åtgärder eroderar er bruttomarginal med 40% inom 24 månader.
                                    </p>
                                </div>
                                <div className="p-6 border-l-2 border-soft">
                                    <h6 className="font-bold uppercase-spaced text-[0.65rem] mb-3 text-navy">Scenario: "Talent Liquidity Crisis"</h6>
                                    <p className="opacity-70 leading-relaxed text-[0.7rem]">
                                        Er mest värdefulla personal löper 65% högre risk att lämna bolaget för aktörer med modernare AI-infrastruktur. AI-literacy är numera den viktigaste faktorn för talent retention.
                                    </p>
                                </div>
                                <div className="mt-6 p-6 bg-navy text-white text-center italic text-[0.6rem] uppercase-spaced tracking-[0.2em] opacity-80">
                                    Fullständig teknisk bilaga bifogas
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="mt-20 pt-10 border-t flex justify-between items-center opacity-40 italic text-[0.6rem]">
                    <span>Genererad av AI Disruption Scanner — Strategisk Rapport</span>
                    <span>Sida 5 av 5</span>
                </div>
            </div>

            
            <div className="container py-12">
                <div className="flex justify-between items-end mb-16 accent-border-left no-print">
                    <div>
                        <Link href="/dashboard" className="uppercase-spaced mb-2 block" style={{ color: 'var(--accent-teal)', fontSize: '0.65rem' }}>← Tillbaka till översikt</Link>
                        <h1 className="serif-font text-5xl">Operationell Handlingsplan 2026</h1>
                        <p className="text-muted mt-2">En exekutiv roadmap för att säkra {userProfile?.companyName || 'organisationen'} mot AI-disruption.</p>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            className={`btn-primary ${isGenerating ? 'opacity-50 cursor-wait' : ''}`} 
                            style={{ fontSize: '0.7rem', background: 'var(--accent-teal)', color: 'var(--primary-navy)' }} 
                            onClick={handlePrint}
                            disabled={isGenerating}
                        >
                            {isGenerating ? 'GENERERAR FULLSTÄNDIG RAPPORT...' : 'EXPORTERA FULLSTÄNDIG STRATEGISK RAPPORT (PDF)'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-12">
                    {/* Header Info Card */}
                    <div className="card bg-navy p-12 text-white flex justify-between items-center relative overflow-hidden">
                        <div style={{ position: 'absolute', top: -50, right: -50, fontSize: '20rem', opacity: 0.05, pointerEvents: 'none' }}>AI</div>
                        <div className="relative z-10">
                            <div className="uppercase-spaced text-xs mb-2" style={{ color: 'var(--accent-teal)' }}>Analys-ID: {Math.random().toString(36).substring(7).toUpperCase()}</div>
                            <h2 className="serif-font text-4xl mb-4">Strategisk Acceleration</h2>
                            <p className="max-w-xl opacity-80">Baserat på din riskscore ({data.score}/100) har vi tagit fram en prioriterad lista på åtgärder för att maximera er konkurrenskraft.</p>
                        </div>
                        <div className="relative z-10 p-6 border border-white/20 text-center">
                            <div className="text-xs uppercase-spaced opacity-60 mb-1">Status</div>
                            <div className="font-bold text-2xl" style={{ letterSpacing: '2px' }}>AKTIVERAD</div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Q1 Section */}
                        <div className="card bg-white p-10">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="bg-navy text-white w-12 h-12 flex items-center justify-center font-bold">Q1</span>
                                <h3 className="serif-font text-2xl">Grundläggande Skydd</h3>
                            </div>
                            <div className="roadmap-items">
                                <div className="roadmap-item p-6 bg-soft border mb-8">
                                    <h5 className="font-bold text-sm mb-2 text-navy">Taktisk åtgärd: "LLM-Guardrails"</h5>
                                    <p className="text-sm opacity-80 leading-relaxed">Etablera en säker infrastruktur för internt användande av generativ AI för att förhindra dataläckage. Implementera centraliserad kontroll av API-nycklar.</p>
                                </div>
                                <div className="roadmap-item p-6 bg-soft border">
                                    <h5 className="font-bold text-sm mb-2 text-navy">Styrelse-briefing</h5>
                                    <p className="text-sm opacity-80 leading-relaxed">Genomför en 'Stress Test'-workshop med ledningsgruppen för att visualisera disruptiva scenarier och säkra investeringsutrymme för Q2.</p>
                                </div>
                            </div>
                        </div>

                        {/* Q2 Section */}
                        <div className="card bg-white p-10">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="bg-navy text-white w-12 h-12 flex items-center justify-center font-bold">Q2</span>
                                <h3 className="serif-font text-2xl">Operationell Effektivitet</h3>
                            </div>
                            <div className="roadmap-items">
                                <div className="roadmap-item p-6 border-left bg-soft mb-8" style={{ borderLeftColor: 'var(--accent-teal)', borderLeftWidth: '4px' }}>
                                    <h5 className="font-bold text-sm mb-2 text-navy">Automatisering av {data.categories.find((c: any) => c.score > 60)?.name || 'Kärnprocesser'}</h5>
                                    <p className="text-sm opacity-80 leading-relaxed">Sätt upp ett dedikerat 'Agent-team' för att minska manuellt arbete med 30% inom {data.categories.find((c: any) => c.score > 60)?.name || 'era mest tidskrävande flöden'}.</p>
                                </div>
                                <div className="roadmap-item p-6 border-left bg-soft" style={{ borderLeftColor: 'var(--accent-teal)', borderLeftWidth: '4px' }}>
                                    <h5 className="font-bold text-sm mb-2 text-navy">Data-rening & Arkitektur</h5>
                                    <p className="text-sm opacity-80 leading-relaxed">Strukturera ostrukturerad data och rensa gamla källor för att möjliggöra träning av egna modeller med hög precision framåt.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* H2 Section - Full Width */}
                    <div className="card bg-white p-10">
                        <div className="flex items-center gap-4 mb-8">
                            <span className="bg-navy text-white w-12 h-12 flex items-center justify-center font-bold">H2</span>
                            <h3 className="serif-font text-2xl">Strategisk Expansion & Transformation</h3>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="md:col-span-2">
                                <div className="p-8 border bg-navy text-white h-full relative overflow-hidden">
                                    <div style={{ position: 'absolute', bottom: -20, right: -20, fontSize: '10rem', opacity: 0.1 }}>H2</div>
                                    <h5 className="uppercase-spaced text-xs mb-4" style={{ color: 'var(--accent-teal)' }}>Strategisk Pivot</h5>
                                    <p className="serif-font text-3xl mb-4">"Från försäljning av volym till försäljning av resultat."</p>
                                    <p className="opacity-70 leading-relaxed text-sm">Lansering av den första AI-stödda produkten som utmanar branschstandarden och sänker era marginalkostnader mot noll. Detta kräver en omarbetning av era nuvarande prismodeller för att fånga upp värdeskapandet.</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="p-6 border flex flex-col justify-center h-full bg-soft">
                                    <h5 className="font-bold text-xs mb-2 uppercase-spaced opacity-60">Transformation Readiness</h5>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-2xl font-bold">{data.score + 10}%</span>
                                        <span className="text-[0.6rem] uppercase-spaced opacity-40">Mål efter H2</span>
                                    </div>
                                    <div className="bg-white h-2 w-full border">
                                        <div className="bg-teal h-full" style={{ width: '65%', background: 'var(--accent-teal)' }}></div>
                                    </div>
                                    <p className="text-[0.65rem] mt-4 opacity-70 italic text-center text-navy font-bold">Investering krävs: Ledningsmandat</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* NEW SECTION: GAP ANALYSIS & ATTACK OUTCOMES */}
                    <div className="grid md:grid-cols-3 gap-8 pb-12">
                        <div className="card bg-white p-10 md:col-span-1 border-top" style={{ borderTop: '4px solid var(--accent-teal)' }}>
                            <h4 className="serif-font text-xl mb-6">Gap-analys: Avdelningar</h4>
                            <div className="space-y-6">
                                <div className="department-stat pb-4 border-b">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>Marknad & Sälj</span>
                                        <span className="font-bold">HÖG RISK</span>
                                    </div>
                                    <div className="h-1 bg-soft w-full overflow-hidden">
                                        <div className="h-full bg-red-800" style={{ width: '85%', backgroundColor: '#D32F2F' }}></div>
                                    </div>
                                </div>
                                <div className="department-stat pb-4 border-b">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>IT & Operation</span>
                                        <span className="font-bold">MEDIUM RISK</span>
                                    </div>
                                    <div className="h-1 bg-soft w-full overflow-hidden">
                                        <div className="h-full bg-orange-400" style={{ width: '45%', backgroundColor: '#F57C00' }}></div>
                                    </div>
                                </div>
                                <div className="department-stat">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>HR & Kultur</span>
                                        <span className="font-bold">LÅG RISK</span>
                                    </div>
                                    <div className="h-1 bg-soft w-full overflow-hidden">
                                        <div className="h-full bg-green-600" style={{ width: '20%', backgroundColor: '#388E3C' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="card bg-white p-10 md:col-span-2 border-top" style={{ borderTop: '4px solid var(--primary-navy)' }}>
                            <h4 className="serif-font text-xl mb-6">Attack-simulering: Resultat</h4>
                            <div className="grid grid-cols-2 gap-8 text-sm">
                                <div>
                                    <h6 className="font-bold uppercase-spaced text-[0.65rem] mb-2 text-navy">Känslighet: Prispress</h6>
                                    <p className="opacity-70 leading-relaxed text-xs">Simulering visar att en AI-native konkurrent kan sänka priset med 40% och ändå behålla 25% marginal genom automatiserad kundanalys. Ert försvar: Skapa högre 'switching costs' genom data-integration.</p>
                                </div>
                                <div>
                                    <h6 className="font-bold uppercase-spaced text-[0.65rem] mb-2 text-navy">Känslighet: Talent Retention</h6>
                                    <p className="opacity-70 leading-relaxed text-xs">Risk för 'Brain Drain' till mer AI-mogna organisationer. Utan intern AI-infrastruktur tappar ni era topp-presterare inom 12 månader.</p>
                                </div>
                            </div>
                            <div className="mt-8 p-4 bg-navy text-white text-center italic text-xs no-print">
                                "Den fördjupade simuleringsrapporten och teknisk bilaga ingår i PDF-exporten."
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .bg-soft { background: #f4f6f8; }
                .bg-navy { background: var(--primary-navy); }
                .text-navy { color: var(--primary-navy); }
                .loader { width: 40px; height: 40px; border: 3px solid #eee; border-top-color: var(--primary-navy); border-radius: 50%; animation: spin 1s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                
                .print-only {
                    position: absolute;
                    top: -9999px;
                    left: -9999px;
                    opacity: 0;
                    pointer-events: none;
                }

                @media print {
                    .no-print, nav { display: none !important; }
                    .print-only { 
                        position: static !important; 
                        display: block !important; 
                        opacity: 1 !important;
                    }
                    .page-break-after { page-break-after: always; }
                    .container { width: 100% !important; max-width: none !important; padding: 0 !important; margin: 0 !important; }
                    .card { border: 1px solid #eee !important; box-shadow: none !important; break-inside: avoid; margin-bottom: 2rem; }
                    .bg-navy { background: #002B49 !important; -webkit-print-color-adjust: exact; color: white !important; }
                    .bg-soft { background: #f4f6f8 !important; -webkit-print-color-adjust: exact; }
                    body { background: white !important; }
                }
            `}</style>
        </div>
    );
}
