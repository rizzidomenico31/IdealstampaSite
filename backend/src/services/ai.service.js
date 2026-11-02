const crypto = require('crypto');
const config = require('../config');
const logger = require('../utils/logger');

/**
 * Servizio AI per l'analisi del mercato e la comparazione dei preventivi.
 *
 * Tre chiamate distinte, ognuna con il minimo contesto necessario per contenere i token:
 *  - extractSpec:     nota del cliente → specifiche strutturate (modello economico, output vincolato)
 *  - searchWebPrices: specifiche → prezzi reali dai siti indicati (Responses API + web_search, opzionale)
 *  - analyzeQuote:    specifiche + contesto operatore + listino + storico → stima finale
 *
 * Nessun dato personale del cliente viene inviato al modello.
 * Se OPENAI_API_KEY non è configurata, si usa un'analisi locale basata su euristica.
 */

const MARKET_RULES = {
    // Prezzi orientativi al pezzo per categoria di prodotto (€)
    'biglietti da visita': { unit: [0.08, 0.35], minOrder: 100 },
    'volantini a5': { unit: [0.06, 0.22], minOrder: 100 },
    'volantini a4': { unit: [0.10, 0.35], minOrder: 100 },
    'locandine a3': { unit: [0.35, 1.20], minOrder: 10 },
    'manifesti 70x100': { unit: [1.50, 5.50], minOrder: 1 },
    'etichette': { unit: [0.03, 0.18], minOrder: 500 },
    'adesivi': { unit: [0.05, 0.30], minOrder: 100 },
    'timbri': { unit: [8, 25], minOrder: 1 },
    'cartelline': { unit: [0.50, 2.50], minOrder: 50 },
    'calendari': { unit: [1.50, 6.00], minOrder: 10 }
};

// Esponente delle economie di scala usato per riportare un prezzo a una quantità diversa
const SCALE_EXPONENT = 0.8;

const NOTE_MAX_CHARS = 400;

function detectProductCategory(note = '') {
    const text = String(note).toLowerCase();
    const priorities = [
        { key: 'biglietti da visita', tokens: ['biglietto da visita', 'biglietti da visita', 'visit card', 'business card'] },
        { key: 'volantini a5', tokens: ['volantino a5', 'volantini a5', 'flyer a5', 'a5'] },
        { key: 'volantini a4', tokens: ['volantino a4', 'volantini a4', 'flyer a4', 'a4'] },
        { key: 'locandine a3', tokens: ['locandina a3', 'locandine a3', 'a3'] },
        { key: 'manifesti 70x100', tokens: ['manifesto', 'manifesti', '70x100', '100x70'] },
        { key: 'etichette', tokens: ['etichetta', 'etichette', 'label'] },
        { key: 'adesivi', tokens: ['adesivo', 'adesivi', 'sticker'] },
        { key: 'timbri', tokens: ['timbro', 'timbri', 'stamp'] },
        { key: 'cartelline', tokens: ['cartellina', 'cartelline', 'cartella'] },
        { key: 'calendari', tokens: ['calendario', 'calendari'] }
    ];

    for (const item of priorities) {
        if (item.tokens.some(t => text.includes(t))) return item.key;
    }
    return null;
}

function round2(n) {
    return Math.round((Number(n) || 0) * 100) / 100;
}

function scaleToQuantity(price, fromQty, toQty) {
    return price * Math.pow(toQty / Math.max(1, fromQty), SCALE_EXPONENT);
}

/** Descrizione testuale compatta delle specifiche (usata nei prompt). */
function specToText(spec = {}) {
    return [
        spec.prodotto,
        spec.formato && `formato ${spec.formato}`,
        spec.carta && `carta ${spec.carta}`,
        spec.grammatura && `${spec.grammatura}g`,
        spec.colori && `stampa ${spec.colori}`,
        spec.finiture && `finiture: ${spec.finiture}`,
        spec.consegna && `consegna: ${spec.consegna}`
    ].filter(Boolean).join(', ');
}

