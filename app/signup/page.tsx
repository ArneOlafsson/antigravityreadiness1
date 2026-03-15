'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function Signup() {
    const [formData, setFormData] = useState({
        companyName: '',
        industry: '',
        revenue: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                email: formData.email,
                companyName: formData.companyName,
                industry: formData.industry,
                revenue: formData.revenue,
                createdAt: new Date().toISOString()
            });

            window.location.href = '/assessment';
        } catch (err: any) {
            setError(err.message || 'Ett fel uppstod vid registrering.');
            setLoading(false);
        }
    };

    return (
        <div className="bg-soft min-h-screen pb-20">
            <Navbar />
            <div className="container py-12 md:py-24 flex flex-col items-center">
                <div className="form-card card accent-border-left w-full max-w-2xl bg-white p-8 md:p-12 border-0 shadow-lg">
                    <div className="mb-10">
                        <div className="uppercase-spaced mb-2" style={{ color: 'var(--accent-teal)' }}>Registrering</div>
                        <h1 className="serif-font text-3xl md:text-4xl text-navy">Skapa din miljö</h1>
                        <p className="text-muted mt-2 text-sm">En privat plattform för strategisk positionering.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-700 text-xs border-l-2 border-red-500 mb-2">
                                {error}
                            </div>
                        )}
                        
                        <div className="form-group flex flex-col gap-2">
                            <label className="uppercase-spaced" style={{ fontSize: '0.65rem' }}>Organisationsnamn</label>
                            <input 
                                type="text" 
                                name="companyName" 
                                required 
                                value={formData.companyName} 
                                onChange={handleChange} 
                                placeholder="T.ex. Acme Corp AB" 
                                disabled={loading}
                                className="styled-input"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="form-group flex flex-col gap-2">
                                <label className="uppercase-spaced" style={{ fontSize: '0.65rem' }}>Bransch</label>
                                <select 
                                    name="industry" 
                                    required 
                                    value={formData.industry} 
                                    onChange={handleChange} 
                                    disabled={loading}
                                    className="styled-input"
                                >
                                    <option value="">Välj...</option>
                                    <option value="Finans">Finans & Bank</option>
                                    <option value="Tjänsteproduktion">Tjänsteproduktion</option>
                                    <option value="Tillverkning">Tillverkning</option>
                                    <option value="Retail">Retail</option>
                                </select>
                            </div>
                            <div className="form-group flex flex-col gap-2">
                                <label className="uppercase-spaced" style={{ fontSize: '0.65rem' }}>Omsättningsintervall</label>
                                <select 
                                    name="revenue" 
                                    value={formData.revenue} 
                                    onChange={handleChange} 
                                    disabled={loading}
                                    className="styled-input"
                                >
                                    <option value="">Välj...</option>
                                    <option value="<50M">&lt; 50M SEK</option>
                                    <option value="50-250M">50-500M SEK</option>
                                    <option value=">500M">&gt; 500M SEK</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group flex flex-col gap-2 mt-4">
                            <label className="uppercase-spaced" style={{ fontSize: '0.65rem' }}>E-post (Exekutiv)</label>
                            <input 
                                type="email" 
                                name="email" 
                                required 
                                value={formData.email} 
                                onChange={handleChange} 
                                disabled={loading}
                                className="styled-input"
                            />
                        </div>

                        <div className="form-group flex flex-col gap-2">
                            <label className="uppercase-spaced" style={{ fontSize: '0.65rem' }}>Lösenord</label>
                            <input 
                                type="password" 
                                name="password" 
                                required 
                                value={formData.password} 
                                onChange={handleChange} 
                                disabled={loading}
                                className="styled-input"
                            />
                        </div>

                        <button type="submit" className="btn-primary mt-6 py-4 w-full" disabled={loading}>
                            {loading ? 'Skapar konto...' : 'Skapa konto & Starta Analys'}
                        </button>
                        
                        <p className="text-center mt-8 text-xs text-muted">
                            Redan registrerad? <Link href="/login" style={{ color: 'var(--accent-teal)', fontWeight: 700 }}>Logga in</Link>
                        </p>
                    </form>
                </div>
            </div>

            <style jsx>{`
                .bg-soft { background: #fafafa; min-height: 100vh; }
                .styled-input { 
                    border: 1px solid #e1e4e8; 
                    padding: 1rem; 
                    border-radius: 2px; 
                    font-family: var(--header-font); 
                    transition: all 0.2s;
                    background: #fcfcfc;
                    font-size: 0.9rem;
                    width: 100%;
                }
                .styled-input:focus { 
                    border-color: var(--accent-teal); 
                    outline: none; 
                    background: white;
                    box-shadow: 0 0 0 3px rgba(38, 203, 203, 0.1);
                }
                select.styled-input {
                    appearance: none;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23666' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: calc(100% - 1rem) center;
                }
            `}</style>
            <Footer />
        </div>
    );
}
