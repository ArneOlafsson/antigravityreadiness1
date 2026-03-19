'use client';

import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';

const categories = [
    {
        id: 1,
        name: 'AFFÄRSMODELLENS EXPONERING',
        questions: [
            'Vårt värdeerbjudande bygger i hög grad på informations- eller kunskapsarbete',
            'Stora delar av vårt erbjudande kan potentiellt digitaliseras',
            'Våra tjänster är baserade på analys, tolkning eller rådgivning',
            'Våra kunder interagerar primärt med oss digitalt',
            'Nya konkurrenter skulle teoretiskt sett kunna replikera delar av vårt erbjudande med mjukvara'
        ]
    },
    {
        id: 2,
        name: 'AUTOMATISERINGSRISK I PROCESSER',
        questions: [
            'Många interna processer är manuella och repetitiva',
            'Våra arbetsflöden vilar tungt på dokumenthantering eller textbearbetning',
            'Betydande delar av vår verksamhet är beroende av mänsklig analys',
            'Beslut i vår organisation baseras på strukturerad data',
            'Våra processer skulle potentiellt kunna automatiseras med AI-verktyg'
        ]
    },
    {
        id: 3,
        name: 'DATA & DIGITALISERING',
        questions: [
            'Vår organisation genererar stora mängder data',
            'En stor del av vårt arbete involverar dataanalys',
            'Vår bransch digitaliseras snabbt',
            'Datadrivna företag skulle potentiellt kunna prestera bättre än traditionella aktörer',
            'Dataägande håller på att bli strategiskt viktigt i vår bransch'
        ]
    },
    {
        id: 4,
        name: 'KONKURRENSTRYCK',
        questions: [
            'Nya digitala konkurrenter har börjat träda in i vår bransch',
            'Startups i vår sektor adopterar AI snabbare än etablerade aktörer',
            'Kunder förväntar sig snabbare och mer digitala tjänster',
            'Teknikföretag skulle teoretiskt sett kunna gå in på vår marknad',
            'AI-baserade tjänster skulle kunna sänka priserna i vår bransch avsevärt'
        ]
    },
    {
        id: 5,
        name: 'ORGANISATORISK ANPASSNINGSFÖRMÅGA',
        questions: [
            'Vår organisation kan snabbt adoptera nya teknologier',
            'Ledningen övervakar aktivt teknologisk disruption',
            'Vi experimenterar med nya digitala verktyg och lösningar',
            'Vi har intern kapacitet att implementera AI-initiativ',
            'Vår kultur stödjer innovation och experimenterande'
        ]
    }
];

import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, updateDoc, collection, addDoc } from 'firebase/firestore';

