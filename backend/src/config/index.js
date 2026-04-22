require('dotenv').config();

const toInt = (v, fallback) => {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : fallback;
};

const toBool = (v, fallback = false) => {
    if (v === undefined) return fallback;
    return ['true', '1', 'yes', 'on'].includes(String(v).toLowerCase());
};

const config = {
    env: process.env.NODE_ENV || 'development',
    port: toInt(process.env.PORT, 5000),

    cors: {
        origins: (process.env.CORS_ORIGINS || [
            'http://localhost:3000',
            'http://localhost:3001',
            'https://www.idealstampa.com',
            'https://idealstampa.com',
            'https://react-frontend-backend.up.railway.app'
        ].join(','))
            .split(',')
            .map(o => o.trim())
            .filter(Boolean),
        credentials: true
    },

    rateLimit: {
        windowMs: toInt(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
        max: toInt(process.env.RATE_LIMIT_MAX, 10)
    },

    upload: {
        dir: process.env.UPLOAD_DIR || 'uploads/',
        maxFileSize: toInt(process.env.UPLOAD_MAX_SIZE, 25 * 1024 * 1024),
        allowedMimeTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'image/jpeg',
            'image/png',
            'image/gif',
            'application/zip',
            'application/x-rar-compressed'
        ]
    },

    body: {
        limit: process.env.BODY_LIMIT || '50mb'
    },

    smtp: {
        host: process.env.SMTP_HOST,
        port: toInt(process.env.SMTP_PORT, 587),
        secure: toBool(process.env.SMTP_SECURE, false),
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
        connectionTimeout: toInt(process.env.SMTP_CONN_TIMEOUT, 10000),
        greetingTimeout: toInt(process.env.SMTP_GREETING_TIMEOUT, 5000),
        socketTimeout: toInt(process.env.SMTP_SOCKET_TIMEOUT, 10000)
    },

    email: {
        companyEmail: process.env.COMPANY_EMAIL || process.env.SMTP_USER,
        fromName: process.env.EMAIL_FROM_NAME || 'Idealstampa'
    },

    google: {
        apiKey: process.env.GOOGLE_PLACES_API_KEY,
        placeId: process.env.GOOGLE_PLACE_ID,
        cacheDurationMs: toInt(process.env.GOOGLE_CACHE_MS, 6 * 60 * 60 * 1000)
    },

    mongo: {
        uri: process.env.MONGO_URI || '',
        dbName: process.env.MONGO_DB_NAME || 'idealstampa',
        options: {
            serverSelectionTimeoutMS: toInt(process.env.MONGO_TIMEOUT_MS, 5000)
        }
    }
};

module.exports = config;
