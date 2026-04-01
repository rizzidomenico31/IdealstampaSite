import { useState } from 'react';

export default function PrivacyPolicy() {
    const [activeSection, setActiveSection] = useState(null);

    const sections = [
        {
            id: 'titolare',
            icon: '🏢',
            title: 'Titolare del Trattamento',
            content: (
                <>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        Il Titolare del trattamento dei dati personali è:
                    </p>
                    <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100">
                        <p className="font-semibold text-gray-900">Tipografia Idealstampa</p>
                        <p className="text-gray-600 mt-1">Via Dott. Angelo Camposeo, 23 – 70010 Turi (BA)</p>
                        <p className="text-gray-600">P.IVA: 04731500726</p>
                        <p className="text-gray-600 mt-2">
                            Email:{' '}
                            <a href="mailto:info@idealstampa.com" className="text-indigo-600 hover:underline">
                                info@idealstampa.com
                            </a>
                        </p>
                        <p className="text-gray-600">
                            WhatsApp:{' '}
                            <a href="https://wa.me/393770802322" className="text-indigo-600 hover:underline">
                                +39 377 080 2322
                            </a>
                        </p>
                    </div>
                </>
            )
        },
        {
            id: 'dati-raccolti',
            icon: '📋',
            title: 'Dati Personali Raccolti',
            content: (
                <>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        Raccogliamo i seguenti dati personali attraverso il sito web e i form di contatto:
                    </p>
                    <div className="space-y-3">
                        {[
                            { label: 'Dati anagrafici', desc: 'Nome, cognome, ragione sociale/azienda' },
                            { label: 'Dati di contatto', desc: 'Indirizzo email, numero di telefono' },
                            { label: 'Dati del progetto', desc: 'Informazioni relative alle richieste di preventivo (tipo di progetto, quantità, formato, ecc.)' },
                            { label: 'File allegati', desc: 'Documenti e immagini eventualmente caricati tramite il form preventivo' },
                            { label: 'Dati di navigazione', desc: 'Indirizzo IP, tipo di browser, pagine visitate (tramite cookie tecnici)' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start space-x-3 bg-gray-50 rounded-lg p-4">
                                <span className="text-indigo-500 font-bold mt-0.5">•</span>
                                <div>
                                    <span className="font-medium text-gray-900">{item.label}:</span>{' '}
                                    <span className="text-gray-600">{item.desc}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )
        },
        {
            id: 'finalita',
            icon: '🎯',
            title: 'Finalità e Base Giuridica del Trattamento',
            content: (
                <>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        Trattiamo i tuoi dati personali per le seguenti finalità:
                    </p>
                    <div className="space-y-4">
                        {[
                            {
                                num: '1',
                                title: 'Gestione richieste di preventivo e contatto',
                                base: 'Esecuzione di misure precontrattuali (art. 6, par. 1, lett. b GDPR)',
                                color: 'blue'
                            },
                            {
                                num: '2',
                                title: 'Adempimento di obblighi contrattuali',
                                base: 'Esecuzione del contratto (art. 6, par. 1, lett. b GDPR)',
                                color: 'green'
                            },
                            {
                                num: '3',
                                title: 'Adempimenti fiscali e contabili',
                                base: 'Obbligo legale (art. 6, par. 1, lett. c GDPR)',
                                color: 'purple'
                            },
                            {
                                num: '4',
                                title: 'Invio newsletter e comunicazioni commerciali',
                                base: 'Consenso dell\'interessato (art. 6, par. 1, lett. a GDPR) – solo se hai fornito il consenso',
                                color: 'orange'
                            },
                        ].map((item, i) => (
                            <div key={i} className="border border-gray-200 rounded-xl p-4">
                                <div className="flex items-center space-x-3 mb-2">
                                    <div className={`w-7 h-7 rounded-full bg-${item.color}-100 flex items-center justify-center flex-shrink-0`}>
                                        <span className={`text-${item.color}-700 font-bold text-sm`}>{item.num}</span>
                                    </div>
                                    <p className="font-semibold text-gray-900">{item.title}</p>
                                </div>
                                <p className="text-sm text-gray-500 ml-10">Base giuridica: {item.base}</p>
                            </div>
                        ))}
                    </div>
                </>
            )
        },
        {
            id: 'conservazione',
            icon: '🗄️',
            title: 'Conservazione dei Dati',
            content: (
                <>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        I dati personali vengono conservati per i seguenti periodi:
                    </p>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="bg-indigo-600 text-white">
                                <th className="text-left p-3 rounded-tl-lg">Tipo di dato</th>
                                <th className="text-left p-3 rounded-tr-lg">Periodo di conservazione</th>
                            </tr>
                            </thead>
                            <tbody>
                            {[
                                ['Richieste di preventivo', '3 anni dalla richiesta'],
                                ['Dati contrattuali', '10 anni dalla conclusione del contratto (obbligo legale)'],
                                ['Dati fiscali e contabili', '10 anni (obbligo di legge)'],
                                ['File allegati al preventivo', 'Eliminati entro 30 giorni dall\'invio'],
                                ['Dati newsletter', 'Fino alla revoca del consenso'],
                                ['Cookie tecnici', 'Sessione o max 12 mesi'],
                            ].map(([tipo, periodo], i) => (
                                <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                    <td className="p-3 text-gray-700 font-medium border-b border-gray-100">{tipo}</td>
                                    <td className="p-3 text-gray-600 border-b border-gray-100">{periodo}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )
        },
        {
            id: 'diritti',
            icon: '⚖️',
            title: 'I Tuoi Diritti',
            content: (
                <>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        In qualità di interessato, hai i seguenti diritti garantiti dal GDPR (artt. 15-22):
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                            { emoji: '👁️', title: 'Accesso', desc: 'Sapere quali dati trattiamo su di te' },
                            { emoji: '✏️', title: 'Rettifica', desc: 'Correggere dati inesatti o incompleti' },
                            { emoji: '🗑️', title: 'Cancellazione', desc: 'Richiedere la cancellazione dei tuoi dati' },
                            { emoji: '⏸️', title: 'Limitazione', desc: 'Limitare il trattamento in certi casi' },
                            { emoji: '📦', title: 'Portabilità', desc: 'Ricevere i tuoi dati in formato strutturato' },
                            { emoji: '🚫', title: 'Opposizione', desc: 'Opporti al trattamento per motivi legittimi' },
                            { emoji: '↩️', title: 'Revoca consenso', desc: 'Revocare il consenso in qualsiasi momento' },
                            { emoji: '📣', title: 'Reclamo', desc: 'Presentare reclamo al Garante Privacy' },
                        ].map((d, i) => (
                            <div key={i} className="flex items-start space-x-3 bg-gray-50 rounded-xl p-4 hover:bg-indigo-50 transition-colors">
                                <span className="text-xl">{d.emoji}</span>
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">{d.title}</p>
                                    <p className="text-gray-500 text-xs mt-0.5">{d.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <p className="text-sm text-amber-800">
                            Per esercitare i tuoi diritti, contattaci a{' '}
                            <a href="mailto:info@idealstampa.com" className="font-semibold hover:underline">
                                info@idealstampa.com
                            </a>{' '}
                            o via WhatsApp al{' '}
                            <a href="https://wa.me/393770802322" className="font-semibold hover:underline">
                                +39 377 080 2322
                            </a>.
                            Risponderemo entro 30 giorni.
                        </p>
                    </div>
                </>
            )
        },
        {
            id: 'condivisione',
            icon: '🤝',
            title: 'Condivisione dei Dati con Terzi',
            content: (
                <>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        I tuoi dati personali non vengono venduti a terzi. Potremmo condividerli esclusivamente con:
                    </p>
                    <div className="space-y-3">
                        {[
                            'Fornitori di servizi email (per l\'invio delle comunicazioni di preventivo)',
                            'Commercialisti e consulenti fiscali (per adempimenti contabili)',
                            'Autorità pubbliche o giudiziarie (solo se obbligati per legge)',
                        ].map((item, i) => (
                            <div key={i} className="flex items-start space-x-3">
                                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <p className="text-gray-600">{item}</p>
                            </div>
                        ))}
                    </div>
                    <p className="text-gray-600 mt-4 text-sm">
                        Tutti i soggetti terzi con cui condividiamo i dati sono nominati Responsabili del Trattamento
                        ai sensi dell'art. 28 GDPR e operano nel rispetto della normativa vigente.
                    </p>
                </>
            )
        },
        {
            id: 'cookie',
            icon: '🍪',
            title: 'Cookie',
            content: (
                <>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        Il nostro sito utilizza esclusivamente cookie tecnici necessari al funzionamento del sito.
                        Non utilizziamo cookie di profilazione o di tracciamento di terze parti.
                    </p>
                    <p className="text-gray-600">
                        Per maggiori informazioni consulta la nostra{' '}
                        <a href="/cookies" className="text-indigo-600 font-medium hover:underline">Cookie Policy</a>.
                    </p>
                </>
            )
        },
        {
            id: 'aggiornamenti',
            icon: '🔄',
            title: 'Aggiornamenti alla Privacy Policy',
            content: (
                <p className="text-gray-600 leading-relaxed">
                    Ci riserviamo il diritto di modificare questa Privacy Policy in qualsiasi momento per adeguarla a
                    cambiamenti normativi o operativi. Le modifiche saranno pubblicate su questa pagina con indicazione
                    della data di aggiornamento. Ti invitiamo a consultare periodicamente questa pagina.
                </p>
            )
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
                        <span className="text-3xl">🔒</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
                    <p className="text-blue-100 text-lg">
                        Informativa sul trattamento dei dati personali ai sensi del Regolamento UE 2016/679 (GDPR)
                    </p>
                    <p className="text-blue-200 text-sm mt-3">Ultimo aggiornamento: Gennaio 2025</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Intro box */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-l-4 border-indigo-500">
                    <p className="text-gray-600 leading-relaxed">
                        La presente informativa descrive le modalità con cui <strong>Tipografia Idealstampa</strong> raccoglie,
                        utilizza e protegge i dati personali degli utenti che visitano il sito web{' '}
                        <strong>www.idealstampa.com</strong> e utilizzano i nostri servizi. Il trattamento avviene nel
                        rispetto del Regolamento Europeo 2016/679 (GDPR) e del D.Lgs. 196/2003 (Codice Privacy).
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-4">
                    {sections.map((section) => (
                        <div
                            key={section.id}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden"
                        >
                            <button
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                                onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <span className="text-xl">{section.icon}</span>
                                    </div>
                                    <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                                </div>
                                <svg
                                    className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ml-4 ${
                                        activeSection === section.id ? 'rotate-180' : ''
                                    }`}
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {activeSection === section.id && (
                                <div className="px-6 pb-6 border-t border-gray-100">
                                    <div className="pt-5">{section.content}</div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer note */}
                <div className="mt-8 bg-indigo-600 text-white rounded-2xl p-6 text-center">
                    <p className="font-semibold text-lg mb-2">Hai domande sulla tua privacy?</p>
                    <p className="text-blue-100 mb-4 text-sm">
                        Contattaci senza esitare per qualsiasi chiarimento relativo al trattamento dei tuoi dati.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <a
                            href="mailto:info@idealstampa.com"
                            className="bg-white text-indigo-600 px-6 py-2.5 rounded-full font-medium hover:shadow-lg transition-all"
                        >
                            info@idealstampa.com
                        </a>
                        <a
                            href="https://wa.me/393770802322"
                            target="_blank" rel="noopener noreferrer"
                            className="border border-white text-white px-6 py-2.5 rounded-full font-medium hover:bg-white/10 transition-all"
                        >
                            WhatsApp +39 377 080 2322
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}