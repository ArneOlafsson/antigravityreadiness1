'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function HistoryPage() {
    const [historyData, setHistoryData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                window.location.href = '/login';
                return;
            }

            try {
                const logsRef = collection(db, 'assessment_logs');
                const q = query(logsRef, where('userId', '==', user.uid), orderBy('lastUpdated', 'asc'));
                const querySnapshot = await getDocs(q);
                
                const data = querySnapshot.docs.map(doc => {
                    const docData = doc.data();
                    return {
                        id: doc.id,
                        ...docData,
                        dateLabel: new Date(docData.lastUpdated).toLocaleDateString('sv-SE', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })
                    };
                });
                
                setHistoryData(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching history data:", err);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="bg-navy min-h-screen flex items-center justify-center text-white">
                <div className="text-center">
                    <div className="loader mb-8 mx-auto"></div>
                    <h1 className="serif-font text-3xl">Laddar historik...</h1>
                </div>
                <style jsx>{`
                    .bg-navy { background: var(--primary-navy); min-height: 100vh; }
                    .loader { width: 60px; height: 1px; background: rgba(255,255,255,0.2); position: relative; overflow: hidden; }
                    .loader::after { content: ''; position: absolute; left: -100%; width: 100%; height: 100%; background: var(--accent-teal); animation: slide 2s infinite; }
                    @keyframes slide { to { left: 100%; } }
                `}</style>
            </div>
        );
    }

    const getRiskLabel = (s: number) => {
        if (s < 20) return 'Låg Risk';
        if (s < 40) return 'Moderat Risk';
        if (s < 60) return 'Signifikant Risk';
        return 'Kritisk Exponering';
    };

    return (
        <div className="bg-soft min-h-screen pb-20">
            <Navbar />
            
            <div className="container py-12 max-w-[900px] mx-auto">
                <div className="flex justify-between items-end mb-12 accent-border-left pl-6">
                    <div>
                        <Link href="/dashboard" className="uppercase-spaced mb-4 inline-block text-[0.65rem] hover:underline" style={{ color: 'var(--accent-teal)' }}>&larr; Tillbaka till översikt</Link>
                        <h1 className="serif-font text-4xl md:text-5xl text-navy">Din Utveckling</h1>
                        <p className="text-muted mt-3 max-w-2xl text-sm">Följ hur er AI-mognad och strategiska exponering har förändrats över tid.</p>
                    </div>
                </div>

                {historyData.length === 0 ? (
                    <div className="card bg-white p-12 text-center border">
                        <h3 className="serif-font text-2xl mb-4 text-navy">Ingen historik tillgänglig ännu</h3>
                        <p className="text-muted mb-8">När du genomför fler analyser kommer din utveckling visas här.</p>
                        <Link href="/assessment" className="btn-primary" style={{ padding: '0.8rem 1.5rem', fontSize: '0.75rem' }}>Gör en ny analys</Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-12">
                        {/* CHART SECTION */}
                        <div className="card bg-white p-6 md:p-10 border shadow-sm">
                            <h3 className="serif-font text-2xl mb-2 text-navy">Utveckling: Disruption Score</h3>
                            <p className="text-xs text-muted mb-8">Lägre poäng indikerar starkare motståndskraft (mindre risk) mot AI-disruption.</p>
                            
                            <div style={{ width: '100%', height: 350 }}>
                                <ResponsiveContainer>
                                    <LineChart data={historyData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                        <XAxis dataKey="dateLabel" tick={{ fontSize: 11, fill: '#002B49' }} axisLine={false} tickLine={false} />
                                        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#002B49' }} axisLine={false} tickLine={false} />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '0', border: '1px solid #ccc', background: 'var(--primary-navy)', color: 'white', fontSize: '11px' }}
                                            itemStyle={{ color: 'var(--accent-teal)' }}
                                            formatter={(value) => [`${value}/100`, 'Exponering']}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="score" 
                                            stroke="var(--primary-navy)" 
                                            strokeWidth={3} 
                                            dot={{ r: 4, fill: 'var(--accent-teal)', strokeWidth: 0 }} 
                                            activeDot={{ r: 6, fill: 'var(--accent-teal)', strokeWidth: 0 }} 
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* HISTORY LIST */}
                        <div>
                            <h3 className="serif-font text-2xl mb-6 accent-border-left pl-6 text-navy">Tidigare Mätningar</h3>
                            <div className="flex flex-col gap-4">
                                {[...historyData].reverse().map((entry, index) => (
                                    <div key={entry.id} className="card bg-white p-6 border flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-transform hover:-translate-y-1 shadow-sm">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-2">
                                                <div className="text-navy font-bold">{entry.dateLabel}</div>
                                                {index === 0 && (
                                                    <span className="bg-teal text-navy text-[0.55rem] uppercase-spaced px-2 py-1 font-bold" style={{ backgroundColor: 'var(--accent-teal)' }}>Senaste</span>
                                                )}
                                            </div>
                                            <div className="text-xs text-muted uppercase-spaced">
                                                {getRiskLabel(entry.score)}
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-4 md:gap-8 flex-wrap flex-1 justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-gray-100 w-full md:w-auto">
                                            {/* Show top 2 categories that improved or just show summary */}
                                            <div className="flex flex-col text-left md:text-right">
                                                <span className="uppercase-spaced text-[0.55rem] text-muted mb-1">Total Poäng</span>
                                                <span className="serif-font text-2xl text-navy">{entry.score}<span className="text-sm opacity-50">/100</span></span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .bg-soft { background: #fafafa; }
                .text-navy { color: var(--primary-navy); }
                .bg-navy { background: var(--primary-navy); }
                .text-teal { color: var(--accent-teal); }
                .btn-primary { background: var(--primary-navy); color: white; border: none; font-family: var(--header-font); text-transform: uppercase; letter-spacing: 1px; font-weight: 700; cursor: pointer; transition: all 0.3s ease; text-decoration: none; display: inline-block; }
                .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            `}</style>
        </div>
    );
}
