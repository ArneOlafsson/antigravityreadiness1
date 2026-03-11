'use client';

import Navbar from '../../components/Navbar';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const adminStats = [
    { bransch: 'Finans', avgScore: 68, count: 42 },
    { bransch: 'Tillverkning', avgScore: 45, count: 35 },
    { bransch: 'Detaljhandel', avgScore: 72, count: 28 },
    { bransch: 'Hälsovård', avgScore: 50, count: 22 },
    { bransch: 'IT/Tech', avgScore: 35, count: 64 },
];

export default function AdminPanel() {
    return (
        <div className="bg-light min-h-100 pb-20">
            <Navbar />
            <div className="container py-12">
                <header className="mb-12 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Admin Panel: AI Disruption Scanner</h1>
                        <p className="text-muted">Översikt över plattformens användning och benchmarks.</p>
                    </div>
                    <button className="btn-outline">Exportera alla data (.csv)</button>
                </header>

                <div className="grid col-4 gap-6 mb-12">
                    <div className="card stat-card">
                        <h4>Registrerade Företag</h4>
                        <div className="stat-val">191</div>
                        <p className="text-xs text-green">+12 denna vecka</p>
                    </div>
                    <div className="card stat-card">
                        <h4>Slutförda Analyser</h4>
                        <div className="stat-val">482</div>
                        <p className="text-xs text-muted">Aktivitetsgrad: 84%</p>
                    </div>
                    <div className="card stat-card">
                        <h4>Snittscore (Retail)</h4>
                        <div className="stat-val">72/100</div>
                        <p className="text-xs text-red">Högsta branschrisk</p>
                    </div>
                    <div className="card stat-card">
                        <h4>Plattformsintäkter</h4>
                        <div className="stat-val">€42,800</div>
                        <p className="text-xs text-muted">Mars 2025</p>
                    </div>
                </div>

                <div className="grid col-2-1 gap-12">
                    <div className="card chart-card">
                        <h3 className="mb-8">Branschexponering: Genomsnittlig Riskscore</h3>
                        <div style={{ height: '400px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={adminStats}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="bransch" />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip />
                                    <Bar dataKey="avgScore" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="card list-card">
                        <h3>Senaste Registreringar</h3>
                        <div className="user-list mt-8">
                            {[1, 2, 3, 4, 5].map((u) => (
                                <div key={u} className="user-item py-4 border-bottom flex justify-between items-center">
                                    <div>
                                        <div className="font-bold underline text-sm">Företag_{u} AB</div>
                                        <div className="text-xs text-muted">bransch_{u}@mail.se</div>
                                    </div>
                                    <div className={`status-pill ${u % 2 === 0 ? 'bg-green' : 'bg-gray'}`}>Aktiv</div>
                                </div>
                            ))}
                        </div>
                        <button className="btn-outline w-100 mt-8 text-sm">Visa alla företag</button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .bg-light { background: #f8f9fb; min-height: 100vh; }
        .grid { display: grid; }
        .col-4 { grid-template-columns: repeat(4, 1fr); }
        .col-2-1 { grid-template-columns: 2fr 1.2fr; }
        .stat-card { padding: 2rem; border-radius: 12px; }
        .stat-card h4 { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px; }
        .stat-val { font-size: 2rem; font-weight: 800; color: var(--primary-navy); }
        .text-green { color: #10b981; }
        .text-red { color: #ef4444; }
        .status-pill { padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; font-weight: 700; color: white; }
        .bg-green { background: #10b981; }
        .bg-gray { background: #94a3b8; }
        .border-bottom { border-bottom: 1px solid #f1f5f9; }
        .w-100 { width: 100%; }
        
        @media (max-width: 1024px) {
          .col-4 { grid-template-columns: repeat(2, 1fr); }
          .col-2-1 { grid-template-columns: 1fr; }
        }
      `}</style>
        </div>
    );
}
