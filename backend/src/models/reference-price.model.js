const mongoose = require('mongoose');

/**
 * Listino prezzi di riferimento.
 * Ogni documento è un prezzo di mercato per una combinazione prodotto/spec/fascia quantità,
 * trovato con la ricerca web (source: 'web') o inserito a mano dall'operatore (source: 'manual').
 * I prezzi web scadono (validUntil) così vengono riutilizzati senza rifare la ricerca.
 */
const sourceSchema = new mongoose.Schema(
    {
        url: String,
        title: String
    },
    { _id: false }
);

const offerSchema = new mongoose.Schema(
    {
        fonte: String,
        totale: Number,
        quantita: Number,
        note: String
    },
    { _id: false }
);

const referencePriceSchema = new mongoose.Schema(
    {
        // Chiave completa (spec + fascia quantità) e chiave prodotto (solo spec)
        key: { type: String, required: true, index: true },
        productKey: { type: String, required: true, index: true },

        spec: {
            prodotto: String,
            formato: String,
            carta: String,
            grammatura: Number,
            colori: String,
            finiture: String
        },
        quantita: { type: Number, required: true, min: 1 },

        // Prezzi del TOTALE lotto, IVA esclusa (€). Null se la ricerca non ha trovato nulla.
        priceMin: { type: Number, min: 0, default: null },
        priceMax: { type: Number, min: 0, default: null },
        found: { type: Boolean, default: true },

        offers: { type: [offerSchema], default: [] },
        sources: { type: [sourceSchema], default: [] },

        source: { type: String, enum: ['web', 'manual'], required: true },
        note: { type: String, trim: true, maxlength: 500 },
        createdBy: String,

        // null = non scade (prezzi manuali)
        validUntil: { type: Date, default: null }
    },
    { timestamps: true, collection: 'reference_prices' }
);

referencePriceSchema.index({ productKey: 1, validUntil: 1 });

module.exports = mongoose.model('ReferencePrice', referencePriceSchema);