/** Oscura email e numeri di telefono eventualmente scritti dal cliente nella nota. */
function redactNote(note, maxChars) {
    return String(note || '')
        .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '[email]')
        .replace(/\+?\d[\d\s./-]{7,}\d/g, '[tel]')
        .substring(0, maxChars);
}

/** Rimuove i campi vuoti per non sprecare token nel JSON inviato al modello. */
function compact(obj) {
    const out = {};
    for (const [k, v] of Object.entries(obj || {})) {
        if (v === undefined || v === null || v === '') continue;
        if (Array.isArray(v) && v.length === 0) continue;
        out[k] = v;
    }
    return out;
}

// ───────────────────────────── Chiamate OpenAI

async function postOpenAI(path, body) {
    const res = await fetch(`${config.openai.baseUrl}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.openai.apiKey}`
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(config.openai.timeoutMs)
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`OpenAI HTTP ${res.status}: ${text.substring(0, 300)}`);
    }
    return res.json();
}

/** Chat Completions con Structured Outputs: l'output rispetta sempre lo schema. */
async function callStructured({ system, user, schemaName, schema, maxTokens }) {
    const data = await postOpenAI('/chat/completions', {
        model: config.openai.model,
        messages: [
            { role: 'system', content: system },
            { role: 'user', content: user }
        ],
        max_tokens: maxTokens,
        temperature: config.openai.temperature,
        response_format: {
            type: 'json_schema',
            json_schema: { name: schemaName, strict: true, schema }
        }
    });

    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('Risposta OpenAI vuota');
    return {
        json: JSON.parse(content),
        usage: {
            inputTokens: data.usage?.prompt_tokens || 0,
            outputTokens: data.usage?.completion_tokens || 0
        }
    };
}

/** Estrae il primo oggetto JSON da un testo (il modello con web_search non ha output vincolato). */
function parseJsonLoose(text) {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end <= start) throw new Error('JSON non trovato nella risposta');
    return JSON.parse(text.substring(start, end + 1));
}

// ───────────────────────────── Estrazione specifiche dalla nota

const nullableString = { type: ['string', 'null'] };

const SPEC_SCHEMA = {
    type: 'object',
    additionalProperties: false,
    required: ['prodotto', 'formato', 'carta', 'grammatura', 'colori', 'finiture', 'consegna'],
    properties: {
        prodotto: nullableString,
        formato: nullableString,
        carta: nullableString,
        grammatura: { type: ['number', 'null'] },
        colori: nullableString,
        finiture: nullableString,
        consegna: nullableString
    }
};

async function extractSpec(note, quantita) {
    if (!config.openai.apiKey) {
        return { spec: { prodotto: detectProductCategory(note) }, usage: null, local: true };
    }

    const { json, usage } = await callStructured({
        system: 'Estrai le specifiche di stampa dalla richiesta del cliente. Usa null per i dati non indicati, non inventare. colori nel formato "4/0", "4/4", "1/0", "1/1". prodotto breve (es. "volantini", "biglietti da visita").',
        user: `Quantità: ${quantita}\n${redactNote(note, 1000)}`,
        schemaName: 'specifiche',
        schema: SPEC_SCHEMA,
        maxTokens: 150
    });

    const spec = {};
    for (const [k, v] of Object.entries(json)) {
        if (v !== null && v !== '') spec[k] = v;
    }
    return { spec, usage, local: false };
}

// ───────────────────────────── Ricerca prezzi reali online

/**
 * Cerca prezzi reali sui siti configurati (OPENAI_SEARCH_DOMAINS).
 * Al modello va solo la descrizione del prodotto: niente storico né dati cliente.
 */
