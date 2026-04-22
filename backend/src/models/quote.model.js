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

        tipoProgetto: {
            type: String,
            required: true,
            enum: ['business', 'marketing', 'eventi', 'editoria', 'packaging', 'altro']
        },
        servizio: {
            type: String,
            required: true,
            enum: ['offset', 'digitale', 'grande-formato', 'packaging', 'editoria', 'finiture']
        },
        urgenza: { type: String, required: true, enum: ['urgente', 'normale', 'rilassato'] },

        quantita: { type: Number, required: true, min: 1, max: 1000000 },
        formato: { type: String, required: true, trim: true },
        colori: { type: String, required: true, enum: ['1+0', '1+1', '4+0', '4+1', '4+4', 'pantone'] },
        carta: { type: String, required: true, trim: true },
        pagine: { type: Number },

        finiture: { type: [String], default: [] },
        note: { type: String, trim: true, maxlength: 1000 },
        budget: { type: String, enum: ['0-100', '100-300', '300-500', '500-1000', '1000-2000', '2000+'] },

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
