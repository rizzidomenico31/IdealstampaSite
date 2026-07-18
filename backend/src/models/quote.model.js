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
