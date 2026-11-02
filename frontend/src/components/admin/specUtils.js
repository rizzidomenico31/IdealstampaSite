/** Converte i valori del form specifiche nel payload per l'API (campi vuoti rimossi, grammatura numerica). */
export function specToPayload(spec = {}) {
    const out = {};
    for (const [k, v] of Object.entries(spec)) {
        if (v === '' || v === null || v === undefined) continue;
        out[k] = k === 'grammatura' ? Number(v) : String(v).trim();
    }
    return out;
}
