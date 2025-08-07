import { useState, useEffect } from 'react';

export default function Production() {
    const [activeStep, setActiveStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    // Intersection Observer per animazioni
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        // Auto-play degli step
                        const interval = setInterval(() => {
                            setActiveStep(prev => (prev + 1) % processSteps.length);
                        }, 3000);
                        return () => clearInterval(interval);
                    }
                });
            },
            { threshold: 0.1 }
        );

        const element = document.getElementById('process-section');
        if (element) observer.observe(element);

        return () => observer.disconnect();
    }, []);

    const processSteps = [
        {
            id: 1,
            title: "Consulenza Iniziale",
            subtitle: "Ascoltiamo le tue esigenze",
            description: "Analizziamo insieme il tuo progetto per capire obiettivi, target e budget. Ti guidiamo nella scelta della soluzione più adatta.",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
            ),
            details: [
                "Analisi delle esigenze specifiche",
                "Definizione obiettivi e target",
                "Valutazione budget disponibile",
                "Consigli su materiali e formati"
            ],
            duration: "30-60 min",
            gradient: "from-blue-500 to-indigo-600"
        },
        {
            id: 2,
            title: "Preventivo Dettagliato",
            subtitle: "Trasparenza nei costi",
            description: "Elaboriamo un preventivo completo e dettagliato, spiegando ogni voce di costo. Nessuna sorpresa, tutto chiaro fin dall'inizio.",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            ),
            details: [
                "Preventivo gratuito e senza impegno",
                "Dettaglio di ogni voce di costo",
                "Opzioni alternative per il budget",
                "Tempi di consegna garantiti"
            ],
            duration: "24h",
            gradient: "from-green-500 to-emerald-600"
        },
        {
            id: 3,
            title: "Preparazione File",
            subtitle: "Ottimizzazione per la stampa",
            description: "I nostri tecnici verificano e ottimizzano i tuoi file per garantire il miglior risultato di stampa possibile.",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            details: [
                "Controllo risoluzione e colori",
                "Verifica margini e al vivo",
                "Ottimizzazione per il tipo di stampa",
                "Correzione eventuali problemi"
            ],
            duration: "2-4h",
            gradient: "from-purple-500 to-violet-600"
        },
        {
            id: 4,
            title: "Prova di Stampa",
            subtitle: "Approvazione prima della produzione",
            description: "Ti forniamo una prova fisica o digitale del lavoro finale per la tua approvazione prima di procedere con la tiratura completa.",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
            ),
            details: [
                "Prova su carta del progetto finale",
                "Verifica colori e qualità",
                "Possibilità di modifiche",
                "Approvazione definitiva"
            ],
            duration: "1-2 giorni",
            gradient: "from-orange-500 to-red-600"
        },
        {
            id: 5,
            title: "Produzione",
            subtitle: "Stampa con tecnologie avanzate",
            description: "Avviamo la produzione utilizzando le migliori tecnologie di stampa offset e digitale, con controllo qualità costante.",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2m-7 10l2 2 4-4" />
                </svg>
            ),
            details: [
                "Stampa con macchine professionali",
                "Controllo qualità in tempo reale",
                "Utilizzo di inchiostri premium",
                "Monitoraggio di ogni fase"
            ],
            duration: "1-5 giorni",
            gradient: "from-teal-500 to-cyan-600"
        },
        {
            id: 6,
            title: "Finiture e Lavorazioni",
            subtitle: "L'arte del dettaglio",
            description: "Applichiamo tutte le lavorazioni speciali: taglio, piega, plastificazione, rilegatura e ogni finitura richiesta.",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
            ),
            details: [
                "Taglio di precisione",
                "Plastificazione e verniciature",
                "Rilegature personalizzate",
                "Finiture speciali su richiesta"
            ],
            duration: "1-3 giorni",
            gradient: "from-pink-500 to-rose-600"
        },
        {
            id: 7,
            title: "Controllo Qualità",
            subtitle: "Perfezione garantita",
            description: "Ogni pezzo viene ispezionato individualmente per garantire la massima qualità prima della consegna finale.",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            details: [
                "Ispezione qualità su ogni pezzo",
                "Verifica conformità specifiche",
                "Controllo finale pre-consegna",
                "Garanzia soddisfazione 100%"
            ],
            duration: "2-4h",
            gradient: "from-emerald-500 to-teal-600"
        },
        {
            id: 8,
            title: "Confezionamento e Consegna",
            subtitle: "Cura fino alla destinazione",
            description: "Confezioniamo tutto con cura per proteggere il lavoro durante il trasporto e consegniamo puntualmente.",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 1L5.5 3M15 1l3.5 2" />
                </svg>
            ),
            details: [
                "Imballaggio professionale",
                "Protezione durante il trasporto",
                "Consegna nei tempi concordati",
                "Tracking e comunicazione costante"
            ],
            duration: "Stesso giorno",
            gradient: "from-indigo-500 to-purple-600"
        }
    ];

    return (
        <section
            id="process-section"
            className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 relative overflow-hidden"
        >
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-block bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                        🔧 Il Nostro Metodo
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Il Processo Produttivo
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Ogni progetto segue un percorso strutturato che garantisce qualità,
                        trasparenza e rispetto dei tempi. Scopri come trasformiamo le tue idee in realtà.
                    </p>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Central Line */}
                    <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-indigo-200 via-purple-300 to-indigo-200"></div>

                    {/* Steps */}
                    <div className="space-y-12">
                        {processSteps.map((step, index) => (
                            <div
                                key={step.id}
                                className={`relative transition-all duration-1000 ${
                                    isVisible
                                        ? `opacity-100 ${index % 2 === 0 ? 'translate-x-0' : 'translate-x-0'}`
                                        : `opacity-0 ${index % 2 === 0 ? '-translate-x-20' : 'translate-x-20'}`
                                }`}
                                style={{ animationDelay: `${index * 200}ms` }}
                            >
                                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                                    index % 2 === 0 ? '' : 'lg:grid-flow-col-dense'
                                }`}>

                                    {/* Content */}
                                    <div className={`${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12 lg:col-start-2'} 
                                        ${activeStep === index ? 'lg:scale-105' : ''} transition-transform duration-500`}>
                                        <div className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 
                                            ${activeStep === index ? 'ring-4 ring-indigo-300 shadow-2xl' : ''}`}
                                        >
                                            <div className={`w-16 h-16 bg-gradient-to-r ${step.gradient} rounded-2xl flex items-center justify-center text-white mb-6 
                                                ${activeStep === index ? 'scale-110' : ''} transition-transform duration-300`}
                                            >
                                                {step.icon}
                                            </div>

                                            <div className="mb-4">
                                                <span className="text-sm font-medium text-indigo-600 mb-2 block">
                                                    Step {step.id} • {step.duration}
                                                </span>
                                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                                    {step.title}
                                                </h3>
                                                <p className="text-lg text-indigo-600 font-medium mb-4">
                                                    {step.subtitle}
                                                </p>
                                            </div>

                                            <p className="text-gray-600 mb-6 leading-relaxed">
                                                {step.description}
                                            </p>

                                            <ul className="space-y-2 mb-6">
                                                {step.details.map((detail, idx) => (
                                                    <li key={idx} className="flex items-center text-sm text-gray-600">
                                                        <span className="w-2 h-2 bg-indigo-400 rounded-full mr-3 flex-shrink-0"></span>
                                                        {detail}
                                                    </li>
                                                ))}
                                            </ul>

                                            <div className={`w-full bg-gray-200 rounded-full h-2 mb-4 ${
                                                activeStep === index ? 'bg-indigo-100' : ''
                                            }`}>
                                                <div
                                                    className={`bg-gradient-to-r ${step.gradient} h-2 rounded-full transition-all duration-1000 ${
                                                        activeStep === index ? 'w-full' : 'w-0'
                                                    }`}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Image/Visual */}
                                    <div className={`${index % 2 === 0 ? 'lg:pl-12' : 'lg:pr-12 lg:col-start-1'} 
                                        ${activeStep === index ? 'lg:scale-105' : ''} transition-transform duration-500`}>
                                        <div className="relative">
                                            <div className={`w-full h-80 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center overflow-hidden relative group`}>
                                                {/* Content for each step */}
                                                <div className="text-center text-white p-8">
                                                    <div className="text-6xl mb-4 opacity-20">
                                                        {step.icon}
                                                    </div>
                                                    <h4 className="text-2xl font-bold mb-2">
                                                        {step.title}
                                                    </h4>
                                                    <p className="text-blue-100">
                                                        Durata: {step.duration}
                                                    </p>
                                                </div>

                                                {/* Decorative Elements */}
                                                <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white/20 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
                                                <div className="absolute bottom-4 left-4 w-8 h-8 border-2 border-white/20 rounded-full group-hover:scale-110 transition-transform duration-300"></div>
                                            </div>

                                            {/* Step Number */}
                                            <div className="absolute -top-6 -left-6 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-indigo-100">
                                                <span className="text-xl font-bold text-indigo-600">
                                                    {step.id}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Connection Line for Mobile */}
                                {index < processSteps.length - 1 && (
                                    <div className="lg:hidden flex justify-center mt-8">
                                        <div className="w-1 h-12 bg-gradient-to-b from-indigo-300 to-purple-300 rounded-full"></div>
                                    </div>
                                )}

                                {/* Timeline Dot */}
                                <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <div className={`w-8 h-8 rounded-full border-4 border-white shadow-lg transition-all duration-500 ${
                                        activeStep === index
                                            ? `bg-gradient-to-r ${step.gradient} scale-125 shadow-xl`
                                            : 'bg-indigo-300'
                                    }`}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                

                {/* Bottom CTA */}
                <div className="mt-20 text-center">
                    <div className="bg-white rounded-2xl p-8 shadow-xl max-w-4xl mx-auto">
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">
                            Pronto a Iniziare il Tuo Progetto?
                        </h3>
                        <p className="text-xl text-gray-600 mb-8">
                            Seguiremo insieme ogni fase del processo per garantire
                            un risultato perfetto e la tua completa soddisfazione.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                                <span className="flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Richiedi Preventivo
                                </span>
                            </button>

                            <a
                                href="https://wa.me/393770802322"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-indigo-600 hover:text-white transition-all duration-300 transform hover:scale-105"
                            >
                                <span className="flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 448 512">
                                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                                    </svg>
                                    Parliamone su WhatsApp
                                </span>
                            </a>
                        </div>

                        <div className="flex items-center justify-center mt-6 text-sm text-gray-500">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Ti ricontattiamo entro 2 ore</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}