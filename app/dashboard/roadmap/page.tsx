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
    Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
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

    const riskLevel = data.score < 30 ? 'Low' : data.score < 50 ? 'Moderate' : data.score < 75 ? 'High' : 'Critical';
    const riskColor = data.score < 30 ? '#388E3C' : data.score < 50 ? '#F57C00' : data.score < 75 ? '#D32F2F' : '#B71C1C';

    const getHeatmapColor = (risk: string) => {
        return risk === 'LÅG' ? '#388E3C' : risk === 'MODERAT' ? '#F57C00' : risk === 'HÖG' ? '#D32F2F' : '#B71C1C';
    };

    return (
        <div className="bg-soft min-h-screen print:bg-white">
            <Navbar />
            
            <div className="container py-12 max-w-5xl mx-auto no-print">
                <div className="flex justify-between items-end mb-16 accent-border-left">
                    <div>
                        <Link href="/dashboard" className="uppercase-spaced mb-4 inline-block text-[0.65rem] hover:underline" style={{ color: 'var(--accent-teal)' }}>&larr; Tillbaka till översikt</Link>
                        <h1 className="serif-font text-5xl">Strategic Intelligence Report</h1>
                        <p className="text-muted mt-3 max-w-2xl">En exekutiv roadmap och finansiell simuleringsrapport skräddarsydd för <strong>{userProfile?.companyName || 'Organisationen'}</strong>.</p>
                    </div>
                    <div>
                        <button 
                            className={`btn-primary ${isGenerating ? 'opacity-50 cursor-wait' : ''}`} 
                            style={{ fontSize: '0.7rem', background: 'var(--accent-teal)', color: 'var(--primary-navy)', padding: '1rem 2rem' }} 
                            onClick={handlePrint}
                            disabled={isGenerating}
                        >
                            {isGenerating ? 'GENERERAR PDF...' : 'EXPORTERA RAPPORT (PDF)'}
                        </button>
                    </div>
                </div>
            </div>

            {/* THE REPORT */}
            <div className="report-container mx-auto bg-white max-w-[1100px] shadow-2xl print:shadow-none">
                
                {/* 1. COVER PAGE */}
                <div className="page-break-after h-screen flex flex-col justify-between p-24 bg-navy text-white relative overflow-hidden">
                    <div className="absolute inset-0 z-0 opacity-10">
                        <div className="absolute inset-0 bg-gradient-to-tr from-navy to-teal opacity-20"></div>
                    </div>
                    
                    <div className="relative z-10">
                        <div className="uppercase-spaced tracking-[0.4em] text-xs opacity-60 mb-24" style={{ color: 'var(--accent-teal)' }}>Strictly Confidential</div>
                        <div>
                            <div className="serif-font text-[6rem] mb-2 leading-none">AI DISRUPTION SCANNER</div>
                            <div className="serif-font text-4xl italic opacity-70 ml-2 mt-4">Strategic AI Analysis Report</div>
                            <div className="h-1 w-32 bg-teal mt-16" style={{ backgroundColor: 'var(--accent-teal)' }}></div>
                        </div>
                    </div>

                    <div className="relative z-10 flex justify-between items-end border-t border-white/20 pt-16">
                        <div className="text-left">
                            <div className="text-[0.65rem] uppercase-spaced opacity-60 mb-3">Prepared For</div>
                            <div className="text-4xl font-bold serif-font text-white">{userProfile?.companyName || 'Organisationen'}</div>
                            <div className="text-sm mt-3 opacity-60">Industry: {data.industryData.name}</div>
                        </div>
                        <div className="text-right text-[0.65rem] uppercase-spaced opacity-60 leading-loose bg-white/5 p-6 border border-white/10">
                            <div><strong>Date:</strong> {new Date().toLocaleDateString('sv-SE')}</div>
                            <div><strong>Report ID:</strong> {reportId}</div>
                            <div className="mt-4 text-teal text-xl font-bold" style={{ color: 'var(--accent-teal)', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '10px' }}>Exponering: {data.score}/100</div>
                        </div>
                    </div>
                </div>

                {/* 2. EXECUTIVE SUMMARY */}
                <div className="page-break-after p-24 bg-white text-navy">
                    <h2 className="serif-font text-5xl mb-16 accent-border-left pl-8 relative z-10">2. Executive Summary</h2>
                    <div className="grid grid-cols-5 gap-16">
                        <div className="col-span-3 text-sm leading-loose">
                            <p className="text-xl serif-font italic opacity-90 mb-8 border-l-4 pl-6" style={{ borderColor: 'var(--accent-teal)' }}>
                                &quot;Marknaden rör sig från en fas av experimentering till operationell exekvering. Vinnarna de kommande 3 åren definieras av hur väl de integrerar AI i kärnaffären.&quot;
                            </p>
                            <p className="mb-6">
                                Denna strategiska rapport utvärderar {userProfile?.companyName || 'organisationen'}:s beredskap att möta det paradigmskifte som AI-drivna affärsmodeller medför. Med en uppmätt total exponering på <strong>{data.score} av 100</strong>, klassificeras er nuvarande situation som <strong>{riskLevel.toUpperCase()} RISK</strong>.
                            </p>
                            <p className="mb-6">
                                De primära riskområdena är lokaliserade till de operationella dimensionerna, där manuella processer riskerar att utmanövrerades av konkurrenters automatiserade agenter, vilket skapar ohållbart marginaltryck.
                            </p>
                            <p>
                                Det absolut största hotet är <em>underinvestering i omställning</em>. Fönstret för proaktiv anpassning håller på att stängas. Om inte omedelbara initiativ tas kring AI-governance och operationella piloter (<span className="italic">Q2-Roadmap</span>), kommer bolaget att tvingas till reaktiv krishantering redan inom 18-24 månader.
                            </p>
                        </div>
                        <div className="col-span-2 space-y-8">
                            <div className="p-8 bg-soft border">
                                <h4 className="font-bold mb-4 uppercase-spaced text-[0.65rem] opacity-60">Disruption Score</h4>
                                <div className="text-7xl serif-font mb-2" style={{ color: riskColor }}>{data.score}</div>
                                <div className="uppercase-spaced text-xs tracking-widest font-bold" style={{ color: riskColor }}>{riskLevel} RISK ZONE</div>
                            </div>
                            <div className="p-8 bg-navy text-white shadow-xl">
                                <h4 className="font-bold mb-6 uppercase-spaced text-[0.65rem] opacity-60" style={{ color: 'var(--accent-teal)' }}>Key Weaknesses</h4>
                                <ul className="space-y-4 text-xs leading-relaxed">
                                    {data.categories.filter((c:any) => c.score > 50).slice(0, 3).map((c:any, i:number) => (
                                        <li key={i} className="flex gap-3 border-b border-white/10 pb-3 last:border-0 last:pb-0">
                                            <span className="text-teal" style={{ color: 'var(--accent-teal)' }}>&bull;</span> 
                                            <span><strong>{c.name}:</strong> Sårbarhet pga hög exponering mot manuellt / låg-effektivt arbete.</span>
                                        </li>
                                    ))}
                                    {data.categories.filter((c:any) => c.score > 50).length === 0 && (
                                        <li className="flex gap-3"><span className="text-teal" style={{ color: 'var(--accent-teal)' }}>&bull;</span> <span>Relativt låg exponering, fokus bör ligga på offensiv tillväxt.</span></li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. STRATEGIC DECISION BRIEF */}
                <div className="page-break-after p-24 bg-soft text-navy">
                    <h2 className="serif-font text-5xl mb-16 accent-border-left pl-8 relative z-10">3. Strategic Decision Brief</h2>
                    
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="serif-font text-3xl mb-8">1. Strategisk Risköversikt</h3>
                            <p className="text-sm leading-relaxed mb-8 opacity-80">Vad som sker om organisationen intar en passiv hållning till AI-transformationen under det kommande året:</p>
                            
                            <div className="space-y-6">
                                <div className="flex gap-6 items-start bg-white p-6 border">
                                    <div className="w-12 h-12 flex-shrink-0 bg-red-100 flex items-center justify-center text-red-800 font-bold serif-font text-xl rounded-full">A</div>
                                    <div>
                                        <h5 className="font-bold text-sm mb-2">Marginalerosion (Margin Erosion)</h5>
                                        <p className="text-xs opacity-70 leading-relaxed">När AI-aktörer sänker sina operativa kostnader med upp till 40%, uppstår en ohållbar prispress på era standardtjänster. Marginalen äts upp på 12-18 mån.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 items-start bg-white p-6 border">
                                    <div className="w-12 h-12 flex-shrink-0 bg-orange-100 flex items-center justify-center text-orange-800 font-bold serif-font text-xl rounded-full">B</div>
                                    <div>
                                        <h5 className="font-bold text-sm mb-2">Förlorad Konkurrenskraft (Eroding Moat)</h5>
                                        <p className="text-xs opacity-70 leading-relaxed">Er historiska vallgrav (relationer, skala, legacy-data) tappar i värde snabbare än ni bygger nya värden. Er oförmåga att agera prediktivt blir en kompetitiv nackdel.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 items-start bg-white p-6 border">
                                    <div className="w-12 h-12 flex-shrink-0 bg-yellow-100 flex items-center justify-center text-yellow-800 font-bold serif-font text-xl rounded-full">C</div>
                                    <div>
                                        <h5 className="font-bold text-sm mb-2">Kompetensdränering (Talent Attrition)</h5>
                                        <p className="text-xs opacity-70 leading-relaxed">De skarpaste hjärnorna vill arbeta där AI-infrastrukturen hävstångar deras tid. Utan rätt interna verktyg lämnar &apos;top performers&apos; er för modernare branschkollegor.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-navy text-white p-12 shadow-2xl relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-teal opacity-5 rounded-bl-full"></div>
                            <h3 className="serif-font text-3xl mb-8" style={{ color: 'var(--accent-teal)' }}>2. Rekommenderade Beslut</h3>
                            <p className="text-[0.8rem] leading-relaxed mb-10 opacity-80">Styrelse & VD behöver omedelbart fatta beslut inom följande kärnområden:</p>
                            
                            <ul className="space-y-8">
                                <li className="pb-6 border-b border-white/10">
                                    <h4 className="uppercase-spaced text-xs font-bold mb-3">I. Initiera AI Transformation Taskforce</h4>
                                    <p className="text-xs opacity-70 leading-relaxed">Kräver VD:s direkta sponsorskap. Utse en cross-funktionell styrgrupp (Sälj, Ops, IT) som leder integrationen, fristående från traditionella IT-projekt.</p>
                                </li>
                                <li className="pb-6 border-b border-white/10">
                                    <h4 className="uppercase-spaced text-xs font-bold mb-3">II. Allokera Evolutionsbudget</h4>
                                    <p className="text-xs opacity-70 leading-relaxed">Godkänn en omallokering om 2-3% av rörelseresultatet specifikt för experimentell och tillämpad AI-integration. ROI-fokus bör vara 12-18 månader, inte 3-5 år.</p>
                                </li>
                                <li className="pb-6 border-b border-white/10">
                                    <h4 className="uppercase-spaced text-xs font-bold mb-3">III. Etablera &apos;AI Governance&apos; Framework</h4>
                                    <p className="text-xs opacity-70 leading-relaxed">Sätt omedelbart legala ramverk och datasäkerhetspolicys för generativ AI så att personalen vågar och får innovera utan att äventyra bolagets IP.</p>
                                </li>
                                <li>
                                    <h4 className="uppercase-spaced text-xs font-bold mb-3">IV. Lansera Hög-effekts Piloter (Q2)</h4>
                                    <p className="text-xs opacity-70 leading-relaxed">Inled 2-3 skarpa proof-of-concepts inom de mest administrativa flödena, för att bygga momentum och påvisa konkret finansiellt värde.</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 4. RISK & BENCHMARK ANALYSIS */}
                <div className="page-break-after p-24 bg-white">
                    <h2 className="serif-font text-5xl mb-16 accent-border-left pl-8 relative z-10">4. Risk & Benchmark Analysis</h2>
                    
                    <div className="grid grid-cols-2 gap-12">
                        <div className="p-12 border bg-soft">
                            <h4 className="font-bold mb-8 uppercase-spaced text-xs text-center opacity-60 text-navy">Dimensionell Värmekarta</h4>
                            <div className="flex justify-center flex-1" style={{ height: '350px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data.categories}>
                                        <PolarGrid stroke="#ccc" />
                                        <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: '#002B49', fontWeight: 600 }} />
                                        <Radar name="Din Profil" dataKey="score" stroke="var(--primary-navy)" fill="var(--primary-navy)" fillOpacity={0.4} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="flex flex-col">
                            <h4 className="serif-font text-2xl mb-8">Marknadens Fördelning & Benchmark</h4>
                            <p className="text-sm opacity-70 mb-8 leading-relaxed">
                                Tabellen nedan jämför era score-nivåer mot det generella branschsnittet i <strong className="text-navy">{data.industryData.name}</strong>-sektorn. En högre summa indikerar en högre exponering mot plötsliga AI-drivna förändringar i marknadsklimatet.
                            </p>

                            <div className="overflow-hidden border rounded-lg flex-1 bg-white">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-navy text-white">
                                        <tr>
                                            <th className="py-4 px-6 font-bold uppercase-spaced text-[0.65rem]">Dimension</th>
                                            <th className="py-4 px-6 font-bold uppercase-spaced text-[0.65rem]">Company</th>
                                            <th className="py-4 px-6 font-bold uppercase-spaced text-[0.65rem] opacity-70">Industry Avg</th>
                                            <th className="py-4 px-6 font-bold uppercase-spaced text-[0.65rem] text-teal" style={{ color: 'var(--accent-teal)' }}>Top 10%</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {data.categories.map((c:any, i:number) => {
                                            const hashStr = c.name;
                                            const deterministicRandom = (hashStr.charCodeAt(0) % 20) - 10;
                                            const stableAvg = Math.round(50 + deterministicRandom);
                                            const top = Math.round(stableAvg * 0.5);
                                            return (
                                                <tr key={i} className="hover:bg-soft transition-colors">
                                                    <td className="py-4 px-6 font-bold text-navy">{c.name}</td>
                                                    <td className="py-4 px-6 font-bold">
                                                        <span className={c.score > 65 ? 'text-red-600' : 'text-navy'}>{c.score}</span>
                                                    </td>
                                                    <td className="py-4 px-6 opacity-60">{stableAvg}</td>
                                                    <td className="py-4 px-6 font-bold text-green-700">{top}</td>
                                                </tr>
                                            );
                                        })}
                                        <tr className="bg-soft font-bold border-t-2 border-navy">
                                            <td className="py-6 px-6 text-navy">TOTAL DISRUPTION SCORE</td>
                                            <td className="py-6 px-6 text-xl" style={{ color: riskColor }}>{data.score}</td>
                                            <td className="py-6 px-6 opacity-60 text-lg">56</td>
                                            <td className="py-6 px-6 text-green-700 text-lg">28</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. FINANSIELL IMPACT SIMULATION */}
                <div className="page-break-after p-24 bg-navy text-white">
                    <h2 className="serif-font text-5xl mb-6 accent-border-left pl-8 relative z-10">5. AI Economic Impact Simulation</h2>
                    <p className="max-w-3xl text-sm leading-relaxed opacity-80 mb-16">Simulerad prognos för EBITDA-marginalutveckling över 4 år baserad på tre distinkta investeringsval.</p>
                    
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="bg-white p-8 rounded shadow-2xl" style={{ height: '400px' }}>
                             <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={[
                                    { year: 'Nu', 'Scenario A (Ingen AI)': 15, 'Scenario B (Selektiv AI)': 15, 'Scenario C (AI-native)': 15 },
                                    { year: 'År 1', 'Scenario A (Ingen AI)': 13, 'Scenario B (Selektiv AI)': 16, 'Scenario C (AI-native)': 14 },
                                    { year: 'År 2', 'Scenario A (Ingen AI)': 9, 'Scenario B (Selektiv AI)': 17, 'Scenario C (AI-native)': 22 },
                                    { year: 'År 3', 'Scenario A (Ingen AI)': 4, 'Scenario B (Selektiv AI)': 19, 'Scenario C (AI-native)': 28 },
                                    { year: 'År 4', 'Scenario A (Ingen AI)': -2, 'Scenario B (Selektiv AI)': 21, 'Scenario C (AI-native)': 34 },
                                ]} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                    <XAxis dataKey="year" tick={{ fontSize: 12, fill: '#002B49' }} axisLine={false} tickLine={false} />
                                    <YAxis tickFormatter={(val) => `${val}%`} tick={{ fontSize: 12, fill: '#002B49' }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ borderRadius: '0', border: '1px solid #ccc', fontSize: '12px', color: '#002B49' }} />
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                                    <Line type="monotone" dataKey="Scenario A (Ingen AI)" stroke="#D32F2F" strokeWidth={3} dot={{ r: 4 }} />
                                    <Line type="monotone" dataKey="Scenario B (Selektiv AI)" stroke="#F57C00" strokeWidth={3} dot={{ r: 4 }} />
                                    <Line type="monotone" dataKey="Scenario C (AI-native)" stroke="var(--accent-teal)" strokeWidth={4} dot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="p-6 border-l-4 border-red-500 bg-white/5">
                                <h4 className="font-bold text-sm mb-2 text-white">Scenario A: Ingen AI Adoption</h4>
                                <p className="text-xs opacity-80 leading-relaxed">Avvaktan. Efter initial fas börjar kostnadsgapet mot konkurrenter öka markant. Marginal sjunker och bolaget tvingas in i förlustdrivande prispress.</p>
                            </div>
                            <div className="p-6 border-l-4 border-orange-500 bg-white/5">
                                <h4 className="font-bold text-sm mb-2 text-white">Scenario B: Selektiv AI Adoption</h4>
                                <p className="text-xs opacity-80 leading-relaxed">Isolerade effektiviseringsprojekt. Bibehåller relevans, sänker vissa handläggningstider men skalar ej exponentiellt mot nya marknader.</p>
                            </div>
                            <div className="p-6 border-l-4 border-teal bg-white/5" style={{ borderLeftColor: 'var(--accent-teal)' }}>
                                <h4 className="font-bold text-sm mb-2 text-white">Scenario C: AI-First Transformation</h4>
                                <p className="text-xs opacity-80 leading-relaxed">Kortvarig dipp för integration, därefter bryts linjär koppling mellan personal och intäkt. Marginal drastiskt förstärkt när digitala agenter övertar 40% av driften.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 6. AI COMPETITIVE THREAT SIMULATION */}
                <div className="page-break-after p-24 bg-white text-navy">
                    <h2 className="serif-font text-5xl mb-16 accent-border-left pl-8 relative z-10">6. AI Competitive Threat</h2>
                    <p className="text-sm leading-relaxed max-w-2xl mb-16">Hur snabbt en &apos;AI-native entrant&apos; bryter ned en existerande marknadsposition. Baserad på live-data från SaaS- och konsult-disruption under det senaste året.</p>

                    <div className="relative max-w-4xl mx-auto">
                        <div className="absolute left-[45px] top-4 bottom-4 w-1 bg-soft z-0\"></div>
                        
                        {[
                            { year: 'Year 1', text: 'AI entrant launches with lower cost model. Skalar med mikroteam och extrem tech-leverage. Ingångsrabatter om -40% mot ert ordinarie pris.', impact: 'Margin pressure begins.' },
                            { year: 'Year 2', text: `Automation av kärntjänster. Konkurrenten erbjuder 24/7 service där ni kräver manuell handläggning på 48h. Hög automation av ${data.industryData.name}-tjänster.`, impact: 'Customer switching rates spikar.' },
                            { year: 'Year 3', text: 'Marknadsandelserosion. Prisetiketter permanent asymmetriska. Obalans där ni finansierar lokaler & stora team medan konkurrenten finansierar compute.', impact: 'Strategisk kris.' }
                        ].map((t, i) => (
                            <div key={i} className="relative z-10 flex gap-10 mb-12 items-start">
                                <div className="w-24 h-24 rounded-full bg-navy text-white border-4 border-white shadow-xl flex flex-col justify-center items-center flex-shrink-0">
                                    <div className="uppercase-spaced text-[0.55rem] tracking-widest opacity-60 mb-1">ZON</div>
                                    <div className="font-bold serif-font text-2xl">0{i+1}</div>
                                </div>
                                <div className="bg-soft border p-8 flex-1 relative overflow-hidden">
                                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-red-800 opacity-80"></div>
                                    <h4 className="font-bold uppercase-spaced text-xs mb-4 text-navy">{t.year}</h4>
                                    <p className="text-sm leading-relaxed opacity-80 mb-6">{t.text}</p>
                                    <div className="text-[0.65rem] uppercase-spaced font-bold text-red-800 bg-white inline-block px-4 py-2 border">{t.impact}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 7. AI MATURITY MODEL & 8. INDUSTRY OPPORTUNITIES */}
                <div className="page-break-after p-24 bg-soft">
                    <div className="mb-20">
                        <h2 className="serif-font text-5xl mb-10 accent-border-left pl-8">7. AI Maturity Framework</h2>
                        <div className="grid grid-cols-4 gap-4">
                            {[
                                { level: 'L1: Experimenting', desc: 'Individuell användning, skugg-IT. Ingen central strategi.', ac: data.score > 60 },
                                { level: 'L2: AI-Aware', desc: 'Piloter, silos. Mestadels generativ AI för text. Governance på plats.', ac: data.score > 40 && data.score <= 60 },
                                { level: 'L3: AI-Capable', desc: 'Integration i processer. Autonoma agenter. RAG över egen data.', ac: data.score > 20 && data.score <= 40 },
                                { level: 'L4: AI-Native', desc: 'Intelligens first. Affärsmodell flyttad, noll-marginalkostnad i sikte.', ac: data.score <= 20 }
                            ].map((m, i) => (
                                <div key={i} className={`p-6 border-t-8 ${m.ac ? 'border-teal bg-navy text-white shadow-xl transform -translate-y-4' : 'border-gray-300 bg-white text-navy'}`}>
                                    <div className="uppercase-spaced text-[0.6rem] mb-4 opacity-60">Nivå {i+1}</div>
                                    <h5 className="font-bold text-sm mb-4">{m.level}</h5>
                                    <p className="text-[0.65rem] leading-relaxed opacity-80">{m.desc}</p>
                                    {m.ac && <div className="mt-6 text-[0.65rem] font-bold text-teal uppercase-spaced" style={{ color: 'var(--accent-teal)' }}>Er Nuvarande<br/>Position</div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="serif-font text-5xl mb-6 accent-border-left pl-8">8. Industrispecifika Möjligheter</h2>
                        <p className="mb-10 text-sm max-w-2xl opacity-70">Härvid följer de 5 mest hög-påverkande AI-applikationerna just nu mätta i sektion: <strong>{data.industryData.name}</strong>.</p>
                        
                        <div className="grid grid-cols-1 gap-6">
                            {data.industryData.useCases.map((uc:any, i:number) => (
                                <div key={i} className="bg-white border p-6 flex gap-8 items-center hover:shadow-lg transition-shadow">
                                    <div className="w-12 h-12 bg-navy text-white flex items-center justify-center serif-font text-xl rounded">{i+1}</div>
                                    <div className="flex-1">
                                        <h5 className="font-bold text-base mb-2">{uc.case}</h5>
                                        <p className="text-xs opacity-70">{uc.desc}</p>
                                    </div>
                                    <div className="text-center px-6 border-l">
                                        <div className="uppercase-spaced text-[0.55rem] mb-1 opacity-60">Impact</div>
                                        <div className="font-bold text-xs" style={{ color: uc.impact === 'KRITISK' || uc.impact === 'HÖG' ? '#2E7D32' : '#F57C00' }}>{uc.impact}</div>
                                    </div>
                                    <div className="text-center px-6 border-l">
                                        <div className="uppercase-spaced text-[0.55rem] mb-1 opacity-60">Complex</div>
                                        <div className="font-bold text-xs">{uc.complexity}</div>
                                    </div>
                                    <div className="text-center px-6 border-l bg-teal/10 rounded ml-2" style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)' }}>
                                        <div className="uppercase-spaced text-[0.55rem] mb-1 opacity-60">ROI</div>
                                        <div className="font-bold text-lg text-teal" style={{ color: 'var(--accent-teal)' }}>{uc.roi}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 9. TRANSFORMATION ROADMAP */}
                <div className="page-break-after p-24 bg-navy text-white relative overflow-hidden">
                    <div style={{ position: 'absolute', top: -50, right: -50, fontSize: '15rem', opacity: 0.05, pointerEvents: 'none', color: 'var(--accent-teal)' }}>12M</div>
                    <h2 className="serif-font text-5xl mb-16 accent-border-left pl-8 relative z-10">9. 12-Månaders Roadmap</h2>
                    
                    <div className="space-y-6 relative z-10">
                        <div className="flex flex-col md:flex-row bg-white/5 border border-white/10 p-8">
                            <div className="w-48 border-r border-white/10 pr-8 flex flex-col justify-center">
                                <div className="text-3xl font-bold serif-font text-teal" style={{ color: 'var(--accent-teal)' }}>Q1</div>
                                <div className="uppercase-spaced text-[0.6rem] opacity-60 mt-2">Fundamentals & Skydd</div>
                            </div>
                            <div className="pl-8 flex-1 grid md:grid-cols-2 gap-8">
                                <div><div className="w-2 h-2 bg-teal mb-3" style={{ backgroundColor: 'var(--accent-teal)' }}></div><h5 className="font-bold text-sm mb-2">AI Governance Policy</h5><p className="text-xs opacity-60 leading-relaxed">Sätt legala och etiska riktlinjer. Kontroll över Shadow-AI. Upprätta &apos;Safe Zones&apos;.</p></div>
                                <div><div className="w-2 h-2 bg-teal mb-3" style={{ backgroundColor: 'var(--accent-teal)' }}></div><h5 className="font-bold text-sm mb-2">Data Security Review</h5><p className="text-xs opacity-60 leading-relaxed">Mappering av dataarkitektur inför framtida RAG-modeller.</p></div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row bg-white/5 border border-white/10 p-8">
                            <div className="w-48 border-r border-white/10 pr-8 flex flex-col justify-center">
                                <div className="text-3xl font-bold serif-font text-teal" style={{ color: 'var(--accent-teal)' }}>Q2</div>
                                <div className="uppercase-spaced text-[0.6rem] opacity-60 mt-2">Automation Pilots</div>
                            </div>
                            <div className="pl-8 flex-1 grid md:grid-cols-2 gap-8">
                                <div><div className="w-2 h-2 bg-white mb-3"></div><h5 className="font-bold text-sm mb-2">Back-office Automatisering</h5><p className="text-xs opacity-60 leading-relaxed">Rulla ut digitala agenter i support & administration. Mål: Sänk admin-tid med 20%.</p></div>
                                <div><div className="w-2 h-2 bg-white mb-3"></div><h5 className="font-bold text-sm mb-2">Copilot Rollouts</h5><p className="text-xs opacity-60 leading-relaxed">Träning och implementering av strategiska verktyg för värdeskapande personal.</p></div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row bg-white/5 border border-white/10 p-8">
                            <div className="w-48 border-r border-white/10 pr-8 flex flex-col justify-center">
                                <div className="text-3xl font-bold serif-font text-teal" style={{ color: 'var(--accent-teal)' }}>Q3</div>
                                <div className="uppercase-spaced text-[0.6rem] opacity-60 mt-2">Core Integration</div>
                            </div>
                            <div className="pl-8 flex-1 grid md:grid-cols-2 gap-8">
                                <div><div className="w-2 h-2 bg-white mb-3"></div><h5 className="font-bold text-sm mb-2">Applikationer över Egen Data</h5><p className="text-xs opacity-60 leading-relaxed">Deployment av custom LLMs tränade på er egen IP (RAG) för instant knowledge retrieval.</p></div>
                                <div><div className="w-2 h-2 bg-white mb-3"></div><h5 className="font-bold text-sm mb-2">Vendor API Integration</h5><p className="text-xs opacity-60 leading-relaxed">Koppla isär legacy system via API:er för att låta AI orkestrera kommunikationen.</p></div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row bg-teal border p-8" style={{ backgroundColor: 'var(--accent-teal)', color: 'var(--primary-navy)', borderColor: 'var(--accent-teal)' }}>
                            <div className="w-48 border-r border-navy/20 pr-8 flex flex-col justify-center">
                                <div className="text-3xl font-bold serif-font">Q4</div>
                                <div className="uppercase-spaced text-[0.6rem] opacity-80 mt-2 font-bold">AI-First Products</div>
                            </div>
                            <div className="pl-8 flex-1 grid md:grid-cols-2 gap-8">
                                <div><div className="w-2 h-2 bg-navy mb-3"></div><h5 className="font-bold text-sm mb-2">Nya Tjänstemodeller</h5><p className="text-xs opacity-80 leading-relaxed">Skifta intäktsdrivarna. Använd den frikoppling från personal/intäkt ni nått till att rulla ut tjänster till vrakpris med 80% marginal.</p></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 10. HEATMAP */}
                <div className="page-break-after p-24 bg-white text-navy">
                    <h2 className="serif-font text-5xl mb-16 accent-border-left pl-8">10. Organisational Heatmap</h2>
                    <p className="text-sm opacity-80 max-w-2xl mb-12 leading-relaxed">
                        Nedan visas en heatmap över bedömd automationsrisk och disruptiv potential för era nyckelavdelningar (anpassad efter <strong>{data.industryData.name}</strong>).
                    </p>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                        {data.industryData.heatmap.map((h:any, i:number) => (
                            <div key={i} className="p-6 flex flex-col justify-between border shadow-sm bg-white" style={{ minHeight: '140px', borderTop: `4px solid ${getHeatmapColor(h.risk)}` }}>
                                <div className="font-bold text-sm truncate">{h.dept}</div>
                                <div className="mt-4">
                                    <div className="uppercase-spaced text-[0.55rem] tracking-widest opacity-60 mb-1">Risk Level</div>
                                    <div className="font-bold text-xs" style={{ color: getHeatmapColor(h.risk) }}>{h.risk}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 11. INVESTMENT & BACK COVER */}
                <div className="p-24 bg-soft text-navy border-b-[20px]" style={{ borderBottomColor: 'var(--accent-teal)' }}>
                    <div className="grid grid-cols-2 gap-16">
                        <div>
                            <h2 className="serif-font text-5xl mb-10 accent-border-left pl-8">11. Investment Index</h2>
                            <p className="text-sm leading-relaxed mb-10 opacity-80">Exekutiv ram för allokering. Procenten syftar på andel av det totala transformationsutrymmet eller intäktsbasen.</p>

                            <div className="space-y-6">
                                <div className="p-6 bg-white border flex gap-6 items-center">
                                    <div className="text-3xl font-bold text-navy w-16 text-center">1%</div>
                                    <div><h5 className="font-bold text-sm mb-1">Exploration Phase</h5><p className="text-[0.65rem] opacity-70">Licenser (Copilot, ChatGPT), utbildning, risk auditing.</p></div>
                                </div>
                                <div className="p-6 bg-white border flex gap-6 items-center shadow-lg relative z-10" style={{ borderLeft: '4px solid #F57C00', transform: 'scale(1.05)' }}>
                                    <div className="text-3xl font-bold text-orange-500 w-16 text-center" style={{ color: '#F57C00' }}>3%</div>
                                    <div><h5 className="font-bold text-sm mb-1">Acceleration Phase (Recommended)</h5><p className="text-[0.65rem] opacity-70">Custom RAG-lösningar, automatisering av core-operations, agent-baserade verktyg.</p></div>
                                </div>
                                <div className="p-6 bg-white border flex gap-6 items-center">
                                    <div className="text-3xl font-bold text-teal w-16 text-center" style={{ color: 'var(--accent-teal)' }}>6%</div>
                                    <div><h5 className="font-bold text-sm mb-1">AI-Native Transformation</h5><p className="text-[0.65rem] opacity-70">Datamodernisering, LLM-finetuning, skapande av nya digitala affärsområden.</p></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center bg-navy text-white text-center p-16 shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute w-64 h-64 bg-teal rounded-full blur-[80px] -top-10 -right-10" style={{ backgroundColor: 'var(--accent-teal)' }}></div>
                            </div>
                            <div className="relative z-10">
                                <div className="serif-font text-6xl italic opacity-50 mb-10">&quot;Agera.&quot;</div>
                                <h3 className="text-2xl font-bold serif-font mb-4">Framtiden belönar mod.</h3>
                                <p className="text-sm leading-relaxed opacity-80 mb-10">Transformation är aldrig lineärt och aldrig bekvämt. Men fönstret står öppet nu.</p>
                                <div className="w-full h-[1px] bg-white/20 mb-10"></div>
                                <div className="text-[0.6rem] uppercase-spaced tracking-widest opacity-60">AI DISRUPTION SCANNER &bull; STRATEGIC ADVISORY</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <style jsx>{`
                .bg-soft { background: #f8fafc; }
                .bg-navy { background: var(--primary-navy); }
                .text-navy { color: var(--primary-navy); }
                .text-teal { color: var(--accent-teal); }
                .loader { width: 40px; height: 40px; border: 3px solid #eee; border-top-color: var(--primary-navy); border-radius: 50%; animation: spin 1s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                
                @media print {
                    .no-print, nav { display: none !important; }
                    .print\\:bg-white { background: white !important; }
                    .print\\:shadow-none { box-shadow: none !important; border: none !important; }
                    .page-break-after { page-break-after: always; break-inside: avoid; }
                    .report-container { max-width: 100% !important; margin: 0 !important; border: none !important; box-shadow: none !important; }
                    body { background: white !important; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    .container { padding: 0 !important; width: 100% !important; margin: 0 !important; max-width: 100% !important; }
                    @page { size: auto; margin: 0; }
                }
            `}</style>
        </div>
    );
}
