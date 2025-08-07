import { useState, useEffect } from 'react';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [businessStatus, setBusinessStatus] = useState({
        isOpen: false,
        message: '',
        nextChange: ''
    });

    // Funzione per calcolare lo stato dell'attività
    const calculateBusinessStatus = () => {
        const now = new Date();
        const currentDay = now.getDay(); // 0 = Domenica, 1 = Lunedì, ..., 6 = Sabato
        const currentTime = now.getHours() * 60 + now.getMinutes(); // Minuti dall'inizio del giorno

        // Orari: Lun-Ven 8:00-13:00 e 14:30-18:00, Sab-Dom chiuso
        const workingDays = [1, 2, 3, 4, 5]; // Lunedì-Venerdì
        const morningStart = 8 * 60; // 8:00
        const morningEnd = 13 * 60; // 13:00
        const afternoonStart = 14 * 60 + 30; // 14:30
        const afternoonEnd = 18 * 60; // 18:00

        let isOpen = false;
        let message = '';
        let nextChange = '';

        if (!workingDays.includes(currentDay)) {
            // Weekend
            isOpen = false;
            message = 'Siamo chiusi nel weekend';
            nextChange = 'Riapriremo lunedì alle 8:00';
        } else {
            // Giorno lavorativo
            if (currentTime >= morningStart && currentTime < morningEnd) {
                // Mattina - aperti
                isOpen = true;
                message = 'Siamo aperti ora!';
                nextChange = 'Chiuderemo alle 13:00 per pausa pranzo';
            } else if (currentTime >= afternoonStart && currentTime < afternoonEnd) {
                // Pomeriggio - aperti
                isOpen = true;
                message = 'Siamo aperti ora!';
                nextChange = 'Chiuderemo alle 18:00';
            } else if (currentTime >= morningEnd && currentTime < afternoonStart) {
                // Pausa pranzo
                isOpen = false;
                message = 'Pausa pranzo';
                nextChange = 'Riapriremo alle 14:30';
            } else if (currentTime < morningStart) {
                // Prima dell'apertura
                isOpen = false;
                message = 'Ancora chiusi';
                nextChange = 'Apriremo alle 8:00';
            } else {
                // Dopo la chiusura
                isOpen = false;
                message = 'Chiusi per oggi';
                if (currentDay === 5) { // Venerdì
                    nextChange = 'Riapriremo lunedì alle 8:00';
                } else {
                    nextChange = 'Riapriremo domani alle 8:00';
                }
            }
        }

        setBusinessStatus({ isOpen, message, nextChange });
    };

    useEffect(() => {
        calculateBusinessStatus();
        // Aggiorna ogni minuto
        const interval = setInterval(calculateBusinessStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Qui puoi aggiungere la logica per inviare il form
        console.log('Form submitted:', formData);
        alert('Messaggio inviato! Ti ricontatteremo presto.');
        // Reset form
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Header Section */}
            <div className="text-center pt-16 pb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Contattaci
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto px-4">
                    Siamo pronti ad ascoltare le tue idee e trasformarle in realtà
                </p>
                <div className="flex mt-6 justify-center">
                    <div className="w-24 h-1 rounded-full bg-indigo-500"></div>
                </div>
            </div>

            {/* Main Contact Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Contact Info Cards */}
                    <div className="space-y-6">

                        {/* Telefono/WhatsApp Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center mb-4">
                                <div className="bg-green-100 p-3 rounded-full">
                                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 448 512">
                                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 ml-3">WhatsApp</h3>
                            </div>
                            <p className="text-gray-600 mb-3">Contattaci direttamente su WhatsApp per una risposta immediata</p>
                            <a
                                href="https://wa.me/393770802322"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-green-600 font-medium hover:text-green-700 transition-colors"
                            >
                                <span className="mr-2">+39 377 080 2322</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>

                        {/* Email Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center mb-4">
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 ml-3">Email</h3>
                            </div>
                            <p className="text-gray-600 mb-3">Inviaci una email dettagliata con le tue esigenze</p>
                            <a
                                href="mailto:info@idealstampa.com"
                                className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
                            >
                                <span className="mr-2">info@idealstampa.com</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        </div>

                        {/* Indirizzo Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center mb-4">
                                <div className="bg-red-100 p-3 rounded-full">
                                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 ml-3">Indirizzo</h3>
                            </div>
                            <p className="text-gray-600 mb-3">Vieni a trovarci presso la nostra sede</p>
                            <address className="text-gray-800 font-medium not-italic">
                                Via Dott. Agelo Camposeo, 23<br />
                                70010 Turi (BA)<br />
                                Puglia, Italia
                            </address>
                        </div>

                        {/* Orari Card con Status */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex items-center mb-4">
                                <div className="bg-purple-100 p-3 rounded-full">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 ml-3">Orari</h3>
                            </div>

                            {/* Status in tempo reale */}
                            <div className={`mb-4 p-3 rounded-lg flex items-center space-x-3 ${
                                businessStatus.isOpen
                                    ? 'bg-green-50 border border-green-200'
                                    : 'bg-red-50 border border-red-200'
                            }`}>
                                <div className={`w-3 h-3 rounded-full ${
                                    businessStatus.isOpen ? 'bg-green-500' : 'bg-red-500'
                                } ${businessStatus.isOpen ? 'animate-pulse' : ''}`}></div>
                                <div>
                                    <p className={`font-semibold ${
                                        businessStatus.isOpen ? 'text-green-800' : 'text-red-800'
                                    }`}>
                                        {businessStatus.message}
                                    </p>
                                    <p className={`text-sm ${
                                        businessStatus.isOpen ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {businessStatus.nextChange}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Lun - Ven</span>
                                    <span className="font-medium">8:00 - 13:00 / 14:30 - 18:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Sabato</span>
                                    <span className="font-medium text-red-600">Chiuso</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Domenica</span>
                                    <span className="font-medium text-red-600">Chiuso</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Inviaci un messaggio</h3>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Nome e Cognome *
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            placeholder="Mario Rossi"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            placeholder="mario@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                            Telefono
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                            placeholder="+39 123 456 7890"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                            Oggetto *
                                        </label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            required
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        >
                                            <option value="">Seleziona un servizio</option>
                                            <option value="preventivo">Richiesta Preventivo</option>
                                            <option value="offset">Stampa Offset</option>
                                            <option value="digitale">Stampa Digitale</option>
                                            <option value="grande-formato">Grande Formato</option>
                                            <option value="packaging">Packaging</option>
                                            <option value="altro">Altro</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Messaggio *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={6}
                                        required
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
                                        placeholder="Descrivi il tuo progetto, quantità, formato, tempistiche e qualsiasi altra informazione utile..."
                                    ></textarea>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        id="privacy"
                                        name="privacy"
                                        type="checkbox"
                                        required
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="privacy" className="ml-2 block text-sm text-gray-700">
                                        Accetto il trattamento dei dati personali secondo la{' '}
                                        <a href="#" className="text-indigo-600 hover:text-indigo-700 underline">
                                            Privacy Policy
                                        </a>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
                                >
                                    <span className="flex items-center justify-center">
                                        Invia Messaggio
                                        <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </span>
                                </button>

                                <p className="text-xs text-gray-500 text-center">
                                    Ti ricontatteremo entro 24 ore lavorative
                                </p>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="mt-16">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-indigo-600 to-blue-600">
                            <h3 className="text-2xl font-bold text-white mb-2">Dove siamo</h3>
                            <p className="text-blue-100">Vieni a trovarci presso la nostra sede a Turi</p>
                        </div>

                        <div className="relative h-96">
                            <iframe
                                src="https://maps.google.com/maps?width=100%&amp;height=400&amp;hl=it&amp;q=Tipografia%20Idealstampa,%20BA,%20Italia&amp;ie=UTF8&amp;t=&amp;z=16&amp;iwloc=B&amp;output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full h-full"
                            ></iframe>

                            {/* Overlay con indirizzo */}
                            <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                                <div className="flex items-start space-x-3">
                                    <div className="bg-red-100 p-2 rounded-full flex-shrink-0">
                                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Tipografia Idealstampa</h4>
                                        <p className="text-sm text-gray-600">Via Roma, 123 - 70010 Turi (BA)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}