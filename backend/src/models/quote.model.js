const mongoose = require('mongoose');

const fileInfoSchema = new mongoose.Schema(
    {
        originalName: String,
        storedName: String,
        mimeType: String,
        size: Number
    },
    { _id: false }
);

const quoteSchema = new mongoose.Schema(
    {
        nome: { type: String, required: true, trim: true },
        cognome: { type: String, required: true, trim: true },
        email: { type: String, required: true, lowercase: true, trim: true, index: true },
        telefono: { type: String, required: true, trim: true },
        azienda: { type: String, trim: true },

        quantita: { type: Number, required: true, min: 1, max: 1000000 },
        note: { type: String, required: true, trim: true, maxlength: 2000 },

        privacy: { type: Boolean, required: true },
        newsletter: { type: Boolean, default: false },

        file: { type: fileInfoSchema, default: null },

        status: {
            type: String,
            enum: ['pending', 'processing', 'quoted', 'accepted', 'rejected', 'archived'],
            default: 'pending',
            index: true
        },
        emailStatus: {
            companyMessageId: String,
            clientMessageId: String,
            sentAt: Date,
            error: String
        },
        adminResponse: {
            subject: String,
            message: String,
            sentAt: Date,
            by: String
        },

        // Dati commerciali (prezzo e costi)
        pricing: {
            unitPrice: { type: Number, min: 0 },        // prezzo unitario stimato/venduto (€)
            setupCost: { type: Number, min: 0 },          // eventuali costi di impostazione (€)
            discount: { type: Number, min: 0, max: 100 }, // sconto percentuale applicato
            finalTotal: { type: Number, min: 0 },         // totale finale (€)
            currency: { type: String, default: 'EUR' }
        },

        // Analisi AI del mercato/preventivo
        aiAnalysis: {
            status: {
                type: String,
                enum: ['none', 'pending', 'completed', 'failed'],
                default: 'none'
            },
            estimatedMarketPriceMin: Number,
            estimatedMarketPriceMax: Number,
            confidence: { type: String, enum: ['low', 'medium', 'high'] },
            reasoning: String,
            factors: [String],
            warnings: [String],
            generatedAt: Date,
            error: String
        },

        meta: {
            ip: String,
            userAgent: String
        }
    },
    { timestamps: true, collection: 'quotes' }
);

quoteSchema.index({ createdAt: -1 });
quoteSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Quote', quoteSchema);
