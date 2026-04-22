const database = require('../config/database');

function getHealth(req, res) {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Idealstampa Preventivi API',
        features: ['email', 'file-upload', 'validation', 'reviews'],
        database: {
            enabled: database.isEnabled(),
            connected: database.isConnected()
        }
    });
}

module.exports = { getHealth };
