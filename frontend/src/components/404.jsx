import { useState, useEffect } from 'react';

const Page404 = () => {
    const [timeLeft, setTimeLeft] = useState(10);
    const [isRedirecting, setIsRedirecting] = useState(false);

    // Countdown per redirect automatico
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    setIsRedirecting(true);
                    window.location.href = '/';
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleRedirect = () => {
        setIsRedirecting(true);
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center px-4">
            <div className="max-w-2xl mx-auto text-center">

                {/* Logo */}
                <div className="mb-8">
                    <img
                        className="h-16 w-auto mx-auto transition-all duration-300 hover:scale-105"
                        src="/logo_ideal.png"
                        alt="Idealstampa Logo"
                    />
                </div>

                {/* Numero 404 grande */}
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text animate-pulse">
                        404
                    </h1>
                </div>

                {/* Messaggio principale */}
                <div className="mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Pagina non trovata
                    </h2>
                    <p className="text-xl text-gray-600 mb-6">
                        Ops! La pagina che stai cercando non esiste o è stata spostata.
                    </p>
                </div>

                {/* Illustrazione creativa per tipografia */}
                <div className="mb-8">
                    <div className="w-64 h-32 mx-auto bg-white rounded-xl shadow-lg border-2 border-gray-200 relative overflow-hidden">
                        {/* Simulazione foglio stampato */}
                        <div className="absolute inset-4">
                            <div className="w-full h-2 bg-indigo-200 rounded mb-2"></div>
                            <div className="w-3/4 h-2 bg-indigo-100 rounded mb-2"></div>
                            <div className="w-5/6 h-2 bg-indigo-100 rounded mb-2"></div>
                            <div className="w-1/2 h-2 bg-indigo-100 rounded mb-2"></div>
                        </div>
                        {/* Simbolo "X" per indicare errore */}
                        <div className="absolute top-2 right-2">
                            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                ✕
                            </div>
                        </div>
                    </div>
                </div>

                {/* Suggerimenti utili */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 text-left">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                        💡 Cosa puoi fare:
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold">
                                    🏠
                                </span>
                                <a href="/" className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline">
                                    Torna alla Home
                                </a>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-semibold">
                                    📋
                                </span>
                                <a href="/preventivo" className="text-green-600 hover:text-green-700 font-medium hover:underline">
                                    Richiedi Preventivo
                                </a>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                                    📞
                                </span>
                                <a href="tel:+393770802322" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                                    Chiamaci
                                </a>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                                    ✉️
                                </span>
                                <a href="mailto:info@idealstampa.com" className="text-purple-600 hover:text-purple-700 font-medium hover:underline">
                                    Scrivici
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Countdown e redirect */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8">
                    <div className="flex items-center justify-center space-x-4">
                        {!isRedirecting ? (
                            <>
                                <div className="text-center">
                                    <p className="text-gray-600 mb-2">
                                        Sarai reindirizzato automaticamente alla home in:
                                    </p>
                                    <div className="text-3xl font-bold text-indigo-600">
                                        {timeLeft}
                                    </div>
                                </div>
                                <div className="border-l border-gray-300 h-12"></div>
                                <button
                                    onClick={handleRedirect}
                                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                                >
                                    Vai subito alla Home
                                </button>
                            </>
                        ) : (
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                                <p className="text-gray-600">Reindirizzamento in corso...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Messaggio divertente per tipografia */}
                <div className="text-sm text-gray-500">
                    <p className="mb-2">
                        🎨 Anche le pagine migliori a volte "vanno fuori registro"
                    </p>
                    <p>
                        Ma noi di <strong>Idealstampa</strong> sappiamo come rimettere tutto a posto!
                    </p>
                </div>

                {/* Footer */}
                <div className="mt-12 text-center text-sm text-gray-400">
                    <p>© 2025 Idealstampa - Dal 1995 al vostro servizio</p>
                </div>
            </div>
        </div>
    );
};

export default Page404;