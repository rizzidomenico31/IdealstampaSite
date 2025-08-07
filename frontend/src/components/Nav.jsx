import { useState, useEffect } from 'react';
import { Outlet } from "react-router-dom";
import Footer from "./Footer.jsx";

export default function Nav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
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
                message = 'Aperti ora!';
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

    // Gestione scroll per navbar trasparente
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        calculateBusinessStatus();
        const interval = setInterval(calculateBusinessStatus, 60000);

        window.addEventListener('scroll', handleScroll);

        return () => {
            clearInterval(interval);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Chiudi menu quando si clicca su un link
    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    const navLinks = [
        { name: 'Home', href: '/', icon: '🏠' },
        { name: 'Chi Siamo', href: '/info', icon: '👥' },
        { name: 'Servizi', href: '/servizi', icon: '⚙️' },
        { name: 'Portfolio', href: '/portfolio', icon: '💼' },
        { name: 'Contatti', href: '/contatti', icon: '📞' },
    ];

    return (
        <div className="bg-gradient-to-b from-[#F5F7FF] via-[#fffbee] to-[#E6EFFF] min-h-screen">

            {/* Top Bar con Status */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-2 text-sm">
                        {/* Status Business */}
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                            businessStatus.isOpen
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                            <div className={`w-2 h-2 rounded-full ${
                                businessStatus.isOpen ? 'bg-green-500' : 'bg-red-500'
                            } ${businessStatus.isOpen ? 'animate-pulse' : ''}`}></div>
                            <span className="font-medium">{businessStatus.message}</span>
                        </div>

                        {/* Quick Contact */}
                        <div className="hidden md:flex items-center space-x-6 text-gray-600">
                            <a
                                href="mailto:info@idealstampa.com"
                                className="flex items-center space-x-2 hover:text-indigo-600 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>info@idealstampa.com</span>
                            </a>
                            <a
                                href="https://wa.me/393770802322"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 hover:text-green-600 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 448 512">
                                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                                </svg>
                                <span>+39 377 080 2322</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <header className="bg-white shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">

                        {/* Logo */}
                        <a href="/" className="flex-shrink-0">
                            <img className="h-16 w-auto object-contain transition-all duration-300 hover:scale-105"
                                 src="/logo_ideal.png"
                                 alt="Idealstampa Logo"/>
                        </a>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="group relative px-3 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-all duration-300"
                                    onClick={handleLinkClick}
                                >
                                    <span>{link.name}</span>
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
                                </a>
                            ))}
                        </nav>

                        {/* Desktop CTA + Mobile Menu Button */}
                        <div className="flex items-center space-x-4">
                            {/* Desktop CTA */}
                            <div className="hidden md:flex items-center space-x-3">
                                <a
                                    href="https://wa.me/393770802322"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                                >
                                    WhatsApp
                                </a>

                                <a
                                    href="/preventivo"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                                >
                                    PREVENTIVO
                                </a>
                            </div>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="lg:hidden p-2 text-gray-600 hover:text-indigo-600 transition-colors relative z-50"
                            >
                                <svg
                                    className={`w-6 h-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-45' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    {isMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 lg:hidden ${
                isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`} onClick={() => setIsMenuOpen(false)}></div>

            {/* Mobile Menu */}
            <nav className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 lg:hidden ${
                isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
                <div className="flex flex-col h-full">
                    {/* Mobile Menu Header */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <img className="h-12 w-auto" src="../public/logo_ideal.png" alt="Idealstampa" />
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Mobile Status */}
                        <div className={`mt-4 flex items-center space-x-2 px-3 py-2 rounded-lg ${
                            businessStatus.isOpen
                                ? 'bg-green-50 text-green-800 border border-green-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                        }`}>
                            <div className={`w-2 h-2 rounded-full ${
                                businessStatus.isOpen ? 'bg-green-500' : 'bg-red-500'
                            } ${businessStatus.isOpen ? 'animate-pulse' : ''}`}></div>
                            <span className="text-sm font-medium">{businessStatus.message}</span>
                        </div>
                    </div>

                    {/* Mobile Menu Links */}
                    <div className="flex-1 py-6">
                        {navLinks.map((link, index) => (
                            <a
                                key={link.name}
                                href={link.href}
                                onClick={handleLinkClick}
                                className="flex items-center space-x-4 px-6 py-4 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 group"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <span className="text-2xl group-hover:scale-110 transition-transform">
                                    {link.icon}
                                </span>
                                <span className="text-lg font-medium">{link.name}</span>
                                <svg className="w-5 h-5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        ))}
                    </div>

                    {/* Mobile Menu Footer */}
                    <div className="p-6 border-t border-gray-100 space-y-4">
                        {/* Contact Info */}
                        <div className="space-y-3 text-sm text-gray-600">
                            <a
                                href="mailto:info@idealstampa.com"
                                className="flex items-center space-x-3 hover:text-indigo-600 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>info@idealstampa.com</span>
                            </a>
                            <div className="flex items-center space-x-3">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>Via Roma, 123 - Turi (BA)</span>
                            </div>
                        </div>

                        {/* Mobile CTA Buttons */}
                        <div className="space-y-3">
                            <a
                                href="https://wa.me/393770802322"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-full font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                                onClick={handleLinkClick}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 448 512">
                                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                                </svg>
                                <span>Contatta WhatsApp</span>
                            </a>

                            <a
                                href="/preventivo"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-full font-medium transition-all duration-300 text-center block"
                                onClick={handleLinkClick}
                            >
                                Richiedi Preventivo
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Content */}
            <div className="px-4 sm:px-6 lg:px-8">
                <main>
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    )
}