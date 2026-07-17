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

export default function AdminQuotes() {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [search, setSearch] = useState('');

    const [detailTarget, setDetailTarget] = useState(null);
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
        const t = setTimeout(load, 250); // debounce ricerca
        return () => clearTimeout(t);
    }, [load]);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Preventivi</h1>
                    <p className="text-slate-500 text-sm mt-1">Visualizza, rispondi e gestisci tutte le richieste ricevute.</p>
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
                                <Th>File</Th>
                                <Th>Stato</Th>
                                <Th>Ricevuto</Th>
                                <Th className="text-right">Azioni</Th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-12 text-slate-500">Caricamento...</td></tr>
                            ) : quotes.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-12 text-slate-500">Nessun preventivo trovato</td></tr>
                            ) : quotes.map(q => (
                                <tr key={q.id} className="hover:bg-slate-50">
                                    <Td>
                                        <div className="font-medium text-slate-900">{q.nome} {q.cognome}</div>
                                        <div className="text-xs text-slate-500">{q.email}</div>
                                        {q.azienda && <div className="text-xs text-slate-400">{q.azienda}</div>}
                                    </Td>
                                    <Td className="text-sm text-slate-700">{q.quantita?.toLocaleString('it-IT')} pz</Td>
                                    <Td>
                                        {q.file ? (
                                            <span className="inline-flex items-center gap-1 text-xs text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                                Sì
                                            </span>
                                        ) : <span className="text-xs text-slate-400">—</span>}
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
                onChanged={() => { setDetailTarget(null); load(); }}
                onRespond={(q) => { setDetailTarget(null); setRespondTarget(q); }}
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
function DetailModal({ quote, onClose, onChanged, onRespond }) {
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
            await quotesApi.updateStatus(quote.id, status);
            onChanged();
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

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition text-sm">Chiudi</button>
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
