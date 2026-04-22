const fs = require('fs');
const path = require('path');
const multer = require('multer');
const config = require('../config');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        fs.mkdirSync(config.upload.dir, { recursive: true });
        cb(null, config.upload.dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `preventivo-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (config.upload.allowedMimeTypes.includes(file.mimetype)) {
        return cb(null, true);
    }
    cb(new Error('Tipo di file non supportato'), false);
};

const upload = multer({
    storage,
    limits: { fileSize: config.upload.maxFileSize },
    fileFilter
});

module.exports = upload;