async function searchWebPrices(spec, quantita) {
    if (!config.openai.apiKey) throw new Error('OPENAI_API_KEY non configurata');
    const s = config.openai.search;

    const input = `Trova il prezzo attuale di vendita online per: ${specToText(spec)}. Quantità: ${quantita} pezzi (o la più vicina disponibile).
Usa i configuratori/listini dei siti. Prezzi IVA esclusa, spedizione esclusa, consegna standard.
Rispondi SOLO con JSON: {"offerte":[{"fonte":"dominio","totale":numero,"quantita":numero,"note":"max 60 caratteri"}]}
Includi solo prezzi letti davvero sulle pagine, max 4 offerte. Se non trovi prezzi affidabili: {"offerte":[]}`;

    const data = await postOpenAI('/responses', {
        model: s.model,
        input,
        tools: [{
            type: 'web_search',
            search_context_size: s.contextSize,
            filters: { allowed_domains: s.domains },
            user_location: { type: 'approximate', country: 'IT' }
        }],
        tool_choice: 'required',
        max_output_tokens: s.maxTokens
    });

    const output = Array.isArray(data.output) ? data.output : [];
    const message = output.find(o => o.type === 'message');
    const textPart = message?.content?.find(c => c.type === 'output_text');
    if (!textPart?.text) throw new Error('Risposta ricerca web vuota');

    const parsed = parseJsonLoose(textPart.text);
    const offers = (Array.isArray(parsed.offerte) ? parsed.offerte : [])
        .map(o => ({
            fonte: String(o.fonte || '').substring(0, 80),
            totale: round2(o.totale),
            quantita: Math.max(1, Number(o.quantita) || quantita),
            note: String(o.note || '').substring(0, 120)
        }))
        .filter(o => o.totale > 0)
        .slice(0, 4);

    // Fascia di prezzo riportata alla quantità richiesta (solo offerte con quantità vicina)
    const comparable = offers
        .filter(o => Math.abs(Math.log(o.quantita / quantita)) <= Math.log(1.5))
        .map(o => scaleToQuantity(o.totale, o.quantita, quantita));

    const seen = new Set();
    const sources = (textPart.annotations || [])
        .filter(a => a.type === 'url_citation' && a.url && !seen.has(a.url) && seen.add(a.url))
        .slice(0, 5)
        .map(a => ({ url: a.url, title: String(a.title || '').substring(0, 150) }));

    return {
        offers,
        sources,
        priceMin: comparable.length ? round2(Math.min(...comparable)) : null,
        priceMax: comparable.length ? round2(Math.max(...comparable)) : null,
        usage: {
            inputTokens: data.usage?.input_tokens || 0,
            outputTokens: data.usage?.output_tokens || 0,
            webSearches: output.filter(o => o.type === 'web_search_call').length
        }
    };
}

// ───────────────────────────── Stima finale

const ANALYSIS_SCHEMA = {
    type: 'object',
    additionalProperties: false,
    required: ['min', 'max', 'confidenza', 'motivazione', 'fattori', 'avvisi'],
    properties: {
        min: { type: 'number' },
        max: { type: 'number' },
        confidenza: { type: 'string', enum: ['low', 'medium', 'high'] },
        motivazione: { type: 'string' },
        fattori: { type: 'array', items: { type: 'string' } },
        avvisi: { type: 'array', items: { type: 'string' } }
    }
};

// Statico e sempre identico: resta in testa al prompt (favorisce il prompt caching)
const ANALYSIS_SYSTEM = `Sei un preventivista esperto di tipografia in Italia. Stimi il prezzo di vendita di mercato del TOTALE lotto in EUR, IVA esclusa.
Priorità delle fonti: 1) "rif" = prezzi reali di mercato (web o listino manuale); 2) "storico" = nostri preventivi già prezzati; 3) tua conoscenza.
Se i riferimenti sono per quantità diverse, applica le economie di scala. Considera "contesto" dell'operatore come vincolante.
confidenza "high" solo con riferimenti reali coerenti per quantità simile; "low" se mancano specifiche (carta, grammatura, colori, finiture).
motivazione max 200 caratteri; max 4 fattori e 3 avvisi, brevi, in italiano.`;

