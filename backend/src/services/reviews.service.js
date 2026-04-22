const config = require('../config');
const logger = require('../utils/logger');

let cache = null;
let cacheTimestamp = null;

const FALLBACK_REVIEWS = {
    placeName: 'Tipografia Idealstampa',
    totalRating: 4.9,
    totalCount: 87,
    reviews: [
        {
            author: 'Marco Esposito',
            profilePhoto: null,
            rating: 5,
            text: 'Ottima tipografia! Abbiamo stampato i biglietti da visita per la nostra azienda e il risultato è stato impeccabile. Colori vividi, carta di ottima qualità e consegna nei tempi promessi. Consigliatissimi!',
            relativeTime: '2 settimane fa'
        },
        {
            author: 'Giulia Mancini',
            profilePhoto: null,
            rating: 5,
            text: 'Professionalità e attenzione al dettaglio eccezionali. Ho commissionato un lavoro complesso per il lancio del mio brand e il team di Idealstampa mi ha supportata in ogni fase, dal design alla consegna finale.',
            relativeTime: '1 mese fa'
        },
        {
            author: 'Antonio Russo',
            profilePhoto: null,
            rating: 5,
            text: 'Utilizzo Idealstampa da anni per tutte le esigenze della mia azienda: brochure, cataloghi, banner. Ogni volta sono sorpreso dall\'alta qualità del lavoro e dalla puntualità. Un partner di fiducia.',
            relativeTime: '3 settimane fa'
        },
        {
            author: 'Sara Lorusso',
            profilePhoto: null,
            rating: 5,
            text: 'Ho fatto realizzare le locandine per il mio ristorante. Qualità della stampa fantastica, il grafico mi ha anche aiutato a migliorare il design. Prezzi onesti e personale gentilissimo. Tornerò sicuramente!',
            relativeTime: '1 mese fa'
        },
        {
            author: 'Francesco De Palma',
            profilePhoto: null,
            rating: 4,
            text: 'Buona esperienza complessiva. Ho ordinato 500 flyer per un evento e sono stati consegnati in anticipo rispetto alla data prevista. Qualità della stampa molto buona. Consiglio.',
            relativeTime: '2 mesi fa'
        },
        {
            author: 'Lucia Palmieri',
            profilePhoto: null,
            rating: 5,
            text: 'Meravigliosa tipografia! Per il mio matrimonio ho scelto Idealstampa per le partecipazioni e tutto il materiale cartaceo. Il risultato ha superato ogni aspettativa. Grazie mille!',
            relativeTime: '3 mesi fa'
        }
    ]
};

function getFallback() {
    return FALLBACK_REVIEWS;
}

function isCacheValid() {
    if (!cache || !cacheTimestamp) return false;
    return (Date.now() - cacheTimestamp) < config.google.cacheDurationMs;
}

function normalize(placeData) {
    const reviews = (placeData.reviews || [])
        .filter(r => r.rating >= 4)
        .map(r => ({
            author: r.authorAttribution?.displayName || 'Cliente',
            profilePhoto: r.authorAttribution?.photoUri || null,
            rating: r.rating,
            text: r.text?.text || r.originalText?.text || '',
            relativeTime: r.relativePublishTimeDescription || '',
            publishTime: r.publishTime || null
        }))
        .sort((a, b) => (b.text.length || 0) - (a.text.length || 0))
        .slice(0, 10);

    return {
        placeName: placeData.displayName?.text || 'Idealstampa',
        totalRating: placeData.rating || 5.0,
        totalCount: placeData.userRatingCount || 0,
        reviews
    };
}

async function fetchFromGoogle() {
    const { apiKey, placeId } = config.google;
    if (!apiKey || !placeId) return null;

    const url = `https://places.googleapis.com/v1/places/${placeId}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'displayName,rating,userRatingCount,reviews'
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        logger.error('Google Places API error:', response.status, errorText);
        return null;
    }

    return normalize(await response.json());
}

async function getReviews() {
    if (isCacheValid()) {
        return { source: 'cache', data: cache };
    }

    if (!config.google.apiKey || !config.google.placeId) {
        logger.warn('GOOGLE_PLACES_API_KEY o GOOGLE_PLACE_ID non configurati. Uso fallback.');
        return { source: 'fallback', data: getFallback() };
    }

    try {
        const fresh = await fetchFromGoogle();
        if (!fresh) return { source: 'fallback', data: getFallback() };

        cache = fresh;
        cacheTimestamp = Date.now();
        logger.success(`${fresh.reviews.length} recensioni Google aggiornate`);
        return { source: 'google', data: fresh };
    } catch (err) {
        logger.error('Errore nel recupero recensioni:', err.message);
        return { source: 'fallback', data: getFallback() };
    }
}

function clearCache() {
    cache = null;
    cacheTimestamp = null;
    logger.info('Cache recensioni azzerata');
}

module.exports = { getReviews, clearCache };
