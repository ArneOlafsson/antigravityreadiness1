'use client';

import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="container flex justify-between items-center py-6">
        <Link href="/" className="logo serif-font text-2xl uppercase-spaced" style={{ color: 'var(--primary-navy)' }}>
          AI DISRUPTION <span style={{ fontWeight: 400 }}>SCANNER</span>
        </Link>
        <div className="links flex items-center gap-8">
          <Link href="/methodology" className="uppercase-spaced">Metodik</Link>
          <Link href="/pricing" className="uppercase-spaced">Prisplaner</Link>
          <Link href="/dashboard" className="uppercase-spaced">Dashboard</Link>
          
          {user ? (
            <button onClick={handleLogout} className="uppercase-spaced" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: 'inherit' }}>
              Logga ut
            </button>
          ) : (
            <>
              <Link href="/login" className="uppercase-spaced">Logga in</Link>
              <Link href="/signup" className="btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.75rem' }}>Starta Analys</Link>
            </>
          )}
        </div>
      </div>
      <style jsx>{`
        .navbar {
          background: white;
          border-bottom: 1px solid var(--border-color);
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        .logo {
          letter-spacing: 2px;
        }
      `}</style>
    </nav>
  );
}