/** Payload compatto inviato al modello (chiavi brevi, campi vuoti omessi). */
function buildAnalysisPayload({ quote, references, history }) {
    const spec = compact(quote.spec);
    return compact({
        spec: Object.keys(spec).length ? spec : undefined,
        qta: quote.quantita,
        nota: redactNote(quote.note, NOTE_MAX_CHARS),
        contesto: quote.operatorContext || undefined,
        rif: references.map(r => compact({
            q: r.quantita,
            min: r.priceMin,
            max: r.priceMax,
            fonte: r.source === 'manual' ? 'listino' : 'web',
            offerte: r.source === 'web' ? r.offers.map(o => `${o.fonte}: ${o.totale}€/${o.quantita}pz`) : undefined
        })),
        storico: history.map(h => compact({
            q: h.quantita,
            prod: h.spec?.prodotto ? specToText(h.spec).substring(0, 120) : redactNote(h.note, 120),
            tot: h.pricing.finalTotal
        }))
    });
}

function hashInput(payload) {
    return crypto
        .createHash('sha256')
        .update(`${config.openai.model}|${JSON.stringify(payload)}`)
        .digest('hex')
        .substring(0, 32);
}

function fallbackAnalysis(quote, history = [], references = []) {
    const category = detectProductCategory(`${quote.spec?.prodotto || ''} ${quote.spec?.formato || ''} ${quote.note || ''}`);
    const quantita = Math.max(1, Number(quote.quantita) || 1);

    let min, max, confidence = 'medium';
    const factors = [];
    const warnings = [];

    if (references.length > 0) {
        // Prezzo di riferimento reale più vicino per quantità, riportato alla quantità richiesta
        const ref = references[0];
        min = scaleToQuantity(ref.priceMin, ref.quantita, quantita);
        max = scaleToQuantity(ref.priceMax, ref.quantita, quantita);
        confidence = Math.abs(Math.log(ref.quantita / quantita)) <= Math.log(1.5) ? 'high' : 'medium';
        factors.push(`Basato su prezzo di riferimento (${ref.source === 'manual' ? 'listino' : 'web'}) per ${ref.quantita.toLocaleString('it-IT')} pz`);
    } else if (category && MARKET_RULES[category]) {
        const rule = MARKET_RULES[category];
        min = rule.unit[0] * quantita;
        max = rule.unit[1] * quantita;
        factors.push(`Categoria riconosciuta: ${category}`);
        factors.push(`Quantità richiesta: ${quantita.toLocaleString('it-IT')} pezzi`);
        if (quantita < rule.minOrder) {
            warnings.push(`Quantità inferiore al lotto minimo tipico (${rule.minOrder} pz); il prezzo unitario potrebbe essere più alto.`);
        }
    } else {
        // Euristica generica basata sulla fascia di quantità
        if (quantita <= 50) {
            min = quantita * 0.50;
            max = quantita * 2.50;
        } else if (quantita <= 250) {
            min = quantita * 0.25;
            max = quantita * 1.20;
        } else if (quantita <= 1000) {
            min = quantita * 0.12;
            max = quantita * 0.60;
        } else {
            min = quantita * 0.05;
            max = quantita * 0.35;
        }
        factors.push('Categoria non riconosciuta, uso fascia quantità');
        warnings.push('Compila le specifiche tecniche per un confronto più accurato.');
    }

    // Confronto con preventivi simili storici
    const historical = history.map(q => q.pricing.finalTotal);
    if (references.length === 0 && historical.length >= 3) {
        const avg = historical.reduce((a, b) => a + b, 0) / historical.length;
        const std = Math.sqrt(historical.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / historical.length);
        factors.push(`Confrontato con ${historical.length} preventivi simili già preventivati`);
        if (std / avg < 0.15) confidence = 'high';
        else if (std / avg > 0.40) confidence = 'low';
    } else if (historical.length > 0) {
        factors.push(`Confrontato con ${historical.length} preventivo/i simile/i`);
        if (references.length === 0) confidence = 'low';
    }

    return {
        estimatedMarketPriceMin: round2(min),
        estimatedMarketPriceMax: round2(max),
        confidence,
        reasoning: `Stima locale per "${quote.spec?.prodotto || category || 'prodotto generico'}" con quantità ${quantita}.`,
        factors,
        warnings
    };
}

