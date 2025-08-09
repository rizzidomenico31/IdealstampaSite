import { useState, useEffect } from 'react';

const PasswordProtection = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Password di accesso - cambiala come preferisci
    const SITE_PASSWORD = 'idealstampa2025';

    // Controlla se l'utente è già autenticato (sessionStorage)
    useEffect(() => {
        const auth = sessionStorage.getItem('siteAuthenticated');
        if (auth === 'true') {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (password === SITE_PASSWORD) {
            setIsAuthenticated(true);
            sessionStorage.setItem('siteAuthenticated', 'true');
        } else {
            setError('Password non corretta');
            setPassword('');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('siteAuthenticated');
        setPassword('');
    };

    // Loading iniziale
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Se autenticato, mostra il sito
    if (isAuthenticated) {
        return (
            <div>
                {/* Pulsante logout in alto a destra (solo in dev) */}
                <div className="fixed top-4 right-4 z-50">
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 rounded-full shadow-lg transition-colors"
                        title="Logout (solo sviluppo)"
                    >
                        🔒 Logout
                    </button>
                </div>
                {children}
            </div>
        );
    }

    // Form di login
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/* Logo/Header */}
                <div className="text-center mb-8">

                    <img className="h-16 w-auto object-contain transition-all duration-300 hover:scale-105"
                         src="/logo_ideal.png"
                         alt="Idealstampa Logo"/>

                    <p className="text-gray-600">
                        Sito in sviluppo - Accesso riservato
                    </p>
                </div>

                {/* Form di login */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Inserisci la password
                        </h2>
                        <p className="text-sm text-gray-500">
                            Questo sito è attualmente in fase di sviluppo
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password di accesso
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                placeholder="Inserisci la password"
                                autoFocus
                            />
                        </div>

                        {error && (
                            <div className="flex items-center space-x-2 text-red-600 text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 font-medium"
                        >
                            Accedi al sito
                        </button>
                    </div>

                    {/* Info sviluppo */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start space-x-2">
                            <svg className="w-5 h-5 text-amber-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    Sito in sviluppo
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                    Alcune funzionalità potrebbero non essere ancora complete.
                                    La protezione verrà rimossa al rilascio ufficiale.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-sm text-gray-500">
                    <p>© 2025 Idealstampa - Dal 1995 al vostro servizio</p>
                </div>
            </div>
        </div>
    );
};

export default PasswordProtection;