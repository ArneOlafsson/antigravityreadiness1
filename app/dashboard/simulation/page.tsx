'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Link from 'next/link';

import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const INDUSTRY_SCENARIOS: Record<string, any[]> = {
    'Finans': [
        {
            id: 'f1',
            title: "AI-Native Neo-Bank: Hyper-Personalisering",
            description: "En ny konkurrent lanserar en plattform där varje kund har en individuell ränte- och risksättningsmodell i realtid, styrd av autonoma agenter. De eliminerar behovet av traditionella handläggare.",
            impact: "Ditt kundtapp riskerar att öka med 40% när kunder erbjuds exakt matchade villkor på sekunder.",
            strategy: "Implementera dynamisk prissättning via ML-modeller och förstärk kundrelationen genom hybrid-rådgivning (människa + AI).",
            priority: "Kritisk"
        },
        {
            id: 'f2',
            title: "Automatiserad Wealth Management",
            description: "En utmanare använder LLM:er för att ge personlig finansiell rådgivning av högsta kvalitet till nollkostnad. Hela din nuvarande rådgivningsaffär blir irrelevant.",
            impact: "Avgiftsintäkter från kapitalförvaltning pressas mot noll.",
            strategy: "Skapa en 'Premium Concierge'-tjänst som fokuserar på komplexa skattefrågor och arv – områden som AI ännu inte hanterar fullt ut.",
            priority: "Strategisk"
        }
    ],
    'Tillverkning': [
        {
            id: 't1',
            title: "Generativ Design-disruption",
            description: "En konkurrent använder AI för att generera komponenter som är 40% lättare och billigare att producera. Deras R&D-cykel är veckor istället för år.",
            impact: "Dina nuvarande patent och produktionsmetoder förlorar sitt värde inom 18 månader.",
            strategy: "Investera i Generativ Design-verktyg och ställ om produktionen till additiv tillverkning (3D-print) för att öka flexibiliteten.",
            priority: "Kritisk"
        },
        {
            id: 't2',
            title: "Autonom Supply Chain Orchestration",
            description: "En aktör bygger en helt AI-styrd logistikkedja som förutser störningar innan de sker. De kan garantera leveranstider som ni inte kan matcha.",
            impact: "Marknadsandelar tappas till följd av lägre leveransprecision.",
            strategy: "Migrera till en molnbaserad dataplattform för realtidslogistik och implementera prediktiva lageralgoritmer.",
            priority: "Strategisk"
        }
    ],
    'Tjänsteproduktion': [
        {
            id: 's1',
            title: "Agentiska Projektteam",
            description: "Ett nystartat bolag levererar komplexa konsulttjänster med 80% färre anställda genom att ersätta juniora resurser med specialiserade AI-agenter.",
            impact: "Dina priser på standardtjänster blir ohållbara jämfört med deras automatiserade prissättning.",
            strategy: "Bygg upp ett internt 'Agent-bibliotek' för att automatisera standardmoment och frigör seniora konsulter för strategisk rådgivning.",
            priority: "Kritisk"
        },
        {
            id: 's2',
            title: "Syntetisk Expertis-on-demand",
            description: "En plattform demokratiserar tillgången till specialistkunskap genom en AI-modell tränad på branschledande case. Behovet av din expertis minskar drastiskt.",
            impact: "Risk för 50% minskning av debiterbara timmar inom 2 år.",
            strategy: "Fokusera på 'Implementation-as-a-Service' där ni tar ansvar för att AI-expertisen faktiskt skapar resultat i kundens unika miljö.",
            priority: "Strategisk"
        }
    ],
    'default': [
        {
            id: 'd1',
            title: "AI-Native Marknadsdominans",
            description: "En ny utmanare använder AI för att helt automatisera kundanskaffning och operativ drift, vilket tillåter dem att underbjuda marknaden kraftigt.",
            impact: "Marginalerna pressas i hela din bransch.",
            strategy: "Automatisera interna 'Back-office'-processer aggressivt för att sänka omkostnader och matcha konkurrenternas prissättning.",
            priority: "Kritisk"
        },
        {
            id: 'd2',
            title: "Disruptiv Affärsmodells-innovation",
            description: "AI möjliggör en övergång från tjänsteförsäljning till en ren 'Outcome-as-a-Service'-modell som dina nuvarande system inte kan hantera.",
            impact: "Ert nuvarande värdeerbjudande blir utdaterat.",
            strategy: "Utveckla egna värdebaserade prismodeller styrda av sensor- eller användardata.",
            priority: "Strategisk"
        }
    ]
};

