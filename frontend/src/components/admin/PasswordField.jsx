import { useState } from 'react';

const RULES = [
    { key: 'len', label: 'Almeno 10 caratteri', test: v => v.length >= 10 },
    { key: 'upper', label: 'Almeno una maiuscola', test: v => /[A-Z]/.test(v) },
    { key: 'lower', label: 'Almeno una minuscola', test: v => /[a-z]/.test(v) },
    { key: 'digit', label: 'Almeno un numero', test: v => /\d/.test(v) },
    { key: 'special', label: 'Almeno un carattere speciale', test: v => /[^A-Za-z0-9]/.test(v) }
];

export function isPasswordValid(value) {
    return RULES.every(r => r.test(value || ''));
}

export default function PasswordField({ value, onChange, label = 'Password', name = 'password', autoComplete = 'new-password', showRules = true, disabled }) {
    const [show, setShow] = useState(false);

    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
            <div className="relative">
                <input
                    type={show ? 'text' : 'password'}
                    name={name}
                    autoComplete={autoComplete}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition disabled:bg-slate-50"
                />
                <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShow(s => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                    aria-label={show ? 'Nascondi' : 'Mostra'}
                >
                    {show ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    )}
                </button>
            </div>

            {showRules && (
                <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
                    {RULES.map(r => {
                        const ok = r.test(value || '');
                        return (
                            <li key={r.key} className={`flex items-center gap-1.5 ${ok ? 'text-emerald-600' : 'text-slate-400'}`}>
                                <span className={`inline-flex items-center justify-center w-3.5 h-3.5 rounded-full ${ok ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                                    {ok ? (
                                        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                    ) : (
                                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                    )}
                                </span>
                                {r.label}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
