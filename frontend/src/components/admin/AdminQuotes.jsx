import { useEffect, useState, useCallback } from 'react';
import { quotesApi } from '../../services/api';
import Modal from './Modal';
import { STATUS, STATUS_KEYS, formatDate } from './quoteStatus';

function StatusBadge({ status }) {
    const s = STATUS[status] || STATUS.pending;
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${s.cls}`}>
            {s.label}
        </span>
    );
}

function currency(n) {
    if (n === null || n === undefined || Number.isNaN(n)) return '—';
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n);
}

export default function AdminQuotes() {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [search, setSearch] = useState('');

    const [detailTarget, setDetailTarget] = useState(null);
    const [pricingTarget, setPricingTarget] = useState(null);
    const [analyzeTarget, setAnalyzeTarget] = useState(null);
    const [respondTarget, setRespondTarget] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await quotesApi.list({ status: statusFilter, search });
            setQuotes(res.quotes);
        } catch (err) {
            setError(err.message || 'Errore caricamento preventivi');
        } finally {
            setLoading(false);
        }
    }, [statusFilter, search]);

    useEffect(() => {
        const t = setTimeout(load, 250);
        return () => clearTimeout(t);
    }, [load]);

    const updateQuoteInList = (updated) => {
        setQuotes(prev => prev.map(q => q.id === updated.id ? updated : q));
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Preventivi</h1>
                    <p className="text-slate-500 text-sm mt-1">Visualizza, rispondi, stima prezzi e gestisci tutte le richieste.</p>
                </div>
                <div className="relative">
                    <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cerca nome, email, azienda..."
                        className="pl-9 pr-3 py-2 w-full sm:w-72 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-sm"
                    />
                </div>
            </div>

            {/* Filtri stato */}
            <div className="flex flex-wrap gap-2">
                <FilterChip active={statusFilter === ''} onClick={() => setStatusFilter('')}>Tutti</FilterChip>
                {STATUS_KEYS.map(k => (
                    <FilterChip key={k} active={statusFilter === k} onClick={() => setStatusFilter(k)}>
                        {STATUS[k].label}
                    </FilterChip>
                ))}
            </div>

            {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <Th>Cliente</Th>
                                <Th>Quantità</Th>
                                <Th>Prezzo AI</Th>
                                <Th>Prezzo finale</Th>
                                <Th>Stato</Th>
                                <Th>Ricevuto</Th>
                                <Th className="text-right">Azioni</Th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={7} className="text-center py-12 text-slate-500">Caricamento...</td></tr>
                            ) : quotes.length === 0 ? (
                                <tr><td colSpan={7} className="text-center py-12 text-slate-500">Nessun preventivo trovato</td></tr>
                            ) : quotes.map(q => (
                                <tr key={q.id} className="hover:bg-slate-50">
                                    <Td>
                                        <div className="font-medium text-slate-900">{q.nome} {q.cognome}</div>
                                        <div className="text-xs text-slate-500">{q.email}</div>
                                        {q.azienda && <div className="text-xs text-slate-400">{q.azienda}</div>}
                                    </Td>
                                    <Td className="text-sm text-slate-700">{q.quantita?.toLocaleString('it-IT')} pz</Td>
                                    <Td>
                                        {q.aiAnalysis?.status === 'completed' ? (
                                            <span className="text-sm text-slate-700">
                                                {currency(q.aiAnalysis.estimatedMarketPriceMin)} – {currency(q.aiAnalysis.estimatedMarketPriceMax)}
                                            </span>
                                        ) : q.aiAnalysis?.status === 'pending' ? (
                                            <span className="text-xs text-amber-600">in analisi...</span>
                                        ) : (
                                            <button onClick={() => setAnalyzeTarget(q)} className="text-xs text-teal-600 hover:text-teal-700 font-medium">
                                                Stima AI
                                            </button>
                                        )}
                                    </Td>
                                    <Td>
                                        {q.pricing?.finalTotal ? (
                                            <span className="text-sm font-medium text-slate-800">{currency(q.pricing.finalTotal)}</span>
                                        ) : (
                                            <button onClick={() => setPricingTarget(q)} className="text-xs text-slate-500 hover:text-slate-700 font-medium">
                                                Aggiungi prezzo
                                            </button>
                                        )}
                                    </Td>
                                    <Td><StatusBadge status={q.status} /></Td>
                                    <Td className="text-sm text-slate-600 whitespace-nowrap">{formatDate(q.createdAt)}</Td>
                                    <Td className="text-right whitespace-nowrap">
                                        <button onClick={() => setDetailTarget(q)} className="text-sm text-slate-600 hover:text-slate-800 font-medium px-2">Dettagli</button>
                                        <button onClick={() => setRespondTarget(q)} className="text-sm text-teal-600 hover:text-teal-700 font-medium px-2">Rispondi</button>
                                        <button onClick={() => setDeleteTarget(q)} className="text-sm text-red-600 hover:text-red-700 font-medium px-2">Elimina</button>
                                    </Td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <DetailModal
                quote={detailTarget}
                onClose={() => setDetailTarget(null)}
                onChanged={(updated) => { setDetailTarget(null); if (updated) updateQuoteInList(updated); else load(); }}
                onRespond={(q) => { setDetailTarget(null); setRespondTarget(q); }}
                onPricing={(q) => { setDetailTarget(null); setPricingTarget(q); }}
                onAnalyze={(q) => { setDetailTarget(null); setAnalyzeTarget(q); }}
            />
            <PricingModal
                quote={pricingTarget}
                onClose={() => setPricingTarget(null)}
                onSaved={(updated) => { setPricingTarget(null); updateQuoteInList(updated); }}
            />
            <AnalyzeModal
                quote={analyzeTarget}
                onClose={() => setAnalyzeTarget(null)}
                onSaved={(updated) => { setAnalyzeTarget(null); updateQuoteInList(updated); }}
            />
            <RespondModal
                quote={respondTarget}
                onClose={() => setRespondTarget(null)}
                onSent={() => { setRespondTarget(null); load(); }}
            />
            <DeleteModal
                quote={deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onDeleted={() => { setDeleteTarget(null); load(); }}
            />
        </div>
    );
}

const Th = ({ children, className = '' }) => (
    <th className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider ${className}`}>{children}</th>
);
const Td = ({ children, className = '' }) => (
    <td className={`px-4 py-3 align-top ${className}`}>{children}</td>
);

