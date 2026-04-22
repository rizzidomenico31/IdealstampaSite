const mongoose = require('mongoose');
const config = require('./index');
const logger = require('../utils/logger');

let connectionPromise = null;

async function connect() {
    if (!config.mongo.uri) {
        logger.warn('MONGO_URI non configurata: MongoDB disabilitato. L\'app funziona in modalità stateless.');
        return null;
    }

    if (connectionPromise) return connectionPromise;

    mongoose.set('strictQuery', true);

    connectionPromise = mongoose
        .connect(config.mongo.uri, {
            dbName: config.mongo.dbName,
            ...config.mongo.options
        })
        .then(conn => {
            logger.success(`MongoDB connesso: ${conn.connection.host}/${conn.connection.name}`);
            return conn;
        })
        .catch(err => {
            connectionPromise = null;
            logger.error('Errore connessione MongoDB:', err.message);
            throw err;
        });

    mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnesso');
        connectionPromise = null;
    });

    mongoose.connection.on('error', err => {
        logger.error('Errore MongoDB runtime:', err.message);
    });

    return connectionPromise;
}

async function disconnect() {
    if (!mongoose.connection.readyState) return;
    await mongoose.disconnect();
    connectionPromise = null;
    logger.info('MongoDB disconnesso correttamente');
}

function isEnabled() {
    return Boolean(config.mongo.uri);
}

function isConnected() {
    return mongoose.connection.readyState === 1;
}

module.exports = { connect, disconnect, isEnabled, isConnected };
