import { useState } from 'react';

export default function Servizi() {
    const [activeService, setActiveService] = useState(null);

    const services = [
        {
            id: 1,
            title: "Stampa Offset",
            subtitle: "Qualità professionale per grandi tirature",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            description: "La stampa offset è la scelta ideale per progetti con tirature elevate. Garantiamo colori brillanti, definizione perfetta e costi ottimizzati.",
            features: [
                "Tirature da 500 a 100.000+ copie",
                "Qualità fotografica superiore",
                "Ampia gamma di supporti e formati",
                "Pantone e quadricromia CMYK",
                "Finiture speciali disponibili"
            ],
            applications: [
                "Cataloghi e brochure",
                "Riviste e periodici",
                "Libri e manuali",
                "Packaging premium",
                "Materiale promozionale"
            ],
            bgColor: "from-blue-600 to-indigo-700",
            accentColor: "blue"
        },
        {
            id: 2,
            title: "Stampa Digitale",
            subtitle: "Velocità e flessibilità per piccole tirature",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2m-7 10l2 2 4-4" />
                </svg>
            ),
            description: "Perfetta per tirature ridotte e personalizzazioni. Stampa rapida con qualità eccellente e possibilità di dati variabili.",
            features: [
                "Da 1 a 2.000 copie",
                "Tempi di consegna rapidi",
                "Stampa dati variabili",
                "Prototipazione veloce",
                "Costi contenuti per piccole quantità"
            ],
            applications: [
                "Biglietti da visita personalizzati",
                "Volantini e flyer",
                "Inviti e partecipazioni",
                "Tesi di laurea",
                "Presentazioni aziendali"
            ],
            bgColor: "from-green-600 to-emerald-700",
            accentColor: "green"
        },
        {
            id: 3,
            title: "Grande Formato",
            subtitle: "Visibilità massima per i tuoi messaggi",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            description: "Soluzioni di stampa per grande formato con materiali resistenti agli agenti atmosferici e colori brillanti che catturano l'attenzione.",
            features: [
                "Formati fino a 3,2 metri di larghezza",
                "Materiali per interno ed esterno",
                "Resistenza agli UV",
                "Installazione e montaggio",
                "Progettazione grafica inclusa"
            ],
            applications: [
                "Striscioni e banner",
                "Insegne luminose e non",
                "Adesivi per vetrine",
                "Stand fieristici",
                "Decorazioni murali"
            ],
            bgColor: "from-purple-600 to-violet-700",
            accentColor: "purple"
        },
        {
            id: 4,
            title: "Packaging",
            subtitle: "Confeziona le tue idee con stile",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 1L5.5 3M15 1l3.5 2" />
                </svg>
            ),
            description: "Realizziamo packaging personalizzato che valorizza i tuoi prodotti. Dalle scatole ai sacchetti, ogni dettaglio è curato per fare la differenza.",
            features: [
                "Scatole personalizzate di ogni forma",
                "Buste e sacchetti branded",
                "Etichette e adesivi",
                "Fustelle su misura",
                "Finiture premium disponibili"
            ],
            applications: [
                "E-commerce packaging",
                "Scatole regalo",
                "Packaging alimentare",
                "Contenitori per eventi",
                "Shopper personalizzate"
            ],
            bgColor: "from-orange-600 to-red-700",
            accentColor: "orange"
        },
        {
            id: 5,
            title: "Editoria",
            subtitle: "Diamo forma alle tue pubblicazioni",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            description: "Dalla pre-stampa alla rilegatura, gestiamo ogni aspetto della produzione editoriale con cura artigianale e tecnologie moderne.",
            features: [
                "Libri e manuali rilegati",
                "Riviste e cataloghi",
                "Tesi di laurea premium",
                "Rilegature personalizzate",
                "Correzione bozze inclusa"
            ],
            applications: [
                "Case editrici",
                "Università e scuole",
                "Aziende per cataloghi",
                "Professionisti per manuali",
                "Privati per progetti personali"
            ],
            bgColor: "from-teal-600 to-cyan-700",
            accentColor: "teal"
        },
        {
            id: 6,
            title: "Finiture Speciali",
            subtitle: "Dettagli che fanno la differenza",
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
            ),
            description: "Aggiungi un tocco di classe ai tuoi stampati con le nostre finiture speciali. Ogni progetto diventa unico e memorabile.",
            features: [
                "Plastificazione lucida/opaca",
                "Verniciatura UV selettiva",
                "Stampa oro e argento",
                "Rilievi e impressioni",
                "Fustellature personalizzate"
            ],
            applications: [
                "Biglietti da visita di lusso",
                "Inviti matrimoniali",
                "Copertine premium",
                "Packaging di alta gamma",
                "Materiale promozionale esclusivo"
            ],
            bgColor: "from-rose-600 to-pink-700",
            accentColor: "rose"
        }
    ];

    const processSteps = [
        {
            step: "01",
            title: "Consulenza",
            description: "Analizziamo il tuo progetto e ti consigliamo la soluzione migliore"
        },
        {
            step: "02",
            title: "Preventivo",
            description: "Ricevi un preventivo dettagliato e trasparente entro 24 ore"
        },
        {
            step: "03",
            title: "Preparazione",
            description: "Ottimizziamo i file e prepariamo tutto per la stampa"
        },
        {
            step: "04",
            title: "Produzione",
            description: "Stampiamo con attenzione ai dettagli e controllo qualità"
        },
        {
            step: "05",
            title: "Consegna",
            description: "Confezioniamo e consegniamo il tuo progetto nei tempi concordati"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Hero Section */}
            <div className="pt-20 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            I Nostri Servizi
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                            Soluzioni complete di stampa per ogni esigenza.
                            Dall'ideazione alla consegna, ci prendiamo cura di ogni dettaglio.
                        </p>
                        <div className="flex justify-center">
                            <div className="w-24 h-1 bg-indigo-500 rounded-full"></div>
                        </div>
                    </div>
                </div>


                {/* Floating elements */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
                <div className="absolute bottom-20 right-20 w-32 h-32 bg-white bg-opacity-5 rounded-full"></div>
                <div className="absolute top-1/2 right-10 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
            </div>

            {/* Services Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className={`group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer overflow-hidden ${
                                activeService === service.id ? 'ring-4 ring-indigo-300' : ''
                            }`}
                            onClick={() => setActiveService(activeService === service.id ? null : service.id)}
                        >
                            {/* Header with gradient */}
                            <div className={`bg-gradient-to-r ${service.bgColor} p-6 text-white relative`}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
                                <div className="relative z-10">
                                    <div className="mb-4">
                                        {service.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                                    <p className="text-sm opacity-90">{service.subtitle}</p>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <p className="text-gray-600 mb-4 leading-relaxed">
                                    {service.description}
                                </p>

                                {/* Expandable content */}
                                <div className={`transition-all duration-500 overflow-hidden ${
                                    activeService === service.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                    <div className="space-y-4 pt-4 border-t border-gray-100">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2">Caratteristiche:</h4>
                                            <ul className="space-y-1">
                                                {service.features.map((feature, idx) => (
                                                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                                                        <span className="text-green-500 mr-2 text-xs">●</span>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2">Applicazioni:</h4>
                                            <ul className="space-y-1">
                                                {service.applications.map((app, idx) => (
                                                    <li key={idx} className="text-sm text-gray-600 flex items-start">
                                                        <span className="text-blue-500 mr-2 text-xs">●</span>
                                                        {app}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <div className="mt-6 pt-4 border-t border-gray-100">
                                    <button className={`w-full bg-gradient-to-r ${service.bgColor} text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200`}>
                                        <a href="/preventivo">
                                            Richiedi Preventivo
                                        </a>

                                    </button>
                                </div>
                            </div>

                            {/* Click indicator */}
                            <div className="absolute top-4 right-4 text-white">
                                <svg
                                    className={`w-6 h-6 transition-transform duration-300 ${
                                        activeService === service.id ? 'rotate-180' : ''
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Process Section */}
            <div className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Il Nostro Processo
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Ogni progetto segue un processo strutturato che garantisce qualità,
                            trasparenza e rispetto dei tempi di consegna.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                        {processSteps.map((step, index) => (
                            <div key={index} className="relative text-center group">
                                {/* Connection line */}
                                {index < processSteps.length - 1 && (
                                    <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-indigo-300 to-purple-300 transform translate-x-4"></div>
                                )}

                                <div className="relative">
                                    <div className="mx-auto w-24 h-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-2xl font-bold text-white">{step.step}</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                                    <p className="text-gray-600">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                        <div>
                            <div className="text-4xl font-bold mb-2">30+</div>
                            <div className="text-blue-100">Anni di esperienza</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">10K+</div>
                            <div className="text-blue-100">Progetti realizzati</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">500+</div>
                            <div className="text-blue-100">Clienti soddisfatti</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">24h</div>
                            <div className="text-blue-100">Tempo risposta</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gray-50 py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">
                        Pronto a dare vita al tuo progetto?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Contattaci per una consulenza gratuita. I nostri esperti ti guideranno
                        nella scelta della soluzione migliore per le tue esigenze.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-indigo-600 text-white px-8 py-4 rounded-full font-medium hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
                            Richiedi Preventivo Gratuito
                        </button>
                        <button className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-full font-medium hover:bg-indigo-50 transition-all duration-200">
                            Chiamaci: +39 377 080 2322
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}