function FilterChip({ active, onClick, children }) {
    return (
        <button
            onClick={onClick}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition ${
                active
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
        >
            {children}
        </button>
    );
}

// ───────────────────────────── Dettaglio + cambio stato
function DetailModal({ quote, onClose, onChanged, onRespond, onPricing, onAnalyze }) {
    const [status, setStatus] = useState('pending');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => { if (quote) { setStatus(quote.status); setError(''); } }, [quote]);

    if (!quote) return null;

    const saveStatus = async () => {
        if (status === quote.status) return;
        setSaving(true);
        setError('');
        try {
            const res = await quotesApi.updateStatus(quote.id, status);
            onChanged(res.quote);
        } catch (err) {
            setError(err.message || 'Errore aggiornamento stato');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal open={Boolean(quote)} onClose={onClose} title="Dettaglio preventivo" size="xl">
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <StatusBadge status={quote.status} />
                    <span className="text-xs text-slate-400">Ricevuto il {formatDate(quote.createdAt)}</span>
                </div>

                <Section title="Cliente">
                    <Info label="Nome" value={`${quote.nome} ${quote.cognome}`} />
                    <Info label="Email" value={<a className="text-teal-600 hover:underline" href={`mailto:${quote.email}`}>{quote.email}</a>} />
                    <Info label="Telefono" value={<a className="text-teal-600 hover:underline" href={`tel:${quote.telefono}`}>{quote.telefono}</a>} />
                    {quote.azienda && <Info label="Azienda" value={quote.azienda} />}
                </Section>

                <Section title="Richiesta">
                    <Info label="Quantità" value={`${quote.quantita?.toLocaleString('it-IT')} pezzi`} />
                    <Info label="File allegato" value={quote.file ? (quote.file.originalName || 'File allegato') : 'Nessuno'} />
                </Section>

                <PricingSection quote={quote} onEdit={() => onPricing(quote)} />
                <AiSection quote={quote} onAnalyze={() => onAnalyze(quote)} />

                {quote.note && (
                    <div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Messaggio del cliente</div>
                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700 whitespace-pre-wrap">{quote.note}</div>
                    </div>
                )}

                {quote.adminResponse?.message && (
                    <div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                            Risposta inviata {quote.adminResponse.by ? `da ${quote.adminResponse.by}` : ''} · {formatDate(quote.adminResponse.sentAt)}
                        </div>
                        <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 text-sm text-slate-700 whitespace-pre-wrap">{quote.adminResponse.message}</div>
                    </div>
                )}

                <div className="pt-2 border-t border-slate-100">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Stato</div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <select
                            value={status} onChange={(e) => setStatus(e.target.value)}
                            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white text-sm"
                        >
                            {STATUS_KEYS.map(k => <option key={k} value={k}>{STATUS[k].label}</option>)}
                        </select>
                        <button
                            onClick={saveStatus} disabled={saving || status === quote.status}
                            className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {saving ? 'Salvataggio...' : 'Aggiorna stato'}
                        </button>
                    </div>
                </div>

                {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

                <div className="flex flex-wrap justify-end gap-2 pt-2 border-t border-slate-100">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition text-sm">Chiudi</button>
                    <button onClick={() => onPricing(quote)} className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium transition">Prezzi</button>
                    <button onClick={() => onAnalyze(quote)} className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium transition">Stima AI</button>
                    <button
                        onClick={() => onRespond(quote)}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white text-sm font-medium shadow-md shadow-teal-500/20 transition"
                    >
                        Rispondi al cliente
                    </button>
                </div>
            </div>
        </Modal>
    );
}

function PricingSection({ quote, onEdit }) {
    if (!quote.pricing?.finalTotal) {
        return (
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-amber-800">Nessun prezzo inserito</span>
                    <button onClick={onEdit} className="text-sm font-medium text-amber-800 hover:text-amber-900">Aggiungi →</button>
                </div>
            </div>
        );
    }
    return (
        <Section title="Prezzi preventivo">
            <Info label="Prezzo unitario" value={currency(quote.pricing.unitPrice)} />
            <Info label="Costi impostazione" value={currency(quote.pricing.setupCost)} />
            {quote.pricing.discount > 0 && <Info label="Sconto" value={`${quote.pricing.discount}%`} />}
            <Info label="Totale finale" value={currency(quote.pricing.finalTotal)} />
        </Section>
    );
}

function AiSection({ quote, onAnalyze }) {
    const a = quote.aiAnalysis;
    if (!a || a.status === 'none') {
        return (
            <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-indigo-800">Analisi di mercato non ancora eseguita</span>
                    <button onClick={onAnalyze} className="text-sm font-medium text-indigo-800 hover:text-indigo-900">Analizza con AI →</button>
                </div>
            </div>
        );
    }
    if (a.status === 'pending') {
        return <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">Analisi AI in corso...</div>;
    }
    return (
        <div className="p-4 rounded-lg bg-indigo-50/60 border border-indigo-100 space-y-2">
            <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stima di mercato AI</div>
                <ConfidenceBadge confidence={a.confidence} />
            </div>
            <div className="text-lg font-bold text-slate-900">
                {currency(a.estimatedMarketPriceMin)} – {currency(a.estimatedMarketPriceMax)}
            </div>
            <p className="text-sm text-slate-700">{a.reasoning}</p>
            {a.factors?.length > 0 && (
                <ul className="text-xs text-slate-600 list-disc list-inside space-y-0.5">
                    {a.factors.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
            )}
            {a.warnings?.length > 0 && (
                <div className="mt-2 space-y-1">
                    {a.warnings.map((w, i) => (
                        <div key={i} className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">⚠ {w}</div>
                    ))}
                </div>
            )}
            {a.status === 'failed' && a.error && (
                <div className="text-xs text-red-700">Errore: {a.error}</div>
            )}
            <button onClick={onAnalyze} className="text-xs text-indigo-700 hover:text-indigo-900 font-medium">Ricalcola stima</button>
        </div>
    );
}

function ConfidenceBadge({ confidence }) {
    const map = {
        low: { label: 'Bassa confidenza', cls: 'bg-slate-100 text-slate-600 border-slate-200' },
        medium: { label: 'Media confidenza', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
        high: { label: 'Alta confidenza', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' }
    };
    const c = map[confidence] || map.medium;
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${c.cls}`}>{c.label}</span>;
}

// ───────────────────────────── Pricing
function PricingModal({ quote, onClose, onSaved }) {
    const [unitPrice, setUnitPrice] = useState('');
    const [setupCost, setSetupCost] = useState('');
    const [discount, setDiscount] = useState('');
    const [finalTotal, setFinalTotal] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (quote) {
            setUnitPrice(quote.pricing?.unitPrice ?? '');
            setSetupCost(quote.pricing?.setupCost ?? '');
            setDiscount(quote.pricing?.discount ?? '');
            setFinalTotal(quote.pricing?.finalTotal ?? '');
            setError('');
        }
    }, [quote]);

    if (!quote) return null;

    const qty = Math.max(1, Number(quote.quantita) || 1);

    const recalc = () => {
        const up = Number(unitPrice) || 0;
        const sc = Number(setupCost) || 0;
        const disc = Number(discount) || 0;
        const subtotal = up * qty + sc;
        return Math.round(subtotal * (1 - disc / 100) * 100) / 100;
    };

    const save = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            const body = {
                unitPrice: unitPrice === '' ? undefined : Number(unitPrice),
                setupCost: setupCost === '' ? undefined : Number(setupCost),
                discount: discount === '' ? undefined : Number(discount),
                finalTotal: finalTotal === '' ? recalc() : Number(finalTotal)
            };
            const res = await quotesApi.updatePricing(quote.id, body);
            onSaved(res.quote);
        } catch (err) {
            setError(err.message || 'Errore salvataggio prezzi');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal open={Boolean(quote)} onClose={onClose} title={`Prezzi - ${quote.nome} ${quote.cognome}`} size="lg">
            <form onSubmit={save} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Prezzo unitario (€)</label>
                        <input type="number" min="0" step="0.01" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Costi impostazione (€)</label>
                        <input type="number" min="0" step="0.01" value={setupCost} onChange={(e) => setSetupCost(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Sconto (%)</label>
                        <input type="number" min="0" max="100" step="0.01" value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Totale finale (€)</label>
                        <input type="number" min="0" step="0.01" value={finalTotal} onChange={(e) => setFinalTotal(e.target.value)} placeholder={currency(recalc())} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm" />
                    </div>
                </div>
                <div className="text-xs text-slate-500">Totale calcolato automaticamente: <strong>{currency(recalc())}</strong> su {qty.toLocaleString('it-IT')} pz</div>

                {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

                <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={onClose} disabled={saving} className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition text-sm disabled:opacity-60">Annulla</button>
                    <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white text-sm font-medium shadow-md shadow-teal-500/20 transition disabled:opacity-60 inline-flex items-center gap-2">
                        {saving && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                        Salva prezzi
                    </button>
                </div>
            </form>
        </Modal>
    );
}

// ───────────────────────────── Analyze AI
function AnalyzeModal({ quote, onClose, onSaved }) {
    const [analyzing, setAnalyzing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => { if (quote) { setError(''); } }, [quote]);

    if (!quote) return null;

    const run = async () => {
        setAnalyzing(true);
        setError('');
        try {
            const res = await quotesApi.analyze(quote.id);
            onSaved(res.quote);
        } catch (err) {
            setError(err.message || 'Errore analisi AI');
            setAnalyzing(false);
        }
    };

    return (
        <Modal open={Boolean(quote)} onClose={onClose} title="Analisi di mercato con AI" size="md">
            <div className="space-y-4">
                <p className="text-sm text-slate-600">
                    L'AI confronta questo preventivo con richieste simili e con i prezzi di mercato tipici della tipografia italiana per stimare una fascia di prezzo competitiva.
                </p>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700">
                    <strong>Cliente:</strong> {quote.nome} {quote.cognome}<br />
                    <strong>Quantità:</strong> {quote.quantita?.toLocaleString('it-IT')} pz<br />
                    <strong>Note:</strong> {quote.note?.substring(0, 120)}{quote.note?.length > 120 ? '...' : ''}
                </div>
                {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
                <div className="flex justify-end gap-2 pt-2">
                    <button onClick={onClose} disabled={analyzing} className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition text-sm disabled:opacity-60">Chiudi</button>
                    <button onClick={run} disabled={analyzing} className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white text-sm font-medium shadow-md shadow-indigo-500/20 transition disabled:opacity-60 inline-flex items-center gap-2">
                        {analyzing && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                        {analyzing ? 'Analisi in corso...' : 'Avvia analisi'}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

// ───────────────────────────── Rispondi (email al cliente)
function RespondModal({ quote, onClose, onSent }) {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (quote) {
            setSubject('Risposta alla tua richiesta di preventivo - Idealstampa');
            setMessage('');
            setError('');
        }
    }, [quote]);

    if (!quote) return null;

    const canSend = message.trim().length > 0 && !sending;

    const send = async (e) => {
        e.preventDefault();
        if (!canSend) return;
        setSending(true);
        setError('');
        try {
            await quotesApi.respond(quote.id, { subject, message });
            onSent();
        } catch (err) {
            setError(err.message || 'Errore invio risposta');
        } finally {
            setSending(false);
        }
    };

    return (
        <Modal open={Boolean(quote)} onClose={onClose} title={`Rispondi a ${quote.nome} ${quote.cognome}`} size="xl">
            <form onSubmit={send} className="space-y-4">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-600">
                    L'email sarà inviata a <strong className="text-slate-800">{quote.email}</strong>. Lo stato passerà a “Preventivato”.
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Oggetto</label>
                    <input
                        type="text" value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={200}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Messaggio</label>
                    <textarea
                        value={message} onChange={(e) => setMessage(e.target.value)} rows={8} maxLength={5000} required autoFocus
                        placeholder="Scrivi la risposta o il preventivo dettagliato per il cliente..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-sm resize-none"
                    />
                </div>

                {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

                <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={onClose} disabled={sending} className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition text-sm disabled:opacity-60">Annulla</button>
                    <button
                        type="submit" disabled={!canSend}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white text-sm font-medium shadow-md shadow-teal-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                    >
                        {sending && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                        Invia risposta
                    </button>
                </div>
            </form>
        </Modal>
    );
}

// ───────────────────────────── Elimina
function DeleteModal({ quote, onClose, onDeleted }) {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');

    if (!quote) return null;

    const confirm = async () => {
        setDeleting(true);
        setError('');
        try {
            await quotesApi.remove(quote.id);
            onDeleted();
        } catch (err) {
            setError(err.message || 'Errore eliminazione');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Modal open={Boolean(quote)} onClose={onClose} title="Conferma eliminazione" size="md">
            <div className="space-y-4">
                <p className="text-slate-700">
                    Stai per eliminare il preventivo di <strong className="text-slate-900">{quote.nome} {quote.cognome}</strong>.
                    Questa operazione è irreversibile.
                </p>
                {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
                <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={onClose} disabled={deleting} className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition disabled:opacity-60">Annulla</button>
                    <button
                        type="button" onClick={confirm} disabled={deleting}
                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition disabled:opacity-60 inline-flex items-center gap-2"
                    >
                        {deleting && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                        Elimina
                    </button>
                </div>
            </div>
        </Modal>
    );
}

function Section({ title, children }) {
    return (
        <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{title}</div>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">{children}</dl>
        </div>
    );
}
function Info({ label, value }) {
    return (
        <div className="flex justify-between gap-4 text-sm border-b border-slate-100 py-1.5">
            <dt className="text-slate-500 shrink-0">{label}</dt>
            <dd className="text-slate-800 font-medium text-right break-words">{value}</dd>
        </div>
    );
}
