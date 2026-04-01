// backend/routes/reviews.js
// Endpoint per recuperare le recensioni Google di Idealstampa
const express = require('express');
const router = express.Router();

// Cache in memoria per non chiamare Google ad ogni richiesta
let reviewsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION_MS = 6 * 60 * 60 * 1000; // 6 ore

/**
 * GET /api/reviews
 * Recupera le recensioni Google tramite Places API (New)
 * Richiede: GOOGLE_PLACES_API_KEY e GOOGLE_PLACE_ID nel .env
 */
router.get('/', async (req, res) => {
    try {
        // Controlla se la cache è ancora valida
        const now = Date.now();
        if (reviewsCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION_MS) {
            console.log('✅ Reviews servite dalla cache');
            return res.json({
                success: true,
                source: 'cache',
                data: reviewsCache
            });
        }

        const apiKey = process.env.GOOGLE_PLACES_API_KEY;
        const placeId = process.env.GOOGLE_PLACE_ID;

        if (!apiKey || !placeId) {
            console.warn('⚠️  GOOGLE_PLACES_API_KEY o GOOGLE_PLACE_ID non configurati. Uso dati di fallback.');
            return res.json({
                success: true,
                source: 'fallback',
                data: getFallbackReviews()
            });
        }

        // Chiamata alla Google Places API v1 (New Places API)
        const url = `https://places.googleapis.com/v1/places/${placeId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                // Richiedi solo i campi che ci servono (riduce costi)
                'X-Goog-FieldMask': 'displayName,rating,userRatingCount,reviews'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Google Places API error:', response.status, errorText);
            // In caso di errore API usa il fallback
            return res.json({
                success: true,
                source: 'fallback',
                data: getFallbackReviews()
            });
        }

        const placeData = await response.json();

        // Normalizza i dati nella struttura che ci serve
        const normalized = normalizeGoogleReviews(placeData);

        // Aggiorna la cache
        reviewsCache = normalized;
        cacheTimestamp = now;
        console.log(`✅ ${normalized.reviews.length} recensioni Google aggiornate`);

        return res.json({
            success: true,
            source: 'google',
            data: normalized
        });

    } catch (error) {
        console.error('❌ Errore nel recupero recensioni:', error.message);
        // Fallback in caso di errore di rete
        return res.json({
            success: true,
            source: 'fallback',
            data: getFallbackReviews()
        });
    }
});

/**
 * Normalizza la risposta della Places API v1
 */
function normalizeGoogleReviews(placeData) {
    const reviews = (placeData.reviews || [])
        .filter(r => r.rating >= 4) // Solo recensioni positive (4-5 stelle)
        .map(r => ({
            author: r.authorAttribution?.displayName || 'Cliente',
            profilePhoto: r.authorAttribution?.photoUri || null,
            rating: r.rating,
            text: r.text?.text || r.originalText?.text || '',
            relativeTime: r.relativePublishTimeDescription || '',
            publishTime: r.publishTime || null
        }))
        // Preferisci recensioni con testo
        .sort((a, b) => (b.text.length || 0) - (a.text.length || 0))
        .slice(0, 10); // Max 10 recensioni

    return {
        placeName: placeData.displayName?.text || 'Idealstampa',
        totalRating: placeData.rating || 5.0,
        totalCount: placeData.userRatingCount || 0,
        reviews
    };
}

/**
 * Dati di fallback nel caso l'API non sia configurata
 * Puoi rimpiazzarli con vere recensioni copiate da Google
 */
function getFallbackReviews() {
    return {
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
}

// Endpoint per forzare il refresh della cache (utile per admin)
router.post('/refresh-cache', (req, res) => {
    reviewsCache = null;
    cacheTimestamp = null;
    console.log('🔄 Cache recensioni azzerata');
    res.json({ success: true, message: 'Cache azzerata, prossima richiesta recupererà dati freschi da Google' });
});

module.exports = router;