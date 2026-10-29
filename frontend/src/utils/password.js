export const PASSWORD_RULES = [
    { key: 'len', label: 'Almeno 10 caratteri', test: v => v.length >= 10 },
    { key: 'upper', label: 'Almeno una maiuscola', test: v => /[A-Z]/.test(v) },
    { key: 'lower', label: 'Almeno una minuscola', test: v => /[a-z]/.test(v) },
    { key: 'digit', label: 'Almeno un numero', test: v => /\d/.test(v) },
    { key: 'special', label: 'Almeno un carattere speciale', test: v => /[^A-Za-z0-9]/.test(v) }
];

export function isPasswordValid(value) {
    return PASSWORD_RULES.every(r => r.test(value || ''));
}
