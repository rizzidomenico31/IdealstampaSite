import { useEffect, useState, useCallback } from 'react';
import { referencePricesApi } from '../../services/api';
import Modal from './Modal';
import SpecFields from './SpecFields';
import { specToPayload } from './specUtils';
import { formatDate } from './quoteStatus';

function currency(n) {
    if (n === null || n === undefined || Number.isNaN(n)) return '—';
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(n);
}

function formatSpec(spec = {}) {
    return [spec.formato, spec.carta, spec.grammatura && `${spec.grammatura}g`, spec.colori, spec.finiture]
        .filter(Boolean)
        .join(' · ');
}

function isExpired(item) {
    return item.validUntil && new Date(item.validUntil) < new Date();
}

export default function AdminReferencePrices() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [createOpen, setCreateOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await referencePricesApi.list({ search });
            setItems(res.items);
        } catch (err) {
            setError(err.message || 'Errore caricamento listino');
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        const t = setTimeout(load, 250);
        return () => clearTimeout(t);
    }, [load]);

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Listino prezzi</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Prezzi di mercato usati dall'analisi AI: inseriti a mano o trovati con la ricerca web (riutilizzati fino alla scadenza).
                    </p>
                </div>
                <div className="flex gap-2">
                    <input
                        type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cerca prodotto, formato, carta..."
                        className="px-3 py-2 w-full sm:w-64 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-sm"
                    />
                    <button
                        onClick={() => setCreateOpen(true)}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white text-sm font-medium shadow-md shadow-teal-500/20 transition whitespace-nowrap"
                    >
                        Aggiungi prezzo
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <Th>Prodotto</Th>
                                <Th>Quantità</Th>
                                <Th>Prezzo (totale, IVA escl.)</Th>
                                <Th>Fonte</Th>
                                <Th>Validità</Th>
                                <Th className="text-right">Azioni</Th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-12 text-slate-500">Caricamento...</td></tr>
                            ) : items.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-12 text-slate-500">Nessun prezzo nel listino</td></tr>
                            ) : items.map(item => (
                                <tr key={item.id} className={`hover:bg-slate-50 ${isExpired(item) ? 'opacity-50' : ''}`}>
                                    <Td>
                                        <div className="font-medium text-slate-900">{item.spec.prodotto}</div>
                                        <div className="text-xs text-slate-500">{formatSpec(item.spec) || '—'}</div>
                                        {item.note && <div className="text-xs text-slate-400 mt-0.5">{item.note}</div>}
                                    </Td>
                                    <Td className="text-sm text-slate-700 whitespace-nowrap">{item.quantita?.toLocaleString('it-IT')} pz</Td>
                                    <Td className="text-sm text-slate-800">
                                        {item.found ? (
                                            item.priceMin === item.priceMax
                                                ? currency(item.priceMin)
                                                : `${currency(item.priceMin)} – ${currency(item.priceMax)}`
                                        ) : (
                                            <span className="text-xs text-slate-400">Nessun prezzo trovato</span>
                                        )}
                                        {item.offers?.length > 0 && (
                                            <ul className="mt-1 text-xs text-slate-500 space-y-0.5">
                                                {item.offers.map((o, i) => (
                                                    <li key={i}>{o.fonte}: {currency(o.totale)} / {o.quantita?.toLocaleString('it-IT')} pz</li>
                                                ))}
                                            </ul>
                                        )}
                                    </Td>
                                    <Td className="text-sm">
                                        {item.source === 'manual' ? (
                                            <span className="text-slate-700">Manuale{item.createdBy ? ` (${item.createdBy})` : ''}</span>
                                        ) : (
                                            <div className="space-y-0.5">
                                                <span className="text-indigo-700">Ricerca web</span>
                                                {item.sources?.slice(0, 3).map((s, i) => (
                                                    <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="block text-xs text-indigo-600 hover:underline truncate max-w-xs">
                                                        {s.title || s.url}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </Td>
                                    <Td className="text-sm text-slate-600 whitespace-nowrap">
                                        {item.validUntil
                                            ? (isExpired(item) ? 'Scaduto' : `fino al ${formatDate(item.validUntil)}`)
                                            : 'Senza scadenza'}
                                    </Td>
                                    <Td className="text-right whitespace-nowrap">
                                        <button onClick={() => setDeleteTarget(item)} className="text-sm text-red-600 hover:text-red-700 font-medium px-2">Elimina</button>
                                    </Td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <CreateModal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreated={() => { setCreateOpen(false); load(); }}
            />
            <DeleteModal
                item={deleteTarget}
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

const inputCls = 'w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none text-sm';

function CreateModal({ open, onClose, onCreated }) {
    const [spec, setSpec] = useState({});
    const [quantita, setQuantita] = useState('');
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [note, setNote] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open) {
            setSpec({});
            setQuantita('');
            setPriceMin('');
            setPriceMax('');
            setNote('');
            setError('');
        }
    }, [open]);

    if (!open) return null;

    const save = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            await referencePricesApi.create({
                spec: specToPayload(spec),
                quantita: Number(quantita),
                priceMin: Number(priceMin),
                priceMax: priceMax === '' ? undefined : Number(priceMax),
                note: note || undefined
            });
            onCreated();
        } catch (err) {
            setError(err.message || 'Errore salvataggio');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose} title="Aggiungi prezzo di riferimento" size="lg">
            <form onSubmit={save} className="space-y-4">
                <SpecFields value={spec} onChange={setSpec} showConsegna={false} requiredProduct />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Quantità (pz) *</label>
                        <input type="number" min="1" required value={quantita} onChange={(e) => setQuantita(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Prezzo totale min (€) *</label>
                        <input type="number" min="0" step="0.01" required value={priceMin} onChange={(e) => setPriceMin(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Prezzo totale max (€)</label>
                        <input type="number" min="0" step="0.01" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} placeholder="= min" className={inputCls} />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Nota (fonte, fornitore...)</label>
                    <input type="text" maxLength={500} value={note} onChange={(e) => setNote(e.target.value)} className={inputCls} />
                </div>
                <p className="text-xs text-slate-500">Prezzi del totale lotto, IVA esclusa. I prezzi manuali non scadono e hanno la precedenza su quelli web.</p>

                {error && <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

                <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={onClose} disabled={saving} className="px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition text-sm disabled:opacity-60">Annulla</button>
                    <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white text-sm font-medium shadow-md shadow-teal-500/20 transition disabled:opacity-60 inline-flex items-center gap-2">
                        {saving && <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                        Salva
                    </button>
                </div>
            </form>
        </Modal>
    );
}

function DeleteModal({ item, onClose, onDeleted }) {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState('');

    if (!item) return null;

    const confirm = async () => {
        setDeleting(true);
        setError('');
        try {
            await referencePricesApi.remove(item.id);
            onDeleted();
        } catch (err) {
            setError(err.message || 'Errore eliminazione');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Modal open={Boolean(item)} onClose={onClose} title="Conferma eliminazione" size="md">
            <div className="space-y-4">
                <p className="text-slate-700">
                    Eliminare il prezzo di riferimento per <strong className="text-slate-900">{item.spec.prodotto}</strong> ({item.quantita?.toLocaleString('it-IT')} pz)?
                    {item.source === 'web' && ' Alla prossima analisi con ricerca web verrà cercato di nuovo.'}
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
