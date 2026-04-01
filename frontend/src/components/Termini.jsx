import { useState } from 'react';

export default function TerminiCondizioni() {
    const [activeSection, setActiveSection] = useState(null);

    const sections = [
        {
            id: 'oggetto',
            icon: '📄',
            title: 'Oggetto e Accettazione',
            content: (
                <>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        I presenti Termini e Condizioni Generali di Servizio (di seguito "Termini") regolano il rapporto
                        contrattuale tra <strong>Tipografia Idealstampa</strong> (di seguito "Idealstampa" o "noi") e
                        il Cliente (di seguito "Cliente" o "voi") per tutti i servizi di stampa e produzione grafica
                        offerti.
                    </p>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        L'accettazione del preventivo, l'invio di un ordine o l'utilizzo dei servizi di Idealstampa
                        implica l'integrale accettazione dei presenti Termini.
                    </p>
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <p className="text-blue-800 text-sm">
                            <strong>Nota:</strong> Condizioni specifiche possono essere concordate per iscritto caso per
                            caso. In caso di contrasto, le condizioni particolari concordate prevalgono sui presenti Termini generali.
                        </p>
                    </div>
                </>
            )
        },
        {
            id: 'preventivi',
            icon: '💬',
            title: 'Preventivi e Ordini',
            content: (
                <>
                    <div className="space-y-4">
                        {[
                            {
                                title: 'Validità del preventivo',
                                desc: 'I preventivi emessi da Idealstampa hanno validità di 30 giorni dalla data di emissione, salvo diversa indicazione scritta. Scaduto tale termine, Idealstampa si riserva il diritto di rivedere prezzi e condizioni.'
                            },
                            {
                                title: 'Conferma d\'ordine',
                                desc: 'L\'ordine si intende confermato solo dopo l\'accettazione scritta da parte di Idealstampa (via email o WhatsApp) e, ove richiesto, il versamento dell\'acconto concordato.'
                            },
                            {
                                title: 'Variazioni dopo la conferma',
                                desc: 'Variazioni apportate dal Cliente dopo la conferma dell\'ordine potrebbero comportare modifiche ai tempi di consegna e ai prezzi. Idealstampa comunicherà eventuali variazioni prima di procedere.'
                            },
                            {
                                title: 'Minimi d\'ordine',
                                desc: 'Per alcune tipologie di prodotto, possono essere applicati quantitativi minimi d\'ordine, indicati nel preventivo o comunicati al momento della richiesta.'
                            },
                        ].map((item, i) => (
                            <div key={i} className="border-l-4 border-indigo-300 pl-4 py-1">
                                <p className="font-semibold text-gray-900 mb-1">{item.title}</p>
                                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </>
            )
        },
        {
            id: 'file-grafici',
            icon: '🎨',
            title: 'Fornitura File Grafici',
            content: (
                <>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        Il Cliente è responsabile della correttezza e qualità dei file grafici forniti. Idealstampa
                        non risponde per errori derivanti da file non conformi alle specifiche indicate.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="font-semibold text-gray-900 text-sm mb-3 flex items-center">
                                <span className="text-green-500 mr-2">✅</span> Formati accettati
                            </p>
                            <ul className="space-y-1 text-sm text-gray-600">
                                {['PDF ad alta risoluzione (preferito)', 'AI, EPS, INDD', 'TIFF, PSD (300 DPI min.)', 'JPG/PNG ad alta risoluzione'].map((f, i) => (
                                    <li key={i} className="flex items-center space-x-2">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0"></span>
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4">
                            <p className="font-semibold text-gray-900 text-sm mb-3 flex items-center">
                                <span className="text-blue-500 mr-2">ℹ️</span> Requisiti tecnici
                            </p>
                            <ul className="space-y-1 text-sm text-gray-600">
                                {['Colori in modalità CMYK', 'Risoluzione minima 300 DPI', 'Abbondanze (bleed) di 3mm', 'Font incorporati nel file', 'Profilo colore ICC corretto'].map((r, i) => (
                                    <li key={i} className="flex items-center space-x-2">
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></span>
                                        <span>{r}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <p className="text-amber-800 text-sm">
                            <strong>⚠️ Importante:</strong> Idealstampa esegue un controllo preflight di base sui file ricevuti.
                            In caso di anomalie rilevate, il Cliente verrà contattato prima dell'avvio della produzione.
                            Modifiche ai file dopo l'approvazione della prova di stampa comporteranno costi aggiuntivi.
                        </p>
                    </div>
                </>
            )
        },
        {
            id: 'prezzi-pagamenti',
            icon: '💰',
            title: 'Prezzi e Condizioni di Pagamento',
            content: (
                <>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Prezzi</h4>
                            <p className="text-gray-600 text-sm leading-relaxed mb-3">
                                Tutti i prezzi indicati nei preventivi si intendono IVA esclusa (salvo diversa indicazione).
                                I prezzi possono variare in funzione delle materie prime, pertanto i preventivi emessi hanno
                                validità limitata come indicato nella sezione "Preventivi e Ordini".
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Modalità di Pagamento</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {[
                                    { emoji: '🏦', method: 'Bonifico Bancario' },
                                    { emoji: '💳', method: 'Carta di Credito' },
                                    { emoji: '💵', method: 'Contanti (in sede)' },
                                    { emoji: '📲', method: 'PayPal / Satispay' },
                                ].map((p, i) => (
                                    <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
                                        <div className="text-2xl mb-1">{p.emoji}</div>
                                        <p className="text-xs font-medium text-gray-700">{p.method}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Termini di Pagamento Standard</h4>
                            <div className="space-y-2">
                                {[
                                    { condition: 'Clienti nuovi / primo ordine', terms: '50% all\'ordine, saldo alla consegna' },
                                    { condition: 'Clienti abituali', terms: 'Condizioni concordate caso per caso' },
                                    { condition: 'Ordini superiori a €2.000', terms: '50% all\'ordine, 50% prima della consegna' },
                                    { condition: 'Ritiro in sede', terms: 'Pagamento all\'atto del ritiro' },
                                ].map((t, i) => (
                                    <div key={i} className="flex items-start justify-between bg-gray-50 rounded-lg px-4 py-3 text-sm">
                                        <span className="text-gray-700 font-medium">{t.condition}</span>
                                        <span className="text-gray-500 ml-4 text-right">{t.terms}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <p className="text-red-800 text-sm">
                                <strong>⚠️ Ritardi di pagamento:</strong> In caso di mancato pagamento nei termini concordati,
                                si applicheranno gli interessi moratori previsti dal D.Lgs. 231/2002. Idealstampa si riserva
                                il diritto di sospendere la fornitura di servizi in caso di insoluti.
                            </p>
                        </div>
                    </div>
                </>
            )
        },
        {
            id: 'consegne',
            icon: '🚚',
            title: 'Tempi e Modalità di Consegna',
            content: (
                <>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        I tempi di consegna indicati nel preventivo decorrono dalla data di approvazione della prova di stampa
                        e/o dalla conferma del pagamento dell'acconto (se previsto).
                    </p>
                    <div className="space-y-3 mb-4">
                        {[
                            {
                                type: 'Stampa digitale (piccole tirature)',
                                time: '3–5 giorni lavorativi',
                                note: 'Salvo urgenze concordate'
                            },
                            {
                                type: 'Stampa offset (grandi tirature)',
                                time: '7–15 giorni lavorativi',
                                note: 'Varia in base alla complessità'
                            },
                            {
                                type: 'Grande formato',
                                time: '5–10 giorni lavorativi',
                                note: 'Inclusa installazione se richiesta'
                            },
                            {
                                type: 'Urgente',
                                time: '1–3 giorni lavorativi',
                                note: 'Sovrapprezzo del 20%'
                            },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">{item.type}</p>
                                    <p className="text-gray-400 text-xs">{item.note}</p>
                                </div>
                                <span className="text-indigo-700 font-semibold text-sm bg-indigo-100 px-3 py-1 rounded-full">
                                    {item.time}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                        <p className="text-indigo-800 text-sm">
                            <strong>Forza maggiore:</strong> Idealstampa non è responsabile per ritardi causati da eventi
                            eccezionali e imprevedibili (guasti macchinari, scioperi, calamità naturali, ecc.). In tali
                            casi, il Cliente sarà tempestivamente informato.
                        </p>
                    </div>
                </>
            )
        },
        {
            id: 'proprieta-intellettuale',
            icon: '©️',
            title: 'Proprietà Intellettuale',
            content: (
                <>
                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-xl p-5">
                            <h4 className="font-semibold text-gray-900 mb-2">Materiali forniti dal Cliente</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Il Cliente garantisce di essere titolare o di aver ottenuto le necessarie licenze per tutti
                                i materiali (immagini, testi, loghi, marchi) forniti ad Idealstampa per la produzione.
                                Il Cliente si assume piena responsabilità per eventuali violazioni di diritti di terzi.
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-5">
                            <h4 className="font-semibold text-gray-900 mb-2">Materiali creati da Idealstampa</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Ove Idealstampa partecipi alla progettazione grafica, i diritti d'autore sul layout creato
                                rimangono di proprietà di Idealstampa fino al pagamento integrale del corrispettivo concordato.
                                Dopo il saldo, i diritti di utilizzo vengono trasferiti al Cliente secondo quanto concordato.
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-5">
                            <h4 className="font-semibold text-gray-900 mb-2">Portfolio e campionario</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Idealstampa si riserva il diritto di pubblicare i lavori realizzati nel proprio portfolio
                                e materiale promozionale, salvo espressa richiesta contraria da parte del Cliente comunicata
                                per iscritto al momento dell'ordine.
                            </p>
                        </div>
                    </div>
                </>
            )
        },
        {
            id: 'garanzie-reclami',
            icon: '🛡️',
            title: 'Garanzie e Gestione dei Reclami',
            content: (
                <>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        Idealstampa garantisce che i prodotti consegnati siano conformi a quanto indicato nel preventivo
                        approvato e agli standard qualitativi del settore tipografico.
                    </p>
                    <div className="space-y-3 mb-4">
                        <div className="border border-gray-200 rounded-xl p-4">
                            <h4 className="font-semibold text-gray-900 text-sm mb-2">Come presentare un reclamo</h4>
                            <ol className="space-y-2 text-sm text-gray-600 list-decimal list-inside">
                                <li>Contattarci entro <strong>8 giorni dalla consegna</strong> per segnalare difetti evidenti</li>
                                <li>Inviare fotografie chiare del difetto via email o WhatsApp</li>
                                <li>Non utilizzare o distribuire il materiale difettoso prima della nostra valutazione</li>
                                <li>Attendere la nostra risposta entro 5 giorni lavorativi</li>
                            </ol>
                        </div>
                        <div className="border border-gray-200 rounded-xl p-4">
                            <h4 className="font-semibold text-gray-900 text-sm mb-2">Esclusioni di garanzia</h4>
                            <ul className="space-y-1 text-sm text-gray-600">
                                {[
                                    'Difetti dovuti a file grafici non conformi alle specifiche forniti dal Cliente',
                                    'Variazioni di colore entro le tolleranze standard del settore (±10% CMYK)',
                                    'Difetti segnalati oltre i termini indicati',
                                    'Prodotti modificati, danneggiati o conservati impropriamente dal Cliente',
                                ].map((e, i) => (
                                    <li key={i} className="flex items-start space-x-2">
                                        <span className="text-red-400 flex-shrink-0">✗</span>
                                        <span>{e}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <p className="text-green-800 text-sm">
                            <strong>✅ In caso di difetto confermato</strong>, Idealstampa provvederà a propria discrezione
                            a ristampare il materiale difettoso o a emettere una nota di credito, senza ulteriori costi per il Cliente.
                        </p>
                    </div>
                </>
            )
        },
        {
            id: 'limitazione-responsabilita',
            icon: '⚠️',
            title: 'Limitazione di Responsabilità',
            content: (
                <>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        La responsabilità di Idealstampa per eventuali danni derivanti dall'esecuzione dei servizi
                        è limitata al valore dell'ordine oggetto di contestazione.
                    </p>
                    <p className="text-gray-600 leading-relaxed mb-4">
                        In nessun caso Idealstampa potrà essere ritenuta responsabile per:
                    </p>
                    <div className="space-y-2">
                        {[
                            'Danni indiretti, perdita di profitto o danni consequenziali',
                            'Danni causati da forza maggiore o eventi eccezionali imprevedibili',
                            'Errori nei contenuti forniti dal Cliente (testi, immagini, dati)',
                            'Violazioni di diritti di terzi per materiali forniti dal Cliente',
                            'Danni causati da utilizzo improprio dei prodotti finiti',
                        ].map((item, i) => (
                            <div key={i} className="flex items-start space-x-3 bg-gray-50 rounded-lg px-4 py-3">
                                <span className="text-amber-500 flex-shrink-0 mt-0.5">⚠️</span>
                                <p className="text-gray-600 text-sm">{item}</p>
                            </div>
                        ))}
                    </div>
                </>
            )
        },
        {
            id: 'legge-applicabile',
            icon: '⚖️',
            title: 'Legge Applicabile e Foro Competente',
            content: (
                <>
                    <div className="space-y-4">
                        <div className="bg-gray-50 rounded-xl p-5">
                            <h4 className="font-semibold text-gray-900 mb-2">Legge applicabile</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                I presenti Termini e Condizioni sono regolati e interpretati in conformità alla
                                legge italiana. Per tutto quanto non previsto, si applicano le disposizioni del
                                Codice Civile italiano.
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-5">
                            <h4 className="font-semibold text-gray-900 mb-2">Risoluzione amichevole</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                In caso di controversia, le parti si impegnano a ricercare una soluzione amichevole
                                prima di ricorrere all'autorità giudiziaria. A tal fine, il Cliente è invitato a
                                contattare Idealstampa per iscritto descrivendo il problema.
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-5">
                            <h4 className="font-semibold text-gray-900 mb-2">Foro competente</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Per qualsiasi controversia non risolta amichevolmente, è competente in via esclusiva
                                il <strong>Foro di Bari</strong>, salvo che il Cliente sia un consumatore (D.Lgs. 206/2005),
                                nel qual caso sarà competente il foro del luogo di residenza del consumatore.
                            </p>
                        </div>
                    </div>
                </>
            )
        },
        {
            id: 'modifiche',
            icon: '🔄',
            title: 'Modifiche ai Termini e Condizioni',
            content: (
                <p className="text-gray-600 leading-relaxed">
                    Idealstampa si riserva il diritto di modificare in qualsiasi momento i presenti Termini e Condizioni.
                    Le modifiche saranno comunicate tramite pubblicazione sul sito con indicazione della data di aggiornamento.
                    Per gli ordini già confermati prima delle modifiche, continuano ad applicarsi i Termini vigenti al
                    momento della conferma dell'ordine.
                </p>
            )
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
                        <span className="text-3xl">📜</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Termini e Condizioni</h1>
                    <p className="text-gray-300 text-lg">
                        Condizioni generali di servizio di Tipografia Idealstampa
                    </p>
                    <p className="text-gray-400 text-sm mt-3">Ultimo aggiornamento: Gennaio 2025</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Intro */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-l-4 border-gray-700">
                    <p className="text-gray-600 leading-relaxed">
                        I presenti Termini e Condizioni si applicano a tutti i servizi forniti da{' '}
                        <strong>Tipografia Idealstampa</strong>, con sede in Via Dott. Angelo Camposeo, 23 – 70010 Turi (BA),
                        P.IVA 04731500726. Per qualsiasi chiarimento, siamo disponibili a{' '}
                        <a href="mailto:info@idealstampa.com" className="text-indigo-600 hover:underline">
                            info@idealstampa.com
                        </a>.
                    </p>
                </div>

                {/* Quick nav pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {sections.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => setActiveSection(activeSection === s.id ? null : s.id)}
                            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                activeSection === s.id
                                    ? 'bg-gray-800 text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                        >
                            <span>{s.icon}</span>
                            <span className="hidden sm:inline">{s.title.split(' ').slice(0, 2).join(' ')}</span>
                        </button>
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
                                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
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
                <div className="mt-8 bg-gray-800 text-white rounded-2xl p-6 text-center">
                    <p className="font-semibold text-lg mb-2">Hai domande sui nostri Termini?</p>
                    <p className="text-gray-400 text-sm mb-4">
                        Contattaci per qualsiasi chiarimento contrattuale o commerciale.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <a
                            href="mailto:info@idealstampa.com"
                            className="bg-white text-gray-800 px-6 py-2.5 rounded-full font-medium hover:shadow-lg transition-all text-sm"
                        >
                            info@idealstampa.com
                        </a>
                        <a
                            href="https://wa.me/393770802322"
                            target="_blank" rel="noopener noreferrer"
                            className="border border-gray-500 text-gray-300 px-6 py-2.5 rounded-full font-medium hover:bg-gray-700 transition-all text-sm"
                        >
                            WhatsApp +39 377 080 2322
                        </a>
                    </div>
                </div>

                {/* Policy links */}
                <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
                    <a href="/privacy" className="text-indigo-600 hover:underline font-medium">← Privacy Policy</a>
                    <span className="text-gray-300">|</span>
                    <a href="/cookies" className="text-indigo-600 hover:underline font-medium">Cookie Policy →</a>
                </div>
            </div>
        </div>
    );
}