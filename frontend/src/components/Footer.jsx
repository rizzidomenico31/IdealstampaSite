import { useState, useEffect } from 'react';

export default function Footer() {
    const year = new Date().getFullYear();
    const [businessStatus, setBusinessStatus] = useState({
        isOpen: false,
        message: ''
    });

    // Funzione per calcolare lo stato dell'attività
    const calculateBusinessStatus = () => {
        const now = new Date();
        const currentDay = now.getDay();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        const workingDays = [1, 2, 3, 4, 5];
        const morningStart = 8 * 60;
        const morningEnd = 13 * 60;
        const afternoonStart = 14 * 60 + 30;
        const afternoonEnd = 18 * 60;

        let isOpen = false;
        let message = '';

        if (!workingDays.includes(currentDay)) {
            isOpen = false;
            message = 'Chiusi nel weekend';
        } else {
            if ((currentTime >= morningStart && currentTime < morningEnd) ||
                (currentTime >= afternoonStart && currentTime < afternoonEnd)) {
                isOpen = true;
                message = 'Aperti ora';
            } else if (currentTime >= morningEnd && currentTime < afternoonStart) {
                isOpen = false;
                message = 'Pausa pranzo';
            } else {
                isOpen = false;
                message = 'Chiusi';
            }
        }

        setBusinessStatus({ isOpen, message });
    };

    useEffect(() => {
        calculateBusinessStatus();
        const interval = setInterval(calculateBusinessStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    const quickLinks = [
        { name: 'Chi Siamo', href: '/info' },
        { name: 'I Nostri Servizi', href: '/servizi' },
        { name: 'Portfolio', href: '/portfolio' },
        { name: 'Contatti', href: '/contatti' },
    ];

    const services = [
        { name: 'Stampa Offset', href: '/servizi#offset' },
        { name: 'Stampa Digitale', href: '/servizi#digitale' },
        { name: 'Grande Formato', href: '/servizi#grande-formato' },
        { name: 'Packaging', href: '/servizi#packaging' },
        { name: 'Editoria', href: '/servizi#editoria' },
        { name: 'Finiture Speciali', href: '/servizi#finiture' },
    ];

    const legalLinks = [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Cookie Policy', href: '/cookies' },
        { name: 'Termini e Condizioni', href: '/termini' },
        { name: 'P.IVA: 12345678901', href: '#' },
    ];

    return (
        <footer className="bg-gray-900 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
            </div>

            {/* Main Footer Content */}
            <div className="relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

                        {/* Company Info */}
                        <div className="lg:col-span-1">
                            <div className="flex items-center mb-6">
                                <img
                                    className="h-16 w-auto object-contain filter brightness-0 invert"
                                    src="/logo_ideal.png"
                                    alt="Idealstampa Logo"
                                />
                            </div>
                            <p className="text-gray-300 mb-6 leading-relaxed">
                                Dal 1995, la passione per la stampa di qualità.
                                Trasformiamo le tue idee in progetti tangibili con
                                esperienza, precisione e innovazione.
                            </p>

                            {/* Status Badge */}
                            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium mb-6 ${
                                businessStatus.isOpen
                                    ? 'bg-green-900/50 text-green-300 border border-green-800'
                                    : 'bg-red-900/50 text-red-300 border border-red-800'
                            }`}>
                                <div className={`w-2 h-2 rounded-full ${
                                    businessStatus.isOpen ? 'bg-green-400' : 'bg-red-400'
                                } ${businessStatus.isOpen ? 'animate-pulse' : ''}`}></div>
                                <span>{businessStatus.message}</span>
                            </div>

                            {/* Social Media */}
                            <div className="flex space-x-4">
                                <a
                                    href="#"
                                    className="bg-gray-800 hover:bg-indigo-600 p-3 rounded-full transition-colors duration-300 group"
                                    aria-label="Facebook"
                                >
                                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                                    </svg>
                                </a>
                                <a
                                    href="#"
                                    className="bg-gray-800 hover:bg-pink-600 p-3 rounded-full transition-colors duration-300 group"
                                    aria-label="Instagram"
                                >
                                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                                        <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"/>
                                    </svg>
                                </a>
                                <a
                                    href="https://wa.me/393770802322"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-gray-800 hover:bg-green-600 p-3 rounded-full transition-colors duration-300 group"
                                    aria-label="WhatsApp"
                                >
                                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 448 512">
                                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-lg font-semibold mb-6 text-white flex items-center">
                                <span className="mr-2">🔗</span>
                                Link Rapidi
                            </h3>
                            <ul className="space-y-3">
                                {quickLinks.map((link, index) => (
                                    <li key={index}>
                                        <a
                                            href={link.href}
                                            className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center group"
                                        >
                                            <span className="opacity-0 group-hover:opacity-100 mr-2 transition-opacity">→</span>
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Services */}
                        <div>
                            <h3 className="text-lg font-semibold mb-6 text-white flex items-center">
                                <span className="mr-2">⚙️</span>
                                I Nostri Servizi
                            </h3>
                            <ul className="space-y-3">
                                {services.map((service, index) => (
                                    <li key={index}>
                                        <a
                                            href={service.href}
                                            className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center group"
                                        >
                                            <span className="opacity-0 group-hover:opacity-100 mr-2 transition-opacity">→</span>
                                            {service.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="text-lg font-semibold mb-6 text-white flex items-center">
                                <span className="mr-2">📍</span>
                                Contattaci
                            </h3>
                            <div className="space-y-4">
                                {/* Address */}
                                <div className="flex items-start space-x-3 group">
                                    <div className="bg-gray-800 p-2 rounded-lg group-hover:bg-indigo-600 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-gray-300">
                                            Via Dott. Angelo Camposeo, 23<br />
                                            70010 Turi (BA)<br />
                                            Puglia, Italia
                                        </p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-center space-x-3 group">
                                    <div className="bg-gray-800 p-2 rounded-lg group-hover:bg-green-600 transition-colors">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 448 512">
                                            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                                        </svg>
                                    </div>
                                    <a
                                        href="https://wa.me/393770802322"
                                        className="text-gray-300 hover:text-white transition-colors"
                                    >
                                        +39 377 080 2322
                                    </a>
                                </div>

                                {/* Email */}
                                <div className="flex items-center space-x-3 group">
                                    <div className="bg-gray-800 p-2 rounded-lg group-hover:bg-blue-600 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <a
                                        href="mailto:info@idealstampa.com"
                                        className="text-gray-300 hover:text-white transition-colors"
                                    >
                                        info@idealstampa.com
                                    </a>
                                </div>

                                {/* Business Hours */}
                                <div className="mt-6">
                                    <h4 className="text-sm font-semibold text-gray-200 mb-2">Orari di Apertura:</h4>
                                    <div className="text-sm text-gray-300 space-y-1">
                                        <div>Lun-Ven: 8:00-13:00 / 14:30-18:00</div>
                                        <div>Sab-Dom: Chiuso</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter Section */}
                    <div className="border-t border-gray-800 pt-8 mb-8">
                        <div className="max-w-md mx-auto lg:mx-0">
                            <h3 className="text-lg font-semibold mb-4 text-white flex items-center justify-center lg:justify-start">
                                <span className="mr-2">📧</span>
                                Resta Aggiornato
                            </h3>
                            <p className="text-gray-300 mb-4 text-center lg:text-left">
                                Iscriviti alla nostra newsletter per ricevere offerte esclusive e novità.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="email"
                                    placeholder="La tua email"
                                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                                <button className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg font-medium transition-colors whitespace-nowrap">
                                    Iscriviti
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 bg-gray-950">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
                            {/* Copyright */}
                            <div className="text-center lg:text-left">
                                <p className="text-gray-400 text-sm">
                                    © {year} Tipografia Idealstampa. Tutti i diritti riservati.
                                </p>
                                <p className="text-gray-500 text-xs mt-1">
                                    Realizzato con ❤️ da{' '}
                                    <a
                                        href="#"
                                        className="text-indigo-400 hover:text-indigo-300 transition-colors"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Domenico Rizzi
                                    </a>
                                </p>
                            </div>

                            {/* Legal Links */}
                            <div className="flex flex-wrap justify-center gap-4 text-sm">
                                {legalLinks.map((link, index) => (
                                    <a
                                        key={index}
                                        href={link.href}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Floating Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <a
                    href="https://wa.me/393770802322"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
                    aria-label="Contattaci su WhatsApp"
                >
                    <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 448 512">
                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                    </svg>
                </a>
            </div>
        </footer>
    );
}