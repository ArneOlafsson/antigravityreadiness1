'use client';

import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  const [isOpen, setIsOpen] = useState(false);

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
        <Link href="/" className="logo serif-font text-xl md:text-2xl uppercase-spaced flex-shrink-0" style={{ color: 'var(--primary-navy)' }}>
          AI DISRUPTION <span style={{ fontWeight: 400 }} className="hidden sm:inline">SCANNER</span>
        </Link>
        
        {/* Desktop Links */}
        <div className="links hidden md:flex items-center gap-8">
          <Link href="/methodology" className="uppercase-spaced text-xs">Metodik</Link>
          <Link href="/pricing" className="uppercase-spaced text-xs">Prisplaner</Link>
          <Link href="/dashboard" className="uppercase-spaced text-xs">Dashboard</Link>
          
          {user ? (
            <button onClick={handleLogout} className="uppercase-spaced text-xs" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: 'inherit' }}>
              Logga ut
            </button>
          ) : (
            <>
              <Link href="/login" className="uppercase-spaced text-xs">Logga in</Link>
              <Link href="/signup" className="btn-primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.75rem' }}>Starta Analys</Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden flex flex-col gap-2" onClick={() => setIsOpen(!isOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <div className={`h-0.5 bg-navy transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`} style={{ width: '24px' }}></div>
          <div className={`h-0.5 bg-navy transition-all ${isOpen ? 'opacity-0' : ''}`} style={{ width: '24px' }}></div>
          <div className={`h-0.5 bg-navy transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} style={{ width: '24px' }}></div>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b py-8 px-6 flex flex-col gap-6 animate-fade-in">
          <Link href="/methodology" className="uppercase-spaced text-sm" onClick={() => setIsOpen(false)}>Metodik</Link>
          <Link href="/pricing" className="uppercase-spaced text-sm" onClick={() => setIsOpen(false)}>Prisplaner</Link>
          <Link href="/dashboard" className="uppercase-spaced text-sm" onClick={() => setIsOpen(false)}>Dashboard</Link>
          <div className="h-px bg-gray-100 w-full"></div>
          {user ? (
            <button onClick={() => { handleLogout(); setIsOpen(false); }} className="uppercase-spaced text-sm text-left" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              Logga ut
            </button>
          ) : (
            <div className="flex flex-col gap-6">
              <Link href="/login" className="uppercase-spaced text-sm" onClick={() => setIsOpen(false)}>Logga in</Link>
              <Link href="/signup" className="btn-primary text-center" style={{ padding: '1rem' }} onClick={() => setIsOpen(false)}>Starta Analys</Link>
            </div>
          )}
        </div>
      )}

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
        .bg-navy { background-color: var(--primary-navy); }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease forwards;
        }
      `}</style>
    </nav>
  );
}