export default function AttackSimulation() {
    const [status, setStatus] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [scenarios, setScenarios] = useState<any[]>([]);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [activeDefense, setActiveDefense] = useState<string | null>(null);

    const terminalLines = [
        "INITIALIZING ADVERSARIAL AGENT...",
        "SCANNING CORPORATE INFRASTRUCTURE...",
        "MAPPING VALUE CHAIN VULNERABILITIES...",
        "GENERATING AI-NATIVE ATTACK VECTORS...",
        "CALCULATING DISRUPTION VELOCITY...",
        "SIMULATION COMPLETE: THREAT DETECTED."
    ];

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                window.location.href = '/login';
                return;
            }

            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const profile = userDoc.data();
                    setUserProfile(profile);
                    
                    const industry = profile.industry || 'Finans';
                    const selectedScenarios = INDUSTRY_SCENARIOS[industry] || INDUSTRY_SCENARIOS['default'];
                    setScenarios(selectedScenarios);

                    // Progressive terminal effect
                    let lineIndex = 0;
                    const interval = setInterval(() => {
                        if (lineIndex < terminalLines.length) {
                            setStatus(prev => [...prev, terminalLines[lineIndex]]);
                            lineIndex++;
                        } else {
                            clearInterval(interval);
                            setTimeout(() => setLoading(false), 1000);
                        }
                    }, 600);
                }
            } catch (err) {
                console.error("Error fetching simulation data:", err);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="bg-soft">
            <Navbar />
            <div className="container py-12">
                <div className="flex justify-between items-end mb-16 accent-border-left no-print">
                    <div>
                        <Link href="/dashboard" className="uppercase-spaced mb-2 block" style={{ color: 'var(--accent-teal)', fontSize: '0.65rem' }}>← Tillbaka till översikt</Link>
                        <h1 className="serif-font text-5xl">AI Attack Simulation: {userProfile?.companyName || 'Din Organisation'}</h1>
                        <p className="text-muted mt-2">Djuppanalys av hyper-effektiva utmanare inom {userProfile?.industry || 'din bransch'}.</p>
                    </div>
                    <button className="btn-primary" style={{ padding: '0.8rem 1.5rem', fontSize: '0.7rem' }} onClick={() => window.location.reload()}>Kör ny simulering</button>
                </div>

                {loading ? (
                    <div className="card terminal-container py-20 px-12 bg-navy text-white relative overflow-hidden">
                        <div className="scanner-radar"></div>
                        <div className="relative z-10 flex flex-col gap-3">
                            {status.map((line, idx) => (
                                <div key={idx} className="terminal-line font-mono text-xs">
                                    <span style={{ color: 'var(--accent-teal)' }}>[SYSTEM]</span> {line}
                                </div>
                            ))}
                            <div className="cursor-blink font-mono text-xs mt-2">_</div>
                        </div>
                    </div>
                ) : (
                    <div className="grid-container">
                        {scenarios.map((s) => (
                            <div key={s.id} className="card scenario-card">
                                <div style={{ marginBottom: '10px' }}>
                                    <span style={{ 
                                        background: s.priority === 'Kritisk' ? '#002B49' : 'var(--accent-teal)', 
                                        color: 'white', 
                                        padding: '2px 6px', 
                                        fontSize: '10px',
                                        textTransform: 'uppercase'
                                    }}>
                                        {s.priority}
                                    </span>
                                </div>
                                <h3 className="serif-font" style={{ fontSize: '1.2rem', margin: '0 0 10px 0' }}>{s.title}</h3>
                                <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '15px', lineHeight: '1.5' }}>{s.description}</p>

                                <div style={{ background: '#f9f9f9', padding: '15px', border: '1px solid #eee', marginBottom: '15px' }}>
                                    <h4 style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: 'var(--primary-navy)', margin: '0 0 5px 0' }}>Strategisk Effekt</h4>
                                    <p style={{ fontSize: '0.8rem', fontWeight: 'bold', margin: 0, lineHeight: '1.4' }}>{s.impact}</p>
                                </div>

                                {activeDefense === s.id && (
                                    <div className="defense-strategy p-5 mt-4 mb-4" style={{ background: '#eefcfb', borderLeft: '4px solid var(--accent-teal)', animation: 'slideDown 0.3s ease-out' }}>
                                        <h4 style={{ fontSize: '0.6rem', textTransform: 'uppercase', color: 'var(--accent-teal)', marginBottom: '5px' }}>Rekommenderad Försvarsstrategi</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--primary-navy)', fontWeight: '500' }}>{s.strategy}</p>
                                    </div>
                                )}

                                <button 
                                    className="btn-primary" 
                                    style={{ width: '100%', padding: '10px', fontSize: '0.7rem' }}
                                    onClick={() => setActiveDefense(activeDefense === s.id ? null : s.id)}
                                >
                                    {activeDefense === s.id ? 'Dölj strategi' : 'Visa Försvarsstrategi'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
        .bg-soft { background: #f4f6f8; min-height: 100vh; padding-bottom: 5rem; }
        .grid-container { display: grid; grid-template-columns: 1fr 1fr; align-items: start; gap: 2rem; }
        .scenario-card { height: auto !important; align-self: start; padding: 2.5rem; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .bg-red { background: #002B49; }
        .bg-gold { background: var(--accent-teal); }
        .loader { width: 40px; height: 40px; border: 2px solid #eee; border-top-color: var(--primary-navy); border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .terminal-container { min-height: 400px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        .terminal-line { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
        .cursor-blink { animation: blink 1s step-end infinite; }
        @keyframes blink { 50% { opacity: 0; } }
        .scanner-radar {
            position: absolute;
            top: -50%;
            right: -20%;
            width: 500px;
            height: 500px;
            background: radial-gradient(circle, rgba(0,255,204,0.05) 0%, transparent 70%);
            animation: pulse 4s infinite;
        }
        @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.1; } 50% { transform: scale(1.5); opacity: 0.2; } }
        
        @media (max-width: 900px) { .grid-container { grid-template-columns: 1fr; } }
      `}</style>
        </div>
    );
}
