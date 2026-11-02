// Campi delle specifiche tecniche di stampa (usati in Analisi AI e Listino prezzi)

const inputCls = 'w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-sm';

const FIELDS = [
    { key: 'prodotto', label: 'Prodotto', placeholder: 'es. volantini, biglietti da visita', maxLength: 120 },
    { key: 'formato', label: 'Formato', placeholder: 'es. A5, 85x55 mm', maxLength: 60 },
    { key: 'carta', label: 'Carta', placeholder: 'es. patinata opaca', maxLength: 80 },
    { key: 'grammatura', label: 'Grammatura (g/m²)', placeholder: 'es. 135', type: 'number' },
    { key: 'colori', label: 'Colori', placeholder: 'es. 4/4', maxLength: 20, list: 'spec-colori' },
    { key: 'finiture', label: 'Finiture', placeholder: 'es. plastificazione opaca', maxLength: 200 },
    { key: 'consegna', label: 'Consegna', placeholder: 'es. standard, urgente 48h', maxLength: 80, optionalKey: true }
];

export default function SpecFields({ value, onChange, showConsegna = true, requiredProduct = false }) {
    const set = (key, v) => onChange({ ...value, [key]: v });

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FIELDS.filter(f => showConsegna || !f.optionalKey).map(f => (
                <div key={f.key}>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                        {f.label}{f.key === 'prodotto' && requiredProduct ? ' *' : ''}
                    </label>
                    <input
                        type={f.type || 'text'}
                        min={f.type === 'number' ? 0 : undefined}
                        value={value?.[f.key] ?? ''}
                        onChange={(e) => set(f.key, e.target.value)}
                        placeholder={f.placeholder}
                        maxLength={f.maxLength}
                        list={f.list}
                        required={f.key === 'prodotto' && requiredProduct}
                        className={inputCls}
                    />
                </div>
            ))}
            <datalist id="spec-colori">
                <option value="4/0" />
                <option value="4/4" />
                <option value="1/0" />
                <option value="1/1" />
            </datalist>
        </div>
    );
}
