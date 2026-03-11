'use client';

import { useState } from 'react';
import Navbar from '../../../components/Navbar';
import Link from 'next/link';

export default function Profile() {
    const [profile, setProfile] = useState({
        industry: 'Finans & Bank',
        businessModel: 'Service company', // Tjänsteföretag
        customerType: 'B2B',
        valueCreation: 'Knowledge / consulting'
    });

    return (
        <div className="bg-light min-h-100 flex flex-col">
            <Navbar />
            <div className="container py-12 max-w-600">
                <div className="flex items-center gap-2 mb-8">
                    <Link href="/dashboard" className="text-sm text-muted">← Dashboard</Link>
                    <span className="text-sm text-gray">/</span>
                    <span className="text-sm font-bold">Företagsprofil</span>
                </div>

                <div className="card profile-card">
                    <h1 className="text-2xl font-bold mb-8">Företagsprofil</h1>

                    <div className="flex flex-col gap-6">
                        <div className="profile-group">
                            <label>Bransch</label>
                            <select value={profile.industry} onChange={(e) => setProfile({ ...profile, industry: e.target.value })}>
                                <option value="Finans & Bank">Finans & Bank</option>
                                <option value="Tillverkning">Tillverkning</option>
                                <option value="Tjänsteföretag">Tjänsteföretag</option>
                                <option value="IT/Tech">IT / Tech</option>
                            </select>
                        </div>

                        <div className="profile-group">
                            <label>Affärsmodells-typ</label>
                            <select value={profile.businessModel} onChange={(e) => setProfile({ ...profile, businessModel: e.target.value })}>
                                <option value="Product company">Produktbolag</option>
                                <option value="Service company">Tjänsteföretag</option>
                                <option value="Platform">Plattform</option>
                                <option value="Marketplace">Marknadsplats</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                        </div>

                        <div className="profile-group">
                            <label>Kund-typ</label>
                            <select value={profile.customerType} onChange={(e) => setProfile({ ...profile, customerType: e.target.value })}>
                                <option value="B2B">B2B (Business to Business)</option>
                                <option value="B2C">B2C (Business to Consumer)</option>
                                <option value="B2G">B2G (Business to Government)</option>
                                <option value="Mixed">Mixed</option>
                            </select>
                        </div>

                        <div className="profile-group">
                            <label>Värdeskapande-typ</label>
                            <select value={profile.valueCreation} onChange={(e) => setProfile({ ...profile, valueCreation: e.target.value })}>
                                <option value="Knowledge / consulting">Kunskap / Konsultation</option>
                                <option value="Physical products">Fysiska produkter</option>
                                <option value="Digital services">Digitala tjänster</option>
                                <option value="Software">Mjukvara</option>
                                <option value="Mixed">Mixed</option>
                            </select>
                        </div>

                        <button className="btn-primary mt-6">Spara ändringar</button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .bg-light { background: #f8f9fb; min-height: 100vh; }
        .profile-card { padding: 3rem; background: white; border: 1px solid var(--border-color); }
        .max-w-600 { max-width: 600px; width: 100%; margin: 0 auto; }
        .profile-group { display: flex; flex-direction: column; gap: 8px; }
        label { font-size: 0.8rem; font-weight: 700; color: #64748b; text-transform: uppercase; }
        select { border: 1px solid #dce1e6; padding: 0.75rem 1rem; border-radius: 4px; font-size: 1rem; background: #fff; }
        select:focus { border-color: var(--accent-blue); outline: none; }
      `}</style>
        </div>
    );
}
