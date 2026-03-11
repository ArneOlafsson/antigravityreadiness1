'use client';

import { useState } from 'react';
import Navbar from '../../components/Navbar';
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
        <div className="bg-soft min-h-100 flex flex-col items-center">
            <Navbar />
            <div className="container py-32 flex flex-col items-center">
                <div className="card login-card accent-border-left max-w-500 w-100">
                    <div className="mb-10">
                        <div className="uppercase-spaced mb-2" style={{ color: 'var(--accent-teal)' }}>Säker Inloggning</div>
                        <h1 className="serif-font text-3xl">Välkommen tillbaka</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {error && <div className="p-4 bg-red-100 text-red-700 text-sm mb-4">{error}</div>}
                        
                        <div className="form-group flex flex-col">
                            <label className="uppercase-spaced" style={{ fontSize: '0.65rem' }}>E-post</label>
                            <input type="email" required onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="namn@företag.se" disabled={loading} />
                        </div>

                        <div className="form-group flex flex-col">
                            <div className="flex justify-between items-end">
                                <label className="uppercase-spaced" style={{ fontSize: '0.65rem' }}>Lösenord</label>
                                <Link href="#" className="uppercase-spaced" style={{ fontSize: '0.6rem', color: 'var(--accent-teal)' }}>Glömt lösenord?</Link>
                            </div>
                            <input type="password" required onChange={(e) => setFormData({ ...formData, password: e.target.value })} disabled={loading} />
                        </div>

                        <button type="submit" className="btn-primary mt-8 py-4" disabled={loading}>
                            {loading ? 'Loggar in...' : 'Logga in'}
                        </button>
                        <p className="text-center uppercase-spaced mt-8" style={{ fontSize: '0.65rem' }}>
                            Saknar du konto? <Link href="/signup" style={{ color: 'var(--accent-teal)' }}>Starta en ny analys.</Link>
                        </p>
                    </form>
                </div>
            </div>

            <style jsx>{`
        .bg-soft { background: #fafafa; min-height: 100vh; }
        .login-card { width: 100%; max-width: 500px; }
        input { border: 1px solid #eee; padding: 1rem; border-radius: 0; font-family: 'Montserrat', sans-serif; }
        input:focus { border-color: var(--primary-navy); outline: none; }
      `}</style>
        </div>
    );
}
