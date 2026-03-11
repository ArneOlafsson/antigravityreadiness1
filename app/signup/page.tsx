'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
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
        <div className="bg-soft min-h-100 pb-20">
            <Navbar />
            <div className="container py-20 flex flex-col items-center">
                <div className="form-card card accent-border-left max-w-700 w-100">
                    <div className="mb-12">
                        <div className="uppercase-spaced mb-2" style={{ color: 'var(--accent-teal)' }}>Registrering</div>
                        <h1 className="serif-font text-4xl">Skapa din miljö</h1>
                        <p className="text-muted mt-2">En privat plattform för strategisk positionering.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {error && <div className="p-4 bg-red-100 text-red-700 text-sm mb-4">{error}</div>}
                        
                        <div className="form-group flex flex-col">
                            <label className="uppercase-spaced" style={{ fontSize: '0.65rem' }}>Organisationsnamn</label>
                            <input type="text" name="companyName" required value={formData.companyName} onChange={handleChange} placeholder="T.ex. Acme Corp AB" disabled={loading} />
                        </div>

                        <div className="grid col-2 gap-6">
                            <div className="form-group flex flex-col">
                                <label className="uppercase-spaced" style={{ fontSize: '0.65rem' }}>Bransch</label>
                                <select name="industry" required value={formData.industry} onChange={handleChange} disabled={loading}>
                                    <option value="">Välj...</option>
                                    <option value="Finans">Finans & Bank</option>
                                    <option value="Tjänsteproduktion">Tjänsteproduktion</option>
                                    <option value="Tillverkning">Tillverkning</option>
                                    <option value="Retail">Retail</option>
                                </select>
                            </div>
                            <div className="form-group flex flex-col">
                                <label className="uppercase-spaced" style={{ fontSize: '0.65rem' }}>Omsättningsintervall</label>
                                <select name="revenue" value={formData.revenue} onChange={handleChange} disabled={loading}>
                                    <option value="">Välj...</option>
                                    <option value="<50M">&lt; 50M SEK</option>
                                    <option value="50-250M">50-500M SEK</option>
                                    <option value=">500M">&gt; 500M SEK</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group flex flex-col mt-8">
                            <label className="uppercase-spaced" style={{ fontSize: '0.65rem' }}>E-post (Exekutiv)</label>
                            <input type="email" name="email" required value={formData.email} onChange={handleChange} disabled={loading} />
                        </div>

                        <div className="form-group flex flex-col">
                            <label className="uppercase-spaced" style={{ fontSize: '0.65rem' }}>Lösenord</label>
                            <input type="password" name="password" required value={formData.password} onChange={handleChange} disabled={loading} />
                        </div>

                        <button type="submit" className="btn-primary mt-8 py-5" disabled={loading}>
                            {loading ? 'Skapar konto...' : 'Skapa konto & Starta Analys'}
                        </button>
                        <p className="text-center uppercase-spaced mt-6" style={{ fontSize: '0.65rem' }}>
                            Redan registrerad? <Link href="/login" style={{ color: 'var(--accent-teal)' }}>Logga in</Link>
                        </p>
                    </form>
                </div>
            </div>

            <style jsx>{`
        .bg-soft { background: #fafafa; min-height: 100vh; }
        .form-card { width: 100%; max-width: 700px; }
        input, select { border: 1px solid #eee; padding: 1rem; border-radius: 0; font-family: 'Montserrat', sans-serif; font-size: 0.9rem; }
        input:focus { border-color: var(--primary-navy); outline: none; }
        .grid { display: grid; }
        .col-2 { grid-template-columns: 1fr 1fr; }
        @media (max-width: 600px) { .col-2 { grid-template-columns: 1fr; } }
      `}</style>
        </div>
    );
}
