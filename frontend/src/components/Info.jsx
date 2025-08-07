import { useState, useEffect } from 'react';

export default function Info() {
    const [activeStory, setActiveStory] = useState(0);
    const [isVisible, setIsVisible] = useState({});

    // Intersection Observer per animazioni
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(prev => ({
                            ...prev,
                            [entry.target.id]: true
                        }));
                    }
                });
            },
            { threshold: 0.1 }
        );

        const sections = document.querySelectorAll('[data-animate]');
        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    // Auto-cycle through story timeline
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStory(prev => (prev + 1) % storyTimeline.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const storyTimeline = [
        {
            year: '1995',
            title: 'La Nascita',
            description: 'Fondiamo Idealstampa con l\'obiettivo di portare qualità artigianale nel mondo della stampa.',
            icon: '🌱'
        },
        {
            year: '2005',
            title: 'Innovazione',
            description: 'Abbracciamo il digitale mantenendo sempre la qualità che ci contraddistingue.',
            icon: '💻'
        },
        {
            year: '2015',
            title: 'Crescita',
            description: 'Diventiamo punto di riferimento per aziende e istituzioni del territorio.',
            icon: '🚀'
        },
        {
            year: '2025',
            title: 'Oggi',
            description: 'Continuiamo a innovare con passione, qualità e rispetto per l\'ambiente.',
            icon: '✨'
        }
    ];

    const valori = [
        {
            title: 'Qualità',
            description: 'Standard elevati in ogni progetto, senza compromessi.',
            icon: '🏆',
            gradient: 'from-green-500 to-emerald-600'
        },
        {
            title: 'Affidabilità',
            description: 'Tempi certi e risultati garantiti, sempre.',
            icon: '⏰',
            gradient: 'from-blue-500 to-indigo-600'
        },
        {
            title: 'Innovazione',
            description: 'Tecnologie moderne al servizio della tradizione.',
            icon: '💡',
            gradient: 'from-purple-500 to-violet-600'
        },
        {
            title: 'Sostenibilità',
            description: 'Materiali eco-friendly e processi rispettosi.',
            icon: '🌱',
            gradient: 'from-teal-500 to-cyan-600'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">

            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        <div>
                            <span className="inline-block bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                                🏛️ La Nostra Storia
                            </span>

                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                                Da oltre 30 anni,
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                    {' '}stampiamo{' '}
                                </span>
                                le vostre idee
                            </h1>

                            <p className="text-xl text-gray-600 leading-relaxed mb-8">
                                Fondata nel 1995, Idealstampa nasce dalla passione per l'arte della stampa.
                                Oggi siamo un punto di riferimento per aziende, professionisti e privati
                                che cercano qualità, affidabilità e creatività.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <a
                                    href="/preventivo"
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-center"
                                >
                                    Richiedi Preventivo
                                </a>
                                <a
                                    href="/contatti"
                                    className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-indigo-600 hover:text-white transition-all duration-300 transform hover:scale-105 text-center"
                                >
                                    Contattaci
                                </a>
                            </div>

                            <div className="grid grid-cols-3 gap-6 text-center">
                                <div>
                                    <div className="text-3xl font-bold text-indigo-600">30+</div>
                                    <div className="text-sm text-gray-600">Anni di Esperienza</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-indigo-600">500+</div>
                                    <div className="text-sm text-gray-600">Clienti Soddisfatti</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-indigo-600">10K+</div>
                                    <div className="text-sm text-gray-600">Progetti Realizzati</div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <img
                                src="/chi-siamo.jpg"
                                alt="Laboratorio Idealstampa"
                                className="rounded-2xl shadow-2xl w-full h-auto object-cover transform hover:scale-105 transition-all duration-700"
                            />

                            {/* Floating Badge */}
                            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl animate-float">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-indigo-100 p-3 rounded-lg">
                                        <span className="text-2xl">🎯</span>
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900">Mission</div>
                                        <div className="text-sm text-gray-600">Eccellenza in ogni progetto</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section id="timeline" data-animate className={`py-16 bg-white transition-all duration-1000 ${isVisible.timeline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Il Nostro Percorso
                        </h2>
                        <p className="text-lg text-gray-600">
                            30 anni di crescita, innovazione e passione
                        </p>
                    </div>

                    {/* Timeline Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {storyTimeline.map((story, index) => (
                            <div
                                key={index}
                                className={`group bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer ${
                                    activeStory === index ? 'ring-2 ring-indigo-300 shadow-xl scale-105' : ''
                                }`}
                                onClick={() => setActiveStory(index)}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="text-center">
                                    <div className="text-4xl mb-3">{story.icon}</div>
                                    <div className="text-2xl font-bold text-indigo-600 mb-2">{story.year}</div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{story.title}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{story.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section id="valori" data-animate className={`py-16 bg-gradient-to-br from-gray-50 to-indigo-50 transition-all duration-1000 ${isVisible.valori ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            I Nostri Valori
                        </h2>
                        <p className="text-lg text-gray-600">
                            Principi che guidano ogni nostra decisione
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {valori.map((valore, index) => (
                            <div
                                key={index}
                                className="group bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className={`w-12 h-12 bg-gradient-to-r ${valore.gradient} rounded-xl flex items-center justify-center text-2xl text-white mb-4 group-hover:scale-110 transition-transform duration-300 mx-auto`}>
                                    {valore.icon}
                                </div>

                                <div className="text-center">
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                                        {valore.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        {valore.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white bg-opacity-5 rounded-full animate-pulse animation-delay-1000"></div>
                </div>

                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-white text-center lg:text-left">

                        <div>
                            <div className="text-4xl mb-4">🎯</div>
                            <h3 className="text-2xl font-bold mb-4">La Nostra Mission</h3>
                            <p className="text-lg text-blue-100 leading-relaxed">
                                Trasformare ogni progetto in un'esperienza di eccellenza,
                                combinando tradizione artigianale e innovazione tecnologica.
                            </p>
                        </div>

                        <div>
                            <div className="text-4xl mb-4">🚀</div>
                            <h3 className="text-2xl font-bold mb-4">La Nostra Vision</h3>
                            <p className="text-lg text-blue-100 leading-relaxed">
                                Essere il punto di riferimento nella stampa, riconosciuti
                                per qualità e innovazione, portando l'eccellenza italiana nel mondo.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Inizia il Tuo Progetto con Noi
                    </h2>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Ogni cliente diventa parte della famiglia Idealstampa.
                        Scopri come possiamo aiutarti a realizzare le tue idee.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/preventivo"
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                        >
                            <span className="flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Richiedi Preventivo
                            </span>
                        </a>

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
                                Scrivici su WhatsApp
                            </span>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}