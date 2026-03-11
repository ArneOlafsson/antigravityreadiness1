'use client';

import Navbar from '../../components/Navbar';
import Link from 'next/link';

export default function PricingPage() {
    const plans = [
        {
            name: 'Standard',
            price: '0 kr',
            description: 'För beslutsfattare som vill ha den första objektiva bilden av sin sårbarhet.',
            features: [
                'Full AI Disruption Scan',
                'Övergripande Riskscore (0-100)',
                'Benchmarking mot branschsnitt',
                'Analys av 5 kritiska dimensioner',
                'Grundläggande rekommendationer (3 steg)'
            ],
            button: 'Starta Gratis Analys',
            cta: '/signup',
            highlight: false
        },
        {
            name: 'Professional',
            price: '19 900 kr',
            period: '/ per analys',
            description: 'För ledningsgrupper som behöver en konkret, exekutiv handlingsplan för att agera.',
            features: [
                'Allt i Standard-analysen',
                'Fullständig Operationell Roadmap 2026',
                'AI Attack Simulation (6 unika scenarier)',
                'Exportbar PDF-rapport för Styrelsen',
                'Detaljerad gap-analys per avdelning',
                'Taktisk "Action-Plan" för Q1-H2'
            ],
            button: 'Aktivera Pro-analys',
            cta: '/signup',
            highlight: true,
            label: 'Mest Vald'
        },
        {
            name: 'Enterprise',
            price: 'Offert',
            description: 'För större koncerner och PE-bolag som behöver analysera flera portföljbolag.',
            features: [
                'Koncernövergripande dashboards',
                'Skräddarsydda attack-simuleringar',
                'En-dags workshop med ledningsguppen',
                'Löpande kvartalsvis scanning',
                'Prioriterad support och rådgivning'
            ],
            button: 'Kontakta oss',
            cta: 'mailto:info@aidisruptionscanner.se',
            highlight: false
        }
    ];

    return (
        <div className="bg-soft min-h-screen pb-24">
            <Navbar />
            
            <header className="py-20 md:py-24 text-center">
                <div className="container">
                    <div className="max-w-2xl mx-auto">
                        <span className="uppercase-spaced text-xs" style={{ color: 'var(--accent-teal)' }}>Investering</span>
                        <h1 className="serif-font text-5xl md:text-6xl mt-6 mb-6">Prisplaner för AI-transformation.</h1>
                        <p className="text-lg leading-relaxed text-muted">
                            Välj den nivå av insikt som krävs för att säkra din organisation. 
                            Från en första diagnos till en fullständig, operationell roadmap.
                        </p>
                    </div>
                </div>
            </header>

            <section className="pb-24">
                <div className="container">
                    <div className="grid md:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <div key={plan.name} className={`card flex flex-col p-10 ${plan.highlight ? 'bg-navy text-white shadow-2xl relative' : 'bg-white'}`} style={plan.highlight ? { transform: 'scale(1.05)', zIndex: 10 } : {}}>
                                {plan.highlight && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-teal text-navy px-4 py-1 text-[0.6rem] uppercase-spaced font-bold" style={{ background: 'var(--accent-teal)' }}>
                                        {plan.label}
                                    </div>
                                )}
                                <div className="mb-10 text-center">
                                    <h3 className="serif-font text-3xl mb-4">{plan.name}</h3>
                                    <div className="flex flex-col items-center">
                                        <div className="serif-font text-5xl font-bold">{plan.price}</div>
                                        {plan.period && (
                                            <div className="mt-2 text-[0.65rem] uppercase-spaced tracking-widest opacity-50">
                                                {plan.period.replace('/', '').trim()}
                                            </div>
                                        )}
                                    </div>
                                    <p className={`mt-6 text-sm leading-relaxed ${plan.highlight ? 'opacity-70' : 'text-muted'}`}>
                                        {plan.description}
                                    </p>
                                </div>

                                <div className="flex-1 space-y-4 mb-10 border-t pt-8" style={plan.highlight ? { borderColor: 'rgba(255,255,255,0.1)' } : { borderColor: '#eee' }}>
                                    {plan.features.map((feature) => (
                                        <div key={feature} className="flex items-start gap-3">
                                            <span style={{ color: plan.highlight ? 'var(--accent-teal)' : 'var(--accent-teal)' }}>✓</span>
                                            <span className="text-xs opacity-80">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link 
                                    href={plan.cta} 
                                    className={plan.highlight ? 'btn-primary w-full text-center' : 'btn-outline w-full text-center'}
                                    style={plan.highlight ? { background: 'var(--accent-teal)', color: 'var(--primary-navy)', borderColor: 'var(--accent-teal)' } : {}}
                                >
                                    {plan.button}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white border-y">
                <div className="container">
                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <div>
                            <h2 className="serif-font text-4xl mb-8">Varför investera i en Pro-analys?</h2>
                            <div className="space-y-8">
                                <div className="flex gap-8">
                                    <div className="serif-font text-4xl opacity-20">01</div>
                                    <div>
                                        <h4 className="font-bold mb-1">Eliminera gissningar</h4>
                                        <p className="text-sm text-muted leading-relaxed">Istället för att ledningen känner sig "orolig", får ni konkreta data på exakt var era processer är sörbara.</p>
                                    </div>
                                </div>
                                <div className="flex gap-8 border-t pt-8">
                                    <div className="serif-font text-4xl opacity-20">02</div>
                                    <div>
                                        <h4 className="font-bold mb-1">Styrelsefärdig rapport</h4>
                                        <p className="text-sm text-muted leading-relaxed">Vår Pro-analys genererar en färdig exekutiv sammanfattning som kan tas direkt in i nästa styrelsemöte för beslut om mandat.</p>
                                    </div>
                                </div>
                                <div className="flex gap-8 border-t pt-8">
                                    <div className="serif-font text-4xl opacity-20">03</div>
                                    <div>
                                        <h4 className="font-bold mb-1">Snabbare ROI</h4>
                                        <p className="text-sm text-muted leading-relaxed">Vår roadmap prioriterar de projekt som ger bäst resultat på sista raden, vilket gör att teknikinvesteringarna betalar sig snabbare.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-soft p-12 border-left" style={{ borderLeftWidth: '8px' }}>
                            <p className="serif-font text-2xl italic leading-relaxed mb-6">
                                "Kostnaden för analysen är försumbar jämfört med risken att gå miste om en hel marknadsförändring för att man agerade för sent."
                            </p>
                            <p className="uppercase-spaced text-xs opacity-60">Gustaf Olafsson — Strategy Lead</p>
                        </div>
                    </div>
                </div>
            </section>

            <style jsx>{`
                .btn-primary:hover { background: white !important; color: var(--primary-navy) !important; }
            `}</style>
        </div>
    );
}
