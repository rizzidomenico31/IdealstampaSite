import { useAuth } from '../../context/AuthContext';

const stats = [
    { label: 'Preventivi totali', value: '—', hint: 'Dato in arrivo', accent: 'from-teal-500 to-cyan-500' },
    { label: 'Preventivi in attesa', value: '—', hint: 'Dato in arrivo', accent: 'from-amber-500 to-orange-500' },
    { label: 'Preventivi del mese', value: '—', hint: 'Dato in arrivo', accent: 'from-indigo-500 to-purple-500' },
    { label: 'Tasso conversione', value: '—', hint: 'Dato in arrivo', accent: 'from-emerald-500 to-green-500' }
];

export default function AdminDashboard() {
    const { admin } = useAuth();

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Welcome */}
            <div className="bg-white rounded-2xl p-6 lg:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center gap-6">
                <img
                    src="/logo_ideal.png"
                    alt="Idealstampa"
                    className="h-16 w-auto object-contain shrink-0"
                />
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Benvenuto{admin?.username ? `, ${admin.username}` : ''} 👋
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Pannello di controllo Idealstampa. Da qui potrai gestire preventivi, utenti e contenuti del sito.
                    </p>
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map(s => (
                    <div key={s.label} className="relative bg-white rounded-xl p-5 border border-slate-200 shadow-sm overflow-hidden">
                        <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${s.accent}`} />
                        <div className="text-sm font-medium text-slate-500">{s.label}</div>
                        <div className="mt-2 text-3xl font-bold text-slate-900">{s.value}</div>
                        <div className="mt-1 text-xs text-slate-400">{s.hint}</div>
                    </div>
                ))}
            </div>

            {/* Placeholder sezioni future */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-900">Ultimi preventivi</h2>
                        <span className="text-xs text-slate-400">Funzionalità in arrivo</span>
                    </div>
                    <div className="text-sm text-slate-500 py-8 text-center border-2 border-dashed border-slate-200 rounded-lg">
                        La lista preventivi sarà disponibile nei prossimi rilasci
                    </div>
                </div>

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
                                {admin?.lastLoginAt
                                    ? new Date(admin.lastLoginAt).toLocaleString('it-IT')
                                    : '—'}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
}
