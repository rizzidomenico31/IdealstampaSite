import { useEffect, useState, useCallback } from 'react';
import { adminNewsletterApi } from '../../services/api';
import Modal from './Modal';

const GROUPS = [
    { key: 'all',        label: 'Tutti gli iscritti', desc: 'Footer + consenso marketing', statKey: 'total' },
    { key: 'footer',     label: 'Iscritti dal sito',  desc: 'Barra newsletter nel footer', statKey: 'footer' },
    { key: 'preventivo', label: 'Consenso marketing',  desc: 'Spuntato nel form preventivo', statKey: 'preventivo' }
];

const SOURCE_LABELS = {
    footer:     { label: 'Sito',     cls: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    preventivo: { label: 'Preventivo', cls: 'bg-teal-100 text-teal-700 border-teal-200' }
};

function formatDate(d) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('it-IT', { dateStyle: 'medium' });
}

export default function AdminNewsletter() {
    const [stats, setStats] = useState({ total: 0, footer: 0, preventivo: 0 });
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Composizione
    const [group, setGroup] = useState('all');
    const [subject, setSubject] = useState('');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [sending, setSending] = useState(false);
    const [result, setResult] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const [s, list] = await Promise.all([
                adminNewsletterApi.stats(),
                adminNewsletterApi.subscribers()
            ]);
            setStats(s.stats);
            setSubscribers(list.subscribers);
        } catch (err) {
            setError(err.message || 'Errore caricamento dati');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const recipientCount = stats[GROUPS.find(g => g.key === group)?.statKey] ?? 0;
    const canSend = subject.trim() && message.trim() && recipientCount > 0 && !sending;

    const doSend = async () => {
        setSending(true);
        setError('');
        try {
            const res = await adminNewsletterApi.send({ subject, title, message, group });
            setResult(res);
            setConfirmOpen(false);
            setSubject(''); setTitle(''); setMessage('');
            load();
        } catch (err) {
            setError(err.message || 'Errore invio newsletter');
            setConfirmOpen(false);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Newsletter</h1>
                <p className="text-slate-500 text-sm mt-1">Componi e invia comunicazioni ai tuoi iscritti.</p>
            </div>

            {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
            {result && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between">
                    <span>Newsletter inviata: <strong>{result.sent}</strong>/{result.total} destinatari{result.failed?.length ? ` · ${result.failed.length} falliti` : ''}.</span>
                    <button onClick={() => setResult(null)} className="text-emerald-700 hover:text-emerald-900">✕</button>
                </div>
            )}

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {GROUPS.map(g => (
                    <button
                        key={g.key} onClick={() => setGroup(g.key)}
                        className={`text-left bg-white rounded-xl p-5 border shadow-sm transition ${group === g.key ? 'border-teal-500 ring-2 ring-teal-500/20' : 'border-slate-200 hover:border-slate-300'}`}
                    >
                        <div className="text-sm font-medium text-slate-500">{g.label}</div>
                        <div className="mt-1 text-3xl font-bold text-slate-900">{loading ? '—' : (stats[g.statKey] ?? 0)}</div>
                        <div className="mt-1 text-xs text-slate-400">{g.desc}</div>
                    </button>
                ))}
            </div>

            {/* Compositore + anteprima */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form */}
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <h2 className="text-lg font-semibold text-slate-900">Componi messaggio</h2>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Destinatari</label>
                        <select value={group} onChange={(e) => setGroup(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none bg-white text-sm">
                            {GROUPS.map(g => (
                                <option key={g.key} value={g.key}>{g.label} ({stats[g.statKey] ?? 0})</option>
                            ))}
                        </select>
                        <p className="text-xs text-slate-500 mt-1">{recipientCount} destinatari riceveranno questa email.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Oggetto email *</label>
                        <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={200} placeholder="Es. Sconti di primavera sulla stampa" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-sm" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Titolo <span className="text-slate-400 font-normal">(opzionale, mostrato in cima)</span></label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} placeholder="Es. Offerta di primavera" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-sm" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Contenuto *</label>
                        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={10} maxLength={20000} placeholder="Scrivi il testo della newsletter. Vai a capo due volte per separare i paragrafi." className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-sm resize-none" />
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={() => setConfirmOpen(true)} disabled={!canSend}
                            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-medium shadow-md shadow-teal-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Invia newsletter
                        </button>
                    </div>
                </div>

                {/* Anteprima */}
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Anteprima email</h2>
                    <div className="rounded-xl overflow-hidden border border-slate-200">
                        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
                            <span className="text-white font-bold">Idealstampa</span>
                            <span className="text-slate-400 text-xs uppercase tracking-wider">Newsletter</span>
                        </div>
                        {title.trim() && (
                            <div className="px-6 py-6" style={{ background: 'linear-gradient(135deg,#0d9488,#0891b2)' }}>
                                <h3 className="text-white text-xl font-bold">{title}</h3>
                            </div>
                        )}
                        <div className="px-6 py-6 bg-white">
                            {message.trim() ? (
                                message.trim().split(/\n{2,}/).map((p, i) => (
                                    <p key={i} className="text-slate-700 text-sm leading-relaxed mb-3 whitespace-pre-wrap">{p}</p>
                                ))
                            ) : (
                                <p className="text-slate-400 text-sm italic">Il contenuto dell'email apparirà qui...</p>
                            )}
                            <div className="mt-4">
                                <span className="inline-block bg-teal-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg">Contattaci su WhatsApp</span>
                            </div>
                        </div>
                        <div className="bg-slate-900 px-6 py-4 text-center">
                            <div className="text-white text-sm font-bold">Idealstampa</div>
                            <div className="text-slate-500 text-xs mt-1">Annulla l'iscrizione</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista iscritti */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">Iscritti</h2>
                    <span className="text-sm text-slate-400">{subscribers.length} totali</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <Th>Email</Th>
                                <Th>Nome</Th>
                                <Th>Sorgente</Th>
                                <Th>Iscritto</Th>
                                <Th className="text-right">Azioni</Th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-12 text-slate-500">Caricamento...</td></tr>
                            ) : subscribers.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-12 text-slate-500">Nessun iscritto</td></tr>
                            ) : subscribers.map(s => (
                                <tr key={s.id} className={`hover:bg-slate-50 ${!s.active ? 'opacity-50' : ''}`}>
                                    <Td className="text-sm text-slate-800 font-medium">{s.email}</Td>
                                    <Td className="text-sm text-slate-600">{s.nome || '—'}</Td>
                                    <Td>
                                        <div className="flex flex-wrap gap-1">
                                            {(s.sources || []).map(src => {
                                                const sl = SOURCE_LABELS[src] || { label: src, cls: 'bg-slate-100 text-slate-600 border-slate-200' };
                                                return <span key={src} className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${sl.cls}`}>{sl.label}</span>;
                                            })}
                                            {!s.active && <span className="text-xs text-slate-400">disiscritto</span>}
                                        </div>
                                    </Td>
                                    <Td className="text-sm text-slate-600 whitespace-nowrap">{formatDate(s.createdAt)}</Td>
                                    <Td className="text-right">
                                        <button onClick={() => setDeleteTarget(s)} className="text-sm text-red-600 hover:text-red-700 font-medium px-2">Elimina</button>
                                    </Td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Conferma invio */}
            <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="Conferma invio" size="md">
                <div className="space-y-4">
                    <p className="text-slate-700">
                        Stai per inviare la newsletter <strong className="text-slate-900">“{subject}”</strong> a{' '}
                        <strong className="text-slate-900">{recipientCount}</strong> destinatari
                        ({GROUPS.find(g => g.key === group)?.label.toLowerCase()}).
                    </p>
                    <div className="flex justify-end gap-2 pt-2">
                        <button onClick={() => setConfirmOpen(false)} disabled={sending} className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition disabled:opacity-60">Annulla</button>
                        <button onClick={doSend} disabled={sending} className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-medium transition disabled:opacity-60 inline-flex items-center gap-2">
                            {sending && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                            Invia ora
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Elimina iscritto */}
            <Modal open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} title="Elimina iscritto" size="md">
                {deleteTarget && (
                    <DeleteSubscriber
                        subscriber={deleteTarget}
                        onClose={() => setDeleteTarget(null)}
                        onDeleted={() => { setDeleteTarget(null); load(); }}
                    />
                )}
            </Modal>
        </div>
    );
}

const Th = ({ children, className = '' }) => (
    <th className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider ${className}`}>{children}</th>
);
const Td = ({ children, className = '' }) => (
    <td className={`px-4 py-3 align-top ${className}`}>{children}</td>
);

function DeleteSubscriber({ subscriber, onClose, onDeleted }) {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');

    const confirm = async () => {
        setDeleting(true);
        setError('');
        try {
            await adminNewsletterApi.removeSubscriber(subscriber.id);
            onDeleted();
        } catch (err) {
            setError(err.message || 'Errore eliminazione');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-4">
            <p className="text-slate-700">Eliminare definitivamente <strong className="text-slate-900">{subscriber.email}</strong> dagli iscritti?</p>
            {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
            <div className="flex justify-end gap-2 pt-2">
                <button onClick={onClose} disabled={deleting} className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition disabled:opacity-60">Annulla</button>
                <button onClick={confirm} disabled={deleting} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition disabled:opacity-60 inline-flex items-center gap-2">
                    {deleting && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                    Elimina
                </button>
            </div>
        </div>
    );
}
