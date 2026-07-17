export const STATUS = {
    pending:    { label: 'In attesa',      cls: 'bg-amber-100 text-amber-700 border-amber-200' },
    processing: { label: 'In lavorazione', cls: 'bg-blue-100 text-blue-700 border-blue-200' },
    quoted:     { label: 'Preventivato',   cls: 'bg-teal-100 text-teal-700 border-teal-200' },
    accepted:   { label: 'Accettato',      cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    rejected:   { label: 'Rifiutato',      cls: 'bg-red-100 text-red-700 border-red-200' },
    archived:   { label: 'Archiviato',     cls: 'bg-slate-100 text-slate-600 border-slate-200' }
};

export const STATUS_KEYS = Object.keys(STATUS);

export function formatDate(d) {
    if (!d) return '—';
    return new Date(d).toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' });
}
