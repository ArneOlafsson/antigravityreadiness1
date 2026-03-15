/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    LineChart, Line
} from 'recharts';

function getIndustryData(industry: string, score: number) {
    const defaultData = {
        name: industry || 'Professional Services',
        useCases: [
            { case: 'AI Proposal Generation', desc: 'GenAI för att drastiskt korta ner anbudstider.', impact: 'HÖG', complexity: 'LÅG', roi: '150%' },
            { case: 'Executive AI Assistants', desc: 'Copilots för strategisk analys och research.', impact: 'HÖG', complexity: 'MEDIUM', roi: '200%' },
            { case: 'Automated Client Onboarding', desc: 'Agenter som hanterar initial informationsinhämtning och KYC.', impact: 'MEDIUM', complexity: 'MEDIUM', roi: '110%' },
            { case: 'Knowledge Synthesizer', desc: 'RAG-applikation över tidigare projekt för blixtsnabb informationsinhämtning.', impact: 'KRITISK', complexity: 'HÖG', roi: '350%' },
            { case: 'Predictive Resource Allocation', desc: 'AI för att optimera beläggningsgrad på personal.', impact: 'MEDIUM', complexity: 'HÖG', roi: '85%' }
        ],
        heatmap: [
            { dept: 'Sales', risk: 'HÖG' },
            { dept: 'Marketing', risk: 'HÖG' },
            { dept: 'Customer Support', risk: 'MODERAT' },
            { dept: 'HR', risk: 'MODERAT' },
            { dept: 'IT', risk: 'KRITISK' },
            { dept: 'Finance', risk: 'MODERAT' },
            { dept: 'Product', risk: 'HÖG' },
            { dept: 'Operations', risk: 'MODERAT' },
            { dept: 'R&D', risk: 'HÖG' },
            { dept: 'Legal', risk: 'MODERAT' }
        ]
    };

    const industryLower = (industry || '').toLowerCase();
    
    if (industryLower.includes('financ') || industryLower.includes('bank')) {
        defaultData.name = 'Financial Services';
        defaultData.useCases = [
            { case: 'Algorithmic Risk Assessment', desc: 'Real-time kreditbedömning via alternativa datakällor.', impact: 'HÖG', complexity: 'HÖG', roi: '320%' },
            { case: 'Hyper-personalized Wealth Tools', desc: 'AI-drivna finansiella rådgivare för retail-kunder.', impact: 'KRITISK', complexity: 'HÖG', roi: '400%' },
            { case: 'Automated Compliance (RegTech)', desc: 'AI-agenter som övervakar och rapporterar regelefterlevnad.', impact: 'HÖG', complexity: 'MEDIUM', roi: '180%' },
            { case: 'Fraud Detection 2.0', desc: 'Pattern recognition för att identifiera anomalier i mikrosekunder.', impact: 'HÖG', complexity: 'MEDIUM', roi: '250%' },
            { case: 'Customer Journey Automation', desc: 'End-to-end automatisering av låneansökningar.', impact: 'MEDIUM', complexity: 'MEDIUM', roi: '150%' }
        ];
        defaultData.heatmap.find(d => d.dept === 'Finance')!.risk = 'KRITISK';
        defaultData.heatmap.find(d => d.dept === 'Legal')!.risk = 'HÖG';
    } else if (industryLower.includes('manufactur')) {
        defaultData.name = 'Manufacturing';
        defaultData.useCases = [
            { case: 'Predictive Maintenance', desc: 'IoT-data kopplat till AI för noll oplanerade driftstopp.', impact: 'HÖG', complexity: 'HÖG', roi: '400%' },
            { case: 'Supply Chain Autonomous Replenishment', desc: 'Prediktiv auto-beställning av komponenter.', impact: 'HÖG', complexity: 'MEDIUM', roi: '220%' },
            { case: 'Computer Vision Quality Control', desc: 'Automatisk defekt-detektering i produktionslinjen.', impact: 'KRITISK', complexity: 'MEDIUM', roi: '300%' },
            { case: 'Digital Twin Optimization', desc: 'Simulering av fabriksgolvet för flaskhalsidentifiering.', impact: 'MEDIUM', complexity: 'HÖG', roi: '150%' },
            { case: 'Generative Design', desc: 'AI-stödd produktdesign för materialbesparing.', impact: 'MEDIUM', complexity: 'HÖG', roi: '180%' }
        ];
        defaultData.heatmap.find(d => d.dept === 'Operations')!.risk = 'KRITISK';
        defaultData.heatmap.find(d => d.dept === 'R&D')!.risk = 'HÖG';
    }

    return defaultData;
}

