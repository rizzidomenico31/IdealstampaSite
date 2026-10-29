import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { quotesApi, analyticsApi } from '../../services/api';
import SimpleChart from './SimpleChart';
import { STATUS, formatDate } from './quoteStatus';

const STAT_CARDS = [
    { key: 'total', label: 'Preventivi totali', accent: 'from-teal-500 to-cyan-500', suffix: '' },
    { key: 'pending', label: 'Preventivi in attesa', accent: 'from-amber-500 to-orange-500', suffix: '' },
    { key: 'thisMonth', label: 'Preventivi del mese', accent: 'from-indigo-500 to-purple-500', suffix: '' },
    { key: 'conversionRate', label: 'Tasso conversione', accent: 'from-emerald-500 to-green-500', suffix: '%' }
];

const DAYS_OPTIONS = [
    { label: '7 giorni', value: 7 },
    { label: '30 giorni', value: 30 },
    { label: '90 giorni', value: 90 }
];

function currency(n) {
    if (n === null || n === undefined || Number.isNaN(n)) return '—';
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n);
}

export default function AdminDashboard() {
    const { admin } = useAuth();
    const [stats, setStats] = useState(null);
    const [recent, setRecent] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [days, setDays] = useState(30);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let alive = true;
        (async () => {
            setLoading(true);
            setError('');
            try {
                const [s, list, a] = await Promise.all([
                    quotesApi.stats(),
                    quotesApi.list({ limit: 5 }),
                    analyticsApi.dashboard(days)
                ]);
                if (!alive) return;
                setStats(s.stats);
                setRecent(list.quotes);
                setAnalytics(a.analytics);
            } catch (err) {
                if (!alive) return;
                setError(err.message || 'Errore caricamento dati');
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [days]);

    const chartData = useMemo(() => {
        if (!analytics?.dailyTrend) return [];
        return analytics.dailyTrend.map(d => ({
            label: d.date.slice(5),
            value: d.count,
            secondary: d.accepted
        }));
    }, [analytics]);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Welcome */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center gap-6">
                <img src="/logo_ideal.png" alt="Idealstampa" className="h-16 w-auto object-contain shrink-0" />
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Benvenuto{admin?.username ? `, ${admin.username}` : ''}
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Pannello di controllo Idealstampa. Da qui puoi gestire preventivi, utenti e contenuti del sito.
                    </p>
                </div>
            </div>

            {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
            )}

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {STAT_CARDS.map(s => (
                    <div key={s.key} className="relative bg-white rounded-xl p-5 border border-slate-200 shadow-sm overflow-hidden">
                        <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${s.accent}`} />
                        <div className="text-sm font-medium text-slate-500">{s.label}</div>
                        <div className="mt-2 text-3xl font-bold text-slate-900">
                            {loading || !stats ? '—' : `${stats[s.key] ?? 0}${s.suffix}`}
                        </div>
                    </div>
                ))}
            </div>

            {/* Analytics trend */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Andamento preventivi</h2>
                        <p className="text-sm text-slate-500">Nuove richieste giornaliere e preventivi accettati</p>
                    </div>
                    <div className="flex gap-2">
                        {DAYS_OPTIONS.map(o => (
                            <button
                                key={o.value}
                                onClick={() => setDays(o.value)}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                                    days === o.value
                                        ? 'bg-slate-900 text-white border-slate-900'
                                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                {o.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="h-64">
                    {loading ? (
                        <div className="h-full flex items-center justify-center text-slate-400 text-sm">Caricamento...</div>
                    ) : (
                        <SimpleChart data={chartData} primaryColor="#0d9488" secondaryColor="#84cc16" />
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Recent quotes */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-900">Ultimi preventivi</h2>
                        <Link to="/admin/quotes" className="text-sm text-teal-600 hover:text-teal-700 font-medium">Vedi tutti →</Link>
                    </div>

                    {loading ? (
                        <div className="text-sm text-slate-500 py-8 text-center">Caricamento...</div>
                    ) : recent.length === 0 ? (
                        <div className="text-sm text-slate-500 py-8 text-center border-2 border-dashed border-slate-200 rounded-lg">
                            Nessun preventivo ricevuto
                        </div>
                    ) : (
                        <ul className="divide-y divide-slate-100">
                            {recent.map(q => {
                                const st = STATUS[q.status] || STATUS.pending;
                                return (
                                    <li key={q.id}>
                                        <Link to="/admin/quotes" className="flex items-center justify-between gap-3 py-3 hover:bg-slate-50 -mx-2 px-2 rounded-lg transition">
                                            <div className="min-w-0">
                                                <div className="font-medium text-slate-900 truncate">{q.nome} {q.cognome}</div>
                                                <div className="text-xs text-slate-500 truncate">{q.email} · {q.quantita?.toLocaleString('it-IT')} pz</div>
                                            </div>
                                            <div className="flex items-center gap-3 shrink-0">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${st.cls}`}>{st.label}</span>
                                                <span className="text-xs text-slate-400 hidden sm:block">{formatDate(q.createdAt)}</span>
                                            </div>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* Side panel */}
                <div className="space-y-4">
                    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">Il tuo account</h2>
                        <dl className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-slate-500">Username</dt>
                                <dd className="font-medium text-slate-800">{admin?.username}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-slate-500">Ruolo</dt>
                                <dd className="font-medium text-slate-800 capitalize">{admin?.role}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-slate-500">Ultimo accesso</dt>
                                <dd className="font-medium text-slate-800">
                                    {admin?.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleString('it-IT') : '—'}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <RevenueCard loading={loading} analytics={analytics} />
                    <StatusDistributionCard loading={loading} analytics={analytics} />
                </div>
            </div>
        </div>
    );
}

function RevenueCard({ loading, analytics }) {
    return (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-2">Fatturato preventivato</h2>
            {loading ? (
                <div className="text-sm text-slate-500">Caricamento...</div>
            ) : (
                <div className="space-y-2">
                    <div className="text-2xl font-bold text-slate-900">{currency(analytics?.summary?.revenue || 0)}</div>
                    <p className="text-xs text-slate-500">Totale dai preventivi con prezzo finale inserito</p>
                    <div className="pt-2 border-t border-slate-100 flex justify-between text-sm">
                        <span className="text-slate-500">Tempo medio risposta</span>
                        <span className="font-medium text-slate-800">
                            {analytics?.avgResponseHours ? `${analytics.avgResponseHours}h` : '—'}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

const STATUS_DOT_COLORS = {
    pending: 'bg-amber-500',
    processing: 'bg-blue-500',
    quoted: 'bg-teal-500',
    accepted: 'bg-emerald-500',
    rejected: 'bg-red-500',
    archived: 'bg-slate-500'
};

function StatusDistributionCard({ loading, analytics }) {
    const dist = analytics?.statusDistribution || {};
    const total = Object.values(dist).reduce((a, b) => a + b, 0) || 1;
    return (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Distribuzione stati</h2>
            {loading ? (
                <div className="text-sm text-slate-500">Caricamento...</div>
            ) : (
                <div className="space-y-2">
                    {Object.entries(STATUS).map(([key, s]) => {
                        const count = dist[key] || 0;
                        const pct = Math.round((count / total) * 100);
                        return (
                            <div key={key} className="flex items-center gap-3 text-sm">
                                <span className={`w-2 h-2 rounded-full ${STATUS_DOT_COLORS[key] || 'bg-slate-400'}`} />
                                <span className="flex-1 text-slate-600">{s.label}</span>
                                <span className="font-medium text-slate-800">{count}</span>
                                <span className="text-xs text-slate-400 w-8 text-right">{pct}%</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
