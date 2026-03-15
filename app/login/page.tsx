'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
            window.location.href = '/dashboard';
        } catch (err: any) {
            setError('Felaktig e-post eller lösenord.');
            setLoading(false);
        }
    };

    return (
        <div className="bg-soft min-h-screen flex flex-col">
            <Navbar />
            <div className="container py-12 md:py-24 lg:py-32 flex flex-col items-center">
                <div className="card login-card accent-border-left w-full max-w-md bg-white p-8 md:p-12 border-0 shadow-lg">
                    <div className="mb-10">
                        <div className="uppercase-spaced mb-2" style={{ color: 'var(--accent-teal)' }}>Säker Inloggning</div>
                        <h1 className="serif-font text-3xl md:text-4xl text-navy">Välkommen tillbaka</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {error && (
                            <div className="p-4 bg-red-50 text-red-700 text-xs border-l-2 border-red-500 mb-2">
                                {error}
                            </div>
                        )}
                        
                        <div className="form-group flex flex-col gap-2">
                            <label className="uppercase-spaced" style={{ fontSize: '0.65rem' }}>E-post</label>
                            <input 
                                type="email" 
                                required 
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                                placeholder="namn@företag.se" 
                                disabled={loading}
                                className="styled-input"
                            />
                        </div>

                        <div className="form-group flex flex-col gap-2">
                            <div className="flex justify-between items-end">
                                <label className="uppercase-spaced" style={{ fontSize: '0.65rem' }}>Lösenord</label>
                                <Link href="#" className="uppercase-spaced" style={{ fontSize: '0.6rem', color: 'var(--accent-teal)' }}>Glömt lösenord?</Link>
                            </div>
                            <input 
                                type="password" 
                                required 
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                                disabled={loading}
                                className="styled-input"
                            />
                        </div>

                        <button type="submit" className="btn-primary mt-4 py-4 w-full" disabled={loading}>
                            {loading ? 'Loggar in...' : 'Logga in'}
                        </button>
                        
                        <p className="text-center mt-8 text-xs text-muted">
                            Saknar du konto? <Link href="/signup" style={{ color: 'var(--accent-teal)', fontWeight: 700 }}>Starta en ny analys.</Link>
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
                }
                .styled-input:focus { 
                    border-color: var(--accent-teal); 
                    outline: none; 
                    background: white;
                    box-shadow: 0 0 0 3px rgba(38, 203, 203, 0.1);
                }
            `}</style>
            <Footer />
        </div>
    );
}