/**
 * @param {object}   params
 * @param {object}   params.quote       preventivo (con spec e operatorContext già aggiornati)
 * @param {object[]} params.references  prezzi di riferimento validi, più vicini per quantità
 * @param {object[]} params.history     preventivi simili già prezzati
 * @param {object}   [params.previous]  analisi precedente (per riuso se l'input non è cambiato)
 * @param {object}   [params.searchUsage] consumi dell'eventuale ricerca web appena eseguita
 * @param {string[]} [params.extraWarnings]
 */
async function analyzeQuote({ quote, references = [], history = [], previous = null, searchUsage = null, extraWarnings = [] }) {
    const payload = buildAnalysisPayload({ quote, references, history });
    const inputHash = hashInput(payload);

    // Stesso input della stima precedente riuscita: nessuna nuova chiamata
    if (config.openai.apiKey && !searchUsage && previous?.status === 'completed' && previous.inputHash === inputHash) {
        logger.info('Analisi AI: input invariato, riuso la stima precedente');
        return { analysis: previous, cached: true };
    }

    const sources = references
        .flatMap(r => r.sources || [])
        .filter((s, i, arr) => arr.findIndex(x => x.url === s.url) === i)
        .slice(0, 8);

    const result = {
        status: 'pending',
        estimatedMarketPriceMin: null,
        estimatedMarketPriceMax: null,
        confidence: null,
        reasoning: '',
        factors: [],
        warnings: [],
        sources,
        referencesUsed: references.length,
        usedWebSearch: Boolean(searchUsage),
        inputHash: null,
        usage: {
            inputTokens: searchUsage?.inputTokens || 0,
            outputTokens: searchUsage?.outputTokens || 0,
            webSearches: searchUsage?.webSearches || 0
        },
        generatedAt: null,
        error: null
    };

    try {
        if (config.openai.apiKey) {
            const { json: ai, usage } = await callStructured({
                system: ANALYSIS_SYSTEM,
                user: JSON.stringify(payload),
                schemaName: 'stima',
                schema: ANALYSIS_SCHEMA,
                maxTokens: config.openai.maxTokens
            });
            const lo = round2(Math.min(ai.min, ai.max));
            const hi = round2(Math.max(ai.min, ai.max));
            result.estimatedMarketPriceMin = lo;
            result.estimatedMarketPriceMax = hi;
            result.confidence = ai.confidenza;
            result.reasoning = String(ai.motivazione || '').substring(0, 500);
            result.factors = ai.fattori.map(String).slice(0, 6);
            result.warnings = ai.avvisi.map(String).slice(0, 5);
            result.usage.inputTokens += usage.inputTokens;
            result.usage.outputTokens += usage.outputTokens;
            result.inputHash = inputHash;
        } else {
            logger.info('OPENAI_API_KEY non configurata, uso analisi euristica locale per il preventivo');
            Object.assign(result, fallbackAnalysis(quote, history, references));
        }

        result.status = 'completed';
        result.generatedAt = new Date();
    } catch (err) {
        logger.error('Analisi AI preventivo fallita:', err.message);
        // Fallback in caso di errore API
        Object.assign(result, fallbackAnalysis(quote, history, references), { status: 'failed', error: err.message });
    }

    result.warnings = [...extraWarnings, ...result.warnings].slice(0, 6);
    return { analysis: result, cached: false };
}

module.exports = {
    analyzeQuote,
    extractSpec,
    searchWebPrices,
    fallbackAnalysis,
    detectProductCategory
};
