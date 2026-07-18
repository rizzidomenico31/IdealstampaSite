const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        nome: { type: String, trim: true },

        // Provenienza dell'iscrizione. Un contatto può appartenere a più gruppi.
        //  - 'footer'     → iscritto dalla barra newsletter nel footer
        //  - 'preventivo' → ha spuntato il consenso marketing nel form preventivo
        sources: {
            type: [String],
            enum: ['footer', 'preventivo'],
            default: []
        },

        active: { type: Boolean, default: true, index: true },
        unsubscribedAt: { type: Date, default: null }
    },
    { timestamps: true, collection: 'subscribers' }
);

subscriberSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Subscriber', subscriberSchema);
