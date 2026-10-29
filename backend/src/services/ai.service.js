const config = require('../config');
const logger = require('../utils/logger');

/**
 * Servizio AI per l'analisi del mercato e la comparazione dei preventivi.
 * Se OPENAI_API_KEY non è configurata, il servizio ritorna un'analisi locale
 * basata su euristica invece di chiamare l'esterno.
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

function fallbackAnalysis(quote, similarQuotes) {
    const category = detectProductCategory(quote.note);
    const quantita = Math.max(1, Number(quote.quantita) || 1);

    let min, max, confidence = 'medium', factors = [], warnings = [];

    if (category && MARKET_RULES[category]) {
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
        warnings.push('Specifica meglio il prodotto nella nota per un confronto più accurato.');
    }

    // Confronto con preventivi simili storici
    const historical = similarQuotes
        .filter(q => q.pricing?.finalTotal)
        .map(q => q.pricing.finalTotal);
    if (historical.length >= 3) {
        const avg = historical.reduce((a, b) => a + b, 0) / historical.length;
        const std = Math.sqrt(historical.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / historical.length);
        factors.push(`Confrontato con ${historical.length} preventivi simili già preventivati`);
        if (std / avg < 0.15) confidence = 'high';
        else if (std / avg > 0.40) confidence = 'low';
    } else if (historical.length > 0) {
        factors.push(`Confrontato con ${historical.length} preventivo/i simile/i`);
        confidence = 'low';
    }

    return {
        estimatedMarketPriceMin: round2(min),
        estimatedMarketPriceMax: round2(max),
        confidence,
        reasoning: `Stima basata sui prezzi di mercato tipici per la categoria "${category || 'generica'}" con quantità ${quantita}.`,
        factors,
        warnings
    };
}

function round2(n) {
    return Math.round((Number(n) || 0) * 100) / 100;
}

function buildPrompt(quote, similarQuotes) {
    const q = quote;
    const similar = similarQuotes.map(s => ({
        quantita: s.quantita,
        note: s.note?.substring(0, 400),
        prezzoFinale: s.pricing?.finalTotal || null,
        stato: s.status,
        data: s.createdAt
    }));

    return `Sei un esperto di tipografia e stampa in Italia. Aiuti un commerciale a stimare il prezzo di mercato corretto per un preventivo.

DATI DEL NUOVO PREVENTIVO:
- Nome cliente: ${q.nome} ${q.cognome}
- Email: ${q.email}
- Quantità richiesta: ${q.quantita}
- Note/dettagli richiesta: ${(q.note || '').substring(0, 1200)}
- Azienda: ${q.azienda || 'non specificata'}

PREVENTIVI STORICI SIMILI (se presenti):
${JSON.stringify(similar, null, 2)}

Restituisci SOLO un oggetto JSON con questa struttura, senza commenti e senza markdown:
{
  "estimatedMarketPriceMin": number,
  "estimatedMarketPriceMax": number,
  "confidence": "low" | "medium" | "high",
  "reasoning": "stringa in italiano di max 500 caratteri che spiega il ragionamento",
  "factors": ["fattore 1", "fattore 2", ...],
  "warnings": ["avviso 1", ...]
}

Le stime devono essere in EUR e riferite al TOTALE del lotto, non al pezzo. Se mancano dettagli tecnici (grammatura, colori, finiture, ecc.) abbassa la confidence e indicalo nei warnings.`;
}

async function callOpenAI(prompt) {
    const apiKey = config.openai.apiKey;
    if (!apiKey) return null;

    const res = await fetch(`${config.openai.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: config.openai.model,
            messages: [
                { role: 'system', content: 'Sei un assistente commerciale esperto di stampa e preventivazione in Italia. Rispondi solo con JSON valido.' },
                { role: 'user', content: prompt }
            ],
            max_tokens: config.openai.maxTokens,
            temperature: config.openai.temperature,
            response_format: { type: 'json_object' }
        })
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`OpenAI HTTP ${res.status}: ${text}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('Risposta OpenAI vuota');
    return JSON.parse(content);
}

async function analyzeQuote(quote, similarQuotes = []) {
    const result = {
        status: 'pending',
        estimatedMarketPriceMin: null,
        estimatedMarketPriceMax: null,
        confidence: null,
        reasoning: '',
        factors: [],
        warnings: [],
        generatedAt: null,
        error: null
    };

    try {
        if (config.openai.apiKey) {
            const prompt = buildPrompt(quote, similarQuotes);
            const ai = await callOpenAI(prompt);
            result.estimatedMarketPriceMin = round2(ai.estimatedMarketPriceMin);
            result.estimatedMarketPriceMax = round2(ai.estimatedMarketPriceMax);
            result.confidence = ['low', 'medium', 'high'].includes(ai.confidence) ? ai.confidence : 'medium';
            result.reasoning = String(ai.reasoning || '').substring(0, 1000);
            result.factors = Array.isArray(ai.factors) ? ai.factors.map(String).slice(0, 10) : [];
            result.warnings = Array.isArray(ai.warnings) ? ai.warnings.map(String).slice(0, 10) : [];
        } else {
            logger.info('OPENAI_API_KEY non configurata, uso analisi euristica locale per il preventivo');
            const local = fallbackAnalysis(quote, similarQuotes);
            Object.assign(result, local);
        }

        result.status = 'completed';
        result.generatedAt = new Date();
    } catch (err) {
        logger.error('Analisi AI preventivo fallita:', err.message);
        result.status = 'failed';
        result.error = err.message;

        // Fallback in caso di errore API
        const local = fallbackAnalysis(quote, similarQuotes);
        Object.assign(result, local, { status: 'failed', error: err.message });
    }

    return result;
}

module.exports = { analyzeQuote, fallbackAnalysis, detectProductCategory };
