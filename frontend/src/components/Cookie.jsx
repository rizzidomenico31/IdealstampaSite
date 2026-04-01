import { useState } from 'react';

export default function CookiePolicy() {
    const [activeSection, setActiveSection] = useState(null);

    const cookieTypes = [
        {
            type: 'Tecnici / Sessione',
            purpose: 'Necessari al funzionamento del sito (navigazione, autenticazione temporanea)',
            duration: 'Sessione (eliminati alla chiusura del browser)',
            thirdParty: 'No',
            consent: false,
            badge: 'Necessari',
            badgeColor: 'green',
        },
        {
            type: 'Tecnici / Persistenti',
            purpose: 'Memorizzano preferenze dell\'utente (es. lingua, accettazione cookie)',
            duration: 'Max 12 mesi',
            thirdParty: 'No',
            consent: false,
            badge: 'Necessari',
            badgeColor: 'green',
        },
        {
            type: 'Analitici (se attivati)',
            purpose: 'Analisi statistica anonima delle visite per migliorare il sito',
            duration: '12-24 mesi',
            thirdParty: 'Possibile (es. Google Analytics con IP anonimizzato)',
            consent: true,
            badge: 'Consenso richiesto',
            badgeColor: 'amber',
        },
        {
            type: 'Marketing (se attivati)',
            purpose: 'Pubblicità personalizzata e remarketing',
            duration: 'Variable',
            thirdParty: 'Sì',
            consent: true,
            badge: 'Consenso richiesto',
            badgeColor: 'red',
        },
    ];

    const sections = [
        {
            id: 'cosa-sono',
            icon: '❓',
            title: 'Cosa Sono i Cookie',
            content: (
                <>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        I cookie sono piccoli file di testo che i siti web salvano sul tuo dispositivo (computer, smartphone,
                        tablet) quando li visiti. Vengono utilizzati per far funzionare i siti in modo efficiente e per
                        fornire informazioni ai proprietari del sito.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { emoji: '💾', title: 'Cosa sono', desc: 'Piccoli file di testo salvati sul tuo dispositivo' },
                            { emoji: '⏱️', title: 'Durata', desc: 'Possono essere di sessione (temporanei) o persistenti' },
                            { emoji: '🎛️', title: 'Controllo', desc: 'Puoi gestirli o eliminarli dalle impostazioni del browser' },
                        ].map((item, i) => (
                            <div key={i} className="bg-gray-50 rounded-xl p-4 text-center">
                                <div className="text-3xl mb-2">{item.emoji}</div>
                                <p className="font-semibold text-gray-900 text-sm mb-1">{item.title}</p>
                                <p className="text-gray-500 text-xs">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </>
            )
        },
        {
            id: 'tipi',
            icon: '📂',
            title: 'Tipologie di Cookie Utilizzati',
            content: (
                <>
                    <p className="text-gray-600 leading-relaxed mb-5">
                        Di seguito la tabella completa dei cookie utilizzati su <strong>www.idealstampa.com</strong>:
                    </p>
                    <div className="space-y-4">
                        {cookieTypes.map((cookie, i) => (
                            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                                <div className="flex items-center justify-between bg-gray-50 px-4 py-3">
                                    <p className="font-semibold text-gray-900">{cookie.type}</p>
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full bg-${cookie.badgeColor}-100 text-${cookie.badgeColor}-800`}>
                                        {cookie.badge}
                                    </span>
                                </div>
                                <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                                    <div>
                                        <p className="text-gray-400 font-medium uppercase text-xs mb-1">Finalità</p>
                                        <p className="text-gray-600">{cookie.purpose}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 font-medium uppercase text-xs mb-1">Durata</p>
                                        <p className="text-gray-600">{cookie.duration}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 font-medium uppercase text-xs mb-1">Terze parti</p>
                                        <p className="text-gray-600">{cookie.thirdParty}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                            <span className="text-green-500 text-xl">✅</span>
                            <p className="text-green-800 text-sm">
                                <strong>Attualmente il sito utilizza esclusivamente cookie tecnici necessari.</strong>{' '}
                                Non vengono installati cookie di profilazione o marketing senza il tuo esplicito consenso.
                            </p>
                        </div>
                    </div>
                </>
            )
        },
        {
            id: 'gestione',
            icon: '⚙️',
            title: 'Come Gestire i Cookie',
            content: (
                <>
                    <p className="text-gray-600 leading-relaxed mb-5">
                        Puoi gestire, limitare o eliminare i cookie direttamente dalle impostazioni del tuo browser.
                        Tieni presente che disabilitare i cookie tecnici potrebbe compromettere il funzionamento del sito.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                            { browser: 'Google Chrome', icon: '🌐', url: 'https://support.google.com/chrome/answer/95647' },
                            { browser: 'Mozilla Firefox', icon: '🦊', url: 'https://support.mozilla.org/kb/enable-and-disable-cookies-website-preferences' },
                            { browser: 'Apple Safari', icon: '🧭', url: 'https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac' },
                            { browser: 'Microsoft Edge', icon: '🔷', url: 'https://support.microsoft.com/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09' },
                            { browser: 'Opera', icon: '🎭', url: 'https://help.opera.com/en/latest/web-preferences/#cookies' },
                            { browser: 'Safari iOS', icon: '📱', url: 'https://support.apple.com/HT201265' },
                        ].map((b, i) => (
                            <a
                                key={i}
                                href={b.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-3 bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 rounded-xl p-4 transition-all group"
                            >
                                <span className="text-2xl">{b.icon}</span>
                                <span className="font-medium text-gray-800 group-hover:text-indigo-700 text-sm">{b.browser}</span>
                                <svg className="w-4 h-4 text-gray-400 ml-auto group-hover:text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>
                        ))}
                    </div>
                </>
            )
        },
        {
            id: 'terze-parti',
            icon: '🌍',
            title: 'Cookie di Terze Parti',
            content: (
                <>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        Il sito potrebbe includere contenuti o servizi di terze parti che installano i propri cookie.
                        Tra questi possono figurare:
                    </p>
                    <div className="space-y-3">
                        {[
                            {
                                name: 'Google Maps',
                                desc: 'Utilizzato nella pagina Contatti per visualizzare la mappa della nostra sede.',
                                policy: 'https://policies.google.com/privacy'
                            },
                            {
                                name: 'WhatsApp (link esterni)',
                                desc: 'I link a WhatsApp non installano cookie, reindirizzano semplicemente all\'app.',
                                policy: 'https://www.whatsapp.com/legal/privacy-policy'
                            },
                        ].map((tp, i) => (
                            <div key={i} className="flex items-start justify-between bg-gray-50 rounded-xl p-4">
                                <div className="flex-1 mr-4">
                                    <p className="font-semibold text-gray-900 text-sm">{tp.name}</p>
                                    <p className="text-gray-500 text-xs mt-1">{tp.desc}</p>
                                </div>
                                <a
                                    href={tp.policy}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:text-indigo-700 text-xs font-medium flex-shrink-0 hover:underline"
                                >
                                    Privacy Policy →
                                </a>
                            </div>
                        ))}
                    </div>
                </>
            )
        },
        {
            id: 'aggiornamenti',
            icon: '🔄',
            title: 'Aggiornamenti della Cookie Policy',
            content: (
                <p className="text-gray-600 leading-relaxed">
                    Ci riserviamo il diritto di modificare questa Cookie Policy in qualsiasi momento per riflettere
                    eventuali cambiamenti tecnologici, normativi o operativi. Le modifiche saranno pubblicate su questa
                    pagina con la data di aggiornamento. Per le modifiche sostanziali, potremmo avvisarti tramite
                    banner sul sito.
                </p>
            )
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
                        <span className="text-3xl">🍪</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
                    <p className="text-cyan-100 text-lg">
                        Informativa sull'uso dei cookie ai sensi del D.Lgs. 196/2003 e del Regolamento UE 2016/679
                    </p>
                    <p className="text-cyan-200 text-sm mt-3">Ultimo aggiornamento: Gennaio 2025</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Quick summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {[
                        { emoji: '✅', label: 'Cookie tecnici', sub: 'Sempre attivi', color: 'green' },
                        { emoji: '🔔', label: 'Cookie analitici', sub: 'Solo con consenso', color: 'amber' },
                        { emoji: '🚫', label: 'Cookie marketing', sub: 'Non utilizzati', color: 'red' },
                    ].map((item, i) => (
                        <div key={i} className={`bg-white rounded-2xl shadow p-5 text-center border-t-4 border-${item.color}-400`}>
                            <div className="text-3xl mb-2">{item.emoji}</div>
                            <p className="font-semibold text-gray-900">{item.label}</p>
                            <p className={`text-${item.color}-600 text-sm font-medium mt-1`}>{item.sub}</p>
                        </div>
                    ))}
                </div>

                {/* Sections */}
                <div className="space-y-4">
                    {sections.map((section) => (
                        <div key={section.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            <button
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                                onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
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

                {/* Contact */}
                <div className="mt-8 bg-teal-600 text-white rounded-2xl p-6 text-center">
                    <p className="font-semibold text-lg mb-2">Domande sui cookie?</p>
                    <p className="text-teal-100 text-sm mb-4">
                        Per qualsiasi chiarimento relativo all'utilizzo dei cookie sul nostro sito, contattaci.
                    </p>
                    <a
                        href="mailto:info@idealstampa.com"
                        className="inline-block bg-white text-teal-600 px-6 py-2.5 rounded-full font-medium hover:shadow-lg transition-all"
                    >
                        info@idealstampa.com
                    </a>
                </div>

                {/* Links to other policies */}
                <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
                    <a href="/privacy" className="text-indigo-600 hover:underline font-medium">← Privacy Policy</a>
                    <span className="text-gray-300">|</span>
                    <a href="/termini" className="text-indigo-600 hover:underline font-medium">Termini e Condizioni →</a>
                </div>
            </div>
        </div>
    );
}