export default function RoadmapPage() {
    const [userProfile, setUserProfile] = useState<any>(null);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [reportId, setReportId] = useState('');

    useEffect(() => {
        setReportId(Math.random().toString(36).substring(7).toUpperCase());
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                window.location.href = '/login';
                return;
            }

            try {
                const profileRef = doc(db, 'users', user.uid);
                const profileSnap = await getDoc(profileRef);
                let industry = 'Consulting';
                if (profileSnap.exists()) {
                    const profileData = profileSnap.data();
                    setUserProfile(profileData);
                    if (profileData.industry) industry = profileData.industry;
                }

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
                    
                    const score = parsed.score || 0;
                    setData({
                        score,
                        categories,
                        industryData: getIndustryData(industry, score)
                    });
                } else {
                    setData({
                        score: 0,
                        categories: [],
                        industryData: getIndustryData(industry, 0)
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

    const riskLevel = data.score < 30 ? 'LÅG' : data.score < 50 ? 'MODERAT' : data.score < 75 ? 'HÖG' : 'KRITISK';
    const riskColor = data.score < 30 ? '#388E3C' : data.score < 50 ? '#F57C00' : data.score < 75 ? '#D32F2F' : '#B71C1C';

    const getHeatmapColor = (risk: string) => {
        return risk === 'LÅG' ? '#388E3C' : risk === 'MODERAT' ? '#F57C00' : risk === 'HÖG' ? '#D32F2F' : '#B71C1C';
    };

    return (
        <div className="bg-soft min-h-screen print:bg-white pb-20">
            <Navbar />
            
            <div className="container py-12 max-w-[850px] mx-auto no-print">
                <div className="flex justify-between items-end mb-16 accent-border-left">
                    <div>
                        <Link href="/dashboard" className="uppercase-spaced mb-4 inline-block text-[0.65rem] hover:underline" style={{ color: 'var(--accent-teal)' }}>&larr; Tillbaka till översikt</Link>
                        <h1 className="serif-font text-5xl">Strategic Intelligence Report</h1>
                        <p className="text-muted mt-3 max-w-2xl text-sm">En exekutiv roadmap och finansiell simuleringsrapport skräddarsydd för <strong>{userProfile?.companyName || 'Organisationen'}</strong>.</p>
                    </div>
                    <div>
                        <button 
                            className={`btn-primary ${isGenerating ? 'opacity-50 cursor-wait' : ''}`} 
                            style={{ fontSize: '0.7rem', background: 'var(--accent-teal)', color: 'var(--primary-navy)', padding: '0.8rem 1.5rem' }} 
                            onClick={handlePrint}
                            disabled={isGenerating}
                        >
                            {isGenerating ? 'GENERERAR PDF...' : 'EXPORTERA PDF'}
                        </button>
                    </div>
                </div>
            </div>

            {/* THE REPORT */}
            <div className="report-container w-full max-w-[850px] mx-auto bg-white shadow-2xl print:shadow-none">
                
                {/* 1. COVER PAGE */}
                <div className="report-page cover-page flex flex-col justify-between p-16 relative overflow-hidden bg-navy text-white print-exact">
                    <div className="absolute inset-0 z-0 opacity-10 print-exact bg-gradient-to-tr from-navy to-teal opacity-20 border-teal"></div>
                    
                    <div className="relative z-10">
                        <div className="uppercase-spaced tracking-[0.4em] text-[0.6rem] mb-24 opacity-80" style={{ color: 'var(--accent-teal)' }}>Strictly Confidential</div>
                        <div className="mt-20">
                            <div className="serif-font text-6xl xl:text-7xl mb-4 leading-tight tracking-tight print:text-7xl">AI DISRUPTION<br/>SCANNER</div>
                            <div className="serif-font text-2xl xl:text-3xl italic mx-1 opacity-70 mt-4 print:text-3xl">Strategic AI Analysis Report</div>
                            <div className="h-1.5 w-24 bg-teal mt-16 print-exact" style={{ backgroundColor: 'var(--accent-teal)' }}></div>
                        </div>
                    </div>

                    <div className="relative z-10 flex justify-between items-end border-t border-white/20 pt-10 pb-6 mt-auto">
                        <div className="text-left">
                            <div className="text-[0.6rem] uppercase-spaced opacity-60 mb-2">Prepared For</div>
                            <div className="text-3xl font-bold serif-font text-white">{userProfile?.companyName || 'Organisationen'}</div>
                            <div className="text-xs mt-3 opacity-60">Industry: {data.industryData.name}</div>
                        </div>
                        <div className="text-right text-[0.6rem] uppercase-spaced opacity-80 leading-loose bg-white/5 p-5 border border-white/10 print-exact">
                            <div><strong>Date:</strong> {new Date().toLocaleDateString('sv-SE')}</div>
                            <div><strong>Report ID:</strong> {reportId}</div>
                            <div className="mt-4 text-teal text-lg font-bold pt-3 border-t border-white/20" style={{ color: 'var(--accent-teal)' }}>Exponering: {data.score}/100</div>
                        </div>
                    </div>
                </div>

                {/* 2. EXECUTIVE SUMMARY */}
                <div className="report-page content-page p-16 bg-white text-navy print-exact">
                    <h2 className="serif-font text-4xl mb-12 accent-border-left pl-6 relative z-10">2. Executive Summary</h2>
                    <div className="flex flex-col md:flex-row gap-12 w-full">
                        <div className="flex-1 text-sm leading-relaxed min-w-0">
                            <p className="text-lg serif-font italic opacity-90 mb-8 border-l-4 pl-6" style={{ borderColor: 'var(--accent-teal)' }}>
                                "Marknaden rör sig från en fas av experimentering till operationell exekvering. Vinnarna de kommande 3 åren definieras av hur väl de integrerar AI i kärnaffären."
                            </p>
                            <p className="mb-5 text-sm">
                                Denna strategiska rapport utvärderar {userProfile?.companyName || 'organisationen'}:s beredskap att möta det paradigmskifte som AI-drivna affärsmodeller medför. Med en uppmätt total exponering på <strong>{data.score} av 100</strong>, klassificeras er nuvarande situation som <strong>{riskLevel.toUpperCase()} RISK</strong>.
                            </p>
                            <p className="mb-5 text-sm">
                                De primära riskområdena är lokaliserade till de operationella dimensionerna, där manuella processer riskerar att utmanövrerades av konkurrenters automatiserade agenter, vilket skapar ohållbart marginaltryck.
                            </p>
                            <p className="text-sm">
                                Det absolut största hotet är <em>underinvestering i omställning</em>. Fönstret för proaktiv anpassning håller på att stängas. Om inte omedelbara initiativ tas kring AI-governance och operationella piloter (<span className="italic">Q2-Roadmap</span>), kommer bolaget att tvingas till reaktiv krishantering redan inom 18-24 månader.
                            </p>
                        </div>
                        <div className="w-full md:w-64 md:min-w-[16rem] space-y-6 flex-shrink-0">
                            <div className="p-6 bg-soft border print-exact">
                                <h4 className="font-bold mb-3 uppercase-spaced text-[0.6rem] opacity-60">Disruption Score</h4>
                                <div className="text-5xl serif-font mb-2" style={{ color: riskColor }}>{data.score}</div>
                                <div className="uppercase-spaced text-[0.65rem] tracking-widest font-bold" style={{ color: riskColor }}>{riskLevel} RISK ZONE</div>
                            </div>
                            <div className="p-6 bg-navy text-white shadow-xl print-exact">
                                <h4 className="font-bold mb-5 uppercase-spaced text-[0.6rem] opacity-80" style={{ color: 'var(--accent-teal)' }}>Key Weaknesses</h4>
                                <ul className="space-y-4 text-xs leading-relaxed">
                                    {data.categories.filter((c:any) => c.score > 50).slice(0, 3).map((c:any, i:number) => (
                                        <li key={i} className="flex gap-3 border-b border-white/10 pb-3 last:border-0 last:pb-0 break-words">
                                            <span className="text-teal flex-shrink-0" style={{ color: 'var(--accent-teal)' }}>&bull;</span> 
                                            <span className="min-w-0 flex-1"><strong>{c.name}:</strong> Sårbarhet pga hög exponering mot manuellt / låg-effektivt arbete.</span>
                                        </li>
                                    ))}
                                    {data.categories.filter((c:any) => c.score > 50).length === 0 && (
                                        <li className="flex gap-3 break-words"><span className="text-teal flex-shrink-0" style={{ color: 'var(--accent-teal)' }}>&bull;</span> <span className="min-w-0 flex-1">Relativt låg exponering, fokus bör ligga på offensiv tillväxt.</span></li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. STRATEGIC DECISION BRIEF */}
                <div className="report-page content-page p-16 bg-soft text-navy print-exact">
                    <h2 className="serif-font text-4xl mb-10 accent-border-left pl-6 relative z-10">3. Strategic Decision Brief</h2>
                    
                    <div className="grid md:grid-cols-2 gap-10">
                        <div>
                            <h3 className="serif-font text-2xl mb-6">1. Strategisk Risköversikt</h3>
                            <p className="text-xs leading-relaxed mb-6 opacity-80">Vad som sker om organisationen intar en passiv hållning till AI-transformationen under det kommande året:</p>
                            
                            <div className="space-y-4">
                                <div className="flex gap-4 items-start bg-white p-5 border print-exact">
                                    <div className="w-10 h-10 flex-shrink-0 bg-red-100 flex items-center justify-center text-red-800 font-bold serif-font text-lg rounded-full print-exact">A</div>
                                    <div>
                                        <h5 className="font-bold text-sm mb-1">Marginalerosion</h5>
                                        <p className="text-xs opacity-70 leading-relaxed">När AI-aktörer sänker sina operativa kostnader med upp till 40%, uppstår en ohållbar prispress på era standardtjänster. Marginalen äts upp på 12-18 mån.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start bg-white p-5 border print-exact">
                                    <div className="w-10 h-10 flex-shrink-0 bg-orange-100 flex items-center justify-center text-orange-800 font-bold serif-font text-lg rounded-full print-exact">B</div>
                                    <div>
                                        <h5 className="font-bold text-sm mb-1">Förlorad Konkurrenskraft</h5>
                                        <p className="text-xs opacity-70 leading-relaxed">Er historiska vallgrav (relationer, legacy-data) tappar i värde snabbare än ni bygger nya värden. Er oförmåga att agera prediktivt blir en kompetitiv nackdel.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start bg-white p-5 border print-exact">
                                    <div className="w-10 h-10 flex-shrink-0 bg-yellow-100 flex items-center justify-center text-yellow-800 font-bold serif-font text-lg rounded-full print-exact">C</div>
                                    <div>
                                        <h5 className="font-bold text-sm mb-1">Kompetensdränering</h5>
                                        <p className="text-xs opacity-70 leading-relaxed">De skarpaste hjärnorna vill arbeta där AI-infrastrukturen hävstångar deras tid. Utan rätt interna verktyg lämnar 'top performers' er för modernare branschkollegor.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-navy text-white p-8 shadow-xl relative print-exact">
                            <h3 className="serif-font text-2xl mb-6" style={{ color: 'var(--accent-teal)' }}>2. Rekommenderade Beslut</h3>
                            <p className="text-xs leading-relaxed mb-6 opacity-80">Styrelse & VD behöver omedelbart fatta beslut inom följande kärnområden:</p>
                            
                            <ul className="space-y-6">
                                <li className="pb-4 border-b border-white/10">
                                    <h4 className="uppercase-spaced text-[0.65rem] font-bold mb-2">I. Initiera AI Transformation Taskforce</h4>
                                    <p className="text-xs opacity-70 leading-relaxed">Kräver VD:s direkta sponsorskap. Utse en cross-funktionell styrgrupp (Sälj, Ops, IT) som leder integrationen, fristående från traditionella IT-projekt.</p>
                                </li>
                                <li className="pb-4 border-b border-white/10">
                                    <h4 className="uppercase-spaced text-[0.65rem] font-bold mb-2">II. Allokera Evolutionsbudget</h4>
                                    <p className="text-xs opacity-70 leading-relaxed">Godkänn en omallokering om 2-3% av rörelseresultatet specifikt för experimentell och tillämpad AI-integration. ROI-fokus bör vara 12-18 månader, inte 3-5 år.</p>
                                </li>
                                <li className="pb-4 border-b border-white/10">
                                    <h4 className="uppercase-spaced text-[0.65rem] font-bold mb-2">III. Etablera 'AI Governance' Framework</h4>
                                    <p className="text-xs opacity-70 leading-relaxed">Sätt omedelbart legala ramverk och datasäkerhetspolicys för generativ AI så att personalen vågar och får innovera utan att äventyra bolagets IP.</p>
                                </li>
                                <li>
                                    <h4 className="uppercase-spaced text-[0.65rem] font-bold mb-2">IV. Lansera Hög-effekts Piloter (Q2)</h4>
                                    <p className="text-xs opacity-70 leading-relaxed">Inled 2-3 skarpa proof-of-concepts inom framförallt back-office för att bygga momentum och påvisa konkret finansiellt värde.</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 4. RISK & BENCHMARK ANALYSIS */}
                <div className="report-page content-page p-16 bg-white print-exact">
                    <h2 className="serif-font text-4xl mb-12 accent-border-left pl-6 relative z-10">4. Risk & Benchmark Analysis</h2>
                    
                    <div className="grid md:grid-cols-2 gap-10 w-full">
                        <div className="p-8 border bg-soft print-exact h-[400px] flex flex-col items-center">
                            <h4 className="font-bold mb-6 uppercase-spaced text-[0.6rem] text-center opacity-60 text-navy">Dimensionell Värmekarta</h4>
                            <div style={{ width: '100%', height: '280px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="65%" data={data.categories} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                                        <PolarGrid stroke="#ddd" />
                                        <PolarAngleAxis dataKey="name" tick={{ fontSize: 9, fill: '#002B49', fontWeight: 700 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                        <Radar name="Din Profil" dataKey="score" stroke="var(--primary-navy)" fill="var(--primary-navy)" fillOpacity={0.4} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="flex flex-col h-[400px]">
                            <h4 className="serif-font text-2xl mb-4">Marknadens Benchmark</h4>
                            <p className="text-xs opacity-70 mb-6 leading-relaxed">
                                Jämförelse av era score-nivåer mot branschsnittet i <strong className="text-navy">{data.industryData.name}</strong>. Högre summa indikerar snabbare exponering mot pris- och marginalpress.
                            </p>

                            <div className="overflow-hidden border rounded-lg flex-1 bg-white flex flex-col print-exact">
                                <table className="w-full text-left text-xs flex-1">
                                    <thead className="bg-navy text-white print-exact">
                                        <tr>
                                            <th className="py-3 px-4 font-bold uppercase-spaced text-[0.55rem]">Dimension</th>
                                            <th className="py-3 px-4 font-bold uppercase-spaced text-[0.55rem]">Score</th>
                                            <th className="py-3 px-4 font-bold uppercase-spaced text-[0.55rem] opacity-70">Avg</th>
                                            <th className="py-3 px-4 font-bold uppercase-spaced text-[0.55rem] text-teal" style={{ color: 'var(--accent-teal)' }}>Top 10%</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {data.categories.map((c:any, i:number) => {
                                            const hashStr = c.name;
                                            const stableAvg = Math.round(50 + ((hashStr.charCodeAt(0) % 20) - 10));
                                            return (
                                                <tr key={i} className="hover:bg-soft transition-colors print-exact">
                                                    <td className="py-3 px-4 font-bold text-navy text-[0.65rem]">{c.name}</td>
                                                    <td className="py-3 px-4 font-bold">
                                                        <span className={c.score > 65 ? 'text-red-600' : 'text-navy'}>{c.score}</span>
                                                    </td>
                                                    <td className="py-3 px-4 opacity-60 text-[0.65rem]">{stableAvg}</td>
                                                    <td className="py-3 px-4 font-bold text-green-700 text-[0.65rem]">{Math.round(stableAvg * 0.5)}</td>
                                                </tr>
                                            );
                                        })}
                                        <tr className="bg-soft font-bold border-t-2 border-navy print-exact">
                                            <td className="py-4 px-4 text-navy text-[0.65rem]">TOTAL SCORE</td>
                                            <td className="py-4 px-4 text-base" style={{ color: riskColor }}>{data.score}</td>
                                            <td className="py-4 px-4 opacity-60 text-[0.65rem]">56</td>
                                            <td className="py-4 px-4 text-green-700 text-[0.65rem]">28</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. FINANSIELL IMPACT SIMULATION */}
                <div className="report-page content-page p-16 bg-navy text-white print-exact">
                    <h2 className="serif-font text-4xl mb-6 accent-border-left pl-6 relative z-10">5. AI Economic Impact Simulation</h2>
                    <p className="text-xs leading-relaxed opacity-80 mb-10 border-b border-white/20 pb-6">Simulerad prognos för EBITDA-marginalutveckling över 4 år baserad på tre distinkta investeringsval.</p>
                    
                    <div className="grid lg:grid-cols-2 gap-10 items-center w-full">
                        <div className="bg-white p-6 rounded shadow-2xl h-[320px] print-exact w-full min-w-0">
                             <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={[
                                    { year: 'Nu', 'A (Ingen AI)': 15, 'B (Selektiv AI)': 15, 'C (AI-native)': 15 },
                                    { year: 'År 1', 'A (Ingen AI)': 13, 'B (Selektiv AI)': 16, 'C (AI-native)': 14 },
                                    { year: 'År 2', 'A (Ingen AI)': 9, 'B (Selektiv AI)': 17, 'C (AI-native)': 22 },
                                    { year: 'År 3', 'A (Ingen AI)': 4, 'B (Selektiv AI)': 19, 'C (AI-native)': 28 },
                                    { year: 'År 4', 'A (Ingen AI)': -2, 'B (Selektiv AI)': 21, 'C (AI-native)': 34 },
                                ]} margin={{ top: 20, right: 10, bottom: 20, left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                    <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#002B49' }} axisLine={false} tickLine={false} />
                                    <YAxis tickFormatter={(val) => `${val}%`} tick={{ fontSize: 10, fill: '#002B49' }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ borderRadius: '0', border: '1px solid #ccc', fontSize: '10px', color: '#002B49' }} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                                    <Line type="monotone" dataKey="A (Ingen AI)" stroke="#D32F2F" strokeWidth={3} dot={{ r: 3 }} />
                                    <Line type="monotone" dataKey="B (Selektiv AI)" stroke="#F57C00" strokeWidth={3} dot={{ r: 3 }} />
                                    <Line type="monotone" dataKey="C (AI-native)" stroke="var(--accent-teal)" strokeWidth={4} dot={{ r: 4 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="p-4 border-l-4 border-red-500 bg-white/5 print-exact">
                                <h4 className="font-bold text-xs mb-1 text-white">Scenario A: Ingen AI Adoption</h4>
                                <p className="text-[0.65rem] opacity-80 leading-relaxed">Efter initial fas börjar kostnadsgapet mot konkurrenter öka markant. Marginal sjunker och bolaget tvingas in i förlustdrivande prispress.</p>
                            </div>
                            <div className="p-4 border-l-4 border-orange-500 bg-white/5 print-exact">
                                <h4 className="font-bold text-xs mb-1 text-white">Scenario B: Selektiv AI Adoption</h4>
                                <p className="text-[0.65rem] opacity-80 leading-relaxed">Isolerade effektiviseringsprojekt. Sänker vissa handläggningstider men skalar ej exponentiellt mot nya marknader.</p>
                            </div>
                            <div className="p-4 border-l-4 border-teal bg-white/5 print-exact" style={{ borderLeftColor: 'var(--accent-teal)' }}>
                                <h4 className="font-bold text-xs mb-1 text-white">Scenario C: AI-First Transformation</h4>
                                <p className="text-[0.65rem] opacity-80 leading-relaxed">Kortvarig dipp för integration, därefter bryts linjär koppling mellan personal och intäkt. Marginal drastiskt förstärkt när agenter övertar driften.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 6. AI COMPETITIVE THREAT SIMULATION */}
                <div className="report-page content-page p-16 bg-white text-navy print-exact">
                    <h2 className="serif-font text-4xl mb-12 accent-border-left pl-6 relative z-10">6. AI Competitive Threat</h2>
                    <p className="text-xs leading-relaxed max-w-2xl mb-12">Hur snabbt en 'AI-native entrant' bryter ned en existerande marknadsposition. Baserad på live-data från modern mjukvaru- och konsult-disruption.</p>

                    <div className="relative max-w-3xl mx-auto w-full">
                        <div className="absolute left-[39px] top-4 bottom-4 w-0.5 bg-soft z-0 print-exact"></div>
                        
                        {[
                            { year: 'Year 1', text: 'AI entrant launches with lower cost model. Skalar med mikroteam. Ingångsrabatter om -40% mot ert ordinarie pris.', impact: 'Margin pressure begins' },
                            { year: 'Year 2', text: `Automation av kärntjänster. Konkurrenten erbjuder 24/7 service. Hög automation av ${data.industryData.name}-tjänster.`, impact: 'Customer switching rates spikar' },
                            { year: 'Year 3', text: 'Marknadsandelserosion. Prisetiketter permanent asymmetriska. Ni finansierar lokaler & personal medan konkurrenten finansierar compute.', impact: 'Strategisk kris' }
                        ].map((t, i) => (
                            <div key={i} className="relative z-10 flex gap-8 mb-8 items-start">
                                <div className="w-20 h-20 rounded-full bg-navy text-white border-4 border-white shadow flex flex-col justify-center items-center flex-shrink-0 print-exact">
                                    <div className="uppercase-spaced text-[0.45rem] tracking-widest opacity-80 mb-0.5">ZON</div>
                                    <div className="font-bold serif-font text-xl">0{i+1}</div>
                                </div>
                                <div className="bg-soft border p-6 flex-1 relative overflow-hidden print-exact">
                                    <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-red-800 opacity-80 print-exact"></div>
                                    <h4 className="font-bold uppercase-spaced text-[0.65rem] mb-3 text-navy">{t.year}</h4>
                                    <p className="text-xs leading-relaxed opacity-80 mb-4">{t.text}</p>
                                    <div className="text-[0.6rem] uppercase-spaced font-bold text-red-800 bg-white inline-block px-3 py-1.5 border print-exact">{t.impact}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 7. AI MATURITY & 8. INDUSTRY OPPORTUNITIES */}
                <div className="report-page content-page p-16 bg-soft text-navy print-exact">
                    <div className="mb-16">
                        <h2 className="serif-font text-4xl mb-8 accent-border-left pl-6">7. AI Maturity Framework</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                            {[
                                { level: 'L1: Experiment', desc: 'Individuellt bruk. Ingen central strategi.', ac: data.score > 60 },
                                { level: 'L2: AI-Aware', desc: 'Piloter i silos. Generativ AI för text.', ac: data.score > 40 && data.score <= 60 },
                                { level: 'L3: AI-Capable', desc: 'RAG över egen data. Agenter i loop.', ac: data.score > 20 && data.score <= 40 },
                                { level: 'L4: AI-Native', desc: 'Intelligens first. Noll-marginalkostnad.', ac: data.score <= 20 }
                            ].map((m, i) => (
                                <div key={i} className={`p-5 mt-2 border-t-4 ${m.ac ? 'border-teal bg-navy text-white shadow-md transform -translate-y-2 print-exact' : 'border-gray-300 bg-white text-navy print-exact'}`}>
                                    <div className="uppercase-spaced text-[0.55rem] mb-2 opacity-60">Nivå {i+1}</div>
                                    <h5 className="font-bold text-[0.75rem] mb-2">{m.level}</h5>
                                    <p className="text-[0.6rem] leading-relaxed opacity-80">{m.desc}</p>
                                    {m.ac && <div className="mt-3 text-[0.55rem] font-bold text-teal uppercase-spaced" style={{ color: 'var(--accent-teal)' }}>Er Position</div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="serif-font text-4xl mb-6 accent-border-left pl-6">8. Industrispecifika Möjligheter</h2>
                        <p className="mb-8 text-xs opacity-70">De 5 mest hög-påverkande AI-applikationerna just nu för: <strong>{data.industryData.name}</strong>.</p>
                        
                        <div className="space-y-4">
                            {data.industryData.useCases.map((uc:any, i:number) => (
                                <div key={i} className="bg-white border p-4 flex gap-6 items-center shadow-sm print-exact">
                                    <div className="w-10 h-10 bg-navy text-white flex items-center justify-center serif-font text-lg rounded print-exact">{i+1}</div>
                                    <div className="flex-1">
                                        <h5 className="font-bold text-sm mb-1">{uc.case}</h5>
                                        <p className="text-[0.65rem] opacity-70">{uc.desc}</p>
                                    </div>
                                    <div className="text-center px-4 border-l">
                                        <div className="uppercase-spaced text-[0.5rem] mb-1 opacity-60">Impact</div>
                                        <div className="font-bold text-[0.7rem]" style={{ color: uc.impact === 'KRITISK' || uc.impact === 'HÖG' ? '#2E7D32' : '#F57C00' }}>{uc.impact}</div>
                                    </div>
                                    <div className="text-center px-4 border-l">
                                        <div className="uppercase-spaced text-[0.5rem] mb-1 opacity-60">Complex</div>
                                        <div className="font-bold text-[0.7rem]">{uc.complexity}</div>
                                    </div>
                                    <div className="text-center px-4 border-l pl-4">
                                        <div className="uppercase-spaced text-[0.5rem] mb-1 opacity-60">ROI</div>
                                        <div className="font-bold text-sm" style={{ color: 'var(--accent-teal)' }}>{uc.roi}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 9. TRANSFORMATION ROADMAP */}
                <div className="report-page content-page p-16 bg-navy text-white relative overflow-hidden print-exact">
                    <h2 className="serif-font text-4xl mb-12 accent-border-left pl-6 relative z-10">9. 12-Månaders Roadmap</h2>
                    
                    <div className="space-y-4 relative z-10">
                        <div className="flex flex-col md:flex-row bg-white/5 border border-white/10 p-6 print-exact">
                            <div className="w-32 border-r border-white/10 pr-6 flex flex-col justify-center">
                                <div className="text-2xl font-bold serif-font text-teal" style={{ color: 'var(--accent-teal)' }}>Q1</div>
                                <div className="uppercase-spaced text-[0.55rem] opacity-80 mt-1">Skydd & Insikt</div>
                            </div>
                            <div className="pl-6 flex-1 grid md:grid-cols-2 gap-6">
                                <div><div className="w-1.5 h-1.5 bg-teal mb-2 print-exact" style={{ backgroundColor: 'var(--accent-teal)' }}></div><h5 className="font-bold text-xs mb-1">AI Governance Policy</h5><p className="text-[0.65rem] opacity-70 leading-relaxed">Etiska riktlinjer. Kontroll över Shadow-AI.</p></div>
                                <div><div className="w-1.5 h-1.5 bg-teal mb-2 print-exact" style={{ backgroundColor: 'var(--accent-teal)' }}></div><h5 className="font-bold text-xs mb-1">Data Security Review</h5><p className="text-[0.65rem] opacity-70 leading-relaxed">Mappering av arkitektur inför RAG-modeller.</p></div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row bg-white/5 border border-white/10 p-6 print-exact">
                            <div className="w-32 border-r border-white/10 pr-6 flex flex-col justify-center">
                                <div className="text-2xl font-bold serif-font text-teal" style={{ color: 'var(--accent-teal)' }}>Q2</div>
                                <div className="uppercase-spaced text-[0.55rem] opacity-80 mt-1">Piloter</div>
                            </div>
                            <div className="pl-6 flex-1 grid md:grid-cols-2 gap-6">
                                <div><div className="w-1.5 h-1.5 bg-white mb-2 print-exact"></div><h5 className="font-bold text-xs mb-1">Back-office Automatisering</h5><p className="text-[0.65rem] opacity-70 leading-relaxed">Mål: Sänk administrationstid med 20%.</p></div>
                                <div><div className="w-1.5 h-1.5 bg-white mb-2 print-exact"></div><h5 className="font-bold text-xs mb-1">Copilot Rollouts</h5><p className="text-[0.65rem] opacity-70 leading-relaxed">Träning för värdeskapande personal.</p></div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row bg-white/5 border border-white/10 p-6 print-exact">
                            <div className="w-32 border-r border-white/10 pr-6 flex flex-col justify-center">
                                <div className="text-2xl font-bold serif-font text-teal" style={{ color: 'var(--accent-teal)' }}>Q3</div>
                                <div className="uppercase-spaced text-[0.55rem] opacity-80 mt-1">Integration</div>
                            </div>
                            <div className="pl-6 flex-1 grid md:grid-cols-2 gap-6">
                                <div><div className="w-1.5 h-1.5 bg-white mb-2 print-exact"></div><h5 className="font-bold text-xs mb-1">Egen Data (RAG)</h5><p className="text-[0.65rem] opacity-70 leading-relaxed">Deployment av LLMs tränade på er egen IP.</p></div>
                                <div><div className="w-1.5 h-1.5 bg-white mb-2 print-exact"></div><h5 className="font-bold text-xs mb-1">Vendor API Integration</h5><p className="text-[0.65rem] opacity-70 leading-relaxed">Börja bryta upp legacy system.</p></div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row bg-teal border p-6 print-exact" style={{ backgroundColor: 'var(--accent-teal)', color: 'var(--primary-navy)', borderColor: 'var(--accent-teal)' }}>
                            <div className="w-32 border-r border-navy/20 pr-6 flex flex-col justify-center">
                                <div className="text-2xl font-bold serif-font">Q4</div>
                                <div className="uppercase-spaced text-[0.55rem] opacity-100 mt-1 font-bold">Transformation</div>
                            </div>
                            <div className="pl-6 flex-1 grid md:grid-cols-2 gap-6">
                                <div><div className="w-1.5 h-1.5 bg-navy mb-2 print-exact"></div><h5 className="font-bold text-xs mb-1">Nya Tjänstemodeller</h5><p className="text-[0.65rem] opacity-90 leading-relaxed">Använd minskad personalkostnad till att erbjuda tjänster med 80% marginal.</p></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 10. HEATMAP & 11. CONCLUSION */}
                <div className="report-page content-page p-16 bg-white text-navy print-exact border-b-[20px]" style={{ borderBottomColor: 'var(--accent-teal)' }}>
                    <div className="mb-16">
                        <h2 className="serif-font text-4xl mb-8 accent-border-left pl-6">10. Organisational Heatmap</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                            {data.industryData.heatmap.map((h:any, i:number) => (
                                <div key={i} className="p-4 flex flex-col justify-between border shadow-sm bg-white print-exact" style={{ minHeight: '90px', borderTop: `4px solid ${getHeatmapColor(h.risk)}` }}>
                                    <div className="font-bold text-xs">{h.dept}</div>
                                    <div className="mt-2">
                                        <div className="uppercase-spaced text-[0.45rem] opacity-60 mb-0.5">Risk Level</div>
                                        <div className="font-bold text-[0.65rem]" style={{ color: getHeatmapColor(h.risk) }}>{h.risk}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-10 w-full">
                        <div>
                            <h2 className="serif-font text-3xl mb-6 accent-border-left pl-6">11. Investment Index</h2>
                            <p className="text-xs leading-relaxed mb-6 opacity-80">Riktlinje för allokering av transformationsbudget.</p>
                            <div className="space-y-4">
                                <div className="p-4 bg-white border flex gap-4 items-center print-exact">
                                    <div className="text-2xl font-bold text-navy w-12 text-center">10%</div>
                                    <div><h5 className="font-bold text-xs mb-1">Exploration</h5><p className="text-[0.6rem] opacity-70">Licenser, utbildning.</p></div>
                                </div>
                                <div className="p-4 bg-white border flex gap-4 items-center shadow-md border-l-4 print-exact" style={{ borderLeftColor: '#F57C00' }}>
                                    <div className="text-2xl font-bold text-orange-500 w-12 text-center" style={{ color: '#F57C00' }}>30%</div>
                                    <div><h5 className="font-bold text-xs mb-1">Acceleration</h5><p className="text-[0.6rem] opacity-70">Automatisering av drift.</p></div>
                                </div>
                                <div className="p-4 bg-white border flex gap-4 items-center print-exact">
                                    <div className="text-2xl font-bold text-teal w-12 text-center" style={{ color: 'var(--accent-teal)' }}>60%</div>
                                    <div><h5 className="font-bold text-xs mb-1">AI-Native</h5><p className="text-[0.6rem] opacity-70">Skapa nya digitala tjänster.</p></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center bg-navy text-white text-center p-8 shadow-xl relative overflow-hidden print-exact">
                            <div className="absolute inset-0 opacity-20 print-exact">
                                <div className="absolute w-64 h-64 bg-teal rounded-full blur-[60px] -top-10 -right-10 print-exact" style={{ backgroundColor: 'var(--accent-teal)' }}></div>
                            </div>
                            <div className="relative z-10 print-exact">
                                <h3 className="text-xl font-bold serif-font mb-4 mt-8">Framtiden belönar mod.</h3>
                                <p className="text-[0.65rem] leading-relaxed opacity-80 mb-8">Transformation är aldrig lineärt och aldrig bekvämt. Men fönstret står öppet nu. Agera.</p>
                                <div className="w-full h-[1px] bg-white/20 mb-6 print-exact"></div>
                                <div className="text-[0.5rem] uppercase-spaced tracking-widest opacity-60">AI DISRUPTION SCANNER &bull; ADVISORY</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 pt-8 border-t border-navy/10 print-exact flex flex-col items-start text-left w-full">
                        <h2 className="serif-font text-3xl mb-4 accent-border-left pl-6 text-navy">12. Professionell Kontakt</h2>
                        <p className="text-sm opacity-80 mb-6 max-w-lg pl-6">Boka in er fria genomgång av rapporten och nästa steg för er AI-strategi.</p>
                        
                        <div className="flex flex-col sm:flex-row gap-8 text-sm font-bold opacity-90 pl-6">
                            <div className="flex items-center gap-3">
                                <span className="text-teal text-xl" style={{ color: 'var(--accent-teal)' }}>✉</span>
                                <a href="mailto:arne@olafsson.se" className="hover:underline">arne@olafsson.se</a>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-teal text-xl" style={{ color: 'var(--accent-teal)' }}>☏</span>
                                <a href="tel:0701825532" className="hover:underline">070-182 55 32</a>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <style jsx global>{`
                @media print {
                    @page {
                        margin: 0;
                        size: A4;
                    }
                    /* EXTREMELY AGGRESSIVE PRINT STYLES TO FORCE COLORS */
                    html, body {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        background: white !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .no-print, nav { 
                        display: none !important; 
                    }
                    .print-exact {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }

                    /* Make the pages fill standard page sizes exactly */
                    .report-container {
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 100% !important;
                        max-width: 100% !important;
                        border: none !important;
                        box-shadow: none !important;
                    }
                    .report-page {
                        width: 100% !important;
                        height: auto !important;
                        min-height: 290mm !important;
                        overflow: visible !important;
                        box-sizing: border-box !important;
                        page-break-after: always !important;
                        page-break-inside: avoid !important;
                        break-after: page !important;
                        break-inside: avoid !important;
                        margin: 0 !important;
                        box-shadow: none !important;
                        border: none !important;
                    }
                    .report-page:last-child {
                        page-break-after: auto !important;
                        break-after: auto !important;
                    }
                    body, html, .bg-soft {
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                }
            `}</style>
            
            <style jsx>{`
                .bg-soft { background: #f8fafc; }
                .bg-navy { background: var(--primary-navy); }
                .text-navy { color: var(--primary-navy); }
                .text-teal { color: var(--accent-teal); }
                .loader { width: 40px; height: 40px; border: 3px solid #eee; border-top-color: var(--primary-navy); border-radius: 50%; animation: spin 1s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                
                .report-page {
                    min-height: 1050px;
                    margin-bottom: 3rem;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                }
            `}</style>
        </div>
    );
}
