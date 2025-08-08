import { useState, useEffect } from 'react';
import Production from "./Production.jsx";

export default function Hero() {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [isVisible, setIsVisible] = useState({});

    // Intersection Observer per animazioni al scroll
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

        // Osserva tutte le sezioni
        const sections = document.querySelectorAll('[data-animate]');
        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    // Auto-scroll testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const stats = [
        { number: '30+', label: 'Anni di Esperienza', icon: '🏆' },
        { number: '10K+', label: 'Progetti Realizzati', icon: '📋' },
        { number: '500+', label: 'Clienti Soddisfatti', icon: '😊' },
        { number: '24h', label: 'Tempo di Risposta', icon: '⚡' },
    ];

    const services = [
        {
            title: 'Stampa Offset',
            description: 'Qualità professionale per grandi tirature con colori brillanti e definizione perfetta.',
            icon: '🖨️',
            features: ['Tirature elevate', 'Qualità fotografica', 'Costi ottimizzati'],
            gradient: 'from-blue-600 to-indigo-700'
        },
        {
            title: 'Stampa Digitale',
            description: 'Velocità e flessibilità per piccole tirature con possibilità di personalizzazione.',
            icon: '💻',
            features: ['Consegna rapida', 'Dati variabili', 'Piccole quantità'],
            gradient: 'from-green-600 to-emerald-700'
        },
        {
            title: 'Grande Formato',
            description: 'Visibilità massima per i tuoi messaggi con materiali resistenti e colori vivaci.',
            icon: '🎪',
            features: ['Formati giganti', 'Resistente UV', 'Installazione inclusa'],
            gradient: 'from-purple-600 to-violet-700'
        },
        {
            title: 'Packaging',
            description: 'Confeziona le tue idee con stile, dalla progettazione alla realizzazione.',
            icon: '📦',
            features: ['Design personalizzato', 'Materiali premium', 'Finiture speciali'],
            gradient: 'from-orange-600 to-red-700'
        },
        {
            title: 'Editoria',
            description: 'Diamo forma alle tue pubblicazioni con cura artigianale e tecnologie moderne.',
            icon: '📚',
            features: ['Rilegature premium', 'Correzione bozze', 'Stampa fine art'],
            gradient: 'from-teal-600 to-cyan-700'
        },
        {
            title: 'Finiture Speciali',
            description: 'Dettagli che fanno la differenza con verniciature, rilievi e stampe metallizzate.',
            icon: '✨',
            features: ['Stampa oro/argento', 'Verniciatura UV', 'Rilievi a secco'],
            gradient: 'from-pink-600 to-rose-700'
        }
    ];

    const testimonials = [
        {
            name: 'Marco Bianchi',
            company: 'AutoTech Solutions',
            text: 'Collaboriamo con Idealstampa da oltre 5 anni per tutti i nostri cataloghi aziendali. Qualità impeccabile e tempi sempre rispettati.',
            rating: 5,
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
        },
        {
            name: 'Elena Rossi',
            company: 'Studio Legale Rossi',
            text: 'I nostri biglietti da visita con stampa oro sono sempre un successo. Professionalità e attenzione al dettaglio eccezionali.',
            rating: 5,
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b098?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
        },
        {
            name: 'Giuseppe Verdi',
            company: 'Ristorante Villa dei Sapori',
            text: 'I nostri menu sono diventati parte dell\'esperienza culinaria grazie alla qualità dei materiali e del design. Consigliatissimi!',
            rating: 5,
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
        }
    ];

    const portfolioHighlights = [
        {
            title: 'Catalogo Premium Automotive',
            category: 'Stampa Offset',
            image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            description: '120 pagine in quadricromia su carta patinata'
        },
        {
            title: 'Banner Pubblicitario 6x2m',
            category: 'Grande Formato',
            image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            description: 'PVC banner resistente UV per esterni'
        },
        {
            title: 'Packaging E-commerce',
            category: 'Packaging',
            image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            description: 'Scatole sostenibili con finiture soft touch'
        },
        {
            title: 'Libro Fotografico d\'Arte',
            category: 'Editoria',
            image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            description: 'Rilegatura cartonata con carta fine art'
        }
    ];

    return (
        <>
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background Animation */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
                    <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
                    <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-1000"></div>
                    <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        {/* Left Column - Content */}
                        <div className="text-center lg:text-left">
                            <div className="mb-8">
                                <span className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mb-6 animate-bounce">
                                    ✨ Dal 1995 al vostro servizio
                                </span>

                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                                    L'arte della
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 animate-pulse">
                                        {' '}stampa
                                    </span>
                                    <br />
                                    <span className="text-indigo-600">
                                        l'affidabilità dell'esperienza
                                    </span>
                                </h1>

                                <p className="text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-8">
                                    Trasformiamo le tue idee in progetti tangibili con oltre 30 anni di esperienza.
                                    Dalla consulenza alla consegna, ogni dettaglio è curato con passione artigianale
                                    e tecnologie all'avanguardia.
                                </p>
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                                <button className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                                    <span className="flex items-center justify-center">

                                        <a href="/preventivo">
                                            Richiedi Preventivo Gratuito
                                        </a>

                                        <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </span>
                                </button>

                                <button className="group border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-indigo-600 hover:text-white transition-all duration-300 transform hover:scale-105">
                                    <span className="flex items-center justify-center">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 448 512">
                                            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                                        </svg>
                                        Contatta su WhatsApp
                                    </span>
                                </button>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Preventivi gratuiti
                                </div>
                                <div className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Consegna puntuale
                                </div>
                                <div className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    Qualità garantita
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Image */}
                        <div className="relative">
                            <div className="relative z-10">
                                <img
                                    src="/plantone.png"
                                    alt="Lavorazione tipografica professionale"
                                    className="w-full h-auto object-cover rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-700"
                                />

                                {/* Floating Cards */}
                                <div className="absolute -top-6 -left-6 bg-white p-4 rounded-xl shadow-xl animate-float">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-green-100 p-2 rounded-lg">
                                            <span className="text-2xl">🏆</span>
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">30+ Anni</div>
                                            <div className="text-sm text-gray-600">di Esperienza</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-xl animate-float animation-delay-1000">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-indigo-100 p-2 rounded-lg">
                                            <span className="text-2xl">😊</span>
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">500+</div>
                                            <div className="text-sm text-gray-600">Clienti Felici</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <div className="flex flex-col items-center text-gray-400">
                        <span className="text-sm mb-2">Scopri di più</span>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section id="stats" data-animate className={`py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 transition-all duration-1000 ${isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="text-center text-white transform hover:scale-110 transition-all duration-300"
                                style={{ animationDelay: `${index * 200}ms` }}
                            >
                                <div className="text-4xl mb-2 animate-pulse">{stat.icon}</div>
                                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                                <div className="text-blue-100">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Preview */}
            <section id="services" data-animate className={`py-20 bg-gray-50 transition-all duration-1000 ${isVisible.services ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            I Nostri Servizi
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Soluzioni complete per ogni esigenza di stampa,
                            dalla progettazione alla consegna finale.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                            >
                                <div className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-2xl flex items-center justify-center text-2xl text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    {service.icon}
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">
                                    {service.title}
                                </h3>

                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    {service.description}
                                </p>

                                <ul className="space-y-2 mb-6">
                                    {service.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center text-sm text-gray-600">
                                            <span className="text-green-500 mr-2">•</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <button className={`w-full bg-gradient-to-r ${service.gradient} text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 group-hover:from-indigo-600 group-hover:to-purple-600`}>
                                    Scopri di più
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <a
                            href="/servizi"
                            className="inline-flex items-center bg-indigo-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                        >
                            Vedi Tutti i Servizi
                            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </a>
                    </div>
                </div>
            </section>

            {/* Portfolio Highlights */}
            <section id="portfolio" data-animate className={`py-20 bg-white transition-all duration-1000 ${isVisible.portfolio ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            I Nostri Lavori
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Ogni progetto racconta una storia di qualità, precisione e creatività.
                            Scopri alcuni dei nostri lavori più significativi.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {portfolioHighlights.map((item, index) => (
                            <div
                                key={index}
                                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                    <span className="inline-block bg-indigo-600 px-3 py-1 rounded-full text-xs font-medium mb-2">
                                        {item.category}
                                    </span>
                                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                                    <p className="text-sm text-gray-200">{item.description}</p>
                                </div>

                                <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <a
                            href="/portfolio"
                            className="inline-flex items-center border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-full font-semibold hover:bg-indigo-600 hover:text-white transform hover:scale-105 transition-all duration-300"
                        >
                            Vedi Portfolio Completo
                            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </a>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" data-animate className={`py-20 bg-gradient-to-br from-indigo-50 to-blue-50 transition-all duration-1000 ${isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Cosa Dicono di Noi
                        </h2>
                        <p className="text-xl text-gray-600">
                            La soddisfazione dei nostri clienti è la nostra priorità
                        </p>
                    </div>

                    <div className="relative">
                        <div className="bg-white rounded-2xl p-8 shadow-xl">
                            <div className="flex items-center justify-center mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                    </svg>
                                ))}
                            </div>

                            <blockquote className="text-xl text-gray-700 text-center mb-8 leading-relaxed">
                                "{testimonials[currentTestimonial].text}"
                            </blockquote>

                            <div className="flex items-center justify-center">
                                <img
                                    src={testimonials[currentTestimonial].avatar}
                                    alt={testimonials[currentTestimonial].name}
                                    className="w-16 h-16 rounded-full object-cover mr-4"
                                />
                                <div>
                                    <div className="font-semibold text-gray-900">
                                        {testimonials[currentTestimonial].name}
                                    </div>
                                    <div className="text-gray-600">
                                        {testimonials[currentTestimonial].company}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial Navigation */}
                        <div className="flex justify-center mt-8 space-x-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentTestimonial(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                        index === currentTestimonial ? 'bg-indigo-600 w-8' : 'bg-gray-300'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <Production />

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white bg-opacity-5 rounded-full animate-pulse animation-delay-1000"></div>
                </div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Pronto a Dare Vita al Tuo Progetto?
                    </h2>
                    <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Ogni grande progetto inizia con un'idea.
                        Raccontaci la tua e la trasformeremo in realtà con la nostra esperienza trentennale.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
                        <button className="group bg-white text-indigo-600 px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300">
                            <span className="flex items-center justify-center">
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <a href="/preventivo">
                                    Richiedi Preventivo Gratuito
                                </a>

                                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        </button>

                        <a
                            href="https://wa.me/393770802322"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-indigo-600 transition-all duration-300 transform hover:scale-110"
                        >
                            <span className="flex items-center justify-center">
                                <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 448 512">
                                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                                </svg>
                                Contattaci su WhatsApp
                            </span>
                        </a>
                    </div>

                    {/* Trust Elements */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto text-blue-100">
                        <div className="flex items-center justify-center">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Preventivo in 24h</span>
                        </div>
                        <div className="flex items-center justify-center">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Consegna puntuale</span>
                        </div>
                        <div className="flex items-center justify-center">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Qualità garantita</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Perché Scegliere Idealstampa?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            30 anni di esperienza ci hanno insegnato che ogni dettaglio conta.
                            Ecco cosa ci rende diversi.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="text-center group">
                            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-3xl">🎯</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Precisione Millimetrica</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Ogni progetto è curato nei minimi dettagli. Il nostro controllo qualità
                                garantisce risultati sempre perfetti.
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-3xl">🚀</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Tempi Record</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Tecnologie moderne e processi ottimizzati ci permettono di
                                consegnare in tempi rapidi senza compromessi sulla qualità.
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="bg-gradient-to-br from-yellow-100 to-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-3xl">💡</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Consulenza Gratuita</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Ti guidiamo nella scelta dei materiali e delle soluzioni più adatte
                                al tuo progetto e al tuo budget.
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-3xl">🌱</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Sostenibilità</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Utilizziamo materiali eco-friendly e processi a basso impatto ambientale
                                per un futuro più verde.
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-3xl">🛡️</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Garanzia Totale</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Offriamo garanzia completa su tutti i nostri lavori.
                                La tua soddisfazione è la nostra priorità assoluta.
                            </p>
                        </div>

                        <div className="text-center group">
                            <div className="bg-gradient-to-br from-red-100 to-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <span className="text-3xl">❤️</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Passione Artigianale</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Ogni progetto è realizzato con la passione di chi ama il proprio mestiere
                                e l'orgoglio di tramandare una tradizione.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Info */}
            <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">
                                Vieni a Trovarci
                            </h2>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                Il nostro laboratorio è a Turi, nel cuore della Puglia.
                                Vieni a scoprire come nascono i tuoi progetti e incontra il nostro team.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-indigo-100 p-3 rounded-full">
                                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Indirizzo</h3>
                                        <p className="text-gray-600">Via Dott. Angelo Camposeo, 23 - 70010 Turi (BA)</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="bg-green-100 p-3 rounded-full">
                                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 448 512">
                                            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">WhatsApp</h3>
                                        <a href="https://wa.me/393770802322" className="text-green-600 hover:text-green-700 transition-colors">
                                            +39 377 080 2322
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="bg-blue-100 p-3 rounded-full">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Email</h3>
                                        <a href="mailto:info@idealstampa.com" className="text-blue-600 hover:text-blue-700 transition-colors">
                                            info@idealstampa.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="bg-purple-100 p-3 rounded-full">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Orari</h3>
                                        <p className="text-gray-600">Lun-Ven: 8:00-13:00 / 14:30-18:00</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <img
                                src="/chi-siamo.jpg"
                                alt="Laboratorio tipografico Idealstampa"
                                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-2xl"></div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}