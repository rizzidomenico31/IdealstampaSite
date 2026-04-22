const cors = require('cors');
const config = require('./index');

module.exports = cors({
    origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (config.cors.origins.includes(origin)) return cb(null, true);
        return cb(new Error(`CORS: origin ${origin} non autorizzata`));
    },
    credentials: config.cors.credentials
});