export default function Assessment() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [finished, setFinished] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                window.location.href = '/login';
            }
        });
        return () => unsubscribe();
    }, []);

    const handleScore = (categoryId: number, questionIndex: number, score: number) => {
        setAnswers({ ...answers, [`cat${categoryId}-q${questionIndex}`]: score });
    };

    const nextStep = () => {
        if (step < categories.length - 1) {
            setStep(step + 1);
            window.scrollTo(0, 0);
        } else {
            calculateAndSave();
        }
    };

    const calculateAndSave = async () => {
        if (!user) return;
        setFinished(true);

        let totalAdjustedSum = 0;
        let totalCount = 0;

        const categoryScores = categories.map(cat => {
            const qKeys = Array.from({ length: 5 }, (_, i) => `cat${cat.id}-q${i}`);
            const catSum = qKeys.reduce((acc, key) => {
                let answer = answers[key];
                if (answer === undefined) {
                    answer = 3;
                }
                if (cat.id === 5) {
                    answer = 6 - answer;
                }
                return acc + answer;
            }, 0);
            
            totalAdjustedSum += catSum;
            totalCount += 5;

            return {
                name: cat.name,
                score: Math.round((catSum / 25) * 100)
            };
        });

        const finalScore = Math.round((totalAdjustedSum / (totalCount * 5)) * 100);

        const reportData = {
            userId: user.uid,
            score: finalScore,
            categories: categoryScores,
            rawAnswers: answers,
            lastUpdated: new Date().toISOString()
        };

        try {
            // Skapa en historik/log-post för detta specifika test, så att kunden(och vi) kan spåra utveckling
            await addDoc(collection(db, 'assessment_logs'), reportData);

            // Spara över "senaste resultatet" på vanliga assesments doc för instrumentpanelen
            await setDoc(doc(db, 'assessments', user.uid), reportData);
            
            await updateDoc(doc(db, 'users', user.uid), {
                latestScore: finalScore,
                hasCompletedAssessment: true
            });

            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 2000);
        } catch (error) {
            console.error("Error saving assessment:", error);
            window.location.href = '/dashboard';
        }
    };

    const prevStep = () => {
        if (step > 0) setStep(step - 1);
    };

    if (finished) {
        return (
            <div className="bg-navy min-h-100 flex items-center justify-center text-white">
                <div className="text-center">
                    <div className="loader mb-8 mx-auto"></div>
                    <h1 className="serif-font text-3xl">Beräknar Strategisk Exponering...</h1>
                    <p className="uppercase-spaced mt-4 opacity-70">Genererar AI Attack Scenarios</p>
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

    const currentCategory = categories[step];
    const progress = ((step + 1) / categories.length) * 100;

    return (
        <div className="bg-soft min-h-100 flex flex-col">
            <Navbar />
            <div className="container py-12 md:py-20">
                <div className="card shadow-none border-0 accent-border-left p-6 md:p-12 bg-white">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6">
                        <div>
                            <div className="uppercase-spaced mb-2" style={{ color: 'var(--accent-teal)' }}>Analyssteg {step + 1} av {categories.length}</div>
                            <h1 className="serif-font text-3xl md:text-4xl uppercase">{currentCategory.name}</h1>
                        </div>
                        <div className="text-left sm:text-right">
                            <div className="serif-font text-2xl">{Math.round(progress)}%</div>
                            <div className="uppercase-spaced" style={{ fontSize: '0.6rem' }}>Slutfört</div>
                        </div>
                    </div>

                    <div className="questions-list">
                        {currentCategory.questions.map((q, idx) => (
                            <div key={idx} className="question-item py-8 md:py-10 border-bottom">
                                <div className="flex flex-col lg:flex-row justify-between gap-8">
                                    <p className="question-text serif-font text-xl flex-1">{q}</p>
                                    <div className="rating-area flex-1">
                                        <div className="flex justify-between mb-4 gap-2">
                                            {[1, 2, 3, 4, 5].map((num) => (
                                                <button
                                                    key={num}
                                                    className={`rating-btn ${answers[`cat${currentCategory.id}-q${idx}`] === num ? 'active' : ''}`}
                                                    onClick={() => handleScore(currentCategory.id, idx, num)}
                                                >
                                                    {num}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="flex justify-between uppercase-spaced" style={{ fontSize: '0.6rem', opacity: 0.5 }}>
                                            <span>Instämmer ej</span>
                                            <span>Instämmer helt</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between mt-16 pt-12 border-top gap-6">
                        <button className="btn-outline w-full sm:w-auto text-center" onClick={prevStep} disabled={step === 0}>Föregående</button>
                        <button className="btn-primary w-full sm:w-auto text-center" onClick={nextStep} disabled={currentCategory.questions.some((_, i) => !answers[`cat${currentCategory.id}-q${i}`])}>
                            {step === categories.length - 1 ? 'Slutför Analys' : 'Nästa Kategori'}
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .bg-soft { background: #fafafa; min-height: 100vh; }
        .rating-btn { 
          flex: 1;
          max-width: 60px;
          aspect-ratio: 1/1;
          border: 1px solid #ddd; 
          background: white; 
          font-family: var(--header-font);
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          border-radius: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }
        @media (max-width: 640px) {
          .rating-btn {
            font-size: 0.9rem;
          }
        }
        .rating-btn.active { background: var(--primary-navy); border-color: var(--primary-navy); color: white; }
        .rating-btn:hover:not(.active) { border-color: var(--primary-navy); }
        .border-bottom { border-bottom: 1px solid #eee; }
        .border-top { border-top: 1px solid #eee; }
        button:disabled { opacity: 0.3; cursor: not-allowed; }
      `}</style>
        </div>
    );
}
