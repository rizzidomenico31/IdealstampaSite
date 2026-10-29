import { useEffect, useState, useCallback } from 'react';
import { auditApi } from '../../services/api';
import Modal from './Modal';

const ACTION_LABELS = {
    login: { label: 'Login', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    logout: { label: 'Logout', cls: 'bg-slate-100 text-slate-600 border-slate-200' },
    login_failed: { label: 'Login fallito', cls: 'bg-red-100 text-red-700 border-red-200' },
    password_changed: { label: 'Cambio password', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
    quote_viewed: { label: 'Preventivo visualizzato', cls: 'bg-slate-100 text-slate-600 border-slate-200' },
    quote_status_changed: { label: 'Cambio stato', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
    quote_pricing_updated: { label: 'Aggiornamento prezzi', cls: 'bg-teal-100 text-teal-700 border-teal-200' },
    quote_analyzed: { label: 'Analisi AI', cls: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    quote_responded: { label: 'Risposta inviata', cls: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
    quote_deleted: { label: 'Preventivo eliminato', cls: 'bg-red-100 text-red-700 border-red-200' },
    newsletter_sent: { label: 'Newsletter inviata', cls: 'bg-purple-100 text-purple-700 border-purple-200' },
    subscriber_deleted: { label: 'Iscritto eliminato', cls: 'bg-red-100 text-red-700 border-red-200' },
    admin_created: { label: 'Admin creato', cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    admin_updated: { label: 'Admin modificato', cls: 'bg-amber-100 text-amber-700 border-amber-200' },
    admin_password_reset: { label: 'Reset password admin', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
    admin_deleted: { label: 'Admin eliminato', cls: 'bg-red-100 text-red-700 border-red-200' }
};

const ACTION_OPTIONS = Object.entries(ACTION_LABELS).map(([value, { label }]) => ({ value, label }));

function formatDate(d) {
    if (!d) return '—';
    return new Date(d).toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' });
}

export default function AdminAudit() {
    const [logs, setLogs] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit] = useState(25);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({ action: '', actor: '' });
    const [detail, setDetail] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await auditApi.list({
                action: filters.action || undefined,
                actor: filters.actor || undefined,
                page,
                limit
            });
            setLogs(res.logs);
            setTotal(res.total);
        } catch (err) {
            setError(err.message || 'Errore caricamento log');
        } finally {
            setLoading(false);
        }
    }, [filters, page, limit]);

    useEffect(() => {
        load();
    }, [load]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Audit log</h1>
                <p className="text-slate-500 text-sm mt-1">Traccia delle azioni eseguite nel pannello admin.</p>
            </div>

            {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

            <div className="flex flex-col sm:flex-row gap-3">
                <select
                    value={filters.action}
                    onChange={(e) => { setFilters(f => ({ ...f, action: e.target.value })); setPage(1); }}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none bg-white text-sm"
                >
                    <option value="">Tutte le azioni</option>
                    {ACTION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <input
                    type="text"
                    value={filters.actor}
                    onChange={(e) => { setFilters(f => ({ ...f, actor: e.target.value })); setPage(1); }}
                    placeholder="Filtra per username"
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <Th>Data</Th>
                                <Th>Azione</Th>
                                <Th>Utente</Th>
                                <Th>Target</Th>
                                <Th>IP</Th>
                                <Th className="text-right">Dettagli</Th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-12 text-slate-500">Caricamento...</td></tr>
                            ) : logs.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-12 text-slate-500">Nessun log trovato</td></tr>
                            ) : logs.map(log => {
                                const a = ACTION_LABELS[log.action] || { label: log.action, cls: 'bg-slate-100 text-slate-600 border-slate-200' };
                                return (
                                    <tr key={log.id} className="hover:bg-slate-50">
                                        <Td className="text-sm text-slate-600 whitespace-nowrap">{formatDate(log.createdAt)}</Td>
                                        <Td><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${a.cls}`}>{a.label}</span></Td>
                                        <Td className="text-sm text-slate-800">{log.actor?.username || '—'} <span className="text-xs text-slate-400">({log.actor?.role || '—'})</span></Td>
                                        <Td className="text-sm text-slate-600">{log.target?.summary || '—'}</Td>
                                        <Td className="text-sm text-slate-500 font-mono">{log.actor?.ip || '—'}</Td>
                                        <Td className="text-right">
                                            <button onClick={() => setDetail(log)} className="text-sm text-teal-600 hover:text-teal-700 font-medium">Vedi</button>
                                        </Td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Pagina {page} di {totalPages} · {total} totali</span>
                <div className="flex gap-2">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || loading} className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm disabled:opacity-40">Precedente</button>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages || loading} className="px-3 py-1.5 rounded-lg border border-slate-300 text-sm disabled:opacity-40">Successiva</button>
                </div>
            </div>

            <Modal open={Boolean(detail)} onClose={() => setDetail(null)} title="Dettaglio azione" size="lg">
                {detail && (
                    <div className="space-y-3 text-sm">
                        <Info label="Azione" value={ACTION_LABELS[detail.action]?.label || detail.action} />
                        <Info label="Data" value={formatDate(detail.createdAt)} />
                        <Info label="Utente" value={`${detail.actor?.username || '—'} (${detail.actor?.role || '—'})`} />
                        <Info label="IP" value={detail.actor?.ip || '—'} />
                        <Info label="User Agent" value={detail.userAgent || '—'} />
                        <Info label="Target" value={detail.target?.summary || '—'} />
                        <Info label="Tipo target" value={detail.target?.type || '—'} />
                        {detail.metadata && (
                            <div>
                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Metadata</div>
                                <pre className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs overflow-auto">{JSON.stringify(detail.metadata, null, 2)}</pre>
                            </div>
                        )}
                    </div>
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

function Info({ label, value }) {
    return (
        <div className="flex justify-between gap-4 border-b border-slate-100 py-1.5">
            <dt className="text-slate-500 shrink-0">{label}</dt>
            <dd className="text-slate-800 font-medium text-right break-words">{value}</dd>
        </div>
    );
}
